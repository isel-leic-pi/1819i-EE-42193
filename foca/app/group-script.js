module.exports = function (groupTemplate) {
    const edit = document.querySelector("#create")
    const name = document.querySelector("#name")
    const description = document.querySelector("#description")

    const results = document.querySelector("#results")

    const groupId = window.location.hash.split('/')[1]
  
    edit.addEventListener("click", event => { event.preventDefault() }, true)
    create.onclick = editClick;

    function editClick(event) {
        const url = `http://localhost:8080/foca/favorites/groups/${groupId}`
        let bodyObj = {
            name: name.value,
            description: description.value
        }
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        }
        fetch(url, options)
            .then(processResponse)
            .then(showGroupView)
            .catch(showEditError)
    }

    const url = `http://localhost:8080/foca/favorites/groups/${groupId}`
    fetch(url)
        .then(processResponse)
        .then(showGroupView)
        .catch(showError)

    function processResponse(res) {
        if (!res.ok) {
            throw 'error'
        }
        return res.json()
    }

    async function showGroupView(group) {
        const res = await groupTemplate(group)
        results.innerHTML = res
    }
  
    function showEditError(e) {
        results.innerHTML = "Couldn't edit that group...";
    }

    function showError(e) {
        edit.setAttribute('disabled')
        results.innerHTML = "Group does not exist. Try again later...";
    }
}