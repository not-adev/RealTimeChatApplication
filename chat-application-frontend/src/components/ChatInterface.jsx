import { useEffect, useRef, useState } from 'react'
import { fetchMessages, sendMessage } from '../apiCalls/chatApi'
import { connectSocket, disconnectSocket, emitSendMessage } from '../socket/chatSocket'

const storageKey = 'chat-ui-messages'
const userStorageKey = 'chat-ui-username'
const contactName = 'Ava'

const starterMessages = [
  {
    id: '1',
    sender: 'Ava',
    text: 'Hi! I am ready to help with the new chat experience.',
    time: '2026-07-12T09:15:00.000Z',
  },
  {
    id: '2',
    sender: 'You',
    text: 'Perfect. I want a polished UI for the real-time chat app.',
    time: '2026-07-12T09:16:00.000Z',
  },
  {
    id: '3',
    sender: 'Ava',
    text: 'Great choice. The interface is now structured for live messaging.',
    time: '2026-07-12T09:17:00.000Z',
  },
]

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
      return starterMessages
    }

    try {
      const savedMessages = window.localStorage.getItem(storageKey)
      return savedMessages ? JSON.parse(savedMessages) : starterMessages
    } catch {
      return starterMessages
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
          setMessages((previous) => (previous.length > 0 ? previous : starterMessages))
        }
      } catch {
        setMessages((previous) => (previous.length > 0 ? previous : starterMessages))
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

        <div className="contact-card active">
          <div className="avatar">A</div>
          <div>
            <strong>{contactName}</strong>
            <p>Online now</p>
          </div>
        </div>

        <div className="info-card">
          <h3>Chat overview</h3>
          <ul>
            <li>Instant message delivery</li>
            <li>Message history persistence</li>
            <li>Timestamped conversation</li>
          </ul>
        </div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Active room</p>
            <h1>{contactName}</h1>
          </div>
          <div className="chat-header-actions">
            <span className="user-badge">{username || 'Guest'}</span>
            <span className="status-pill">● Connected</span>
          </div>
        </header>

        <section className="message-list" aria-label="Chat messages">
          {isLoadingHistory && <p className="history-note">Loading chat history...</p>}
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
