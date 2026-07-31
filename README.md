# 🎮 Gaming-Live (CodeBattle Platform)

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black?logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Gaming-Live (CodeBattle) is a next-generation, immersive full-stack gaming and collaborative coding workspace. It bridges the gap between competitive coding and interactive live streaming, featuring a modular code editor workspace (Code Arena), custom game themes, real-time live chat streams, authentication, and customizable gamer inventory lockers.

---

## 🌟 Key Features

### 💻 1. Collaborative Code Arena
* **Live Monaco Editor:** Embedded VS Code-like coding environment via `@monaco-editor/react`.
* **Squad Synchronization:** Real-time collaborative coding and cursor tracking using native WebSockets.
* **Gaming HUD:** Interactive health points (HP), passing rate visualizers, tactical audio cues, and action triggers.

### 🎭 2. Personalized Locker & Themes
* **Theme Selector:** Dynamically swap between gaming-inspired visual skins (e.g., *Sanhok Jungle*, *Cyberpunk*, *Deep Sea*, *Carbon Steel*).
* **Inventory & Locker Room:** Equippable custom avatars, weapons, virtual titles, badges, and rarity-based cosmetic skins.

### 📈 3. Gamer Dashboard & Analytics
* **Rich Lobby:** Visual overview of clans, rooms, active servers, streams, and quick-match cues.
* **Player Analytics:** Detailed gamer profiles tracking match history, winning rates, preferred language heatmaps, and skill metrics.

### 💬 4. Live Stream & Simulated Chat
* **VOD/Live Player:** Seamless video stream rendering via `react-player`.
* **Interactive Live Chat:** Real-time message streaming powered by Socket.io with periodic mock message generators.

### 🛡️ 5. Authentication & Clan Security
* **JWT-Based Sessions:** Secure cookies and token verification.
* **OAuth Integration:** One-click OAuth login via Google and GitHub powered by Passport.js.
* **Protected Routes:** React route guards securing game lobbies, lobbies, arenas, and inventories.

---

## 🏗️ Architecture & Project Structure

The project is split into a **Frontend** (Vite + React) client and a **Backend** (Node + Express + Socket.io + Native WS) engine.

```
Gaming-Live/
├── backend/
│   ├── config/             # Passport.js configurations
│   ├── middleware/         # JWT verification & CORS middleware
│   ├── models/             # Mongoose schemas (User, Profiles)
│   ├── routes/             # Authentication & OAuth endpoints
│   ├── server.js           # Express app, Socket.io, & Native WebSocket handlers
│   └── package.json        
├── frontend/
│   ├── public/             # Static game assets & audio files
│   ├── src/
│   │   ├── components/     # UI elements (ThreeCharacter, VictoryModal, GamerHeader, LiveChat)
│   │   ├── context/        # React AuthState provider
│   │   ├── pages/          # Full views (Dashboard, Arena, Stream, Inventory, Clan, Analytics)
│   │   ├── routes/         # Router hierarchy & Protected Route rules
│   │   ├── services/       # Audio & Theme custom properties managers
│   │   ├── App.jsx         
│   │   └── index.css       # Core game styles & Tailwind directives
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Optional: running locally on port `27017` or a cluster. Falls back to offline/mock mode if unavailable).

---

### Step 1: Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder (or copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Update the variables in `.env` with your credentials:
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/codebattle
   JWT_SECRET=your_secret_key
   # Add Google/GitHub credentials if utilizing OAuth login
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs at **`http://localhost:3001`***.

---

### Step 2: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client runs at **`http://localhost:5173`***.

*(Note: If you run into dependency caching issues during startup, run `npm run dev -- --force` to clear Vite's cache).*

---

## 📡 API & WebSocket Spec

### Backend Endpoints
* `GET /` - Server status & health check.
* `GET /api/auth/me` - Validates session cookie and returns current user payload.
* `GET /api/auth/logout` - Disposes JWT cookie session.
* `/api/auth/google` & `/api/auth/github` - Handles OAuth redirection flows.

### WebSocket Gateways
* **Socket.io (Port 3001):** Manages live chat simulation.
  * Connect: `io('http://localhost:3001')`
  * Events: `send_message`, `new_message`
* **Native WebSocket (`/ws`):** Manages multiplayer Code Arena state.
  * Endpoint: `ws://localhost:3001/ws`
  * Action Types: `JOIN_ROOM`, `CODE_UPDATE`, `CURSOR_UPDATE`, `SQUAD_STATE_CHANGE`

---

## 🎨 Design Systems & UI
* **Custom Typography:** Gaming headings and console-like styling.
* **Themes:** Custom colors configured in `themeService.js` and loaded dynamically via CSS variables into `:root`.
* **Animations:** Subtle transition timings, floating icons, active state glowing badges, and victory splash screens.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
