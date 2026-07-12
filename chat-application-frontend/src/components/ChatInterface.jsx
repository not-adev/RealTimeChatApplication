import { useEffect, useRef, useState } from 'react'
import { fetchMessages, sendMessage } from '../apiCalls/chatApi'
import { connectSocket, disconnectSocket, emitSendMessage } from '../socket/chatSocket'

const storageKey = 'chat-ui-messages'
const userStorageKey = 'chat-ui-username'

function formatTime(value) {
  const date = new Date(value)
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ChatInterface() {
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const savedMessages = window.localStorage.getItem(storageKey)
      return savedMessages ? JSON.parse(savedMessages) : []
    } catch {
      return []
    }
  })
  const [draft, setDraft] = useState('')
  const [username, setUsername] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return window.localStorage.getItem(userStorageKey) || ''
  })
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState([])
  const socketRef = useRef(null)
  const messageEndRef = useRef(null)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoadingHistory(true)

      try {
        const data = await fetchMessages()

        if (data.length > 0) {
          setMessages(data)
        } else {
          setMessages([])
        }
      } catch {
        setMessages([])
      } finally {
        setIsLoadingHistory(false)
      }
    }

    if (username) {
      loadChatHistory()
    }
  }, [username])

  useEffect(() => {
    const savedUsername = window.localStorage.getItem(userStorageKey)
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  useEffect(() => {
    if (!username) {
      return undefined
    }

    const socket = connectSocket({
      username,
      onMessageReceived: (message) => {
        setMessages((previous) => {
          if (previous.some((item) => item.id === message.id)) {
            return previous
          }

          return [...previous, message]
        })
      },
      onUsersUpdated: (users) => {
        setConnectedUsers(users)
      },
    })

    socketRef.current = socket

    return () => {
      disconnectSocket()
      socketRef.current = null
    }
  }, [username])

  async function handleSend(event) {
    event.preventDefault()
    const text = draft.trim()

    if (!text) {
      return
    }

    const payload = {
      sender: username || 'You',
      text,
      time: new Date().toISOString(),
    }

    try {
      const savedMessage = await sendMessage(payload)
      setMessages((previous) => [...previous, savedMessage])
      emitSendMessage(savedMessage)
      setDraft('')
    } catch {
      const fallbackMessage = {
        id: crypto.randomUUID?.() ?? `${Date.now()}`,
        sender: payload.sender,
        text: payload.text,
        time: payload.time,
      }

      setMessages((previous) => [...previous, fallbackMessage])
      setDraft('')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Realtime chat</p>
            <h2>Conversations</h2>
          </div>
          <button type="button" className="ghost-btn small-btn">
            +
          </button>
        </div>

        <div className="info-card">
          <h3>Connected users</h3>
          {connectedUsers.length > 0 ? (
            <ul className="user-list">
              {connectedUsers.map((user) => (
                <li key={user} className="user-list-item">
                  <span className="online-dot" />
                  <span>{user}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users connected yet.</p>
          )}
        </div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Active room</p>
            <h1>Group Chat</h1>
          </div>
          <div className="chat-header-actions">
            <span className="user-badge">{username || 'Guest'}</span>
            <span className="status-pill">● Connected</span>
          </div>
        </header>

        <section className="message-list" aria-label="Chat messages">
          {isLoadingHistory && <p className="history-note">Loading chat history...</p>}
          {!isLoadingHistory && messages.length === 0 && (
            <div className="empty-state">
              <p>No messages yet.</p>
              <span>Start the conversation.</span>
            </div>
          )}
          {messages.map((message) => {
            const isMine = message.sender === username || message.sender === 'You'

            return (
              <article
                key={message.id}
                className={`message-bubble ${isMine ? 'mine' : 'their'}`}
              >
                <div className="message-meta">
                  <strong>{message.sender}</strong>
                  <span>{formatTime(message.time)}</span>
                </div>
                <p>{message.text}</p>
              </article>
            )
          })}
          <div ref={messageEndRef} />
        </section>

        <form className="composer" onSubmit={handleSend}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            aria-label="Message input"
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  )
}

export default ChatInterface
