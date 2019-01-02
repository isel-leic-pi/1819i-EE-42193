module.exports = function (leaguesTemplate) {
    const results = document.querySelector("#results")

    const url = `http://localhost:8080/foca/leagues`
    fetch(url)
        .then(processResponse)
        .then(showLeaguesView)
        .catch(showError)

    function processResponse(res) {
        if (!res.ok) {
            showError()
            throw 'error'
        }
        return res.json()
    }

    async function showLeaguesView(leagues) {
        leagues = leagues.leagues
        const res = await leaguesTemplate(leagues)
        results.innerHTML = res

        document.querySelectorAll('#results .card').forEach(handleClick)
        
        function handleClick(card, idx) {
            card.onclick = function () {
                const hash = `#leagues/${leagues[idx].league_id}`
                window.location.hash = hash
            }
        }
    }

    function showError(e) {
        results.innerHTML = "Leagues not available. Try again later...";
    }
}