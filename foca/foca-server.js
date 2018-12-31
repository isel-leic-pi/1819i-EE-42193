const http = require('http')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const foca_api = require('./web-api/foca-web-api')
const config = require('./foca-config.json')

const port = config.port;
const host = config.host;

const app = express()
app.use(morgan('dev'))
app.use('/', express.static(path.join(__dirname,"dist")))
foca_api(app)

http
    .createServer(app)
    .listen(port, host, () => {
        console.log('Server listening on port ' + port + ` -> http://${host}:${port}/`)
    })