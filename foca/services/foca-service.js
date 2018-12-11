let FootballData = require('../data/football-data')
let footballData = new FootballData
let FocaData = require('../data/foca-db')
let focaData = new FocaData

module.exports = class FocaService {
    
    constructor(mockFootballDataPath, mockFocaDbPath){
        if(mockFootballDataPath && mockFocaDbPath){
            FootballData = require(mockFootballDataPath)
            footballData = new FootballData
            FocaData = require(mockFocaDbPath)
            focaData = new FocaData
        }
    }

    async getLeagues(){
        return await footballData.getLeagues()
    }
    
    async getLeaguesById(league_id){
        return await footballData.getLeaguesById(league_id)
    }

    async getGroupList(){
        return await focaData.getFavorites()
    }
    
    async postGroup(name, description){
        return await focaData.postGroup(name, description)
    }
    
    async editGroup(name, description, groupId){
        return await focaData.putGroupById(name, description, groupId)
    }
    
    async getGroupById(groupId){
        return await focaData.getFavoriteGroupById(groupId)
    }
    
    async addTeamToGroup(groupId, teamId){
        //verificar se a equipa existe
        let team = await footballData.getTeam(teamId)
        let teamObj = {id: teamId, name: team.name}
        return await focaData.putTeamInGroup(groupId, teamObj)
    }
    
    async removeTeamFromGroup(groupId, teamId){
        return await focaData.deleteTeamFromGroup(groupId, teamId)
    }

    async getMatchesByGroup(groupId, queryString){
        let matches = []
        try{
            let groupObj = await focaData.getFavoriteGroupById(groupId)
            
            let teams = groupObj._source.teams.map(team => team.id)
            for(let i = 0; i < teams.length; i++){
                matches[i] = await footballData.getMatchesByTeamId(teams[i], queryString)
                matches[i].teamId = teams[i]
            }
            return await matches
        } catch (err) {
            return []
        }
    }
}