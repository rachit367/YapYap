# YapYap 💬

A real-time full-stack chat application built with React, Node.js, MongoDB, Redis, and Socket.io.

**Live Demo:** [yap-yap-gamma.vercel.app](https://yap-yap-gamma.vercel.app)

---

## Features

- **Real-time messaging** via Socket.io
- **Online presence** — see who's currently online
- **Typing indicators** — live "user is typing..." feedback
- **JWT authentication** stored in HTTP-only cookies
- **Persistent sessions** using Zustand with localStorage
- **Conversation management** — create and browse DM threads
- **Fully typed** frontend with TypeScript + Zod validation

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| Zustand | Global state management |
| TanStack Query | Server state & data fetching |
| React Hook Form + Zod | Form handling & validation |
| Socket.io Client | Real-time communication |
| Axios | HTTP client |
| Lucide React | Icons |
| Sonner | Toast notifications |
| React Router v7 | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Primary database |
| Redis (ioredis) | Online user tracking & socket ID mapping |
| Socket.io | WebSocket server |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| cookie-parser | HTTP-only cookie handling |

---

## Project Structure

```
YapYap/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis client setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── conversationController.js
│   │   └── messageController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorHandling.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── conversation.js
│   │   └── message.js
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── conversationRouter.js
│   │   └── messageRouter.js
│   ├── services/
│   ├── socket/
│   │   └── socketHandler.js   # Socket.io init, online users, typing events
│   ├── utils/
│   ├── app.js                 # Express app setup & CORS
│   ├── server.js              # HTTP server + Socket.io bootstrap
│   └── docker-composer.yaml   # Local MongoDB & Redis via Docker
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWindow/    # Message list, MessageInput
    │   │   ├── Sidebar/       # Conversation list, user search
    │   │   └── common/        # Shared UI (SplashScreen, Avatar, etc.)
    │   ├── context/
    │   │   └── SocketContext  # Socket.io client provider
    │   ├── hooks/             # Custom React hooks
    │   ├── pages/             # Route-level pages (Auth, Home, etc.)
    │   ├── services/          # Axios API service functions
    │   ├── stores/
    │   │   ├── authStore.ts   # Zustand auth state (persisted)
    │   │   └── chatStore.ts   # Zustand chat/conversation state
    │   └── utils/
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for running MongoDB & Redis locally)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/YapYap.git
cd YapYap
```

### 2. Start local services with Docker

```bash
cd backend
docker compose -f docker-composer.yaml up -d
```

This spins up:
- MongoDB on `localhost:27017`
- Redis on `localhost:6379`

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
FRONTEND_URI=http://localhost:5173
PORT=3000

MONGO_URI=mongodb://localhost:27017/yapyap
REDIS_URI=redis://localhost:6379

JWT_SECRET=your_strong_secret_here

NODE_ENV=development
```

### 4. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API server runs on `http://localhost:3000`.

### 5. Configure the frontend

```bash
cd frontend
cp .env.example .env
```

`.env` should contain:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login (returns HTTP-only JWT cookie) |
| `POST` | `/logout` | Clear auth cookie |
| `GET` | `/me` | Get the currently authenticated user |

### Conversations — `/api/conversations`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List all conversations for the current user |
| `POST` | `/` | Create or fetch a DM conversation |

### Messages — `/api/messages`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/:conversationId` | Get all messages in a conversation |
| `POST` | `/:conversationId` | Send a message |

### Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `online_users` | Server → Client | `string[]` | Emitted on connect/disconnect with full online user list |
| `new_message` | Server → Client | `Message` | Delivers a new message to the recipient |
| `new_conversation` | Server → Client | `Conversation` | Notifies recipient of a new conversation |
| `typing_start` | Client → Server | `{ receiverId }` | User started typing |
| `typing_stop` | Client → Server | `{ receiverId }` | User stopped typing |
| `user_typing` | Server → Client | `{ userId, isTyping }` | Forwarded typing state to recipient |

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `FRONTEND_URI` | Allowed CORS origin (no trailing slash) | `https://yap-yap-gamma.vercel.app` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `REDIS_URI` | Redis connection string | `redis://...` |
| `JWT_SECRET` | Secret for signing JWTs | `a_long_random_string` |
| `NODE_ENV` | Environment | `production` |

### Frontend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://yapyap-7bk9.onrender.com/api` |
| `VITE_SOCKET_URL` | Backend socket URL | `https://yapyap-7bk9.onrender.com` |

---

## Deployment

### Backend — Render

1. Connect the `backend/` directory as the root of your Render web service.
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `node server.js`
4. Add all environment variables from the table above in the Render dashboard.
5. Set `FRONTEND_URI` to your exact Vercel URL (no trailing slash).

### Frontend — Vercel

1. Connect the `frontend/` directory as the root of your Vercel project.
2. Set **Framework Preset**: Vite
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add `VITE_API_URL` and `VITE_SOCKET_URL` pointing to your Render backend URL.

> **Note:** Both services must be deployed for the app to function. Socket.io requires the backend to be publicly accessible.

---

## License

MIT
