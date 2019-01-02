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
            body: JSON.stringify(bodyObj)
        }
        fetch(url, options)
    }


}