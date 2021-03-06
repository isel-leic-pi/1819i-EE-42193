const passport = require('passport')
const authService = require('../services/auth-service')
const responseBuilder = require('../utils/response-builder')

module.exports = (app) => {
    passport.serializeUser(serializeUser)
    passport.deserializeUser(deserializeUser)
    app.use(passport.initialize())
    app.use(passport.session())

    app.get('/api/auth/session', getSession)
    app.post('/api/auth/login', login)
    app.post('/api/auth/logout', logout)
    app.post('/api/auth/signup', signup)
}

function getSession(req, resp, next) {
    const username = req.isAuthenticated() ? req.user.username : undefined
    resp.json({
        'auth': req.isAuthenticated(),
        'username': username
    })
}

function login(req, resp, next) {
    authService
        .authenticate(req.body.username, req.body.password)
        .then(user => {
            req.login(user, (err) => {
                if (err) next(err)
                else resp.json(user)
            })
        })
        .catch(err => next(err))
}

function logout(req, resp, next) {
    req.logout()
    resp.statusCode = 200
    resp.end()
}

function signup(req, resp, next) {
    authService
        .createUser(req.body.fullname, req.body.username, req.body.password)
        .then(user => {
            req.login(user, (err) => {
                if (err) next(err)
                else resp.json(user)
            })
        })
        .catch(() => errorHandler(resp))
}

function serializeUser(user, done) {
    done(null, user._id)
}

function deserializeUser(userId, done) {
    authService
        .getUser(userId)
        .then(user => done(null, user))
        .catch(err => done(err))
}

function errorHandler(res) {
    let statusObj = {statusCode: 502, message: 'The information provider service is unavailable.'}
    res.statusCode = statusObj.statusCode
    res.setHeader('content-type', 'application/json')
    res.end(responseBuilder.errorMsg(statusObj))
}