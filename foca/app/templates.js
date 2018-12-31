const handlebars = require('../node_modules/handlebars/dist/handlebars')

const nop = function () { }
const leaguesScript = require('./leagues-script')

const compiledTemplates = {
    home: syncToAsync(handlebars.compile(require('./templates/home.hbs'))),
    leaguesBase: syncToAsync(handlebars.compile(require('./templates/leagues-base.hbs'))),
    multipleLeagues: syncToAsync(handlebars.compile(require('./templates/multiple-leagues.hbs'))),
    singleLeague: syncToAsync(handlebars.compile(require('./templates/single-league.hbs')))
}

function syncToAsync(syncF) {
    return async function() {
        return syncF.apply(this, Array.prototype.slice.call(arguments, 0))
    }
}

module.exports = {
    home: {
      view: compiledTemplates.home,
      script: nop
    },
    leagues: {
        view: compiledTemplates.leaguesBase,
        script: () => leaguesScript(compiledTemplates.multipleLeagues)
      }
  }