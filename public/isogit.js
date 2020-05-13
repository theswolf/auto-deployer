const path = require("path");
const git = require("isomorphic-git");
const http = require("./enhancedHttp");
const fs = require("fs");

//const azure = "https://scaifinance:wrjykykfwzdw573krfdaeh3e25zbm5mro7qfvg6sndwg72xo3rqa@dev.azure.com/scaifinance/AJ-Cruscotto%20AUP/_git/xdce-module-aup-cruscotto-v1"
//const ISP = "https://U0I0920:Intesa19@bitbucket.intesasanpaolo.com/scm/msad0/xdce-module-aupcruscotto-v1.git"

/*{
	"fromBranch": "env/svil",
	"fromPassword": "wrjykykfwzdw573krfdaeh3e25zbm5mro7qfvg6sndwg72xo3rqa",
	"fromUrl": "dev.azure.com/scaifinance/AJ-Cruscotto%20AUP/_git/xdce-module-aup-cruscotto-v1",
	"fromUserName": "scaifinance",
	"isSingleCommit": false,
	"proxyPort": 8008,
	"proxyUrl": "http://localhost",
	"toBranch": "env/svil",
	"toPassword": "Intesa19",
	"toUrl": "bitbucket.intesasanpaolo.com/scm/msad0/xdce-module-aupcruscotto-v1.git",
	"toUserName": "U0I0920"
}
*/

const prepare = (p) => {
  if (!!p.proxyUrl && p.proxyUrl.length > 0) {
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
  const commchanel = "progresChannel";

  let cfg = prepare(params);
  let dir = path.join(process.cwd(), `${Date.now()}-AUTO-DEPLOY`);

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
      console.log("Finished cloning from and to")
      return git.setConfig({
        fs,
        dir: dir,
        path: "user.name",
        value: "script",
      })
    }
      
      
    )
    .then(() =>
      git.setConfig({
        fs,
        dir: dir,
        path: "user.email",
        value: "script@scaifinance.com",
      })
    )
    .then(() =>
    {
      console.log(`Fetching from ${params.fromUrl} branch ${params.fromBranch}`)
      return git.fetch({
        fs,
        http,
        dir: dir,
        url: cfg.fromPath,
        ref: cfg.fromRef,
      })
    }
     
    )
    .then(() => {

      console.log(`Fetching from ${params.toUrl} branch ${params.toBranch}`)
      return git.fetch({
        fs,
        http,
        dir: dir,
        url: cfg.toPath,
        ref: cfg.toRef,
      })
    }
      
    )
    .then(() => {
      console.log(`Checkout from ${params.toUrl} branch ${params.toBranch}`)
      return git
      .checkout({
        fs,
        dir: dir,
        ref: cfg.toRef,
        remote: "upstream",
        force: true,
      })
    })
      

    .then(() =>
          git.pull({
            fs,
            http: http,
            dir: dir,
          })
        )

        .then(() => {
          console.log(`Merging from ${params.fromUrl} branch ${params.fromBranch}`)
          return git.merge({
            fs: fs,
            dir: dir,
            theirs: `origin/${cfg.fromRef}`,
          })
        }
          
        )
        .then(() => {
          console.log("finished");
        })

        .catch(e => {
          console("Big Mistake")
          console.log(e.message)
        })
  
};


let params = {
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
}

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});

startClone(params)