import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const Assistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [password, setPassword] = useState(sessionStorage.getItem('password'));
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !password) return;
    
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/ai/get-history?username=${username}&password=${password}`);
        if (response.data.status === false) return console.log(response.data);
        
        const history = response.data.map(item => ({
          sender: item.user === username ? 'user' : 'bot',
          text: item.text
        }));

        setMessages(history);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    
    fetchHistory();
  }, [username, password]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    const newMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsProcessing(true);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/ai/interact?username=${username}&password=${password}&message=${input}`);
      const botMessage = { sender: 'bot', text: response.data.response };
      
      if (response.data.status === false) {
        setIsProcessing(false);
      } else {
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setInput('');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessing(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      try {
        await axios.get(`http://127.0.0.1:8000/api/v1/ai/clear?username=${username}&password=${password}`);
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  if (!username || !password) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-white text-2xl font-bold">You are not logged in!</h2>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 w-full max-w-[90%] h-[90vh] p-4 rounded-lg shadow-lg flex flex-col">
        <div className="w-full h-24 flex items-center justify-center bg-slate-950 rounded-lg shadow-lg mb-4">
          <h1 className="text-4xl font-bold text-white">AI Assistant</h1>
        </div>
        <div ref={chatBoxRef} className="chat-box flex flex-col space-y-2 overflow-y-auto flex-grow p-2 border border-gray-700 rounded-lg">
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
            className={`bg-gray-700 text-white p-2 rounded-lg flex-grow ${isProcessing ? 'border-2 border-red-500' : ''}`}
            placeholder="Type your message..."
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={`text-white font-medium py-2 px-4 rounded-lg transition ml-2 ${isProcessing ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'}`}
            disabled={isProcessing}
          >
            {isProcessing ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : 'Send'}
          </button>
          <button
            type="button"
            onClick={clearChat}
            className="text-white font-medium py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 ml-2"
          >
            🗑️
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
