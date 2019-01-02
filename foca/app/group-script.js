module.exports = function (groupTemplate) {
    const edit = document.querySelector("#create")
    edit.innerHTML = 'Edit group'
    const name = document.querySelector("#name")
    const description = document.querySelector("#description")

    const results = document.querySelector("#results")

    const groupId = window.location.hash.split('/')[1]

    edit.addEventListener("click", event => { event.preventDefault() }, true)
    edit.onclick = editClick;

    function addTeam() {
        const textBox = document.querySelector("#inputTeam")
        if(!textBox.value) return;

        const url = `http://localhost:8080/foca/favorites/groups/${groupId}/teams/${textBox.value}`
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(url, options)
            .then(processResponse)
            .then(addTeamToView)
            .catch(showAddingError)

        function addTeamToView() {
            location.reload(true)
            //SOLUTION THAT IS NOT BEING USED BECAUSE WE CAN´T GET THE TEAM NAME
            /*let p = document.createElement('p')
            p.className = 'card-text';
    
            p.innerHTML =`
                TEAM_NAME
                <button type="button" class="btn btn-danger" id="deleteButton" value="${textBox.value}">Delete team</button>
            `
            document.querySelector("#teamsView").appendChild(p)*/
        }
    }

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
            .then(refreshGroupView)
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

    function refreshGroupView() {
        document.querySelector("#nameDetail").innerHTML = name.value
        document.querySelector("#descriptionDetail").innerHTML = description.value
        name.value = ''
        description.value = ''
    }

    async function showGroupView(group) {
        const res = await groupTemplate(group)
        results.innerHTML = res

        document.querySelectorAll('#teamElement').forEach(handleClick)

        function handleClick(team, idx) {
            team.onclick = function () {
                deleteTeam(team.querySelector('#deleteButton').value)
                team.remove()
            }
        }

        document.querySelector("#addTeamButton").onclick = addTeam
    }

    function deleteTeam(teamId) {
        const url = `http://localhost:8080/foca/favorites/groups/${groupId}/teams/${teamId}`
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(url, options)
            .then(processResponse)
            .catch(showRemoveError)
    }
  
    function showEditError(e) {
        results.innerHTML = "Couldn't edit that group...";
    }

    function showRemoveError(e) {
        results.innerHTML = "Couldn't remove team...";
    }

    function showAddingError(e) {
        results.innerHTML = "Couldn't add team...";
    }

    function showError(e) {
        edit.disabled = true
        results.innerHTML = "Group does not exist. Try again later...";
    }
}