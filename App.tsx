
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Hero } from './components/Hero';
import { Terminal } from './components/Terminal';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Photography } from './components/Photography';
import { CodesmithChallenges } from './components/CodesmithChallenges';
import { UXDesign } from './components/UXDesign';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 bg-dot-grid text-zinc-50 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-2xl tracking-tighter font-gemola">
                AVSA<span className="text-blue-500">.</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
                <a href="#experience" className="hover:text-white transition-colors">Experience</a>
                <a href="#python-interactive" className="hover:text-white transition-colors">Python Lab</a>
                <a href="#photography" className="hover:text-white transition-colors">Darkroom</a>
                <a href="#js-challenges" className="hover:text-white transition-colors">JS Lab</a>
                <a href="#ux-design" className="hover:text-white transition-colors">UX / UI</a>
                <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <a href="mailto:salome.a.miller@gmail.com" className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-xs font-bold hover:bg-white transition-colors">
                Get in Touch
            </a>
        </div>
      </nav>

      <main>
          <Hero />
          
          {/* Skills Marquee */}
          <div className="w-full border-y border-zinc-800 bg-zinc-900/30 py-8 overflow-hidden">
             <div className="max-w-7xl mx-auto px-4">
                <p className="text-center text-zinc-500 text-sm font-mono uppercase tracking-widest mb-6">Technical Arsenal</p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-zinc-300 font-medium">
                    <span>Python</span>
                    <span className="text-zinc-700">/</span>
                    <span>React</span>
                    <span className="text-zinc-700">/</span>
                    <span>Node.JS</span>
                    <span className="text-zinc-700">/</span>
                    <span>TypeScript</span>
                    <span className="text-zinc-700">/</span>
                    <span>Brand Strategy</span>
                    <span className="text-zinc-700">/</span>
                    <span>Adobe Suite</span>
                    <span className="text-zinc-700">/</span>
                    <span>Figma</span>
                    <span className="text-zinc-700">/</span>
                    <span>Photography</span>
                </div>
             </div>
          </div>

          <Experience />
          
          <Terminal />
          
          <Photography />
          
          <CodesmithChallenges />

          <UXDesign />

          <Projects />

          {/* Contact Section */}
          <section id="contact" className="py-24 px-4 border-t border-zinc-900 bg-zinc-900/20">
              <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-5xl font-bold text-white mb-6 font-gemola">Let's Build Something Unique.</h2>
                  <p className="text-zinc-400 mb-8 text-lg">
                    I am currently open to new opportunities in software engineering and brand development.
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-zinc-300">
                      <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-64">
                          <span className="text-xs font-mono text-zinc-500 mb-2">EMAIL</span>
                          <a href="mailto:salome.a.miller@gmail.com" className="hover:text-blue-400 transition-colors">salome.a.miller@gmail.com</a>
                      </div>
                      <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-64">
                          <span className="text-xs font-mono text-zinc-500 mb-2">PHONE</span>
                          <span>347 873 1451</span>
                      </div>
                      <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-64">
                          <span className="text-xs font-mono text-zinc-500 mb-2">LOCATION</span>
                          <span>Hillsdale, NJ</span>
                      </div>
                  </div>
              </div>
          </section>
      </main>

      <footer className="py-8 border-t border-zinc-900 text-center text-zinc-600 text-sm font-mono">
          &copy; {new Date().getFullYear()} Salome Avsa Miller. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
