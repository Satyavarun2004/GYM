const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User with ID: ${socket.id} joined room: ${userId}`);
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

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
