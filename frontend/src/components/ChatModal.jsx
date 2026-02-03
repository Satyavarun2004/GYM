import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import socket from '../socket';

const ChatModal = ({ peer, onClose }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Join my own room to receive messages
        socket.emit('join_room', user._id);

        // Fetch previous messages
        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/messages/${peer._id}`);
                setMessages(data);
                scrollToBottom();
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };

        fetchMessages();

        // Listen for incoming messages
        socket.on('receive_message', (message) => {
            if (message.sender === peer._id || message.sender === user._id) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }
        });

        // Listen for my sent messages (confirmation)
        socket.on('message_sent', (message) => {
            // Avoid duplication if already optimistically added
            setMessages((prev) => {
                if (prev.some(m => m._id === message._id)) return prev;
                return [...prev, message];
            });
            scrollToBottom();
        });

        return () => {
            socket.off('receive_message');
            socket.off('message_sent');
        };
    }, [peer, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            sender: user._id,
            receiver: peer._id,
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        // Emit to server
        socket.emit('send_message', messageData);

        // Optimistically update UI
        // setMessages((prev) => [...prev, { ...messageData, _id: Date.now() }]); // Waiting for server confirmation is safer to get real ID

        setNewMessage('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card w-full max-w-md h-[500px] flex flex-col relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-dark-bg/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                            {peer.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{peer.name}</h3>
                            <p className="text-xs text-dark-muted flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full bg-green-500`}></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-dark-muted opacity-50">
                            <MessageCircle size={48} className="mb-2" />
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.sender === user._id;
                            return (
                                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white/10 text-white rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className="text-[10px] opacity-50 mt-1 block text-right">
                                            {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-dark-bg/30 rounded-b-2xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3 bg-primary rounded-xl text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
