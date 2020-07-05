'use strict'

class MainController {
    constructor (ctx) {
        this.ctx = ctx
    }

    async main ({Request, Response, ErrorException}) {
        try {
            Response.send('ok')
        } catch (err) {
            throw ErrorException(err, 500)
        }
    }
}

module.exports = MainController
