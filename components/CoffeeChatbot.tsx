/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendCoffeeChat, ChatMessage } from '../services/gemini';

type Message = { from: 'bot' | 'user'; text: string; chips?: string[] };

const INITIAL_MESSAGE: Message = {
  from: 'bot',
  text: 'Hi! Welcome to Brewed Beans Café ☕ What can I get started for you today?',
  chips: ['☕ Order Coffee', '💬 Brewing Tips', '👋 Say Hello'],
};

/* ── B&W SVG mascots ── */
const BrewBot = () => (
  <svg width="56" height="58" viewBox="0 0 56 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9 Q18 5 20 2 Q22 5 20 9" stroke="#222" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <path d="M28 7 Q26 3 28 0 Q30 3 28 7" stroke="#222" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <path d="M36 9 Q34 5 36 2 Q38 5 36 9" stroke="#222" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <path d="M11 15 L15 47 Q15 49 17 49 L39 49 Q41 49 41 47 L45 15 Z" fill="white" stroke="#222" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M41 24 Q50 24 50 32 Q50 40 41 40" stroke="#222" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="28" cy="50" rx="19" ry="3.5" fill="white" stroke="#222" strokeWidth="1.5"/>
    <ellipse cx="28" cy="50" rx="19" ry="3.5" fill="none" stroke="#222" strokeWidth="1.5"/>
    <circle cx="22" cy="30" r="2.2" fill="#222"/>
    <circle cx="34" cy="30" r="2.2" fill="#222"/>
    <circle cx="22.9" cy="29.1" r="0.8" fill="white"/>
    <circle cx="34.9" cy="29.1" r="0.8" fill="white"/>
    <path d="M21 37 Q28 42 35 37" stroke="#222" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <ellipse cx="19" cy="34" rx="2.8" ry="1.6" fill="#222" opacity="0.13"/>
    <ellipse cx="37" cy="34" rx="2.8" ry="1.6" fill="#222" opacity="0.13"/>
    <path d="M23 22 Q24.5 19 28 22 Q31.5 19 33 22 Q31.5 25 28 27 Q24.5 25 23 22Z" fill="#e0e0e0" stroke="#222" strokeWidth="0.8"/>
  </svg>
);

const BeanBuddy = () => (
  <svg width="46" height="58" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="23" cy="30" rx="17" ry="22" fill="white" stroke="#222" strokeWidth="2"/>
    <path d="M23 8 Q14 18 14 30 Q14 42 23 52" stroke="#222" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <circle cx="18" cy="25" r="2.2" fill="#222"/>
    <circle cx="28" cy="25" r="2.2" fill="#222"/>
    <circle cx="18.8" cy="24.2" r="0.8" fill="white"/>
    <circle cx="28.8" cy="24.2" r="0.8" fill="white"/>
    <path d="M17 33 Q23 38 29 33" stroke="#222" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <ellipse cx="14" cy="31" rx="2.5" ry="1.5" fill="#222" opacity="0.11"/>
    <ellipse cx="32" cy="31" rx="2.5" ry="1.5" fill="#222" opacity="0.11"/>
    <path d="M38 22 Q44 17 45 13" stroke="#222" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="45" cy="12" r="2.8" fill="white" stroke="#222" strokeWidth="1.6"/>
    <path d="M43 10 L47 14 M47 10 L43 14" stroke="#222" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ── Rotary knob SVG ── */
const Knob = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" fill="#d4d4d4" stroke="#555" strokeWidth="1.5"/>
    <circle cx="14" cy="14" r="8" fill="#bbb" stroke="#555" strokeWidth="1"/>
    <circle cx="14" cy="14" r="3" fill="#888" stroke="#555" strokeWidth="1"/>
    <line x1="14" y1="6" x2="14" y2="11" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    {[0,45,90,135,180,225,270,315].map((a,i) => (
      <line key={`knob-${i}`}
        x1={14 + 10.5*Math.sin(a*Math.PI/180)}
        y1={14 - 10.5*Math.cos(a*Math.PI/180)}
        x2={14 + 12*Math.sin(a*Math.PI/180)}
        y2={14 - 12*Math.cos(a*Math.PI/180)}
        stroke="#666" strokeWidth="1" strokeLinecap="round"/>
    ))}
  </svg>
);

