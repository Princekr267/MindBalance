# MindBalance - Mental Wellness Tracker

MindBalance is a comprehensive mental health application designed to help users track their stress levels, practice meditation, and monitor their mental wellness journey.

## 🚀 Tech Stack

### Frontend

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI (via shadcn/ui patterns)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)

## 📦 Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Princekr267/MindBalance.git
    cd MindBalance
    ```

2.  **Install Client Dependencies**

    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies**

    ```bash
    cd ../server
    npm install
    ```

4.  **Environment Setup**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/mental_stress_tracker
    JWT_SECRET=your_secure_jwt_secret
    ```

## 🏃‍♂️ Running the Application

### Start the Backend

Open a terminal and run:

```bash
cd server
node server.js
```

_Server will start on http://localhost:5000_

### Start the Frontend

Open a **new** terminal and run:

```bash
cd client
npm run dev
```

_Frontend will start on http://localhost:3000_

## ✨ Features

- **Stress Assessment**: Take quick questionnaires to gauge your current stress levels.
- **Meditation Library**: Access a curated list of meditation sessions.
- **Progress Tracking**: Visualize your stress history over time.
- **Personalized Tips**: Get daily wellness tips tailored specifically to your profession (e.g., Developers, Students, Teachers).
- **Wellness Goals**: Set and display your personal motivation goal on your dashboard.
- **Smart Profile**: Manage your personal details to get a customized experience.
- **Secure Authentication**: Sign up and login securely to save your data.
- **Dynamic UI**: Beautiful, animated interface with a relaxing theme and glassmorphism elements.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
