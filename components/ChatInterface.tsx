import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  gameStatus: 'playing' | 'won';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, gameStatus }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading && gameStatus !== 'won') {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-surface relative">
      {/* Top Bar */}
      <div className="h-16 glass flex items-center px-6 justify-between z-20 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>
          <span className="font-fantasy font-bold text-lg text-gray-100 tracking-wider">대화 기록</span>
        </div>
        <div className="flex gap-4 text-gray-400">
           <button className="hover:text-gold-400 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             </svg>
           </button>
           <button className="hover:text-gold-400 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-60">
             <div className="w-20 h-20 rounded-full border border-gray-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
             </div>
             <p className="font-ui text-sm tracking-wide">대화를 시작해보세요...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`relative flex z-10 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 text-sm md:text-base font-ui leading-relaxed shadow-md backdrop-blur-sm ${
                msg.role === 'user'
                  ? 'bg-gold-600 text-white rounded-br-none'
                  : 'bg-dark-800/80 border border-white/5 text-gray-200 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' && (
                <div className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                   잡화점 주인
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start z-10 relative">
             <div className="bg-dark-800/80 border border-white/5 rounded-2xl rounded-bl-none px-4 py-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-dark-surface z-20">
        <form 
          onSubmit={handleSubmit}
          className={`relative flex items-center gap-3 p-1.5 rounded-xl transition-all duration-300 ${
             gameStatus === 'won' ? 'opacity-50 pointer-events-none' : 'glass-input focus-within:ring-1 focus-within:ring-gold-500/50'
          }`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={gameStatus === 'won' ? "조사가 완료되었습니다." : "메시지를 입력하세요..."}
            disabled={isLoading || gameStatus === 'won'}
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 p-3 font-ui"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || gameStatus === 'won'}
            className={`p-3 rounded-lg transition-all duration-300 ${
               !inputText.trim() || isLoading || gameStatus === 'won'
               ? 'text-gray-600'
               : 'bg-gold-500 text-white hover:bg-gold-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        {gameStatus === 'won' && (
            <div className="mt-4 text-center font-fantasy text-lg text-red-500 animate-pulse tracking-widest">
                임무 완수! 비밀을 밝혀냈습니다.
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;