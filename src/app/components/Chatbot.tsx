"use client"
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { IoMdArrowBack, IoMdClose } from 'react-icons/io';

const markdownComponents = {
  a: (props: { href?: string; children?: React.ReactNode }) => (
    <a {...props} href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline break-words" />
  ),
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello!. I'm the Mentors' AI Assistant. I will help you with your queries.", sender: "Mentors" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [category, setCategory] = useState("");
  const [pendingCourse, setPendingCourse] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [complaintForm, setComplaintForm] = useState({ name: "", phone: "", type: "", comment: "" });
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

type IntentResponse = {
  reply: string;
  intent?: string;
  ask_for_phone?: boolean;
  course?: string | null;
  conversation_id?: string | null;
};
  
 const initialCategories =[
  "Course & Mock Info",
  "Study Abroad Info",
   "Issue & Complaint"
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

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<IntentResponse>(`${API_BASE}/chat/intent`, {
        message,
        category: category || 'Course & Mock Info',
        previousMessages: messages
      });
      setMessages(prev => [...prev, { text: data.reply, sender: "Mentors" }]);
      if (data.conversation_id) setConversationId(data.conversation_id);
      if (data.intent === 'buy_course' && data.ask_for_phone) {
        setPendingCourse(data.course ?? null);
        setPhoneError(null);
      } else {
        setPendingCourse(null);
      }
    } catch {
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "Mentors"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitLead = async (phone: string, course: string | null) => {
    try {
      await axios.post(`${API_BASE}/leads`, {
        phone: phone.trim(),
        course,
        source: 'chatbot_info',
        conversation_id: conversationId ?? undefined
      });
    } catch {}
  };

  const submitComplaint = async (name: string, phone: string, type: string, comment: string) => {
    await axios.post(`${API_BASE}/complaints`, {
      name: name.trim(),
      phone: phone.trim(),
      type,
      comment: comment.trim(),
    });
  };

  const validatePhone = (raw: string): string | null => {
    const digits = raw.replace(/\D/g, "");
    const normalized = digits.startsWith("88") ? "0" + digits.slice(2) : digits;
    if (normalized.length < 10) return "অন্তত ১০ অঙ্কের ফোন নম্বর দিন";
    if (normalized.length > 11) return "সঠিক ফোন নম্বর দিন";
    if (!/^0?1[3-9]\d{8}$/.test(normalized)) return "সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)";
    return null;
  };

  const handlePhoneSubmit = async (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setPhoneError("ফোন নম্বর দিন");
      return;
    }
    const err = validatePhone(trimmed);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError(null);
    const course = pendingCourse;
    setPendingCourse(null);
    setPhoneInput("");
    await submitLead(trimmed, course);
    setMessages(prev => [...prev, {
      text: 'ধন্যবাদ। আমাদের কাউন্সেলর শীঘ্রই যোগাযোগ করবেন।',
      sender: 'Mentors'
    }]);
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    setMessages([...messages, { text: input, sender: "user" }]);
    
    const currentInput = input;
    setInput("");
    
    sendMessage(currentInput);
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
    setPendingCourse(null);
    setPhoneInput("");
    setPhoneError(null);
    setConversationId(null);
    setComplaintForm({ name: "", phone: "", type: "", comment: "" });
    setComplaintSubmitted(false);
    setMessages([
      { text: "Hello!. I'm the Mentors' AI Assistant. I will help you with your queries.", sender: "Mentors" }
    ]);
  };

  const isIssueCategory = category === "Issue & Complaint";
  const showComplaintForm = isIssueCategory && !complaintSubmitted;

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, type, comment } = complaintForm;
    if (!name.trim() || !phone.trim() || !type || !comment.trim()) return;
    const err = validatePhone(phone.trim());
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError(null);
    try {
      await submitComplaint(name, phone, type, comment);
      setComplaintSubmitted(true);
      setComplaintForm({ name: "", phone: "", type: "", comment: "" });
      setMessages(prev => [...prev, {
        text: "ধন্যবাদ। আমরা আপনার অভিযোগ পেয়েছি। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।",
        sender: "Mentors"
      }]);
    } catch {
      setMessages(prev => [...prev, {
        text: "দুঃখিত, অভিযোগ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।",
        sender: "Mentors"
      }]);
    }
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
          <div className=" bg-gradient-to-r from-pink-600 to-yellow-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <button 
              onClick={handleBackButton}
              className="text-white hover:bg-gray-700 rounded-full p-1"
            >
              <IoMdArrowBack className="text-lg" />
            </button>
            <div className="flex items-center gap-2">
              <FaRobot className="text-lg" />
              <h3 className="font-medium text-sm">Mentors&apos; AI Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-gray-700 rounded-full p-1"
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
                  <div className={`flex-shrink-0 p-1 rounded-full ${message.sender === "user" ? "bg-gradient-to-r from-pink-600 to-yellow-600 dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}`}>
                    {message.sender === "user" ? 
                      <FaUser className="text-white text-sm" /> : 
                      <FaRobot className="text-gray-600 dark:text-gray-400 text-sm" />
                    }
                  </div>
                  <div className={`p-2.5 rounded-lg text-sm break-words ${
                    message.sender === "user" 
                      ? "bg-gradient-to-r from-pink-600 to-yellow-600 text-white rounded-tr-none" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                  } prose prose-sm dark:prose-invert max-w-none`}>
                    {message.sender === "user" ? (
                      message.text
                    ) : (
                      <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
                    )}
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

          {pendingCourse !== null && conversationStarted && !showComplaintForm && (
            <div className="px-3 pb-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(null); }}
                  placeholder="ফোন নম্বর"
                  className={`flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-pink-600 to-yellow-600 dark:bg-gray-700 dark:text-white ${phoneError ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                />
                <button
                  onClick={() => handlePhoneSubmit(phoneInput)}
                  className="bg-gradient-to-r from-pink-600 to-yellow-600 hover:bg-gray-700 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap"
                >
                  জমা দিন
                </button>
              </div>
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              <p className="text-xs mt-1 text-center">------ OR -------</p>
            <a
              href="https://api.whatsapp.com/send?phone=8801713243400"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center items-center gap-2 mt-2 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ textDecoration: "none" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.523 3.477A11.909 11.909 0 0 0 12.004 0C5.373 0 .006 5.368.006 11.998c0 2.119.553 4.177 1.601 5.995L0 24l6.201-1.591a12.008 12.008 0 0 0 5.803 1.483h.005c6.63 0 11.995-5.366 11.995-11.996 0-3.193-1.244-6.197-3.481-8.419zM12.004 21.692a9.66 9.66 0 0 1-4.924-1.348l-.353-.209-3.68.943.98-3.587-.23-.369a9.642 9.642 0 0 1-1.492-5.21c0-5.327 4.336-9.665 9.668-9.665 2.585 0 5.018 1.009 6.847 2.838a9.618 9.618 0 0 1 2.836 6.829c0 5.331-4.336 9.668-9.668 9.668zm5.304-7.265c-.292-.146-1.723-.848-1.989-.945-.266-.099-.464-.146-.66.147-.197.29-.761.945-.934 1.14-.173.198-.344.223-.637.075-.292-.146-1.229-.453-2.341-1.444-.865-.77-1.449-1.72-1.62-2.012-.173-.295-.018-.454.13-.6.134-.134.292-.347.439-.521a.548.548 0 0 0 .11-.186c.073-.149.037-.28-.009-.397-.045-.117-.66-1.594-.904-2.177-.237-.572-.478-.494-.66-.498l-.563-.01a1.078 1.078 0 0 0-.779.366c-.268.289-1.02 1.008-1.02 2.457s1.044 2.853 1.189 3.053c.146.198 2.053 3.136 5.037 4.28.706.243 1.242.389 1.668.499.7.178 1.338.153 1.842.093.562-.066 1.723-.705 1.967-1.385.243-.682.243-1.267.171-1.386-.073-.119-.268-.192-.561-.338z"/>
              </svg>
              WhatsApp এ পাঠান
            </a>
            </div>
          )}

          {showComplaintForm && (
            <form onSubmit={handleComplaintSubmit} className="px-3 pb-2 border-t border-gray-200 dark:border-gray-700 pt-2 space-y-2">
              <input
                type="text"
                value={complaintForm.name}
                onChange={(e) => setComplaintForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Name"
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
              <input
                type="tel"
                value={complaintForm.phone}
                onChange={(e) => { setComplaintForm(f => ({ ...f, phone: e.target.value })); setPhoneError(null); }}
                placeholder="Phone"
                className={`w-full p-2 text-sm border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${phoneError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                required
              />
              <select
                value={complaintForm.type}
                onChange={(e) => setComplaintForm(f => ({ ...f, type: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">Type</option>
                <option value="Technical">Technical</option>
                <option value="Course Issue">Course Issue</option>
                <option value="Billing">Billing</option>
                <option value="Mock Issue">Mock Issue</option>
                <option value="Complaint">Complaint</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                value={complaintForm.comment}
                onChange={(e) => setComplaintForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Comment"
                rows={3}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                required
              />
              {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-yellow-600 hover:opacity-90 text-white text-sm rounded-lg px-3 py-2"
              >
                Submit
              </button>
            </form>
          )}
          
          {/* Category buttons */}
          {!conversationStarted && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            {initialCategories.map((categoryItem, index) => (
                <button
                  key={index}
                  onClick={() => handleCategorySelect(categoryItem)}
                  className="bg-gradient-to-r from-pink-600 to-yellow-600 hover:bg-gray-700 text-white text-sm rounded-full px-3 py-2 transition-colors w-full"
                  disabled={isLoading}
                >
                {categoryItem}
                </button>
              ))} 
            </div>
          )}
          
          {/* Input */}
          {conversationStarted && pendingCourse === null && !showComplaintForm && !isIssueCategory && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 sticky bottom-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-pink-600 to-yellow-600 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`bg-gradient-to-r from-pink-600 to-yellow-600 hover:bg-gray-700 text-white rounded-full p-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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