module.exports = {
    errorMsg: errorMsg,
    singleLeague: singleLeague
}

function errorMsg(data){
    let obj = {
        status_message: data.body.message,
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
