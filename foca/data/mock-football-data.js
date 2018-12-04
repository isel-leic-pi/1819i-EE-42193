
module.exports = class FootballDatabase {
    
    getLeagues(callback){
        const competitions = require('../test/mocks/mock-competitions.json')
        callback(undefined, competitions)
    }
    
    getLeaguesById(leagueId, callback){
        const competition = require('../test/mocks/mock-competition-' + leagueId + '.json')
        callback(undefined, competition)
    }

    getMatchesByTeamId(teamId, queryString, callback){
        const matches = require('../test/mocks/mock-team-matches-' + teamId + '.json')
        callback(undefined, matches)
    }
}
