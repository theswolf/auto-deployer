const get = require('simple-get');
const tunnel = require('tunnel');


const proxy = {}


function fromValue(value) {
  let queue = [value];
  return {
    next() {
      return Promise.resolve({ done: queue.length === 0, value: queue.pop() })
    },
    return() {
      queue = [];
      return {}
    },
    [Symbol.asyncIterator]() {
      return this
    },
  }
}

function getIterator(iterable) {
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]()
  }
  if (iterable[Symbol.iterator]) {
    return iterable[Symbol.iterator]()
  }
  if (iterable.next) {
    return iterable
  }
  return fromValue(iterable)
}

// Currently 'for await' upsets my linters.
async function forAwait(iterable, cb) {
  const iter = getIterator(iterable);
  while (true) {
    const { value, done } = await iter.next();
    if (value) await cb(value);
    if (done) break
  }
  if (iter.return) iter.return();
}

function asyncIteratorToStream(iter) {
  const { PassThrough } = require('readable-stream');
  const stream = new PassThrough();
  setTimeout(async () => {
    await forAwait(iter, chunk => stream.write(chunk));
    stream.end();
  }, 1);
  return stream
}

async function collect(iterable) {
  let size = 0;
  const buffers = [];
  // This will be easier once `for await ... of` loops are available.
  await forAwait(iterable, value => {
    buffers.push(value);
    size += value.byteLength;
  });
  const result = new Uint8Array(size);
  let nextIndex = 0;
  for (const buffer of buffers) {
    result.set(buffer, nextIndex);
    nextIndex += buffer.byteLength;
  }
  return result
}

// Convert a Node stream to an Async Iterator
function fromNodeStream(stream) {
  // Use native async iteration if it's available.
  const asyncIterator = Object.getOwnPropertyDescriptor(
    stream,
    Symbol.asyncIterator
  );
  if (asyncIterator && asyncIterator.enumerable) {
    return stream
  }
  // Author's Note
  // I tried many MANY ways to do this.
  // I tried two npm modules (stream-to-async-iterator and streams-to-async-iterator) with no luck.
  // I tried using 'readable' and .read(), and .pause() and .resume()
  // It took me two loooong evenings to get to this point.
  // So if you are horrified that this solution just builds up a queue with no backpressure,
  // and turns Promises inside out, too bad. This is the first code that worked reliably.
  let ended = false;
  const queue = [];
  let defer = {};
  stream.on('data', chunk => {
    queue.push(chunk);
    if (defer.resolve) {
      defer.resolve({ value: queue.shift(), done: false });
      defer = {};
    }
  });
  stream.on('error', err => {
    if (defer.reject) {
      defer.reject(err);
      defer = {};
    }
  });
  stream.on('end', () => {
    ended = true;
    if (defer.resolve) {
      defer.resolve({ done: true });
      defer = {};
    }
  });
  return {
    next() {
      return new Promise((resolve, reject) => {
        if (queue.length === 0 && ended) {
          return resolve({ done: true })
        } else if (queue.length > 0) {
          return resolve({ value: queue.shift(), done: false })
        } else if (queue.length === 0 && !ended) {
          defer = { resolve, reject };
        }
      })
    },
    return() {
      stream.removeAllListeners();
      if (stream.destroy) stream.destroy();
    },
    [Symbol.asyncIterator]() {
      return this
    },
  }
}

/**
 * HttpClient
 *
 * @param {GitHttpRequest} request
 * @returns {Promise<GitHttpResponse>}
 */
async function request({
  onProgress,
  url,
  method = 'GET',
  headers = {},
  body,
}) {
  // If we can, we should send it as a single buffer so it sets a Content-Length header.
  if (body && Array.isArray(body)) {
    body = Buffer.from(await collect(body));
  } else if (body) {
    body = asyncIteratorToStream(body);
  }
  return new Promise((resolve, reject) => {   
    let opts =  {
        url,
        method,
        headers,
        body
      };

    

    opts = proxy.hasProxy && {...opts, agent:tunnel.httpsOverHttp({
        proxy: {
            host: proxy.host,
            port: proxy.port
          }
    })
    } || opts;

    get(opts,
      (err, res) => {
        if (err) return reject(err)
        const iter = fromNodeStream(res);
        resolve({
          url: res.url,
          method: res.method,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: iter,
          headers: res.headers,
        });
      }
    );
  })
}

exports.request = request
exports.proxy = proxy
//var index = { request };

//export default index;
//export { request };
