module.exports = function (groupsTemplate) {
    const create = document.querySelector("#create")
    const copy = document.querySelector("#copy")
    copy.style.display = "none"
    const name = document.querySelector("#name")
    const description = document.querySelector("#description")

    const results = document.querySelector("#results")
  
    create.addEventListener("click", event => { event.preventDefault() }, true)
    create.onclick = createClick;

    async function createClick(event) {
        if(!checkEmptyInput()){
            showInputError()
            return
        } else if (!await checkValidName()){
            showNameError()
            return
        }
        
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

    function checkEmptyInput(){
        return name.value && description.value;
    }

    async function checkValidName(){
        let valid = true;

        const url = `http://localhost:8080/foca/favorites/groups`
        await fetch(url)
            .then(processResponse)
            .then(nameCheck)
            .catch(showCreationError)

        function nameCheck(groups){
            groups = groups.groups

            groups.forEach(group => {
                if(group.name === name.value){
                    valid = false
                }
            })
        }
        return valid
    }

    function processResponse(res) {
        if (!res.ok) {
            throw res.status
        }
        return res.json()
    }

    function showInputError() {
        results.innerHTML = "You must write a valid name and description...";
    }

    function showNameError() {
        results.innerHTML = "You can't have two groups with the same name...";
    }
  
    function showCreationError(e) {
      results.innerHTML = "Couldn't create new group...";
    }

    function showError(statusCode) {
        create.disabled = true
        if(statusCode == 401){
            results.innerHTML = "You must be logged in to check your groups..."
        } else {
            results.innerHTML = "Groups not available. Try again later..."
        }
    }
}