let request = require('request')
let rp = require('request-promise')

const baseUrl = 'https://api.football-data.org/v2/'

module.exports = class FootballDatabase {

    getLeagues(){
        return getRequest(`competitions`)
    }
    
    getLeaguesById(leagueId){
        return getRequest(`competitions/${leagueId}`);
    }

    //Alterar esta funcao para retornar o nome de uma equipa
    getTeamById(teamId, callback){
        getRequest1(`teams/${teamId}`, callback)
    }

    getMatchesByTeamId1(teamId, queryString, callback){
        getRequest(`teams/${teamId}/matches/`, callback, queryString)
    }
}

function getRequest1(path, callback, queryString){
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

async function getRequest(path, queryString){
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
    return await rp(options)
}