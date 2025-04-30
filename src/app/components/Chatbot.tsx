"use client"
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { IoMdArrowBack, IoMdClose } from 'react-icons/io';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello!. I'm the Mentors' AI Assistant. I will help you with your queries.", sender: "Mentors" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [category, setCategory] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const API = "https://chatbotbackend.mentorslearning.com/api/chat"; // https://chatbotbackend.mentorslearning.com/api/chat
  
 const initialCategories =[
  "Course & Mock Info",
  "Study Abroad Info"
 ]

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle keyboard appearance on mobile
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && isMobile) {
        const viewportHeight = window.innerHeight;
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
          chatContainer.style.height = `${viewportHeight - 20}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, isMobile]);

  // Function to convert URLs in text to clickable links with improved formatting
  const formatMessageWithLinks = (text: string) => {
    // Regular expression to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
  
    const parts = text.split(urlRegex);
  
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Clean trailing characters like ) or .
        let cleanURL = part;
        let trailing = "";
  
        while (cleanURL.endsWith(')') || cleanURL.endsWith('.') || cleanURL.endsWith(',')) {
          trailing = cleanURL.slice(-1) + trailing;
          cleanURL = cleanURL.slice(0, -1);
        }
  
        return (
          <React.Fragment key={index}>
            <a 
              href={cleanURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-words"
            >
              {cleanURL}
            </a>
            {trailing}
          </React.Fragment>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };
  
  
  

  const sendMessageToAPI = async (message: string) => {
    setIsLoading(true);
   
    try {
      const response = await axios.post(API, {
        message: message,
        category: category
      });
      console.log('response.data.response',response.data.response)
      setMessages(prev => [...prev, { text: response.data.response, sender: "Mentors" }]);
    } catch (error) {
      console.log(error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        sender: "Mentors" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    setMessages([...messages, { text: input, sender: "user" }]);
    
    const currentInput = input;
    setInput("");
    
    sendMessageToAPI(currentInput);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    
    // Add initial message from Mentors
    setMessages(prev => [...prev, { 
      text: "How can I assist you today?", 
      sender: "Mentors" 
    }]);
    
    setConversationStarted(true);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleBackButton = () => {
    setConversationStarted(false);
    setCategory("");
    setMessages([
      { text: "Hello!. I'm the Mentors' AI Assistant. I will help you with your queries.", sender: "Mentors" }
    ]);
  };

  return (
    <div className={`${isOpen && isMobile ? 'fixed inset-0 z-50' : 'fixed bottom-5 right-5 z-50'}`}>
      {/* Chat button */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className=""
        >
          <Image src="/mentorsAi.gif" alt="Chatbot" width={50} height={50} unoptimized className='rounded-full border-2 border-white' />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          id="chat-container"
          className={`bg-white dark:bg-gray-800 flex flex-col border border-gray-200 dark:border-gray-700 ${
            isMobile 
              ? 'h-full w-full rounded-none' 
              : 'w-[320px] sm:w-[360px] md:w-[400px] h-[400px] md:h-[500px] rounded-lg shadow-xl'
          }`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <button 
              onClick={handleBackButton}
              className="text-white hover:bg-blue-700 rounded-full p-1"
            >
              <IoMdArrowBack className="text-lg" />
            </button>
            <div className="flex items-center gap-2">
              <FaRobot className="text-lg" />
              <h3 className="font-medium text-sm">Mentors&apos; AI Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-blue-700 rounded-full p-1"
            >
              <IoMdClose className="text-lg" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 p-1 rounded-full ${message.sender === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"}`}>
                    {message.sender === "user" ? 
                      <FaUser className="text-blue-600 dark:text-blue-400 text-sm" /> : 
                      <FaRobot className="text-gray-600 dark:text-gray-400 text-sm" />
                    }
                  </div>
                  <div className={`p-2.5 rounded-lg text-sm break-words ${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                  }`}
               
                  >
                    {formatMessageWithLinks(message.text)}
                    {/* {message.text} */}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="flex-shrink-0 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <FaRobot className="text-gray-600 dark:text-gray-400 text-sm" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Category buttons */}
          {!conversationStarted && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            {initialCategories.map((categoryItem, index) => (
                <button
                  key={index}
                  onClick={() => handleCategorySelect(categoryItem)}
                  className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 text-sm rounded-full px-3 py-2 transition-colors w-full"
                  disabled={isLoading}
                >
                {categoryItem}
                </button>
              ))} 
            </div>
          )}
          
          {/* Input */}
          {conversationStarted && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 sticky bottom-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chatbot;