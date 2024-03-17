const userController = require('../controller/user.controller')

module.exports = (app) => {
    app.post('/api/auth/login', userController.login)
    app.post('/api/auth/signup', userController.signup)
}