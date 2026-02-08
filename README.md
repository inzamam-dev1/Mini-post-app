# 📱 SocialConnect - MERN Stack Social Application

A mobile-responsive social media application built for the **3W Business Internship Assessment (Task 1)**. This project focuses on real-time interactions, clean UI/UX, and a robust full-stack architecture.

## 🚀 Live Demo
- **Frontend**: [https://mini-post-web.netlify.app/](https://mini-post-web.netlify.app/)
- **Backend API**: [https://mini-post-app-1.onrender.com/api/posts](https://mini-post-app-1.onrender.com/api/posts)

## ✨ Features
- **User Authentication**: Secure Signup and Login functionality.
- **Content Creation**: Support for text-based posts and image uploads (with camera/gallery access).
- **Interactive Feed**: Like and comment on posts with real-time UI updates.
- **User Search**: Functional search bar to discover other users by username.
- **Responsive Design**: Instagram-inspired, mobile-first interface with fixed navigation and professional card styling.

## 🛠️ Tech Stack
- **Frontend**: React.js, Custom CSS (No UI libraries used for layout).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (optimized with User and Post schemas).
- **Deployment**: Netlify (Frontend) and Render (Backend).

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/inzamam-dev1/Mini-post-app.git](https://github.com/inzamam-dev1/Mini-post-app.git)
   cd Mini-post-app
   Backend Setup:

Navigate to the server folder: cd server

Install dependencies: npm install

Create a .env file and add your MONGO_URI.

Start the server: node server.js

Frontend Setup:

Navigate to the client folder: cd ../client

Install dependencies: npm install

Update API_BASE in src/App.js to your local or live server URL.

Start the React app: npm start
Mini-post-app/
├── client/          # React frontend
│   ├── public/      # Static assets and _redirects
│   └── src/         # Components and CSS
└── server/          # Express backend
    ├── models/      # Mongoose schemas (User, Post)
    └── server.js    # API endpoints and DB connection
