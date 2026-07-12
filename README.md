# Real-Time Chat Application

A full-stack real-time chat application built with React for the frontend and Node.js, Express, and Socket.io for the backend.

## Features

- Username-based login flow
- Chat interface with message history
- REST API to fetch and create chat messages
- Real-time messaging through Socket.io
- Connected users presence updates
- Local storage persistence for the username and recent messages

## Project Structure

### Frontend
- `chat-application-frontend/src/components` – login and chat UI components
- `chat-application-frontend/src/apiCalls` – API helper functions for REST requests
- `chat-application-frontend/src/socket` – Socket.io client helpers
- `chat-application-frontend/src/App.jsx` – main application entry

### Backend
- `chat-application-backend/app.js` – main server setup and route registration
- `chat-application-backend/src/routes` – API routes
- `chat-application-backend/src/controlers` – request handlers
- `chat-application-backend/src/services` – database operations
- `chat-application-backend/src/schemas` – MongoDB schema definitions
- `chat-application-backend/src/socket` – Socket.io server event handling

## Tech Stack

### Frontend
- React
- Vite
- Socket.io Client

### Backend
- Node.js
- Express
- Socket.io
- MongoDB with Mongoose

## Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create a `.env` file in the backend folder with the following values:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/chat-app
FRONT_END_URL=http://localhost:5173
SOCKET_IO_FRONEND_URL=http://localhost:5173
```

For the frontend, you can optionally set:

```env
VITE_API_URL=http://localhost:3000
```

## Installation

### Clone the repository
```bash
git clone https://github.com/not-adev/RealTimeChatApplication
```

### Backend
```bash
cd chat-application-backend
npm install
npm run dev
```

### Frontend
```bash
cd chat-application-frontend
npm install
npm run dev
```

## How to Run the Project Locally

1. Start MongoDB on your machine or make sure your MongoDB Atlas connection string is available.
2. Create the backend `.env` file with the required variables.
3. Open a terminal and start the backend:
   ```bash
   cd chat-application-backend
   npm run dev
   ```
4. Open another terminal and start the frontend:
   ```bash
   cd chat-application-frontend
   npm run dev
   ```
5. Open the frontend URL shown by Vite, usually:
   ```text
   http://localhost:5173
   ```
6. Enter a username to access the chat application.

## Notes for Copying This Repo

- Make sure both folders, `chat-application-backend` and `chat-application-frontend`, are present in the cloned project.
- Install dependencies in both folders separately.
- If you are using a different MongoDB URI, update the backend `.env` file accordingly.
- If the frontend cannot reach the backend, verify that `VITE_API_URL` points to the correct backend address.

## API Endpoints

### Get chat history
```http
GET /api/messages
```

### Create a new chat message
```http
POST /api/messages
```

Request body:
```json
{
  "sender": "John",
  "text": "Hello world",
  "time": "2026-07-12T10:00:00.000Z"
}
```

## Socket.io Events

### Client to server
- `join` – joins the group chat room
- `sendMessage` – sends a chat message to the room

### Server to client
- `newMessage` – broadcasts a new message
- `usersUpdated` – sends the current list of connected users

## How the Flow Works

1. The user enters a username on the login screen.
2. The username is stored in local storage.
3. The chat interface loads and connects to the Socket.io server.
4. The user can send and receive messages in real time.
5. Messages are also saved to the database through the REST API.

## Design Decisions

- The frontend is split into reusable components for better maintainability.
- The backend follows a layered structure: routes → controllers → services.
- Socket.io is used for instant real-time communication.
- Demo data was removed so the UI starts clean and reflects live app state.

## Assumptions

- This version uses a single shared chat room.
- Usernames are simple display names and are not securely authenticated.
- The app uses MongoDB for storing chat history.

## Future Improvements

- Add real authentication
- Support private rooms or DM chats
- Add typing indicators
- Add read receipts and message statuses
- Improve error handling and UI feedback
