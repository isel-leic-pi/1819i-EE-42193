const handlebars = require('../node_modules/handlebars/dist/handlebars')

const nop = function () { }
const leaguesScript = require('./leagues-script')
const leagueScript = require('./league-script')
const groupsScript = require('./groups-script')
const groupScript = require('./group-script')

const compiledTemplates = {
    home: syncToAsync(handlebars.compile(require('./templates/home.hbs'))),
    leaguesBase: syncToAsync(handlebars.compile(require('./templates/leagues-base.hbs'))),
    multipleLeagues: syncToAsync(handlebars.compile(require('./templates/multiple-leagues.hbs'))),
    singleLeague: syncToAsync(handlebars.compile(require('./templates/single-league.hbs'))),
    groupsBase: syncToAsync(handlebars.compile(require('./templates/groups-base.hbs'))),
    multipleGroups: syncToAsync(handlebars.compile(require('./templates/multiple-groups.hbs'))),
    singleGroup: syncToAsync(handlebars.compile(require('./templates/single-group.hbs'))),
    matches: syncToAsync(handlebars.compile(require('./templates/matches.hbs'))),
    login: syncToAsync(handlebars.compile(require('./templates/login.hbs'))),
    signup: syncToAsync(handlebars.compile(require('./templates/signup.hbs')))
}

function syncToAsync(syncF) {
    return async function() {
        return syncF.apply(this, Array.prototype.slice.call(arguments, 0))
    }
}

module.exports = {
    'home': {
        view: compiledTemplates.home,
        script: nop
    },
    'leagues': {
        view: compiledTemplates.leaguesBase,
        script: () => leaguesScript(compiledTemplates.multipleLeagues)
    },
    'single-leagues': {
        view: compiledTemplates.leaguesBase,
        script: () => leagueScript(compiledTemplates.singleLeague)
    },
    'groups': {
        view: compiledTemplates.groupsBase,
        script: () => groupsScript(compiledTemplates.multipleGroups)
    },
    'single-groups': {
        view: compiledTemplates.groupsBase,
        script: () => groupScript(compiledTemplates.singleGroup,compiledTemplates.matches)
    },
    'login': {
        view: compiledTemplates.login,
        script: nop
    },
    'signup': {
        view: compiledTemplates.signup,
        script: nop
    }
}