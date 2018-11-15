let request = require('request')

const baseUrl = 'https://api.football-data.org/v2/'

module.exports = class FootballDatabase {
    
    getLeagues(callback){
        getRequest('competitions', callback);
    }
    
    getLeaguesById(leagueId, callback){
        getRequest(`competitions/${leagueId}`, callback);
    }

    getTeamById(teamId, callback){
        getRequest(`teams/${teamId}`, callback)
    }

    getMatchesByTeamId(teamId, queryString, callback){
        getRequest(`teams/${teamId}/matches/`, callback, queryString)
    }
}

function getRequest(path, callback, queryString){
    const options = {
        url: baseUrl + path,
        headers: {
          'User-Agent': 'request',
          'X-Auth-Token': 'e00d1382199c4ec8918e3c5b6a028c16'
        },
        json: true
    }

    if(typeof queryString !== undefined){
        options.qs = queryString  
    }

    request(options, callback);
}