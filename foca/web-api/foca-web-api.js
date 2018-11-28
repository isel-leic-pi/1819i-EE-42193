'use strict'

const parse = require('url').parse
const responseBuilder = require('../utils/response-builder')
const FocaService = require('../services/foca-service')
let focaService = new FocaService;

module.exports = (app) => {
    app.use(welcome)
    app.use(getLeagues)
    app.use(getLeaguesById)
    app.use(getGroupList)
    app.use(postGroup)
    app.use(editGroup)
    app.use(getGroupById)
    app.use(getMatchesByGroup)
    app.use(addTeamToGroup)
    app.use(removeTeamFromGroup)
    app.use(resourceNotFound)
}

function welcome(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url
    
    if(req.method == 'GET' && pathname == '/') {
        res.statusCode = 200
        res.setHeader('content-type', 'text/plain')
        res.end('Welcome to Foca API!')
    }    
}

/**
 * GET /foca/leagues -- lista das ligas
 */
function getLeagues(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url
    
    if(req.method == 'GET' && pathname == '/foca/leagues') {
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
        return true
    }
    return false
}

/**
 *  GET /foca/leagues/:league_id -- detalhes de uma liga 
 */
function getLeaguesById(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url

    const pattern = /\d+/g
    const leagueId = pathname.match(pattern)
    
    if(req.method == 'GET' && pathname == `/foca/leagues/${leagueId}`) {
        focaService.getLeaguesById(leagueId, function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                if(data.statusCode == 404)
                    //res.end(JSON.stringify(data));
                    res.end(responseBuilder.errorMsg(data));
                else res.end(responseBuilder.singleLeague(data.body));
                //res.statusCode = 200
                //res.setHeader('content-type', 'application/json')
                //res.end(JSON.stringify(data))
            }
        })
        return true
    }
    return false
}

/**
 *  GET /foca/favorites/groups -- lista de grupos favoritos 
 */
function getGroupList(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url
    
    if(req.method == 'GET' && pathname == '/foca/favorites/groups') {
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
        return true
    }
    return false
}

/**
 *  POST /foca/favorites/groups -- criar um grupo
 */
function postGroup(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url

    let body = [];

    if(req.method == 'POST' && pathname == '/foca/favorites/groups') {
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            callPostGroup(JSON.parse(body));
        });
        return true
    }
    return false

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
 *  PUT /foca/favorites/groups/:group_id -- editar um grupo
 */
function editGroup(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url

    const groupId = pathname.split("/")[4]
    let body = [];

    if(req.method == 'PUT' && pathname == `/foca/favorites/groups/${groupId}`) {
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            callEditGroup(JSON.parse(body));
        });
        return true
    }
    return false

    function callEditGroup(bodyObj){
        focaService.editGroup(bodyObj.name, bodyObj.description, groupId, function (err, data) {
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
 *  GET /foca/favorites/groups/:group_id -- detalhes de um grupo
 */
function getGroupById(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url

    const groupId = pathname.split("/")[4]
    
    if(req.method == 'GET' && pathname == `/foca/favorites/groups/${groupId}`) {
        focaService.getGroupById(groupId, function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                res.statusCode = 200
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        })
        return true
    }
    return false
}

/**
 *  GET /foca/favorites/groups/:group_id/matches -- obter os jogos das equipas de um grupo
 */
function getMatchesByGroup(req, res) {
    const url = parse(req.url, true)
    const {pathname, query} = url

    const groupId = pathname.split("/")[4]
    
    if(req.method == 'GET' && pathname == `/foca/favorites/groups/${groupId}/matches`) {
        focaService.getMatchesByGroup(groupId, query, function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                res.statusCode = 200
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        })
        return true
    }
    return false
}

/**
 *  PUT /foca/favorites/groups/:group_id/teams/:team_id -- adicionar equipa a grupo
 */
function addTeamToGroup(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url

    const groupId = pathname.split("/")[4]
    const teamId = pathname.split("/")[6]
    
    if(req.method == 'PUT' && pathname == `/foca/favorites/groups/${groupId}/teams/${teamId}`) {
        focaService.addTeamToGroup(groupId, parseInt(teamId), function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                res.statusCode = 200
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        })
        return true
    }
    return false
}

/**
 *  DELETE /foca/favorites/groups/:group_id/teams/:team_id -- remover uma equipa de um grupo
 */
function removeTeamFromGroup(req, res) {
    const url = parse(req.url, true)
    const {pathname} = url

    const groupId = pathname.split("/")[4]
    const teamId = pathname.split("/")[6]
    
    if(req.method == 'DELETE' && pathname == `/foca/favorites/groups/${groupId}/teams/${teamId}`) {
        focaService.removeTeamFromGroup(groupId, parseInt(teamId), function (err, data) {
            if(err) {
                res.statusCode = err.code
                res.end(err.message + '\n' + err.error)
            } else {
                res.statusCode = 200
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        })
        return true
    }
    return false
}

function resourceNotFound(req, res) {
    res.statusCode = 404
    res.end('Resource Not Found')
    return true
}