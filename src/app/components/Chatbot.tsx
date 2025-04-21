"use client"
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Please select a category to start a conversation.", sender: "Mentors" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [category, setCategory] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API = "https://chatbotbackend.mentorslearning.com/api/chat";
  
  // Initial categories
  const initialCategories = [
    "Course & Mock Info",
    "Batch Info",
    "Technical Info",
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessageToAPI = async (message: string, selectedCategory?: string) => {
    setIsLoading(true);
    
    try {
      // Always send the user's message with the selected category
      const response = await axios.post(API, {
        message: message,
        category: selectedCategory || category
      });
     
      
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
    
    // Add user message
    setMessages([...messages, { text: input, sender: "user" }]);
    
    // Store the current input before clearing it
    const currentInput = input;
    setInput("");
    
    // Send message to API with the current category
    sendMessageToAPI(currentInput);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    // Update the category state
    setCategory(selectedCategory);
    
    // Add user message with the selected category
    setMessages([...messages, { text: `I'd like to discuss ${selectedCategory}`, sender: "user" }]);
    
    // Start the conversation with the selected category
    sendMessageToAPI(`I'd like to discuss ${selectedCategory}`, selectedCategory);
    
    // Mark conversation as started
    setConversationStarted(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <FaRobot className="text-xl" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-80 sm:w-96 h-96 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot className="text-xl" />
              <h3 className="font-medium">Mentors Learning Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1"
            >
              <IoMdClose className="text-xl" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`p-1 rounded-full ${message.sender === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"}`}>
                    {message.sender === "user" ? 
                      <FaUser className="text-blue-600 dark:text-blue-400" /> : 
                      <FaRobot className="text-gray-600 dark:text-gray-400" />
                    }
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 text-sm dark:text-gray-200 rounded-tl-none"
                  }`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <FaRobot className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
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
          
          {/* Category buttons - only show if conversation hasn't started */}
          {!conversationStarted && (
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
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
          
          {/* Input - only show after conversation has started */}
          {conversationStarted && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  <FaPaperPlane />
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