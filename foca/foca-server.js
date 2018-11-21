const http = require('http')
const parse = require('url').parse
const foca_api = require('./web-api/foca-web-api')

const webServer = new WebServer()

foca_api(webServer)

const port = 1904

http.createServer(webServer.router).listen(port, () => {
    console.log('Server listening on port ' + port + ` -> http://localhost:${port}/`)
})

function WebServer() {
    const routes = []

    this.use = (route) => routes.push(route)

    this.router = (req, res) => {
        const url = parse(req.url, true)
        const {pathname} = url
        console.log(`${Date()}: ${req.method} request to ${pathname}`)

        for (let index = 0; index < routes.length; index++) {
            const r = routes[index]
            if(r(req, res))
                break
        }
    }
}