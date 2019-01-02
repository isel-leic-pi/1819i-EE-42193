const util = require('./error-utils.js')

module.exports = function () {
    const signup = document.querySelector('#signup')
    const fullname = document.querySelector('#fullname')
    const username = document.querySelector("#username")
    const password = document.querySelector("#password")

    signup.addEventListener("click", event => { event.preventDefault() }, true)
    signup.onclick = signupClick;

    function signupClick(event){
        console.log("inside signupClick")
        const url = `http://localhost:8080/api/auth/signup`
        let bodyObj = {
            fullname: fullname.value,
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
            .then( () => {
                util.showAlert("You have succesfully signed up", "success");
            })
            .catch(showError)
    }

    function processResponse(res) {
        if (!res.ok) {
            throw 'error'
        }
        return res.json()
    }

    function showError(status_code) {
        util.showAlert("Something went wrong :( Try again later...");
    }
}