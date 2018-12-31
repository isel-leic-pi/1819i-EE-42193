module.exports = function (leagueTemplate) {
    const results = document.querySelector("#results")

    const leagueId = window.location.hash.split('/')[1]

    const url = `http://localhost:8080/foca/leagues/${leagueId}`
    fetch(url)
        .then(processResponse)
        .then(showLeagueView)
        .catch(showSearchError)

    function processResponse(res) {
        if (!res.ok) {
            showSearchError(res.status)
        }
        return res.json()
    }

    async function showLeagueView(league) {
        const res = await leagueTemplate(league)
        results.innerHTML = res
    }

    function showSearchError(status_code) {
        if(status_code == 403){
            console.log('inside 403 if')
            results.innerHTML = "You can't access the information for that league.";
        }
        else if(status_code == 404){
            results.innerHTML = "That league does not exist. Try another one...";
        }
    }
}