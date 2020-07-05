'use strict'

const { join } = require('path')

const bootstrap = {
    'Helpers': join(__dirname, 'App/Helpers'),
    'Controllers': join(__dirname, 'App/Modules/Controllers'),
    'Middlewares': join(__dirname, 'App/Modules/Middlewares'),
    'Models': join(__dirname, 'App/Modules/Models'),
    'Views': join(__dirname, 'App/Modules/Views'),
    'Routes': join(__dirname, 'App/Routes'),
    'Env': {
        set: function (key, value) {
            process.env[key] = value
        },
        get: function (key, defaultvalue) {
            return process.env[key] || dafaultvalue
        }
    }
}

require('./App/Systems/Server')(bootstrap)
    .start()