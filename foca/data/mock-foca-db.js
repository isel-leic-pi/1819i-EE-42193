const fs = require('fs')

module.exports = class FocaDatabase {
    
    getFavorites(){
        return new Promise(resolve => resolve(require('../test/mocks/mock-groups.json')))
    }

    getFavoriteGroupById(groupId){
        return new Promise(resolve => resolve(require('../test/mocks/mock-group-' + groupId + '.json')))
    }

    postGroup(name, description){
        return addGroup(name, description)
    }

    putGroupById(name, description, groupId){
        return editGroup(name, description)
    }

    putTeamInGroup(groupId, teamObj){
        return addTeamToGroup(groupId, teamObj.id)
    }

    deleteTeamFromGroup(groupId, teamId){
        return removeTeamFromGroup(groupId, teamId)
    }
}

function addGroup(groupName, groupDescription){
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
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-groups.json', JSON.stringify(groups,null,4))
    return new Promise(resolve => resolve(groupObj))
}

function editGroup(newName, newDescription){
    const groups = require('../test/mocks/mock-groups.json')
    groups.hits.hits[1]._source.name = newName
    groups.hits.hits[1]._source.description = newDescription
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-groups.json', JSON.stringify(groups,null,4))
    return new Promise(resolve => resolve(groups))
}

function addTeamToGroup(groupId, teamId){
    const group = require('../test/mocks/mock-group-' + groupId + '.json')
    group._source.teams.push(teamId)
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-group-' + groupId + '.json', JSON.stringify(group,null,4))
    return new Promise(resolve => resolve(group))
}

function removeTeamFromGroup(groupId, teamId){
    const group = require('../test/mocks/mock-group-' + groupId + '.json')
    let teamsArray = group._source.teams
    teamsArray.pop()
    fs.writeFileSync(__dirname + '\\..\\test\\mocks\\mock-group-' + groupId + '.json', JSON.stringify(group,null,4))
    return new Promise(resolve => resolve(group))
}