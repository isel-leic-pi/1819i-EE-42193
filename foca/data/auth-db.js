let rp = require('request-promise')
const config = require('../foca-config.json')

const baseUrl = `http://${config.es-auth.host}:${config.es-auth.port}/${config.es-auth.index}/${config.es-auth.type}`

module.exports = class AuthDatabase {

    authenticate(username) {
        return authenticate(username)      
    }
    
    getUser(userId) {
        return getUser(userId)        
    }
    
    createUser(fullname, username, password) {
        return createUser(fullname, username, password)
    }
}

async function authenticate(username) {
    const options = {
        method: 'GET',
        url: `${baseUrl}/_search?q=username:${username}`,
        json: true
    }
    return await rp(options)
}

async function getUser(userId){
    const options = {
        method: 'GET',
        url: `${baseUrl}/${userId}`,
        json: true
    }
    return await rp(options)
}

async function createUser(fullname, username, password){
    const user = { fullname, username, password }
    const options = {
        method: 'POST',
        url: baseUrl,
        json: true,
        body: user
    }
    const resp = await rp(options)
    await rp.post(`${baseUrl}/_refresh`)
    user._id = resp._id
    return user
}