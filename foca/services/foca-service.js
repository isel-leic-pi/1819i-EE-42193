const FootballData = require('../data/football-data')
let footballData = new FootballData
const FocaData = require('../data/foca-db')

module.exports = class FocaService {
    
    getLeagues(callback){
        footballData.getLeagues(callback);
    }
    
    getLeaguesById(league_id, callback){
        footballData.getLeaguesById(league_id, callback);
    }

    getGroupList(callback){
    }
    
    postGroup(callback){
    }
    
    editGroup(groupId, callback){
    }
    
    getGroupById(groupId, callback){
    }
    
    getMatchesByGroup(groupId, queryString, callback){
        //Not the correct behavior, just for testing purposes
        footballData.getMatchesByTeamId(groupId, queryString, callback)
    }
    
    addTeamToGroup(groupId, teamId, callback){
        //Not the correct behavior, just for testing purposes
        footballData.getTeamById(teamId, callback)
    }
    
    removeTeamFromGroup(groupId, teamId, callback){
    }
}