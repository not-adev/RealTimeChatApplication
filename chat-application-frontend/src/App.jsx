import { useEffect, useRef, useState } from 'react'
import './App.css'

const storageKey = 'chat-ui-messages'
const currentUser = 'You'
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
    sender: currentUser,
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

function App() {
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
  const messageEndRef = useRef(null)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(event) {
    event.preventDefault()
    const text = draft.trim()

    if (!text) {
      return
    }

    const nextMessage = {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      sender: currentUser,
      text,
      time: new Date().toISOString(),
    }

    setMessages((previous) => [...previous, nextMessage])
    setDraft('')
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
          <span className="status-pill">● Connected</span>
        </header>

        <section className="message-list" aria-label="Chat messages">
          {messages.map((message) => {
            const isMine = message.sender === currentUser

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

export default App
