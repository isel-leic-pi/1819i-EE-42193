const AuthData = require('../data/auth-db')
let authData = new AuthData

module.exports = {
    authenticate: authenticate,
    getUser: getUser,
    createUser: createUser
}

async function authenticate(username, password) {
    return authData.authenticate(username)
        .then(obj => {
            if(obj.hits.hits.length == 0) 
            throw {'statusCode': 404, 'err': 'Username not found!' }
            const first = obj.hits.hits[0]
            if(first._source.password != password) 
                throw {'statusCode': 401, 'err': 'Wrong credentials!' }
            return {
                '_id': first._id
            }
        })   
}

function getUser(userId) {
    return authData.getUser(userId)
        .then(obj => { return {
            '_id': obj._id,
            'fullname': obj._source.fullname,
            'username': obj._source.username,
        }})
}

function createUser(fullname, username, password) {
    return authData.createUser(fullname, username, password)
}