
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { CommandLineIcon, BeakerIcon, CupSaucerIcon, CalculatorIcon } from '@heroicons/react/24/outline';

// Types for our mini apps
type TerminalApp = 'shipping' | 'magic8' | 'scrabble' | 'coffee' | 'physics';

interface TerminalState {
  output: string[];
  isWaitingInput: boolean;
  inputValue: string;
}

export const Terminal: React.FC = () => {
  const [activeApp, setActiveApp] = useState<TerminalApp>('shipping');
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State for multi-step interactions (like the coffee bot)
  const [interactionStep, setInteractionStep] = useState<number>(0);
  const [tempData, setTempData] = useState<any>({});

  // Helper to add logs
  const log = (text: string) => setLogs(prev => [...prev, text]);
  const clearLogs = () => setLogs([]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Initialize app on switch
  useEffect(() => {
    clearLogs();
    setInteractionStep(0);
    setTempData({});
    
    if (activeApp === 'shipping') {
        log(">>> Sal's Shipping Calculator Loaded");
        log("Type a package weight (lbs) to compare shipping rates.");
    } else if (activeApp === 'magic8') {
        log(">>> Magic 8-Ball Loaded");
        log("Ask a question to seek your fortune...");
    } else if (activeApp === 'scrabble') {
        log(">>> Scrabble Score Calculator");
        log("Enter a word to calculate its score.");
    } else if (activeApp === 'coffee') {
        log(">>> Coffee Chatbot v1.0 initialized");
        log("Welcome to the cafe! What size drink can I get for you?");
        log("[a] Small, [b] Medium, [c] Large");
    } else if (activeApp === 'physics') {
        log(">>> Physics Calculator Loaded");
        log("Available functions: [1] F to C Temp, [2] C to F Temp, [3] Force (F=ma)");
        log("Select a function number:");
    }
  }, [activeApp]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userCmd = input;
    log(`$ ${userCmd}`);
    setInput('');

    // Process Command based on Active App
    setTimeout(() => {
        if (activeApp === 'shipping') {
            processShipping(userCmd);
        } else if (activeApp === 'magic8') {
            processMagic8(userCmd);
        } else if (activeApp === 'scrabble') {
            processScrabble(userCmd);
        } else if (activeApp === 'coffee') {
            processCoffee(userCmd);
        } else if (activeApp === 'physics') {
            processPhysics(userCmd);
        }
    }, 300);
  };

  // --- App Logic ---

  const processShipping = (weightStr: string) => {
    const weight = parseFloat(weightStr);
    if (isNaN(weight)) {
        log("Error: Please enter a valid number for weight.");
        return;
    }

    // Ground Shipping
    let groundCost = 20.00; // Flat charge
    if (weight <= 2) groundCost += weight * 1.50;
    else if (weight <= 6) groundCost += weight * 3.00;
    else if (weight <= 10) groundCost += weight * 4.00;
    else groundCost += weight * 4.75;

    // Drone Shipping
    let droneCost = 0;
    if (weight <= 2) droneCost += weight * 4.50;
    else if (weight <= 6) droneCost += weight * 9.00;
    else if (weight <= 10) droneCost += weight * 12.00;
    else droneCost += weight * 14.25;

    const premiumCost = 125.00;

    log(`Checking rates for ${weight} lbs...`);
    log(`--------------------------------`);
    log(`Ground Shipping: $${groundCost.toFixed(2)}`);
    log(`Drone Shipping:  $${droneCost.toFixed(2)}`);
    log(`Premium Ground:  $${premiumCost.toFixed(2)}`);
    log(`--------------------------------`);
    
    const cheapest = Math.min(groundCost, droneCost, premiumCost);
    const method = cheapest === groundCost ? "Ground" : cheapest === droneCost ? "Drone" : "Premium";
    
    log(`Recommendation: Use ${method} Shipping ($${cheapest.toFixed(2)})`);
  };

  const processMagic8 = (question: string) => {
    const answers = [
        "Yes - definitely.",
        "It is decidedly so.",
        "Without a doubt.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful."
    ];
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    log(`Question: ${question}`);
    log(`Magic 8-Ball says: "${randomAnswer}"`);
  };

  const processScrabble = (word: string) => {
      const points: Record<string, number> = {
          'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1, 
          'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 
          's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
      };
      
      let score = 0;
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      
      for (let char of cleanWord) {
          score += points[char] || 0;
      }
      
      log(`Word: "${word}"`);
      log(`Score: ${score} points`);
      if (score > 15) log("Nice word!");
  };

  const processCoffee = (cmd: string) => {
      const input = cmd.toLowerCase();
      
      if (interactionStep === 0) {
          let size = '';
          if (input === 'a' || input.includes('small')) size = 'Small';
          else if (input === 'b' || input.includes('medium')) size = 'Medium';
          else if (input === 'c' || input.includes('large')) size = 'Large';
          
          if (size) {
              setTempData({ ...tempData, size });
              setInteractionStep(1);
              log(`And what type of brew for your ${size} coffee?`);
              log("[a] Brewed, [b] Espresso, [c] Cold Brew");
          } else {
              log("I didn't understand that size. Please choose [a], [b], or [c].");
          }
      } else if (interactionStep === 1) {
          let type = '';
          if (input === 'a' || input.includes('brewed')) type = 'Brewed';
          else if (input === 'b' || input.includes('espresso')) type = 'Espresso';
          else if (input === 'c' || input.includes('cold')) type = 'Cold Brew';
          
          if (type) {
              log(`Great choice!`);
              log(`Here is your ${tempData.size} ${type} Coffee ☕.`);
              log(`--------------------------------`);
              log("Starting new order...");
              log("What size drink can I get for you?");
              log("[a] Small, [b] Medium, [c] Large");
              setInteractionStep(0);
              setTempData({});
          } else {
              log("Sorry, please select [a] Brewed, [b] Espresso, or [c] Cold Brew.");
          }
      }
  };

  const processPhysics = (cmd: string) => {
      if (interactionStep === 0) {
          if (cmd === '1') {
              setInteractionStep(1);
              setTempData({ mode: 'f_to_c' });
              log("Enter temperature in Fahrenheit:");
          } else if (cmd === '2') {
              setInteractionStep(1);
              setTempData({ mode: 'c_to_f' });
              log("Enter temperature in Celsius:");
          } else if (cmd === '3') {
              setInteractionStep(1);
              setTempData({ mode: 'force' });
              log("Enter mass (kg):");
          } else {
              log("Invalid option. Select [1], [2], or [3].");
          }
      } else if (interactionStep === 1) {
          const val = parseFloat(cmd);
          if (isNaN(val)) {
              log("Please enter a valid number.");
              return;
          }

          if (tempData.mode === 'f_to_c') {
              const c = (val - 32) * 5/9;
              log(`${val}°F is ${c.toFixed(1)}°C`);
              resetPhysics();
          } else if (tempData.mode === 'c_to_f') {
              const f = val * 9/5 + 32;
              log(`${val}°C is ${f.toFixed(1)}°F`);
              resetPhysics();
          } else if (tempData.mode === 'force') {
              setTempData({ ...tempData, mass: val });
              setInteractionStep(2);
              log("Enter acceleration (m/s^2):");
          }
      } else if (interactionStep === 2 && tempData.mode === 'force') {
          const acc = parseFloat(cmd);
          if (isNaN(acc)) {
              log("Please enter a valid number.");
              return;
          }
          const force = tempData.mass * acc;
          log(`Force = ${force.toFixed(2)} Newtons`);
          log(`(Calculated using F = m * a)`);
          resetPhysics();
      }
  };

  const resetPhysics = () => {
      setInteractionStep(0);
      setTempData({});
      log(`--------------------------------`);
      log("Select a function number: [1] F->C, [2] C->F, [3] Force");
  };

  return (
    <section id="python-interactive" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="mb-10">
            <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3 font-gemola tracking-wide">
                <CommandLineIcon className="w-8 h-8 text-blue-500" />
                Interactive Python Projects
            </h2>
            <p className="text-zinc-400">
                Explore my Python capabilities directly in the browser. Select a script to run it.
            </p>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-zinc-800 flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-[#252526] border-r border-zinc-800 flex flex-col">
                <div className="p-4 text-xs font-mono uppercase text-zinc-500 tracking-wider">Explorer</div>
                <div className="flex-1 overflow-y-auto">
                    <button onClick={() => setActiveApp('shipping')} className={`w-full flex items-center px-4 py-2 text-sm font-mono border-l-2 transition-colors ${activeApp === 'shipping' ? 'border-blue-500 bg-[#37373d] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2a2d2e]'}`}>
                        <span className="mr-2 text-yellow-400">py</span> sals_shipping.py
                    </button>
                    <button onClick={() => setActiveApp('magic8')} className={`w-full flex items-center px-4 py-2 text-sm font-mono border-l-2 transition-colors ${activeApp === 'magic8' ? 'border-blue-500 bg-[#37373d] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2a2d2e]'}`}>
                        <span className="mr-2 text-yellow-400">py</span> magic_8_ball.py
                    </button>
                    <button onClick={() => setActiveApp('scrabble')} className={`w-full flex items-center px-4 py-2 text-sm font-mono border-l-2 transition-colors ${activeApp === 'scrabble' ? 'border-blue-500 bg-[#37373d] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2a2d2e]'}`}>
                        <span className="mr-2 text-yellow-400">py</span> scrabble_score.py
                    </button>
                    <button onClick={() => setActiveApp('coffee')} className={`w-full flex items-center px-4 py-2 text-sm font-mono border-l-2 transition-colors ${activeApp === 'coffee' ? 'border-blue-500 bg-[#37373d] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2a2d2e]'}`}>
                        <span className="mr-2 text-yellow-400">py</span> coffee_bot.py
                    </button>
                    <button onClick={() => setActiveApp('physics')} className={`w-full flex items-center px-4 py-2 text-sm font-mono border-l-2 transition-colors ${activeApp === 'physics' ? 'border-blue-500 bg-[#37373d] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#2a2d2e]'}`}>
                        <span className="mr-2 text-yellow-400">py</span> physics_calc.py
                    </button>
                </div>
            </div>

            {/* Editor/Terminal Area */}
            <div className="flex-1 flex flex-col font-mono text-sm">
                {/* Tab */}
                <div className="flex bg-[#2d2d2d]">
                    <div className="px-4 py-2 bg-[#1e1e1e] text-white border-t-2 border-blue-500 flex items-center gap-2">
                        <span className="text-yellow-400">py</span>
                        {activeApp === 'shipping' && 'sals_shipping.py'}
                        {activeApp === 'magic8' && 'magic_8_ball.py'}
                        {activeApp === 'scrabble' && 'scrabble_score.py'}
                        {activeApp === 'coffee' && 'coffee_bot.py'}
                        {activeApp === 'physics' && 'physics_calc.py'}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto relative bg-[#1e1e1e] scrollbar-thin scrollbar-thumb-zinc-700" onClick={() => document.getElementById('terminal-input')?.focus()}>
                    
                    {/* Pseudo Code Display - Changes based on app */}
                    <div className="mb-6 opacity-50 text-xs md:text-sm border-b border-zinc-800 pb-4 select-none">
                        <span className="text-pink-400">def</span> <span className="text-yellow-200">run_script</span>():<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"""Executing {activeApp} module"""</span><br/>
                        &nbsp;&nbsp;print(<span className="text-orange-300">"Initializing system..."</span>)<br/>
                        &nbsp;&nbsp;<span className="text-blue-300">while</span> active:<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;input_data = await user_input(<span className="text-orange-300">{"> "}</span>)<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;process_logic(input_data)
                    </div>

                    {/* Terminal Output */}
                    <div className="space-y-1 pb-4" ref={scrollRef}>
                        {logs.map((line, i) => (
                            <div key={i} className={`${line.startsWith('Error') ? 'text-red-400' : line.startsWith('$') ? 'text-zinc-400 mt-4' : line.startsWith('>>>') ? 'text-blue-400 font-bold mt-4' : 'text-zinc-300'}`}>
                                {line}
                            </div>
                        ))}
                        
                        {/* Input Line */}
                        <form onSubmit={handleCommand} className="flex items-center mt-2">
                            <span className="text-green-500 mr-2">$</span>
                            <input 
                                id="terminal-input"
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-700"
                                placeholder={interactionStep > 0 ? "Waiting for input..." : "Type a command..."}
                                autoComplete="off"
                            />
                        </form>
                    </div>
                </div>
                
                <div className="bg-blue-600/20 text-blue-200 text-xs px-4 py-1 flex justify-between items-center select-none">
                    <span>Python 3.9.1 Environment</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Connected</span>
                </div>
            </div>
        </div>
    </section>
  );
};
