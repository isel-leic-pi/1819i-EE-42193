let request = require('request')
const config = require('../foca-config.json')

const baseUrl = `http://${config.es.host}:${config.es.port}/${config.es.index}/${config.es.type}`

module.exports = class FocaDatabase {
    
    getFavorites(callback){
        getRequest(`/_search`,callback)
    }

    getFavoriteGroupById(groupId,callback){
        getRequest(`/${groupId}`,callback)
    }

    postGroup(name,description,callback){
        postRequest(name,description,``,callback)
    }

    putGroupById(name,description,groupId,callback){
        putRequestToUpdateGroupInfo(name,description,`/${groupId}/_update`,callback)
    }

    putTeamInGroup(groupId,teamId,callback){
        postRequestToAddTeam(teamId,`/${groupId}/_update`,callback)
    }

    deleteTeamFromGroup(groupId,teamId,callback){
        postRequestToRemoveTeam(teamId,`/${groupId}/_update`,callback)
    }
}

function getRequest(path, callback){
    const options = {
        method: 'GET',
        url: baseUrl + path,
        json: true
    }
    request(options, callback)
}

function postRequest(groupName, groupDescription, path, callback){
    let groupObj = {
        name: groupName,
        description: groupDescription,
        teams:[]
    }
    const options = {
        method: 'POST',
        url: baseUrl + path,
        json: true,
        body: groupObj
    }
    request(options, callback)
}

function putRequestToUpdateGroupInfo(newName, newDescription, path, callback){
    let groupObj = {
        script : {
            inline : "ctx._source.name = params.name; ctx._source.description = params.description;",
            params : {
                name : newName,
                description : newDescription
            }
        }
    }
    const options = {
        method: 'POST',
        url: baseUrl + path,
        json: true,
        body: groupObj
    }
    request(options, callback)
}

function postRequestToAddTeam(teamId, path, callback){
    let object = {
        script : {
            inline : "if(!ctx._source.teams.contains(params.team)) ctx._source.teams.add(params.team);",
            params : {
                team : teamId
            }
        }
    }
    const options = {
        method: 'POST',
        url: baseUrl + path,
        json: true,
        body: object
    }
    request(options, callback)
}

function postRequestToRemoveTeam(teamId, path, callback){
    let object = {
        script : {
            inline : "ctx._source.teams.removeIf(v -> v == params.team);",
            params : {
                team : teamId
            }
        }
    }
    const options = {
        method: 'POST',
        url: baseUrl + path,
        json: true,
        body: object
    }
    request(options, callback)
}