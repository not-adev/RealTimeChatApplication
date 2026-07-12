export function registerChatSocket(io) {
  const connectedUsers = new Set()

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)






    socket.on('join', ({ username }) => {
      if (username) {
        socket.username = username
        connectedUsers.add(username)
        socket.join('global-chat')
        io.to('global-chat').emit('usersUpdated', Array.from(connectedUsers))
        console.log(`${username} joined the chat`)
      }
    })






    socket.on('sendMessage', (message) => {
      if (!message || !message.text) {
        return
      }

      const payload = {
        ...message,
        id: message.id || `${Date.now()}`,
        sender: message.sender || socket.username || 'Unknown',
        time: message.time || new Date().toISOString(),
      }

      io.to('global-chat').emit('newMessage', payload)
    })







    socket.on('disconnect', () => {
      if (socket.username) {
        connectedUsers.delete(socket.username)
        io.to('global-chat').emit('usersUpdated', Array.from(connectedUsers))
      }

      console.log('Socket disconnected:', socket.id)
    })
  })
}
