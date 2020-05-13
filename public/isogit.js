
const path = require('path')
const git = require('isomorphic-git')
const http = require('./enhancedHttp')
const fs = require('fs')


const now = Date.now();
const dir = path.join(process.cwd(), `${now}-XDCE.MODULE`)

const azurePath = `AZURE-${dir}`
const ispPath = `ISP-${dir}`

const azure = "https://scaifinance:wrjykykfwzdw573krfdaeh3e25zbm5mro7qfvg6sndwg72xo3rqa@dev.azure.com/scaifinance/AJ-Cruscotto%20AUP/_git/xdce-module-aup-cruscotto-v1"
const ISP = "https://U0I0920:Intesa19@bitbucket.intesasanpaolo.com/scm/msad0/xdce-module-aupcruscotto-v1.git"

const ref = "env/svil"

http.proxy.hasProxy = true;
http.proxy.host = "localhost"
http.proxy.port = 8008

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

const startClone = (params) => {



}

let go = async () =>  {

    await git.clone({ fs, http, dir, url: azure, ref: 'master', noCheckout:true})
    await git.clone({ fs, http, dir, url: ISP, ref: ref,remote: "isp", noCheckout:true})

    await git.setConfig({
      fs,
      dir: dir,
      path: 'http.proxy',
      value: 'http://localhost:8008'
    }) 

    await git.setConfig({
      fs,
      dir: dir,
      path: 'user.name',
      value: 'script'
    }) 

    await git.setConfig({
      fs,
      dir: dir,
      path: 'user.email',
      value: 'script@scaifinance.com'
    }) 

  
    let result = await git.fetch({
      fs,
      http,
      dir: dir,
      url: azure,
      ref: ref,
    })
    console.log(result)


  result = await git.fetch({
      fs,
      http,
      dir: dir,
      url: ISP,
      ref: ref,
    })
    console.log(result)

    await git.checkout({
      fs,
      dir: dir,
      ref: 'env/svil',
      remote: 'isp',
      force:true
    }) 

   await git.pull({
      fs,
      http:http,
      dir: dir
    })


    let mergeresult = await git.merge({
      fs: fs,
      dir:dir,
      theirs: 'origin/env/svil',
    }) 


    console.log(mergeresult)



   /* [ispPath,azurePath].map(async ( dir) => {
      await git.setConfig({
          fs,
          dir: dir,
          path: 'http.proxy',
          value: 'http://localhost:8008'
        }) 
  
        await git.setConfig({
          fs,
          dir: dir,
          path: 'user.name',
          value: 'script'
        }) 
  
        await git.setConfig({
          fs,
          dir: dir,
          path: 'user.email',
          value: 'script@scaifinance.com'
        }) 
    })
    
*/

    
}

try {
    go()
}
catch(e) {
    console.log(e)
}

