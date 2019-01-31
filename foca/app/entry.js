require('../node_modules/bootstrap/dist/css/bootstrap.min.css')
const templates = require('./templates')
require('./navigation.js')

;

(async function () {  
    let mainContent = document.querySelector('#mainContent')

    let user = await fetch('http://localhost:8080/api/auth/session').then(res => res.json())
    if(user.auth){
        const loginButton = document.querySelector("#loginButtonItem")
        const signupButton = document.querySelector("#signUpButtonItem")
        const loggedUser = document.querySelector("#loggedUsername")
        const logoutButton = document.querySelector("#logoutButtonItem")

        loginButton.innerHTML = ``
        signupButton.innerHTML = ``
        loggedUser.innerHTML = `&nbsp; ${user.username} &nbsp;`
        logoutButton.innerHTML = `<a class="nav-link" href="#home">Logout</a>`

        logoutButton.addEventListener("click", event => { event.preventDefault() }, true)
        logoutButton.onclick = logoutFunc

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

    window.addEventListener('hashchange', showView)
    showView()
  
    async function showView() {
        let [view, ...params] = window.location.hash.split('/')
        view = view.substring(1)
        if(params[0] && view !== 'home'){
            view = 'single-' + view
        }

        let viewTemplate = templates[view]

        if(viewTemplate) {
            mainContent.innerHTML = await viewTemplate.view.apply(null, params)
            viewTemplate.script()
        } else {
            window.location.hash = '#home'
        }
    }
})()