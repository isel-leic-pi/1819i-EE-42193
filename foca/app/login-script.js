module.exports = function () {
    const login = document.querySelector('#login')
    const username = document.querySelector("#username")
    const password = document.querySelector("#password")

    login.addEventListener("click", event => { event.preventDefault() }, true)
    login.onclick = loginClick;

    function loginClick(event){
        const url = `http://localhost:8080/api/auth/login`
        let bodyObj = {
            username: username.value,
            password: password.value
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj),
            credentials: 'same-origin'
        }
        fetch(url, options)
            .then(processResponse)
            .then(updateView)
            .catch(showError)
    }

    function processResponse(res) {
        if (!res.ok) {
            throw res.status
        }
        return res.json()
    }

    function updateView() {
        const loginButton = document.querySelector("#loginButtonItem")
        const signupButton = document.querySelector("#signUpButtonItem")
        const loggedUser = document.querySelector("#loggedUsername")
        const logoutButton = document.querySelector("#logoutButtonItem")

        loginButton.innerHTML = ``
        signupButton.innerHTML = ``
        loggedUser.innerHTML = `&nbsp; ${username.value} &nbsp;`
        logoutButton.innerHTML = `<a class="nav-link" href="#home">Logout</a>`

        logoutButton.addEventListener("click", event => { event.preventDefault() }, true)
        logoutButton.onclick = logoutFunc

        window.location.hash = `#groups`

        async function logoutFunc() {
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            }
            await fetch('http://localhost:8080/api/auth/logout', options)
            
            window.location.hash = `#home`
            location.reload(true)
        }
    }

    function showError(status_code) {
        const alert = document.querySelector("#divAlerts")
        if(status_code == 401){
            alert.innerHTML = 'Wrong credentials...'
        }
        else if(status_code == 404){
            alert.innerHTML = 'Username not found. Try another one...'
        } 
        else {
            alert.innerHTML = 'Something went wrong :( Try again later...'
        }
    }
}