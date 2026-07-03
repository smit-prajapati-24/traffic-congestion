# 🚦 SmartFlow AI — Traffic Congestion Management UI

A full-stack web application that visualizes real-time traffic congestion using an interactive 3D crossroads simulation, paired with a secure authentication backend.

---

## ✨ Features

- **Live 3D Traffic Simulation** — Animated crossroads built with React Three Fiber & Three.js, showing vehicles, traffic lights, and congestion patterns in real time.
- **Auth System** — JWT-based signup/login powered by Node.js, Express, and MongoDB.
- **CCTV Integration** — Live webcam feed page with helmet-detection overlay streamed from a Python backend.
- **Framer Motion Animations** — Smooth UI transitions and micro-interactions throughout.
- **Tailwind CSS v4** — Utility-first styling with a dark-mode-first aesthetic.

---

## 🗂️ Project Structure

```
traffic-congestion/
├── src/                        # React frontend (Vite)
│   ├── components/
│   │   ├── CrossroadsBackground.jsx  # 3D Three.js traffic simulation
│   │   ├── LandingPage.jsx           # Main landing UI
│   │   └── AuthModal.jsx             # Login / Signup modal
│   ├── services/
│   │   └── authService.js            # API calls to backend auth routes
│   ├── App.jsx                       # Root component
│   └── main.jsx                      # Entry point
├── backend/                    # Node.js + Express API
│   ├── models/                       # Mongoose schemas
│   ├── routes/
│   │   └── auth.js                   # /api/auth/signup & /api/auth/login
│   ├── server.js                     # Express server entry
│   └── .env                          # Environment variables (not committed)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4, Framer Motion  |
| 3D Engine  | Three.js, React Three Fiber, Drei               |
| Backend    | Node.js, Express 5, Mongoose                    |
| Database   | MongoDB (local or Atlas)                        |
| Auth       | JWT (`jsonwebtoken`), bcryptjs                  |
| Dev Tools  | Nodemon, ESLint                                 |

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd drinkgodi
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartflow
JWT_SECRET=your_super_secret_key_here
```

> 💡 Replace `MONGODB_URI` with your Atlas URI if you're not running MongoDB locally.

Start the backend server:

```bash
# Development (auto-restarts on file change)
npm run dev

# OR Production
npm start
```

The backend will be running at **http://localhost:5000**

---

### 3. Set up the Frontend

Open a **new terminal** and go back to the root directory:

```bash
cd ..         # from backend/ back to drinkgodi/
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

The frontend will be running at **http://localhost:5173**

---

### 4. (Optional) Python CCTV Backend

If you want the live webcam/helmet-detection feed on the `/cctv` page, start the Python backend separately:

```bash
# From the Python project directory
uvicorn main:app --reload --port 8000
```

The frontend automatically detects the stream at `http://localhost:8000`.

---

## 🔗 API Endpoints

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/signup`   | Register a new user |
| POST   | `/api/auth/login`    | Login & receive JWT |
| GET    | `/`                  | Health check        |

---

## 📦 Available Scripts

### Frontend (root directory)

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start Vite dev server              |
| `npm run build` | Build for production               |
| `npm run preview` | Preview production build locally |
| `npm run lint`  | Run ESLint                         |

### Backend (`/backend` directory)

| Command       | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start server with Nodemon (hot reload) |
| `npm start`   | Start server with Node               |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © SmartFlow AI
