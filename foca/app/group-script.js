module.exports = function (groupTemplate, matchesTemplate) {
    const edit = document.querySelector("#create")
    edit.innerHTML = 'Edit group'
    const copy = document.querySelector("#copy")
    copy.style.display = "inline"
    const name = document.querySelector("#name")
    const description = document.querySelector("#description")

    const results = document.querySelector("#results")

    const groupId = window.location.hash.split('/')[1]

    edit.addEventListener("click", event => { event.preventDefault() }, true)
    edit.onclick = editClick;

    copy.addEventListener("click", event => { event.preventDefault() }, true)
    copy.onclick = copyClick;

    async function addTeam() {
        const teamId = document.querySelector("#inputTeam")
        if(!teamId.value) return;
        if(!await checkValidTeam(teamId)){
            showTeamError()
            return
        }

        const url = `http://localhost:8080/foca/favorites/groups/${groupId}/teams/${teamId.value}`
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
                <button type="button" class="btn btn-danger" id="deleteButton" value="${teamId.value}">Delete team</button>
            `
            document.querySelector("#teamsView").appendChild(p)*/
        }
    }

    function getMatches() {
        const start_date = document.querySelector("#inputStartDate")
        const end_date = document.querySelector("#inputEndDate")
        if(!start_date.value || !end_date.value) return;

        const url = `http://localhost:8080/foca/favorites/groups/${groupId}/matches?dateFrom=${start_date.value}&dateTo=${end_date.value}`
        fetch(url)
            .then(processResponse)
            .then(addMatchesToView)
            .catch(showMatchesError)

        async function addMatchesToView(matches) {
            matches = matches.teams
            const res = await matchesTemplate(matches)
            const matchesContent = document.querySelector("#matchesContent")
            matchesContent.innerHTML = res

            start_date.value = ''
            end_date.value = ''
        }
    }

    async function getTeams(){
        const url = `http://localhost:8080/foca/favorites/groups/${groupId}`
        let group = await fetch(url)
            .then(processResponse)
            .catch(showCopyError)
        return group.teams
    }

    function editClick(event) {
        if(!checkEmptyInput()){
            showInputError()
            return
        }

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

    async function copyClick(event) {
        const nameDetail = document.querySelector("#nameDetail")

        if(!checkEmptyInput()){
            showInputError()
            return
        }
        
        if(name.value == nameDetail.innerHTML){
            showSameNameError()
            return
        }

        let teams = await getTeams()

        const url = `http://localhost:8080/foca/favorites/groups`
        let bodyObj = {
            name: name.value,
            description: description.value,
            teams: teams
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
            .then(showNewGroupView)
            .catch(showCopyError)        
    }

    const url = `http://localhost:8080/foca/favorites/groups/${groupId}`
    fetch(url)
        .then(processResponse)
        .then(showGroupView)
        .catch(showError)

    async function checkValidTeam(teamId){
        let valid = true;

        const url = `http://localhost:8080/foca/favorites/groups/${groupId}`
        await fetch(url)
            .then(processResponse)
            .then(teamCheck)
            .catch(showError)

        function teamCheck(teams){
            teams = teams.teams
            
            teams.forEach(team => {
                if(team.id == teamId.value){
                    valid = false
                }
            })
        }
        return valid
    }

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

    function showNewGroupView(group) {
        window.location.hash = `#groups/${group.group_id}`
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

        document.querySelector('#getMatchesButton').onclick = getMatches
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

    function checkEmptyInput(){
        return name.value && description.value;
    }

    function showInputError() {
        results.innerHTML = "You must write a valid name and description...";
    }

    function showSameNameError() {
        results.innerHTML = "You can't have two groups with the same name...";
    }

    function showTeamError() {
        results.innerHTML = "You can't had the same team twice to the same group...";
    }
  
    function showEditError(e) {
        results.innerHTML = "Couldn't edit that group...";
    }

    function showCopyError(e) {
        results.innerHTML = "Couldn't copy that group...";
    }

    function showRemoveError(e) {
        results.innerHTML = "Couldn't remove team...";
    }

    function showAddingError(e) {
        results.innerHTML = "Couldn't add team...";
    }

    function showMatchesError(e) {
        results.innerHTML = "Couldn't get the matches from these teams. Try again later...";
    }

    function showError(e) {
        edit.disabled = true
        results.innerHTML = "Group does not exist. Try again later...";
    }
}