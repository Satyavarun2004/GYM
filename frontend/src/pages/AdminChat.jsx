import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, User as UserIcon, MessageCircle, Shield, ChevronLeft, Check } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
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
                const { data } = await api.get('/users');
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

    // Join room on mount
    useEffect(() => {
        if (user?._id) {
            socket.emit('join_room', user._id);
        }
    }, [user]);

    // Filter users when search term changes
    useEffect(() => {
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Fetch messages when a user is selected
    useEffect(() => {
        if (!selectedUser) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/messages/${selectedUser._id}`);
                setMessages(data);
                scrollToBottom();
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    // Socket listeners
    useEffect(() => {
        const handleReceiveMessage = (message) => {
            // If message is from/to the selected user, add to state
            if (selectedUser && (message.sender === selectedUser._id || message.receiver === selectedUser._id)) {
                setMessages((prev) => {
                    // Prevent duplicate if already added optimistically
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                scrollToBottom();
            }
        };

        const handleMessageSent = (message) => {
            if (selectedUser && message.receiver === selectedUser._id) {
                setMessages((prev) => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                scrollToBottom();
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('message_sent', handleMessageSent);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('message_sent', handleMessageSent);
        };
    }, [selectedUser]);

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
            content: newMessage,
            createdAt: new Date().toISOString()
        };

        // Optimistic UI update
        const tempId = Date.now();
        setMessages((prev) => [...prev, { ...messageData, _id: tempId }]);
        setNewMessage('');
        scrollToBottom();

        try {
            socket.emit('send_message', messageData);
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally remove the optimistic message on error
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6 p-2 lg:p-6 overflow-hidden">
            {/* User List Sidebar */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-full md:w-80 lg:w-96 bg-dark-card/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden transition-all duration-500
                    ${selectedUser ? 'hidden md:flex' : 'flex'}`}
            >
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <MessageCircle className="text-primary-light" size={28} />
                            CHATS
                        </h2>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-xs font-black text-primary-light">{users.length}</span>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search identities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:border-primary/50 focus:outline-none transition-all placeholder:text-dark-muted/50 text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-dark-muted text-xs font-black uppercase tracking-widest">Scanning Grid...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-dark-muted py-20 px-8">
                            <Search size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm font-bold">No active identities found matching your search</p>
                        </div>
                    ) : (
                        filteredUsers.map((u) => (
                            <motion.div
                                layout
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`p-4 rounded-3xl cursor-pointer transition-all duration-300 flex items-center gap-4 relative group
                                    ${selectedUser?._id === u._id
                                        ? 'bg-primary/20 border border-primary/20 shadow-glow-purple'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl transition-transform duration-500 group-hover:scale-110 shadow-lg
                                        ${u.role === 'admin' ? 'bg-gradient-to-tr from-red-500 to-orange-500' : 
                                          u.role === 'trainer' ? 'bg-gradient-to-tr from-primary to-secondary' : 
                                          'bg-gradient-to-tr from-blue-500 to-indigo-500'}`}>
                                        {u.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-dark-card p-0.5">
                                        <div className="w-full h-full rounded-full bg-green-500 animate-pulse shadow-glow-green" />
                                    </div>
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-bold truncate group-hover:text-primary-light transition-colors">{u.name}</h3>
                                        <span className="text-[8px] text-dark-muted font-black uppercase tracking-widest opacity-50">Active</span>
                                    </div>
                                    <p className="text-dark-muted text-[10px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                        {u.role === 'admin' && <Shield size={10} className="text-red-400" />}
                                        {u.role}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex-1 bg-dark-card/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden transition-all duration-500
                    ${!selectedUser ? 'hidden md:flex' : 'flex'}`}
            >
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 lg:p-8 border-b border-white/5 flex items-center gap-4 bg-white/5">
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl
                                ${selectedUser.role === 'admin' ? 'bg-gradient-to-tr from-red-500 to-orange-500' : 
                                  selectedUser.role === 'trainer' ? 'bg-gradient-to-tr from-primary to-secondary' : 
                                  'bg-gradient-to-tr from-blue-500 to-indigo-500'}`}>
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight">{selectedUser.name}</h3>
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${selectedUser.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-primary/10 text-primary-light border-primary/20'}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <p className="text-dark-muted text-xs font-medium opacity-60">{selectedUser.email}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-6">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender === user._id;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        key={msg._id || index}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] lg:max-w-[70%] p-5 rounded-3xl shadow-xl relative group transition-all duration-300
                                                ${isMe
                                                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-tr-none shadow-primary/20'
                                                    : 'bg-white/5 text-white rounded-tl-none border border-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <p className="text-sm lg:text-base leading-relaxed">{msg.content}</p>
                                            <div className={`flex items-center gap-2 mt-2 opacity-40 text-[10px] font-black uppercase tracking-widest ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && <Check size={10} />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-6 lg:p-8 border-t border-white/5 bg-black/40">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Execute message protocol..."
                                    className="flex-1 bg-dark-bg/50 text-white px-8 py-5 rounded-3xl border border-white/5 focus:border-primary/50 focus:outline-none transition-all placeholder:text-dark-muted/30 text-sm lg:text-base font-medium shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-primary hover:bg-primary-dark text-white p-5 rounded-3xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-glow-purple group active:scale-95"
                                >
                                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-dark-muted p-10 text-center">
                        <div className="relative mb-8">
                            <MessageCircle size={100} className="opacity-5 animate-pulse" />
                            <Shield size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 text-primary-light" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Secure Comms Channel</h3>
                        <p className="max-w-xs text-sm font-medium opacity-40 leading-relaxed uppercase tracking-widest text-[10px]">Select an identity from the terminal list to initiate encrypted communication protocol.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminChat;
