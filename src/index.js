// importing standard libraries
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

// importing custom modules
const { getMessage, getLocation } = require('../src/utils/getMessage')
const { addUser, removeUser, getUsersInRooms, getUser } = require('../src/utils/users')

// create express APP, server and IO
const app = express()
const server = http.createServer(app)
const io = socketio(server)


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
//console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath))
const port = process.env.PORT || 3000

// handle client connections
io.on('connection', (socket) => {

    // emit message on new user joining
    socket.emit('message', getMessage('Admin', 'Welcome!'))

    // Client Joining room Message
    socket.broadcast.on('join', (message, callback) => {

        // add user to room
        addUser(socket.id, message.username, message.room)

        // join socket connectiom to room
        socket.join(message.room)

        // boradcast new joining arrival to other room members
        socket.broadcast.to(message.room).emit('message', getMessage('Admin', `${message.username} has joined!`))

        // send modified members list
        usersInRooms = getUsersInRooms(message.room)
        console.log(usersInRooms)
        io.to(message.room).emit('roomData', { room: message.room, users: usersInRooms })

        callback()

    })


    // handling user message
    socket.on('message', (message, callback) => {

        let user = getUser(socket.id)

        //console.log('User: ', user)

        if (!user) {
            callback('User not found!', undefined)
        }
        else {

            io.to(user.room).emit('message', getMessage(user.userName, message))

            callback(undefined, undefined)
        }


    })

    // handling user location sharing
    socket.on('location', (message, callback) => {

        let user = getUser(socket.id)

        //console.log('User: ', user)

        if (!user) {
            callback('User not found!', undefined)
        }
        else {

            io.to(user.room).emit('location', getLocation(user.userName, `https://google.com/maps?q=${message.latitude},${message.longitude}`))

            callback(undefined, undefined)
        }

    })

    // Sign out Message
    socket.on('disconnect', () => {

        //console.log('user disconneted')

        let user = getUser(socket.id)

        // remove user from room
        removeUser(socket.id)

        if (!user) {
            return
        }
        else {

            // send modified members list
            usersInRooms = getUsersInRooms(user.room)

            //sending modified user List
            io.to(user.room).emit('roomData', { room: user.room, users: usersInRooms })
    
            //informaing other users that user has left
            socket.broadcast.emit('message', getMessage('Admin', `${user.userName} has left!`))

        }

    })

})

// start app at given port
server.listen(port,()=>{
    console.log('express app started at port:',port)
})