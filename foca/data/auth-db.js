let rp = require('request-promise')
const config = require('../foca-config.json')

const baseUrl = `http://${config.es_auth.host}:${config.es_auth.port}/${config.es_auth.index}/${config.es_auth.type}`

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

function authenticate(username) {
    const options = {
        method: 'GET',
        url: `${baseUrl}/_search?q=username:${username}`,
        json: true
    }
    return rp(options)
}

function getUser(userId){
    const options = {
        method: 'GET',
        url: `${baseUrl}/${userId}`,
        json: true
    }
    return rp(options)
}

async function createUser(fullname, username, password){
    const user = { 
        fullname: fullname,
        username: username,
        password: password
    }
    const options = {
        method: 'POST',
        url: baseUrl,
        json: true,
        body: user
    }
    const resp = await rp(options)
    await rp.post(`${baseUrl.substring(0,baseUrl.lastIndexOf('/'))}/_refresh`)
    user._id = resp._id
    return user
}