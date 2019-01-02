module.exports = function (leagueTemplate) {
    const results = document.querySelector("#results")

    const leagueId = window.location.hash.split('/')[1]

    const url = `http://localhost:8080/foca/leagues/${leagueId}`
    fetch(url)
        .then(processResponse)
        .then(showLeagueView)
        .catch(showError)

    function processResponse(res) {
        if (!res.ok) {
            showError(res.status)
            throw 'error'
        }
        return res.json()
    }

    async function showLeagueView(league) {
        const res = await leagueTemplate(league)
        results.innerHTML = res
    }

    function showError(status_code) {
        if(status_code == 403){
            results.innerHTML = "You can't access the information for that league.";
        }
        else if(status_code == 404){
            results.innerHTML = "That league does not exist. Try another one...";
        }
        else {
            results.innerHTML = "Something went wrong :( Try again later...";
        }
    }
}