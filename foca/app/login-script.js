const util = require('./error-utils.js')

module.exports = function () {
    const login = document.querySelector('#login')
    const username = document.querySelector("#username")
    const password = document.querySelector("#password")

    const loggedUsername = document.querySelector("#loggedUsername")

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
            body: JSON.stringify(bodyObj)
        }
        fetch(url, options)
            .then(processResponse)
            .then(() => {loggedUsername.innerHTML = username.value})
            .catch(showError)
    }

    function processResponse(res) {
        if (!res.ok) {
            throw 'error'
        }
        return res.json()
    }

    function showError(status_code) {
        if(status_code == 401){
            util.showAlert("Wrong credentials!")
        }
        else if(status_code == 404){
            util.showAlert("Username not found. Try another one...")
        } 
        else {
            util.showAlert("Something went wrong :( Try again later...");
        }
    }

}