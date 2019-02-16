let rp = require('request-promise')
const config = require('../foca-config.json')

const baseUrl = `http://${config.es.host}:${config.es.port}/${config.es.index}/${config.es.type}`

module.exports = class FocaDatabase {
    
    getFavorites(username){
        return getRequest(`/_search?q=username:${username}`)
    }

    getFavoriteGroupById(groupId){
        return getRequest(`/${groupId}`)
    }

    postGroup(name, description, username, teams){
        return postRequest(name, description, ``, username, teams)
    }

    putGroupById(name, description, groupId){
        return putRequestToUpdateGroupInfo(name, description, `/${groupId}/_update`)
    }

    putTeamInGroup(groupId, teamObj){
        return postRequestToAddTeam(teamObj, `/${groupId}/_update`)
    }

    deleteTeamFromGroup(groupId, teamId){
        return postRequestToRemoveTeam(teamId, `/${groupId}/_update`)
    }
}

async function getRequest(path){
    const options = {
        method: 'GET',
        url: baseUrl + path,
        json: true
    }
    return await rp(options)
}

async function postRequest(groupName, groupDescription, path, username, teams){
    let groupObj = {
        name: groupName,
        description: groupDescription,
        username: username,
        teams: teams
    }
    const options = {
        method: 'POST',
        url: baseUrl + path,
        json: true,
        body: groupObj
    }
    return await rp(options)
}

async function putRequestToUpdateGroupInfo(newName, newDescription, path){
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
    return await rp(options)
}

async function postRequestToAddTeam(teamObj, path){
    let object = {
        script : {
            inline : "if(!ctx._source.teams.contains(params.team)) ctx._source.teams.add(params.team);",
            params : {
                team : teamObj
            }
        }
    }
    const options = {
        method: 'POST',
        url: baseUrl + path,
        json: true,
        body: object
    }
    return await rp(options)
}

async function postRequestToRemoveTeam(teamId, path, callback){
    let object = {
        script : {
            inline : "ctx._source.teams.removeIf(v -> v.id == params.team);",
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
    return await rp(options)
}