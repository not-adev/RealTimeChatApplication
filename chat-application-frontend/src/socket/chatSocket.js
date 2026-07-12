import { io } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let socket = null

export function connectSocket({ username, onMessageReceived }) {
  if (socket) {
    socket.disconnect()
  }

  socket = io(socketUrl, {
    transports: ['websocket'],
    reconnection: true,
  })

  socket.on('connect', () => {
    socket.emit('join', { username })
    console.log('Socket connected:', socket.id)
  })

  socket.on('newMessage', (message) => {
    onMessageReceived(message)
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function emitSendMessage(message) {
  if (socket) {
    socket.emit('sendMessage', message)
  }
}
