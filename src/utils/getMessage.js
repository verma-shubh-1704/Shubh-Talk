const moment = require('moment')


const getMessage = (username,text)=>{

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const getLocation = (username,location)=>{

    return {
        username,
        location,
        createdAt: new Date().getTime()
    }
}
//console.log(getMessage('Amit','test'))

module.exports = {
    getMessage,
    getLocation
}