/* ── Pressure gauge SVG ── */
const Gauge = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="17" fill="#d8d8d8" stroke="#555" strokeWidth="1.5"/>
    <circle cx="19" cy="19" r="13" fill="#eee" stroke="#888" strokeWidth="1"/>
    {[150,170,190,210,230].map((a,i) => (
      <line key={`gauge-${i}`}
        x1={19+11*Math.cos(a*Math.PI/180)} y1={19+11*Math.sin(a*Math.PI/180)}
        x2={19+13*Math.cos(a*Math.PI/180)} y2={19+13*Math.sin(a*Math.PI/180)}
        stroke="#666" strokeWidth="1" strokeLinecap="round"/>
    ))}
    <text x="19" y="28" textAnchor="middle" fontSize="5" fill="#555" fontFamily="monospace">°F</text>
    <line x1="19" y1="19" x2={19+9*Math.cos(205*Math.PI/180)} y2={19+9*Math.sin(205*Math.PI/180)} stroke="#222" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="19" cy="19" r="1.8" fill="#555"/>
  </svg>
);

/* ── Send icon ── */
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export const CoffeeChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const botText = await sendCoffeeChat(text, history);

      // Suggest pickup chips if the bot is confirming an order
      const lowerText = botText.toLowerCase();
      const chips =
        lowerText.includes('pickup') || lowerText.includes('pick up') || lowerText.includes('when')
          ? ['Now', '10 mins', '20 mins']
          : lowerText.includes('size') || lowerText.includes('small') || lowerText.includes('large')
          ? ['Small', 'Medium', 'Large']
          : undefined;

      const botMsg: Message = { from: 'bot', text: botText, chips };
      setMessages(prev => [...prev, botMsg]);

      // Update history for multi-turn context
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text }] },
        { role: 'model', parts: [{ text: botText }] },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'Oops! Our espresso machine had a hiccup. Try again in a moment ☕' },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Find index of last bot message (for chips display)
  const lastBotIdx = messages.reduce((acc, m, i) => (m.from === 'bot' ? i : acc), -1);

  return (
    <section className="py-14 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xl">☕</span>
        <h2 className="text-2xl font-bold text-white tracking-tighter font-gemola">Coffee Chatbot</h2>
        <span className="text-zinc-600 text-sm font-mono hidden sm:block">— Python · NLP · CLI</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* ── Espresso Machine Frame ── */}
        <div className="shrink-0 mx-auto lg:mx-0" style={{ width: 330 }}>
          <div className="relative rounded-2xl overflow-hidden"
               style={{
                 background: 'linear-gradient(160deg, #e0e0e0 0%, #c8c8c8 40%, #d4d4d4 100%)',
                 border: '2.5px solid #555',
                 boxShadow: '4px 6px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.6)',
               }}>

            {/* ── Top control panel ── */}
            <div className="px-4 pt-3 pb-2"
                 style={{ background: 'linear-gradient(to bottom, #aaa, #999)', borderBottom: '2px solid #666' }}>
              {/* Top ridge */}
              <div className="h-1 rounded-full mb-3" style={{ background: 'linear-gradient(to right, #777, #bbb, #777)' }} />

              <div className="flex items-center justify-between">
                {/* Left: Steam knob */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold text-zinc-700 tracking-widest uppercase">STEAM</span>
                  <Knob />
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm" style={{ boxShadow: '0 0 4px #22c55e' }} />
                    <span className="text-[8px] text-zinc-600 font-mono">Ready</span>
                  </div>
                </div>

                {/* Center: Display */}
                <div className="flex-1 mx-3">
                  <div className="rounded-md px-2 py-1.5 text-center"
                       style={{ background: '#1a1a1a', border: '1.5px solid #444', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                    <div className="text-[11px] font-bold tracking-[0.18em] text-white font-mono">CAPPUCCINO</div>
                    <div className="flex justify-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400 opacity-90" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 opacity-40" />
                      <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    </div>
                    <div className="text-[8px] text-zinc-500 font-mono mt-0.5 tracking-wider">
                      {isLoading ? 'BREWING...' : 'READY'}
                    </div>
                  </div>
                </div>

                {/* Right: Gauge */}
                <div className="flex flex-col items-center">
                  <Gauge />
                </div>
              </div>
            </div>

            {/* ── Screen / Chat area ── */}
            <div className="mx-3 my-2 rounded-lg overflow-hidden flex flex-col"
                 style={{ background: 'white', border: '2px solid #888', height: 420,
                          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)' }}>

              {/* Welcome banner */}
              <div className="px-3 pt-2 pb-1 border-b border-zinc-200"
                   style={{ background: '#fafafa' }}>
                <div className="text-center text-[11px] font-bold text-zinc-800 tracking-wide">
                  Brewed Beans Café — AI Barista ☕
                </div>
              </div>

              {/* Mascots */}
              <div className="relative flex items-end justify-center gap-4 py-2 border-b border-zinc-100 overflow-hidden"
                   style={{ background: '#f8f7f5' }}>
                <span className="absolute text-[10px] select-none" style={{ top: 4,  left: 14,  opacity: 0.55 }}>✦</span>
                <span className="absolute text-[8px]  select-none" style={{ top: 10, left: 36,  opacity: 0.4  }}>♥</span>
                <span className="absolute text-[10px] select-none" style={{ top: 2,  left: 72,  opacity: 0.5  }}>✧</span>
                <span className="absolute text-[8px]  select-none" style={{ top: 8,  left: 108, opacity: 0.35 }}>✦</span>
                <span className="absolute text-[9px]  select-none" style={{ top: 3,  right: 72, opacity: 0.5  }}>♥</span>
                <span className="absolute text-[10px] select-none" style={{ top: 6,  right: 36, opacity: 0.45 }}>✧</span>
                <span className="absolute text-[8px]  select-none" style={{ top: 2,  right: 14, opacity: 0.4  }}>✦</span>
                <span className="absolute text-[9px]  select-none" style={{ bottom: 8, left: 24, opacity: 0.3  }}>✦</span>
                <span className="absolute text-[8px]  select-none" style={{ bottom: 6, right: 28, opacity: 0.3 }}>♥</span>
                <BrewBot />
                <div className="mb-6 px-2 py-1 bg-white border border-zinc-300 rounded-xl text-[9px] text-zinc-600 font-mono shadow-sm relative leading-tight">
                  hi! ☕✨
                  <div className="absolute -left-[7px] top-2 w-0 h-0"
                       style={{ borderTop:'4px solid transparent', borderBottom:'4px solid transparent', borderRight:'7px solid #d4d4d8' }}/>
                  <div className="absolute -left-[5px] top-2 w-0 h-0"
                       style={{ borderTop:'4px solid transparent', borderBottom:'4px solid transparent', borderRight:'7px solid white' }}/>
                </div>
                <BeanBuddy />
              </div>

              {/* Chat messages — scrollable */}
              <div
                ref={chatAreaRef}
                className="flex-1 overflow-y-auto flex flex-col px-3 py-2 gap-1.5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'} machine-in`}>
                    <div
                      className={`px-2.5 py-1.5 text-[10.5px] leading-relaxed max-w-[84%] ${
                        msg.from === 'bot'
                          ? 'bg-white text-zinc-800 border border-zinc-300 shadow-sm'
                          : 'bg-zinc-800 text-white'
                      }`}
                      style={{ borderRadius: msg.from === 'bot' ? '12px 12px 12px 2px' : '12px 12px 2px 12px' }}
                    >
                      {msg.text}
                    </div>
                    {/* Show chips only on the last bot message */}
                    {msg.from === 'bot' && i === lastBotIdx && msg.chips && !isLoading && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {msg.chips.map(chip => (
                          <button
                            key={chip}
                            onClick={() => sendMessage(chip)}
                            disabled={isLoading}
                            className="px-2 py-0.5 text-[9.5px] text-zinc-600 bg-white border border-zinc-300 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
                            style={{ borderRadius: 20 }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex items-center gap-1 machine-in">
                    <div className="bg-white border border-zinc-300 px-3 py-2 shadow-sm flex gap-1"
                         style={{ borderRadius: '12px 12px 12px 2px' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Real input row ── */}
              <form onSubmit={handleSubmit}
                    className="flex items-center gap-1.5 px-2 py-1.5 border-t border-zinc-200"
                    style={{ background: '#f5f4f2' }}>
                <div className="text-base select-none">🙂</div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Message BrewBot..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[10px] text-zinc-700 placeholder-zinc-400 font-mono outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center justify-center w-6 h-6 rounded-full text-white transition-colors disabled:opacity-40"
                  style={{ background: input.trim() && !isLoading ? '#92400e' : '#a8a29e' }}
                  aria-label="Send"
                >
                  <SendIcon />
                </button>
              </form>
            </div>

            {/* ── Bottom control buttons ── */}
            <div className="flex items-center justify-between px-5 py-2"
                 style={{ background: 'linear-gradient(to bottom, #b0b0b0, #a0a0a0)', borderTop: '1.5px solid #777' }}>
              {['♥','☕','🙂','⏻'].map((icon) => (
                <div key={icon} className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
                     style={{ background: 'linear-gradient(145deg, #c8c8c8, #aaa)', border: '1.5px solid #777',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)' }}>
                  <span style={{ fontSize: 13 }}>{icon}</span>
                </div>
              ))}
            </div>

            {/* ── B&W Coffee logo + drip tray row ── */}
            <div className="flex items-end justify-between px-3 mb-1">
              {/* Logo bottom-left */}
              <div className="flex flex-col items-center gap-0.5">
                <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4 Q7 2 8 0 Q9 2 8 4" stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <path d="M15 3 Q14 1 15 0 Q16 1 15 3" stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <path d="M22 4 Q21 2 22 0 Q23 2 22 4" stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <path d="M3 7 L5 23 Q5 24 6 24 L24 24 Q25 24 25 23 L27 7 Z" fill="white" stroke="#555" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M25 12 Q29 12 29 16 Q29 20 25 20" stroke="#555" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <ellipse cx="15" cy="25" rx="11" ry="2" fill="white" stroke="#555" strokeWidth="1.2"/>
                  <path d="M11 14 Q12 12 15 14 Q18 12 19 14 Q18 16 15 17.5 Q12 16 11 14Z" fill="#ddd" stroke="#555" strokeWidth="0.7"/>
                </svg>
                <span className="text-[7px] text-zinc-500 font-mono tracking-wider">AVSA</span>
              </div>
              {/* Bean logo bottom-right */}
              <div className="flex flex-col items-center gap-0.5">
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="11" cy="13" rx="8" ry="10" fill="white" stroke="#555" strokeWidth="1.4"/>
                  <path d="M11 3 Q7 8 7 13 Q7 18 11 23" stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <circle cx="8.5" cy="11" r="1" fill="#555"/>
                  <circle cx="13.5" cy="11" r="1" fill="#555"/>
                  <path d="M8 15 Q11 17.5 14 15" stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                </svg>
                <span className="text-[7px] text-zinc-500 font-mono tracking-wider">BEAN</span>
              </div>
            </div>

            {/* ── Drip tray ── */}
            <div className="mx-3 mb-3 rounded-b-lg overflow-hidden"
                 style={{ background: '#bbb', border: '1.5px solid #777', borderTop: 'none' }}>
              <div className="h-6 flex items-center justify-center relative overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={`tray-${i}`} className="absolute top-0 bottom-0 w-px" style={{ left: `${(i+1)*5.5}%`, background: '#999' }} />
                ))}
                <div className="absolute inset-0 flex flex-col justify-around">
                  <div className="w-full h-px" style={{ background: '#999' }} />
                  <div className="w-full h-px" style={{ background: '#999' }} />
                </div>
              </div>
            </div>

          </div>

          {/* Machine feet */}
          <div className="flex justify-between px-6 mt-1">
            <div className="w-8 h-2 rounded-b-full" style={{ background: '#888', border: '1px solid #666' }} />
            <div className="w-8 h-2 rounded-b-full" style={{ background: '#888', border: '1px solid #666' }} />
          </div>
        </div>

        {/* ── Description ── */}
        <div className="flex flex-col items-center text-center gap-6 max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl select-none" style={{ filter: 'drop-shadow(0 4px 16px rgba(180,120,60,0.3))' }}>☕</div>
            <div className="flex flex-col gap-1 items-center">
              <div className="flex gap-2 items-center">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                <span className={`text-xs font-mono uppercase tracking-widest ${isLoading ? 'text-amber-500/80' : 'text-green-500/80'}`}>
                  {isLoading ? 'Brewing a response...' : 'BrewBot is ready'}
                </span>
              </div>
              <div className="text-zinc-600 text-xs font-mono">python coffeebot.py --mood tired</div>
            </div>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">
            A conversational Python chatbot with a coffee shop personality. Uses rule-based NLP to recommend drinks, share brewing tips, and keep you caffeinated through late-night coding sessions. Now with a live AI demo — try chatting with BrewBot!
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {['Python', 'NLP', 'CLI', 'NLTK', 'Regex', 'Gemini AI'].map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono rounded-full">{tag}</span>
            ))}
          </div>

          <a href="https://github.com/AvsaStudio" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      <style>{`
        @keyframes machineIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .machine-in { animation: machineIn 0.25s ease-out forwards; }
      `}</style>
    </section>
  );
};
