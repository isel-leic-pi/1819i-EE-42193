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

    async getGroupList(username){
        return await focaData.getFavorites(username)
    }
    
    async postGroup(name, description, username, teams){
        return await focaData.postGroup(name, description, username, teams)
    }
    
    async editGroup(name, description, groupId){
        return await focaData.putGroupById(name, description, groupId)
    }
    
    async getGroupById(groupId){
        return await focaData.getFavoriteGroupById(groupId)
    }
    
    async addTeamToGroup(groupId, teamId){
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
                matches[i].team_name = groupObj._source.teams[i].name
            }
            return await matches
        } catch (err) {
            throw err
        }
    }
}