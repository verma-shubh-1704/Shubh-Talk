const users = []

const addUser = (id, userName, room) => {
    if (!userName || !room) {
        throw new Error('User and Room both are required!')
    }

    user = users.find((user) => {
        if (userName === user.userName && (room == user.room)) {
            return
        }

    })

    users.push({ id, userName, room })
    console.log(`${userName} added to room ${room}`)

}

const removeUser = (id) => {

    index = users.findIndex((user) => (id === user.id))

    users.splice(index, 1)


}

const getUser = (id) => {

    return users.find((user) => (id === user.id))



}

const getUsersInRooms = (room) => {
    if (!room) {
        throw new Error('Room both are required!')
    }

    return users.filter((user) => (room == user.room))

}


module.exports = {
    addUser,
    removeUser,
    getUsersInRooms,
    getUser

}