'use strict'


module.exports = function ({ env }) {
    const configs = {
        app: {
            host: env.get('APP_HOST'),
            port: env.get('APP_PORT'),
            key: env.get('APP_KEY')
        },
        databases: {
            postgresql: {
                host: env.get('POSTGRESQL_HOST'),
                port: env.get('POSTGRESQL_PORT'),
                user: env.get('POSTGRESQL_USER'),
                pass: env.get('POSTGRESQL_PASS'),
            }
        }
    }
    return configs
}