module.exports = {
    'GET': {
        '/': {
            controller: 'MainController.main',
            beforeMiddlewares: [
                'InputMiddleware'
            ],
            afterMiddlewares: [
                // ''
            ]
        }
    },
    'POST': {
    }
}