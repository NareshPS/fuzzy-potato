// const {Subject} = require('rxjs')
import {Subject} from 'rxjs'
import {mkdirSync} from 'fs'
import { operations } from './store/temp.mjs'

const preconditions = _ => {
  // mkdirSync('./temp', {recursive: true})
}

export const start = app => {
  const handler = router(app)
  preconditions()

  handler({
    route: '/datasets/:name/:start/:end',
    method: 'get',
    func: ({req, res}) => {
      console.info(`service: request: %O`, req)
      res.json({message: 'no dataset available'})
    }
  })

  handler({
    route: '/store/write',
    method: 'post',
    func: ({req, res}) => {
      console.info(`requests: `, req, req.body)

      operations.write({request: req.body})
      .then(result => {
        console.info(`service: download %O`, result)
        res.download(result.uri, 'pobjects.json', err => console.error(`error: `, err))
      })
    }
  })


  // handler({
  //   route: '/datasets/:name/:start/:end',
  //   method: 'get'
  // })
  // .subscribe(({req, res}) => {
  //   console.info(`service: request: %O`, req)
  //   res.json({message: 'no dataset available'})
  // })
  // expressUnit(
  //   app,
  //   {
  //     route: '/datasets/:name/:start/:end',
  //     method: 'get'
  //   }
  // )
  // .subscribe(({req, res}) => {
  //   console.info(req.url)
  //   res.json({message: 'no dataset available'})
  // })
}

const router = (app) => {
  const obs = {} // observables
  const rfn = ({route, method, func}) => {
    const registerfn = _ => {
      const s = new Subject()
  
      app[method](route, (req, res) => { s.next({req, res}) })

      return s
    }

    const key = `${method}:${route}`
    const ob = obs[key] || (obs[key] = registerfn(), obs[key])

    ob.subscribe(func)
  } // routing function

  return rfn
}

// const expressUnit = (app, {route, method}) => {
//   const s = new Subject()

//   app[method](route, (req, res) => {
//     s.next({req, res})
//   })

//   return s
// }


// module.exports = {start}
