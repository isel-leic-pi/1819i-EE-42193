
module.exports = class FootballDatabase {
    
    getLeagues(){
        return new Promise(resolve => resolve(require('../test/mocks/mock-competitions.json')))
    }
    
    getLeaguesById(leagueId){
        return new Promise(resolve => resolve(require('../test/mocks/mock-competition-' + leagueId + '.json')))
    }

    getTeam(teamId){
        return new Promise(resolve => resolve(require('../test/mocks/mock-team-' + teamId + '.json')))
    }

    getMatchesByTeamId(teamId, queryString){
        return new Promise(resolve => resolve(require('../test/mocks/mock-team-matches-' + teamId + '.json')))
    }
}
