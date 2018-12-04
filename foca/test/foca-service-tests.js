const assert = require('assert')
const fs = require('fs')
const FocaService = require('../services/foca-service')
let focaService = new FocaService('../data/mock-football-data', '../data/mock-foca-db');

describe('Foca Service Test', () => {

    it('should get the list of available leagues', done => {
        focaService.getLeagues(function (err, body) {
            if(err) assert.fail('Getting leagues list failed.')
            
            assert.equal(body.count,4)
            assert.equal(body.competitions[1].name, 'Supercopa Argentina')
            assert.equal(body.competitions[2].id, 2023)
            assert.equal(body.competitions[3].area.name, 'Europe')
            
            done();
        })
    })

    it('should get a specific league specified by its id', done => {
        focaService.getLeaguesById(2001, function (err, body) {
            if(err) assert.fail('Getting league by id failed.')

            assert.equal(body.id, 2001)
            assert.equal(body.area.name, 'Europe')
            assert.equal(body.name, 'UEFA Champions League')

            done()
        })
    })

    it('should get the list of groups', done => {
        focaService.getGroupList(function (err, body) {
            if(err) assert.fail('Getting groups list failed.')

            assert.equal(body.hits.total, 2)
            assert.equal(body.hits.hits[0]._id,'i8kJJGcBSAafA5skJ5RO')
            assert.equal(body.hits.hits[0]._source.name, 'Primeiro Grupo')
            assert.equal(body.hits.hits[0]._source.teams.length, 3)

            done()
        })
    })

    it('should add a group of favorite teams', done => {
        focaService.postGroup('New Group', 'New group description', function (err, body) {
            if(err) assert.fail('Adding group to list failed.')
            
            const groups = require('./mocks/mock-groups.json')
            
            assert.equal(groups.hits.hits.length, 3)
            assert.equal(groups.hits.hits[2]._id, 'i8kJJGcBSAafA5sABCDO')
            assert.equal(groups.hits.hits[2]._source.name, 'New Group')
            assert.equal(groups.hits.hits[2]._source.description, 'New group description')
            
            groups.hits.hits.pop()
            
            fs.writeFileSync(__dirname + '\\mocks\\mock-groups.json', JSON.stringify(groups,null,4));

            done()
        })
    })

    it('should edit a group of favorite teams specified by its id', done => {
        focaService.editGroup('New Group Name', 'New group description', 'OzaIJmcBiLhWrTB2aZGt', function (err, body) {
            if(err) assert.fail('Editing group information failed.')
            
            const groups = require('./mocks/mock-groups.json')
            
            assert.equal(groups.hits.hits.length,2)
            assert.equal(groups.hits.hits[1]._id, 'OzaIJmcBiLhWrTB2aZGt')
            assert.equal(groups.hits.hits[1]._source.name, 'New Group Name')
            assert.equal(groups.hits.hits[1]._source.description, 'New group description')
            
            groups.hits.hits[1]._source.name = 'Segundo Grupo'
            groups.hits.hits[1]._source.description = 'Descricao do segundo grupo'
            
            fs.writeFileSync(__dirname + '\\mocks\\mock-groups.json', JSON.stringify(groups,null,4));
            
            done()
        })
    })

    it('should get the detailed information from a group given its id', done => {
        focaService.getGroupById('i8kJJGcBSAafA5skJ5RO', function (err, body) {
            if(err) assert.fail('Getting group by id failed.')

            assert.equal(body._id, 'i8kJJGcBSAafA5skJ5RO')
            assert.equal(body._source.name, 'Primeiro Grupo')
            assert.equal(body._source.description, 'Descricao do primeiro grupo')
            assert.equal(body._source.teams.length, 3)

            done()
        })
    })

    it('should add a team to a group of favorite teams given both ids', done => {
        focaService.addTeamToGroup('i8kJJGcBSAafA5skJ5RO', 10, function (err, body) {
            if(err) assert.fail('Adding team to group failed.')
            
            const group = require('./mocks/mock-group-i8kJJGcBSAafA5skJ5RO.json')
            
            assert.equal(group._id, 'i8kJJGcBSAafA5skJ5RO')
            assert.equal(group._source.teams.length, 4)
            assert.equal(group._source.teams[3], 10)
            
            group._source.teams.pop()
            
            fs.writeFileSync(__dirname + '\\mocks\\mock-group-i8kJJGcBSAafA5skJ5RO.json', JSON.stringify(group,null,4));

            done()
        })
    })

    it('should remove a team from a group of favorite teams given both ids', done => {
        focaService.removeTeamFromGroup('i8kJJGcBSAafA5skJ5RO', 52, function (err, body) {
            if(err) assert.fail('Deleting team from group failed.')
            
            const group = require('./mocks/mock-group-i8kJJGcBSAafA5skJ5RO.json')
            
            assert.equal(group._id, 'i8kJJGcBSAafA5skJ5RO')
            assert.equal(group._source.teams.length, 2)
            assert.equal(group._source.teams[0], 3)
            assert.equal(group._source.teams[1], 8)
            
            group._source.teams.push(52)
            
            fs.writeFileSync(__dirname + '\\mocks\\mock-group-i8kJJGcBSAafA5skJ5RO.json', JSON.stringify(group,null,4));

            done()
        })
    })

    it('should get the matches from every team of the group given its id', done => {
        focaService.getMatchesByGroup('OzaIJmcBiLhWrTB2aZGt', undefined, function (err, body) {
            if(err) assert.fail('Getting matches from group teams failed.')

            assert.equal(body.length, 2)
            assert.equal(body[0].matches.length, 2)
            assert.equal(body[0].matches[1].id, 235764)
            assert.equal(body[0].matches[1].status, 'FINISHED')
            assert.equal(body[1].matches.length, 2)
            assert.equal(body[1].matches[0].id, 235753)
            assert.equal(body[1].matches[0].season.id, 155)

            done()
        })
    })
})