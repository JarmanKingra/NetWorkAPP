🌐 NetworkAPP – A LinkedIn-Inspired Social Platform

A full-stack social networking application inspired by LinkedIn.
It allows users to create profiles, View other user's Profile, connect with others, and showcase their professional journey.


✨ Features

👤 User Authentication – Sign up, log in, Token-based handling
📝 Profile Management – Update profile picture, bio, education, and work history
🖼️ Posts – Create posts with text/media Engagement - comment and Likes on Post.
💬 Connections – Send, accept, and manage connection requests
📜 Dynamic Feed – View your posts and activities in real-time
⚙️ Responsive UI – Web-first, Also responsive for Mobile and clean style design

🛠️ Tech Stack

Frontend -----------------
React (Next.js)
Redux Toolkit (State Management)
CSS Modules

Backend -----------------
Node.js + Express
MongoDB + Mongoose
Custom bcrypt & crypto based token Authentication

Other -------------------
Axios (API calls)
Multer (file uploads)

📂 Project Structure
NetworkAPP/
│── frontend/         # React + Next.js code
│   ├── components/   # Reusable UI components
│   ├── layouts/      # User and Dashboard layouts
│   ├── pages/        # Next.js pages (Profile, Home, etc.)
│   └── redux/        # Redux actions & reducers
│
│── backend/          # Express.js backend
│   ├── models/       # Mongoose models (User, Post, etc.)
│   ├── routes/       # API routes
│   └── controllers/  # Business logic
│
└── README.md

⚡ Getting Started

Prerequisites -------------------
Node.js (>= 18)
MongoDB installed or Mongo Atlas account

Installation -------------------
Clone repo
git clone https://github.com/JarmanKingra/NetWorkAPP
cd networkapp


Setup backend -------------------
cd backend
npm install
npm run dev


Setup frontend -------------------
cd frontend
npm install
npm run dev


Open http://localhost:3000
 in your browser 🎉

🔑 Environment Variables -------------------
Create .env files in both frontend/ and backend/ folders.
Backend (/backend/.env):
PORT= yourPort
MONGO_URI= your_mongodb_connection_string



🚀 Deployment -------------------
You can deploy:
Frontend → Vercel
Backend → Render
 or [Heroku]
Database → MongoDB Atlas

Contributions are welcome!

