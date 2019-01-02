module.exports = {
    errorMsg: errorMsg,
    singleLeague: singleLeague,
    multipleLeagues: multipleLeagues,
    multipleGroups: multipleGroups,
    createdOrEditedGroup: createdOrEditedGroup,
    singleGroup: singleGroup,
    multipleMatches: multipleMatches
}

function errorMsg(data){
    let obj = {
        status_message: data.message,
        status_code: data.statusCode
    }
    return JSON.stringify(obj)
}

function singleLeague(object){
    let league = {
        league_id: object.id,
        area: object.area.name,
        name: object.name,
        current_season: {
            id: object.currentSeason.id,
            start_date: object.currentSeason.startDate,
            end_date: object.currentSeason.endDate
        }
    }
    return JSON.stringify(league)
}

function singleLeagueForMapping(object){
    let league = {
        league_id: object.id,
        area: object.area.name,
        name: object.name
    }
    return league
}

function multipleLeagues(object){
    let leagues = {
        total_leagues: object.count,
        leagues: object.competitions.map(singleLeagueForMapping)
    }
    leagues.leagues = sortByKey(leagues.leagues, 'league_id')
    return JSON.stringify(leagues)
}

function singleGroupForMapping(object){
    let group = {
        group_id: object._id,
        name: object._source.name,
        description: object._source.description,
        teams_count: object._source.teams.length
    }
    return group
}

function multipleGroups(object){
    let groups = {
        total_groups: object.hits.total,
        groups: object.hits.hits.map(singleGroupForMapping)
    }
    return JSON.stringify(groups)
}

function createdOrEditedGroup(object){
    let obj = {
        message: 'group ' + object.result,
        group_id: object._id
    }
    return JSON.stringify(obj)
}

function singleGroup(object){
    let group = {
        id: object._id,
        name: object._source.name,
        description: object._source.description,
        teams: object._source.teams
    }
    return JSON.stringify(group)
}

function matchesForMapping(object){
    let match = {
        match_id: object.id,
        league_id: object.competition.id,
        date: object.utcDate,
        status: object.status,
        home_team: object.homeTeam.name,
        away_team: object.awayTeam.name
    }
    return match
}

function singleTeamMatchesForMapping(object){
    let team = {
        team_id: object.teamId,
        team_name: object.team_name,
        total_matches: object.matches.length,
        matches: object.matches.map(matchesForMapping)
    }
    return team
}

function multipleMatches(object){
    let matchesByTeam = {
        total_teams: object.length,
        teams: object.map(singleTeamMatchesForMapping)
    }
    return JSON.stringify(matchesByTeam)
}

function sortByKey(array, key){
    return array.sort(function(a, b){
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}