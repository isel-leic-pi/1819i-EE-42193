const fs = require('fs')

module.exports = class FocaDatabase {
    
    getFavorites(callback){
        const groups = require('../test/mocks/mock-groups.json')
        callback(undefined, groups)
    }

    getFavoriteGroupById(groupId,callback){
        const group = require('../test/mocks/mock-group-' + groupId + '.json')
        callback(undefined, group)
    }

    postGroup(name,description,callback){
        addGroup(name, description, callback)
    }

    putGroupById(name,description,groupId,callback){
        editGroup(name, description, callback)
    }

    putTeamInGroup(groupId,teamId,callback){
        addTeamToGroup(groupId, teamId, callback)
    }

    deleteTeamFromGroup(groupId,teamId,callback){
        removeTeamFromGroup(groupId, teamId, callback)
    }
}

function addGroup(groupName, groupDescription, callback){
    const groups = require('../test/mocks/mock-groups.json')
    let groupObj = {
        _index: "favorites",
        _type: "groups",
        _id: "i8kJJGcBSAafA5sABCDO",
        _score: 1,
        _source: {
            name: groupName,
            description: groupDescription,
            teams: []
        }
    }
    groups.hits.hits.push(groupObj)
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-groups.json', JSON.stringify(groups,null,4));
    callback(undefined, groupObj)
}

function editGroup(newName, newDescription, callback){
    const groups = require('../test/mocks/mock-groups.json')
    groups.hits.hits[1]._source.name = newName
    groups.hits.hits[1]._source.description = newDescription
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-groups.json', JSON.stringify(groups,null,4));
    callback(undefined, groups)
}

function addTeamToGroup(groupId, teamId, callback){
    const group = require('../test/mocks/mock-group-' + groupId + '.json')
    group._source.teams.push(teamId)
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-group-' + groupId + '.json', JSON.stringify(group,null,4));
    callback(undefined, group)
}

function removeTeamFromGroup(groupId, teamId, callback){
    const group = require('../test/mocks/mock-group-' + groupId + '.json')
    let teamsArray = group._source.teams
    teamsArray.pop()
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-group-' + groupId + '.json', JSON.stringify(group,null,4));
    callback(undefined, group)
}