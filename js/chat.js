let socket = io()


// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('Welcome', (WelcomeMessage) => {

    console.log(WelcomeMessage)

    const html = Mustache.render(messageTemplate, {
        username: WelcomeMessage.username,
        message: WelcomeMessage.text,
        createdAt: moment(WelcomeMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})



socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('location', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.location,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//Handling user message, emitting to server
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    text = $messageFormInput.value
    socket.emit('message', text, (error, message) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message Delivered')
    })

})

//Handling Location sharing, emitting to server
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return console.log('GeoLocation not enabled for your Borwser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position)
        const myLocation = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
        console.log(myLocation)
        socket.emit('location', { latitude: position.coords.latitude, longitude: position.coords.longitude }, (error, message) => {
            if (error) {
                console.log(error)
            }
        })

    })


})

socket.on('roomData', ({ room, users }) => {
    console.log('Room data received', { room, users })
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})