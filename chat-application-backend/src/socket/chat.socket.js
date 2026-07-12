export function registerChatSocket(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.on('join', ({ username }) => {
      if (username) {
        socket.username = username
        socket.join('global-chat')
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
      console.log('Socket disconnected:', socket.id)
    })
  })
}
