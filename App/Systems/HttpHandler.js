'use strict'

class HttpHandler {
    /**
     * ctx: [Router | ControllerName | MiddlewareName]
      */
    constructor (ctx) {
        this.ctx = ctx
    }

    async controller (request, response, next) {
        if (!this.ctx.controller) throw new Error('Invalid Controller Context!')
        if (!this.ctx.functionName) throw new Error('Invalid Function Name on Context!')
        if (typeof this.ctx.controller !== 'function') throw new Error('Controller must be as a Class!')
        const Ctrl = this.ctx.controller
        const Controller = new Ctrl()[this.ctx.functionName]
        if (typeof Controller !== 'function') throw new Error('FnName Context is Not a Function!')
        await Controller({
            Request: request,
            Response: response,
            Next: next
        })
    }

    middleware (request, response, next) {
        if (!this.ctx.middleware) throw new Error('Invalid Middleware Context!')
        if (typeof this.ctx.middleware !== 'function') throw new Error('Middleware must be as a Class!')
        const Mdlwr = this.ctx.middleware
        const Middleware = new Ctrl().handle
        if (typeof Middleware !== 'function') throw new Error('Middleware is Not a Function!')
        Middleware({
            Request: request,
            Response: response,
            Next: next
        })
    }

    route ({M: routeMethod, P: routePath, CTRL: controller, AM: afterMiddlewares, BM: beforeMiddlewares}) {
        // ctx = router object from express
        const actions = [...beforeMiddlewares, controller, ...afterMiddlewares]
        switch (routeMethod) {
            case 'GET':
                this.ctx.router.get(routePath, actions)
                break;
            case 'POST':
                this.ctx.router.post(routePath, actions)
                break;
            case 'DEL':
                this.ctx.router.delete(routePath, actions)
                break;
            case 'PUT':
                this.ctx.router.put(routePath, actions)
                break;
            case 'ALL':
                this.ctx.router.all(routePath, actions)
            default:
                break;
        }
        return this.ctx.router
    }
}

module.exports = function (ctx = '') { // ctx : ObjectName
    return new HttpHandler(ctx) 
}