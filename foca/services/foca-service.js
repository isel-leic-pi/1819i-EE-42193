const FootballData = require('../data/football-data')
let footballData = new FootballData
const FocaData = require('../data/foca-db')
let focaData = new FocaData

module.exports = class FocaService {
    
    getLeagues(callback){
        footballData.getLeagues(callback)
    }
    
    getLeaguesById(league_id, callback){
        footballData.getLeaguesById(league_id, callback)
    }

    getGroupList(callback){
        focaData.getFavorites(callback)
    }
    
    postGroup(name, description, callback){
        focaData.postGroup(name, description, callback)
    }
    
    editGroup(name, description, groupId, callback){
        focaData.putGroupById(name, description, groupId, callback)
    }
    
    getGroupById(groupId, callback){
        focaData.getFavoriteGroupById(groupId, callback)
    }
    
    getMatchesByGroup(groupId, queryString, callback){
        //Not the correct behavior, just for testing purposes
        footballData.getMatchesByTeamId(groupId, queryString, callback)
    }
    
    addTeamToGroup(groupId, teamId, callback){
        focaData.putTeamInGroup(groupId, teamId, callback)
    }
    
    removeTeamFromGroup(groupId, teamId, callback){
        focaData.deleteTeamFromGroup(groupId, teamId, callback)
    }
}