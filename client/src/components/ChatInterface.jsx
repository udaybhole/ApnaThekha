import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm your **ApnaTheka Bartender**. 🥂\n\nTell me your **budget** (e.g., 5k) and what you like (e.g., Whiskey/Beer), and I'll make the perfect plan for you!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiBase = '';
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "⚠️ **Network Error:** The bartender can't hear you. Check your connection!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* --- FLOATING TOGGLE BUTTON --- */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-black border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center text-white hover:bg-pink-600 transition-colors group"
      >
        <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:animate-bounce" />}
      </motion.button>

      {/* --- CHAT WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[95vw] md:w-[400px] h-[600px] max-h-[80vh] bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-tight">Party <span className="text-pink-500">Planner</span></h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online • AI Powered
                </p>
              </div>
              <Sparkles className="ml-auto text-yellow-400 opacity-50 animate-pulse" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg
                      ${msg.role === 'user' 
                        ? 'bg-pink-600 text-white rounded-br-none' 
                        : 'bg-zinc-900 border border-white/10 text-slate-200 rounded-bl-none'}
                    `}
                  >
                    {/* MARKDOWN RENDERER */}
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Style bullet points
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        // Style bold text (make it gold/pink for emphasis)
                        strong: ({node, ...props}) => <span className="font-bold text-pink-400" {...props} />,
                        // Style paragraphs
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        // Style links
                        a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                    <span className="text-xs text-slate-500 mr-2">Mixing drinks...</span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask: 'Budget 3k for 4 people...'"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:bg-zinc-900 transition-all shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-pink-600 rounded-lg text-white hover:bg-pink-500 disabled:opacity-50 disabled:hover:bg-pink-600 transition-all shadow-lg active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatInterface;