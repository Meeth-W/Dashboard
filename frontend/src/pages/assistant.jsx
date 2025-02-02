import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import the arrow path icon

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); 

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/ai/get-history?username=Ghostyy&password=Secure123`);
                if (response.data.status === false) return console.log(response.data);
                const history = response.data;

                const formattedMessages = history.map(item => ({
                    sender: item.user === "Ghostyy" ? "user" : "bot",
                    text: item.text
                }));

                setMessages(formattedMessages);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, []); 

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsProcessing(true); 

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/ai/interact?username=Ghostyy&password=Secure123&message=${input}`);
            const botMessage = { sender: 'bot', text: response.data.response };

            if (response.data.status === false) {
                setInput(input); 
                setIsProcessing(false); 
            } else {
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                setInput(''); 
                setIsProcessing(false); 
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setInput(input);
            setIsProcessing(false); 
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center">
            <div className="bg-slate-800 w-full max-w-[90%] h-3/4 p-4 rounded-lg shadow-lg flex flex-col">
                {/* Header Section */}
                <div className="w-full h-24 flex items-center justify-center bg-slate-950 rounded-lg shadow-lg mb-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white">AI Assistant</h1>
                    </div>
                </div>

                {/* Chat Box Section */}
                <div className="chat-box flex flex-col space-y-2 overflow-y-auto h-full">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`bubble ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'} p-3 rounded-lg max-w-[80%] text-white`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="flex mt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`bg-gray-700 text-white p-2 rounded-lg flex-grow ${isProcessing ? 'border-2 border-red-500' : ''}`} // Add red border if processing
                        placeholder="Type your message..."
                        disabled={isProcessing}
                    />
                    <button 
                        type="submit" 
                        className={`text-white font-medium py-2 px-4 rounded-lg transition ml-2 ${isProcessing ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'}`} 
                        disabled={isProcessing}
                    >
                        {isProcessing ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : 'Send'} {/* Use Heroicon when processing */}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Assistant;