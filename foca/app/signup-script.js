module.exports = function () {
    const signup = document.querySelector('#signup')
    const fullname = document.querySelector('#fullname')
    const username = document.querySelector("#username")
    const password = document.querySelector("#password")

    signup.addEventListener("click", event => { event.preventDefault() }, true)
    signup.onclick = signupClick;

    function signupClick(event){
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
            body: JSON.stringify(bodyObj),
            credentials: 'same-origin'
        }
        fetch(url, options)
            .then(processResponse)
            .then(updateView)
            .catch(showError)
    }

    function updateView() {
        window.location.hash = `#groups`
        location.reload(true)
    }

    function processResponse(res) {
        if (!res.ok) {
            throw 'error'
        }
        return res.json()
    }

    function showError(status_code) {
        document.querySelector("#divAlerts").innerHTML = 'Something went wrong :( Try again later...'
    }
}