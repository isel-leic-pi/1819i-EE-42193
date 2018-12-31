const handlebars = require('../node_modules/handlebars/dist/handlebars')

const nop = function () { }

const compiledTemplates = {
    welcome: syncToAsync(handlebars.compile(require('./templates/welcome.hbs')))
}

function syncToAsync(syncF) {
    return async function() {
        return syncF.apply(this, Array.prototype.slice.call(arguments, 0))
    }
}

module.exports = {
    welcome: {
      view: compiledTemplates.welcome,
      script: nop
    }
  }