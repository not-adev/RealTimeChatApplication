import { useState } from 'react'

const userStorageKey = 'chat-ui-username'

function LoginPage({ onLogin }) {
  const [loginInput, setLoginInput] = useState('')

  function handleLogin(event) {
    event.preventDefault()
    const trimmedUsername = loginInput.trim()

    if (!trimmedUsername) {
      return
    }

    window.localStorage.setItem(userStorageKey, trimmedUsername)
    onLogin(trimmedUsername)
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleLogin}>
        <p className="eyebrow">Welcome</p>
        <h1>Join the chat</h1>
        <p className="auth-copy">
          Enter a username to continue into your real-time chat workspace.
        </p>
        <input
          type="text"
          value={loginInput}
          onChange={(event) => setLoginInput(event.target.value)}
          placeholder="Enter your username"
          aria-label="Username"
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  )
}

export default LoginPage
