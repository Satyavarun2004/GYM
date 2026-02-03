# Fitness Application

This project consists of a full-stack gym application with a Node.js backend and a Vite React frontend.

## Prerequisites

- Node.js installed
- MongoDB URI (already configured in `backend/.env`)

## Getting Started

### 1. Run the Backend

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 2. Run the Frontend

Open another terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port shown in your terminal).

## Environment Variables

The backend requires the following environment variables (already provided in `backend/.env`):
- `PORT`: Port for the server (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
