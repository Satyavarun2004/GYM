import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, User as UserIcon, MessageCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axios from '../api/axios';
import socket from '../socket';

const AdminChat = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch all users on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/users');
                // Filter out the current admin user from the list
                const otherUsers = data.filter(u => u._id !== user._id);
                setUsers(otherUsers);
                setFilteredUsers(otherUsers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchUsers();
        }
    }, [user]);

    // Filter users when search term changes
    useEffect(() => {
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Fetch messages when a user is selected
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
                setMessages(data);
                scrollToBottom();
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Join the room for the selected user (optional, if logic requires it)
        // socket.emit('join_room', selectedUser._id); // Maybe not needed if we listen globally but normally we join our OWN room

    }, [selectedUser]);

    // Socket listeners
    useEffect(() => {
        // Evaluate if we need to join our own room. Usually done in App or Layout.
        // Assuming user joins their own room on login in App.js or similar.
        if (user) {
            socket.emit('join_room', user._id);
        }

        const handleReceiveMessage = (message) => {
            if (selectedUser && (message.sender === selectedUser._id || message.receiver === selectedUser._id)) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }
            // Optional: Update last message preview or show unread indicator for other users
        };

        const handleMessageSent = (message) => {
            if (selectedUser && (message.receiver === selectedUser._id)) {
                // If the backend emits this back to sender, valid.
                // However, we optimistically update UI mostly.
                // If backend emits 'receive_message' to sender as well?
                // The current backend code: socket.emit('message_sent', newMessage) to sender.
            }
        };

        // Listen for confirmation
        const onMessageSent = (msg) => {
            if (selectedUser && msg.receiver === selectedUser._id) {
                // Check if we already added it optimistically? 
                // If we didn't add optimistically, add here.
                // let's just use the setMessages from optimistic update for now to be faster
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        // socket.on('message_sent', onMessageSent); 

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            // socket.off('message_sent', onMessageSent);
        };
    }, [selectedUser, user]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            sender: user._id,
            receiver: selectedUser._id,
            content: newMessage
        };

        // Optimistic UI update
        // We'll create a temp ID or wait for server response if we want perfect sync
        // But for speed, let's just send and re-fetch or rely on socket

        try {
            // Emit to socket
            socket.emit('send_message', messageData);

            // Also optimistic add to local state
            setMessages((prev) => [...prev, { ...messageData, _id: Date.now(), createdAt: new Date() }]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 p-6 overflow-hidden">
            {/* User List Sidebar */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-1/3 bg-dark-card/50 backdrop-blur-xl rounded-[2rem] border border-white/5 flex flex-col overflow-hidden"
            >
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="text-primary-light" />
                        Chats
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 text-white pl-12 pr-4 py-3 rounded-xl border border-white/5 focus:border-primary/50 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {loading ? (
                        <div className="text-center text-dark-muted py-8">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-dark-muted py-8">No users found</div>
                    ) : (
                        filteredUsers.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-4
                                    ${selectedUser?._id === u._id
                                        ? 'bg-primary/20 border border-primary/20 shadow-glow-purple'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                    {u.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-white font-semibold truncate">{u.name}</h3>
                                    <p className="text-dark-muted text-xs truncate uppercase tracking-wider">{u.role}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-dark-card/50 backdrop-blur-xl rounded-[2rem] border border-white/5 flex flex-col overflow-hidden"
            >
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/5">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                                <p className="text-primary-light text-sm">{selectedUser.email}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender === user._id;
                                return (
                                    <div
                                        key={index}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] p-4 rounded-2xl ${isMe
                                                    ? 'bg-primary text-white rounded-tr-none'
                                                    : 'bg-white/10 text-white rounded-tl-none'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-black/20">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-dark-bg text-white px-6 py-4 rounded-xl border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-primary hover:bg-primary-dark text-white p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-dark-muted">
                        <MessageCircle size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold">Select a user to start chatting</h3>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminChat;
