const path = require("path");
const git = require("isomorphic-git");
const http = require("./enhancedHttp");
const fs = require("fs");
const rimraf = require("rimraf");
const {app} = require('electron');

const prepare = (p) => {
  if (!!p.proxyUrl && p.proxyUrl.trim().length > 0) {
    http.proxy.hasProxy = true;
    http.proxy.host = p.proxyUrl;
    http.proxy.port = p.proxyPort;
  }

  return {
    fromPath: `https://${p.fromUserName}:${p.fromPassword}@${p.fromUrl}`,
    toPath: `https://${p.toUserName}:${p.toPassword}@${p.toUrl}`,
    fromRef: p.fromBranch,
    toRef: p.toBranch,
  };
};

const startClone = (params, wc) => {
  let cfg = prepare(params);
  let dir = path.join(app.getPath('home'), `/auto-deploy/${Date.now()}-AUTO-DEPLOY`);

  const info = (msg) => {
    wc.send("infoLog", msg);
  };

  const error = (msg) => {
    wc.send("errorLog", msg);
  };

  const success = (msg) => {
    wc.send("successLog", msg);
  };

  process.on("unhandledRejection", function (reason, p) {
    error(reason);
    // application specific logging here
  });

  // wc.send(commchanel, "Starting checkout source ");
  git
    .clone({
      fs,
      http,
      dir,
      url: cfg.fromPath,
      ref: "master",
      noCheckout: true,
    })
    .then(() =>
      git.clone({
        fs,
        http,
        dir,
        url: cfg.toPath,
        ref: cfg.toRef,
        remote: "upstream",
        noCheckout: true,
      })
    )
    .then(() => {
      info("Finished cloning from and to");
      return git.setConfig({
        fs,
        dir: dir,
        path: "user.name",
        value: "script",
      });
    })
    .then(() =>
      git.setConfig({
        fs,
        dir: dir,
        path: "user.email",
        value: "script@scaifinance.com",
      })
    )
    .then(() => {
      info(`Fetching from ${params.fromUrl} branch ${params.fromBranch}`);
      return git.fetch({
        fs,
        http,
        dir: dir,
        url: cfg.fromPath,
        ref: cfg.fromRef,
      });
    })
    .then(() => {
      info(`Fetching from ${params.toUrl} branch ${params.toBranch}`);
      return git.fetch({
        fs,
        http,
        dir: dir,
        url: cfg.toPath,
        ref: cfg.toRef,
      });
    })
    .then(() => {
      info(`Checkout from ${params.toUrl} branch ${params.toBranch}`);
      return git.checkout({
        fs,
        dir: dir,
        ref: cfg.toRef,
        remote: "upstream",
        force: true,
      });
    })

    .then(() =>
      git.pull({
        fs,
        http: http,
        dir: dir,
      })
    )

    .then(() => {
      info(`Merging from ${params.fromUrl} branch ${params.fromBranch}`);
      return git.merge({
        fs: fs,
        dir: dir,
        theirs: `origin/${cfg.fromRef}`,
      });
    })
    .then(() => {
      info(`Pushing to ${params.toUrl}`);
      return git.push({
        fs,
        http,
        dir: dir,
        ref: cfg.toRef,
        remote: "upstream"
      })

    })
    .then(() => {
      rimraf.sync(dir)
      success("finished");
    })

    .catch((e) => {
      error(e.message);
    });
};

const emptyCommit = (params, wc) => {
  let cfg = prepare(params);
  let dir = path.join(app.getPath('home'), `/auto-deploy/${Date.now()}-AUTO-DEPLOY`);

  const info = (msg) => {
    wc.send("infoLog", msg);
  };

  const error = (msg) => {
    wc.send("errorLog", msg);
  };

  const success = (msg) => {
    wc.send("successLog", msg);
  };

  process.on("unhandledRejection", function (reason, p) {
    error(reason);
    // application specific logging here
  });

  // wc.send(commchanel, "Starting checkout source ");
  git
    .clone({
      fs,
      http,
      dir,
      url: cfg.toPath,
      ref: cfg.toRef,
      noCheckout: false,
    })
    .then(() => {
      info("Finished cloning");
      return git.setConfig({
        fs,
        dir: dir,
        path: "user.name",
        value: "script",
      });
    })
    .then(() =>
      git.setConfig({
        fs,
        dir: dir,
        path: "user.email",
        value: "script@scaifinance.com",
      })
    )
    .then(() => {
      info(`Empty commit for branch ${params.toBranch}`);
      return git.commit({
        fs,
        dir: dir,
        message: "SNAPSHOT",
      });
    })
    .then(() => {
      info(`Pushing to ${params.toUrl}`);
      return git.push({
        fs,
        http,
        dir: dir,
        ref: cfg.toRef,
        remote: "origin"
      })

    })

    .then(() => {
      rimraf.sync(dir)
      success("finished");
    })

    .catch((e) => {
      error(e.message);
    });
};

/*let params = {
	"fromBranch": "env/svil",
	"fromPassword": "wrjykykfwzdw573krfdaeh3e25zbm5mro7qfvg6sndwg72xo3rqa",
	"fromUrl": "dev.azure.com/scaifinance/AJ-Cruscotto%20AUP/_git/xdce-module-aup-cruscotto-v1",
	"fromUserName": "scaifinance",
	"isSingleCommit": false,
	"proxyPort": 8008,
	"proxyUrl": "localhost",
	"toBranch": "env/svil",
	"toPassword": "Intesa19",
	"toUrl": "bitbucket.intesasanpaolo.com/scm/msad0/xdce-module-aupcruscotto-v1.git",
	"toUserName": "U0I0920"
}*/

exports.standardClone = startClone;
exports.emptyCommit = emptyCommit;

//use it for debugg
/*let fakeLog = {
  send: (channel,msg) => console.log(msg)
}

startClone(params,fakeLog)*/
