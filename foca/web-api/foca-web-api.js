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
async function getLeagues(req, res) {
    try{
        let leaguesList = await focaService.getLeagues()
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.multipleLeagues(leaguesList))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
}

/**
 *  GET /foca/leagues/:leagueId -- detalhes de uma liga 
 */
async function getLeaguesById(req, res) {
    try{
        let league = await focaService.getLeaguesById(req.params.leagueId)
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.singleLeague(league))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
}

/**
 *  GET /foca/favorites/groups -- lista de grupos favoritos 
 */
async function getGroupList(req, res) {
    try{
        let groupsList = await focaService.getGroupList()
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.multipleGroups(groupsList))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
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

    async function callPostGroup(bodyObj){
        try{
            let info = await focaService.postGroup(bodyObj.name, bodyObj.description)
            res.statusCode = 201
            res.setHeader('content-type', 'application/json')
            res.end(responseBuilder.createdOrEditedGroup(info))
        } catch (err) {
            let statusObj = statusCodeManager(err.statusCode)
            res.statusCode = statusObj.statusCode
            res.setHeader('content-type', 'application/json')
            res.end(responseBuilder.errorMsg(statusObj))
        }
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

    async function callEditGroup(bodyObj){
        try{
            let info = await focaService.editGroup(bodyObj.name, bodyObj.description, req.params.groupId)
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(responseBuilder.createdOrEditedGroup(info))
        } catch (err) {
            let statusObj = statusCodeManager(err.statusCode)
            res.statusCode = statusObj.statusCode
            res.setHeader('content-type', 'application/json')
            res.end(responseBuilder.errorMsg(statusObj))
        }
    }
}

/**
 *  GET /foca/favorites/groups/:groupId -- detalhes de um grupo
 */
async function getGroupById(req, res) {
    try{
        let group = await focaService.getGroupById(req.params.groupId)
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.singleGroup(group))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
}

/**
 *  GET /foca/favorites/groups/:groupId/matches -- obter os jogos das equipas de um grupo
 */
async function getMatchesByGroup(req, res) {
    try{
        let groupMatches = await focaService.getMatchesByGroup(req.params.groupId, req.query)
        if(groupMatches.length == 0) {
            //TO FINISH
            res.end(responseBuilder.errorMsg(statusObj))
            return
        }
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        //res.end(responseBuilder.multipleMatches(groupMatches))
        res.end(JSON.stringify(groupMatches))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
}

/**
 *  PUT /foca/favorites/groups/:groupId/teams/:teamId -- adicionar equipa a grupo
 */
async function addTeamToGroup(req, res) {
    try{
        let info = await focaService.addTeamToGroup(req.params.groupId, parseInt(req.params.teamId))
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.createdOrEditedGroup(info))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
}

/**
 *  DELETE /foca/favorites/groups/:groupId/teams/:teamId -- remover uma equipa de um grupo
 */
async function removeTeamFromGroup(req, res) {
    try{
        let info = await focaService.removeTeamFromGroup(req.params.groupId, parseInt(req.params.teamId))
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.createdOrEditedGroup(info))
    } catch (err) {
        let statusObj = statusCodeManager(err.statusCode)
        res.statusCode = statusObj.statusCode
        res.setHeader('content-type', 'application/json')
        res.end(responseBuilder.errorMsg(statusObj))
    }
}

function statusCodeManager(statusCode){
    if(statusCode === 403)
        return {statusCode: 403, message: 'The resource you are looking for is restricted.'}
    
    if(statusCode >= 400 && statusCode < 418)
        return {statusCode: 404, message: 'The resource you are looking for does not exist.'}

    if(statusCode >= 500 && statusCode < 506)
        return {statusCode: 502, message: 'The information provider service is unavailable.'}
}