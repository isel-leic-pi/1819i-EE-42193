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
        leagues: object.competitions.map(comp => singleLeagueForMapping(comp))
    }
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
        groups: object.hits.hits.map(group => singleGroupForMapping(group))
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