const path = require('path');
const fs = require('fs');
const responseBuilder = require('../utils/response-builder')
const FocaService = require('../services/foca-service')
let focaService = new FocaService;

module.exports = (app) => {
    app.get('/', welcome)
    app.get('/favicon.ico', favicon)
    app.get('/foca/leagues', getLeagues)
    app.get('/foca/leagues/:leagueId', getLeaguesById)
    app.get('/foca/favorites/groups', getGroupList)
    app.post('/foca/favorites/groups', postGroup)
    app.put('/foca/favorites/groups/:groupId', editGroup)
    app.get('/foca/favorites/groups/:groupId', getGroupById)
    app.get('/foca/favorites/groups/:groupId/matches', getMatchesByGroup)
    app.put('/foca/favorites/groups/:groupId/teams/:teamId', addTeamToGroup)
    app.delete('/foca/favorites/groups/:groupId/teams/:teamId', removeTeamFromGroup)
}

function welcome(req, res) {
    res.statusCode = 200
    res.setHeader('content-type', 'text/plain')
    res.end('Welcome to Foca API!')
}

function favicon(req, res) {
    let icon = path.join(__dirname, '..', 'icon', 'foca.ico');

    res.statusCode = 200
    res.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream(icon).pipe(res);   
}


/**
 * GET /foca/leagues -- lista das ligas
 */
function getLeagues(req, res) {
    focaService.getLeagues( function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(data))
        }
    })
}

/**
 *  GET /foca/leagues/:leagueId -- detalhes de uma liga 
 */
function getLeaguesById(req, res) {
    focaService.getLeaguesById(req.params.leagueId, function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            if(data.statusCode == 404)
                res.end(responseBuilder.errorMsg(data));
            else res.end(responseBuilder.singleLeague(data.body));
        }
    })
}

/**
 *  GET /foca/favorites/groups -- lista de grupos favoritos 
 */
function getGroupList(req, res) {
    focaService.getGroupList( function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            console.log(data)
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(data))
        }
    })
}

/**
 *  POST /foca/favorites/groups -- criar um grupo
 */
function postGroup(req, res) {
    let body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        callPostGroup(JSON.parse(body));
    });

    function callPostGroup(bodyObj){
        focaService.postGroup(bodyObj.name, bodyObj.description, function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                res.statusCode = 201
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        })
    }
}

/**
 *  PUT /foca/favorites/groups/:groupId -- editar um grupo
 */
function editGroup(req, res) {
    let body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        callEditGroup(JSON.parse(body));
    });

    function callEditGroup(bodyObj){
        focaService.editGroup(bodyObj.name, bodyObj.description, req.params.groupId, function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                res.statusCode = 200
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        })
    }
}

/**
 *  GET /foca/favorites/groups/:groupId -- detalhes de um grupo
 */
function getGroupById(req, res) {
    focaService.getGroupById(req.params.groupId, function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(data))
        }
    })
}

/**
 *  GET /foca/favorites/groups/:groupId/matches -- obter os jogos das equipas de um grupo
 */
function getMatchesByGroup(req, res) {
    focaService.getMatchesByGroup(req.params.groupId, req.query, function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(data))
        }
    })
}

/**
 *  PUT /foca/favorites/groups/:groupId/teams/:teamId -- adicionar equipa a grupo
 */
function addTeamToGroup(req, res) {
    focaService.addTeamToGroup(req.params.groupId, parseInt(req.params.teamId), function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(data))
        }
    })
}

/**
 *  DELETE /foca/favorites/groups/:groupId/teams/:teamId -- remover uma equipa de um grupo
 */
function removeTeamFromGroup(req, res) {
    focaService.removeTeamFromGroup(req.params.groupId, parseInt(req.params.teamId), function (err, data) {
        if(err) {
            res.statusCode = err.code
            res.end(err.message + '\n' + err.error)
        } else {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(data))
        }
    })
}