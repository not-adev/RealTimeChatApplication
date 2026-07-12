import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import ChatInterface from './components/ChatInterface'

const userStorageKey = 'chat-ui-username'

function App() {
  const [username, setUsername] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return window.localStorage.getItem(userStorageKey) || ''
  })

  useEffect(() => {
    const savedUsername = window.localStorage.getItem(userStorageKey)
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  if (!username) {
    return <LoginPage onLogin={setUsername} />
  }

  return <ChatInterface />
}

export default App
