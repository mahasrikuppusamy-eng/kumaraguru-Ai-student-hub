import React, { useState, useRef, useEffect } from 'react';
import { Student, ChatMessage } from '../types';
import { CampusChatbotEngine } from '../services/chatbotService';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Trash2, 
  User, 
  CheckCircle2, 
  XCircle, 
  CornerDownLeft,
  ChevronDown
} from 'lucide-react';

interface AIChatbotModalProps {
  currentUser: Student | null;
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  setActiveTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const suggestions = [
    'Am I eligible for hackathon?',
    'What is the next hackathon?',
    'My attendance',
    'What is the minimum attendance?',
    'Why can\'t I register?',
    'Recommended events',
    'My registrations',
  ];

  // Initialize welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'msg_welcome',
        sender: 'bot',
        text: `Hello **${currentUser?.name || 'Student'}** 👋! I'm your **Kumaraguru AI Campus Assistant**.\n\nI can help you verify your **Hackathon Eligibility**, check your **Attendance record**, discover **AI Recommended Events**, or explore **Teammate matches**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: suggestions,
      };
      setMessages([welcome]);
    }
  }, [isOpen, currentUser]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Dynamic response from Chatbot Engine
    setTimeout(() => {
      const botReply = CampusChatbotEngine.generate_response(currentUser, text);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const welcome: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'bot',
        text: `Chat cleared! How can I assist you now, **${currentUser?.name || 'Student'}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: suggestions,
      };
      setMessages([welcome]);
    }, 100);
  };

  if (!isOpen) {
    return (
      <button
        id="floating-ai-chatbot-btn"
        onClick={() => onClose()} // triggers open in parent
        className="fixed bottom-6 right-6 z-50 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs sm:text-sm border border-white/20 group"
        title="Open AI Campus Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600 animate-pulse"></span>
        </div>
        <span className="hidden sm:inline">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/80 border border-blue-400/30 flex items-center justify-center text-white shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 leading-tight">
              <span>Kumaraguru AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p className="text-[11px] text-blue-200">
              Your smart campus assistant • Attendance & Eligibility Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
              }`}
            >
              {/* Highlight eligibility results with icons */}
              {msg.text}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>

            {/* Suggested Chips inside bot message */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                {msg.suggestions.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 p-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex gap-1 items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Sticky above input) */}
      <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">Try asking:</span>
        {suggestions.slice(0, 4).map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sug)}
            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 text-[10px] font-medium whitespace-nowrap transition-colors"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask me about hackathons, attendance, events..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-sm flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
