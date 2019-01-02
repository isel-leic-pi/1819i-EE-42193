module.exports = function (groupsTemplate) {
    const create = document.querySelector("#create")
    const name = document.querySelector("#name")
    const description = document.querySelector("#description")

    const results = document.querySelector("#results")
  
    create.addEventListener("click", event => { event.preventDefault() }, true)
    create.onclick = createClick;

    function createClick(event) {
        const url = `http://localhost:8080/foca/favorites/groups`
        let bodyObj = {
            name: name.value,
            description: description.value
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        }
        fetch(url, options)
            .then(processResponse)
            .then(showGroupView)
            .catch(showCreationError)
    }

    const url = `http://localhost:8080/foca/favorites/groups`
    fetch(url)
        .then(processResponse)
        .then(showGroupsView)
        .catch(showError)

    function processResponse(res) {
        if (!res.ok) {
            throw 'error'
        }
        return res.json()
    }

    function showGroupView(group) {
        window.location.hash = `#groups/${group.group_id}`
    }

    async function showGroupsView(groups) {
        groups = groups.groups
        const res = await groupsTemplate(groups)
        results.innerHTML = res

        document.querySelectorAll('#results .card').forEach(handleClick)

        function handleClick(card, idx) {
            card.onclick = function () {
                const hash = `#groups/${groups[idx].group_id}`
                window.location.hash = hash
            }
        }
    }
  
    function showCreationError(e) {
      results.innerHTML = "Couldn't create new group...";
    }

    function showError(e) {
        create.disabled = true
        results.innerHTML = "Groups not available. Try again later...";
    }
}