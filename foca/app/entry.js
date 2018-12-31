require('../node_modules/bootstrap/dist/css/bootstrap.min.css')
const templates = require('./templates')
require('./navigation.js')

;

(function () {  
    let mainContent = document.querySelector('#mainContent')
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