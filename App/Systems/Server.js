
const {join} = require('path')
const express = require('express')
const requireall = require('require-all')

const HttpHandler = require('./HttpHandler')

const router = express.Router()

const app = express()

class Server {
    constructor (config) {
        this.config = config
    }

    bootstrap () {
        this.filesMap = {
            Routes: requireall({
                dirname: this.config.Routes,
                recursive: true,
                filter:  /(.+Routes)\.js$/
            }),
            Helpers: requireall({
                dirname: this.config.Helpers,
                recursive: true,
                filter:  /(.+Helper)\.js$/
            }),
            Models: requireall({
                dirname: this.config.Models,
                recursive: true,
                filter:  /(.+Model)\.js$/
            }),
            Middlewares: requireall({
                dirname: this.config.Middlewares,
                recursive: true,
                filter:  /(.+Middleware)\.js$/
            }),
            Controllers: requireall({
                dirname: this.config.Controllers,
                recursive: true,
                filter:  /(.+Controller)\.js$/
            })
        }
        return this
    }

    listen (port = 3000) {
        port = parseInt(port)
        app.listen(port, function () {
            console.log('App Server Listen On', port)
        })
    }

    start () {
        try {
            this.bootstrap()
            // const {Routes, Helpers, Models, Middlewares, Controllers} = this.filesMap
            this.buildRouters(this.filesMap)
            this.listen()
        } catch (err) {
            console.log(err)
        }
    }

    buildRouters ({Routes, Middlewares, Controllers}) {
        for (const R in Routes) {
            for (const M in Routes[R]) {
                for (const P in Routes[R][M]) {
                    const {controller, beforeMiddlewares, afterMiddlewares} = Routes[R][M][P]
                    let BM = []
                    for (const m0 of beforeMiddlewares) {
                        if (m0 && m0.length > 0) {
                            if (!Middlewares[m0]) throw new Error(`Invalid Middleware Named: ${m0}`)
                            BM.push(HttpHandler({middleware: Middlewares[m0]}).middleware)
                        }
                    }
                    let AM = []
                    for (const m1 of afterMiddlewares) {
                        if (m1 && m1.length > 0) {
                            if (!Middlewares[m1]) throw new Error(`Invalid Middleware Named: ${m1}`)
                            AM.push(HttpHandler({middleware: Middlewares[m1]}).middleware)
                        }
                    }
                    const cname = controller.split('.')[0]
                    const cfn = controller.split('.')[1]
                    const CTRL = HttpHandler({
                        controller: Controllers[cname],
                        functionName: cfn
                    }).controller
                    if (typeof CTRL !== 'function') throw new Error(`Invalid Controller On ${cname}`)
                    const appRouter = HttpHandler({ router }).route({M, P, BM, CTRL, AM})
                    app.use(appRouter)
                }
            }
        }
    }
}

module.exports = function (bootstrap) {
    try {
        return new Server(bootstrap)
    } catch (err) {
        console.log(err)
    }
}