import React, { useState } from 'react';
import axios from 'axios';

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    //   Test implementation: DOESNT WORK
    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = { sender: 'user', text: input };
        setMessages([...messages, newMessage]);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/ai/interact?username=Ghostyy&password=Secure123&message=${input}`);
            const botMessage = { sender: 'bot', text: response.data.reply };
            setMessages([...messages, newMessage, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setInput('');
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white">
            <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white">AI Assistant!</h1>
                    <div className="mt-4 text-lg text-gray-300">
                        <div className="chat-box">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender}`}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="mt-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-gray-700 text-white p-2 rounded-lg"
                                placeholder="Type your message..."
                            />
                            <button type="submit" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-500 transition ml-2">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assistant;