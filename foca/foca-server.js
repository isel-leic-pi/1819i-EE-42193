const path = require('path')
const express = require('express')
const expressSession = require('express-session')
const morgan = require('morgan')
const foca_api = require('./web-api/foca-web-api')
const auth_api = require('./web-api/auth-web-api')
const config = require('./foca-config.json')

const port = config.port;
const host = config.host;

const app = express()
app.use(morgan('dev'))

//app.use(express.json())
app.use(expressSession({secret: 'keyboard cat', resave: false, saveUninitialized: true }))
app.use('/', express.static(path.join(__dirname,"dist")))

foca_api(app)
auth_api(app)

app.listen(port, host, () => {
    console.log('Server listening on port ' + port + ` -> http://${host}:${port}/`)
})