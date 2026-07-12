const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchMessages() {
  const response = await fetch(`${apiBaseUrl}/api/messages`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch messages')
  }

  const data = await response.json()
  return Array.isArray(data?.messages) ? data.messages : []
}

export async function sendMessage(messagePayload) {
  const response = await fetch(`${apiBaseUrl}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(messagePayload),
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  const data = await response.json()
  return data.message
}
