const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/diets', require('./routes/dietRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/photos', require('./routes/progressPhotoRoutes'));
app.use('/api/weight', require('./routes/weightRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User with ID: ${socket.id} joined room: ${userId}`);
    });

    socket.on('workout_start', (data) => {
        const { userId, exerciseName } = data;
        socket.join('gym_floor');
        socket.to('gym_floor').emit('peer_joined', { userId, exerciseName });
        console.log(`User ${userId} started ${exerciseName} on the gym floor`);
    });

    socket.on('workout_update', (data) => {
        const { userId, sets, reps, exerciseName } = data;
        socket.to('gym_floor').emit('peer_update', { userId, sets, reps, exerciseName });
    });

    socket.on('send_message', async (data) => {
        const { sender, receiver, content } = data;
        
        // Save to DB
        try {
            const newMessage = await Message.create({ sender, receiver, content });
            
            // Emit to receiver's room
            socket.to(receiver).emit('receive_message', newMessage);
            // Also emit back to sender (or handle optimistically in frontend)
            socket.emit('message_sent', newMessage); 
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const fs = require('fs');
const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log('Created uploads directory');
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
