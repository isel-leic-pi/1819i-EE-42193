let FootballData = require('../data/football-data')
let footballData = new FootballData
let FocaData = require('../data/foca-db')
let focaData = new FocaData
let count

module.exports = class FocaService {
    
    constructor(mockFootballDataPath, mockFocaDbPath){
        if(mockFootballDataPath && mockFocaDbPath){
            FootballData = require(mockFootballDataPath)
            footballData = new FootballData
            FocaData = require(mockFocaDbPath)
            focaData = new FocaData
        }
    }

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
    
    addTeamToGroup(groupId, teamId, callback){
        focaData.putTeamInGroup(groupId, teamId, callback)
    }
    
    removeTeamFromGroup(groupId, teamId, callback){
        focaData.deleteTeamFromGroup(groupId, teamId, callback)
    }

    getMatchesByGroup(groupId, queryString, callback){
        focaData.getFavoriteGroupById(groupId, function (err, data) {
            let matches = []
            if(err) {
                callback(err,[])
            } else {
                let teams = data.body._source.teams
                count = teams.length
                teams.forEach(teamId => {
                    footballData.getMatchesByTeamId(teamId, queryString, function (err, data){
                        if(err){
                            callback(err,[])
                        }
                        else {
                            matches.push(data)
                            cb(callback,err,matches)
                        }
                    })
                });
            }
        })
    }
}

//TODO: find a better way to call the final callback when every data is available
function cb(finalCallback, err, data){
    if(--count == 0)
        finalCallback(err,data);
}