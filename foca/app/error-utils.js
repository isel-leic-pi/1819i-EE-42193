const Handlebars = require('./../node_modules/handlebars/dist/handlebars.js')
const alertView = Handlebars.compile(require('./templates/alert.hbs'))

module.exports = {
    showAlert
}

function showAlert(message, type = 'danger') {
    document
        .getElementById('divAlerts')
        .insertAdjacentHTML('beforeend', alertView({type, message}))
}