
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const projects = [
    {
        title: "Random Color Picker",
        tech: "React",
        desc: "Interactive color generation tool built with React components and state management."
    },
    {
        title: "Animal Fun Facts",
        tech: "React",
        desc: "Interactive app displaying animal images and facts using React events."
    },
    {
        title: "Message Mixer",
        tech: "Node.js",
        desc: "Exploration of JavaScript modules and backend logic for text processing."
    },
    {
        title: "Rock-Paper-Scissors",
        tech: "JavaScript",
        desc: "Web-based implementation of the classic game using complex conditional logic."
    },
    {
        title: "Whale Talk",
        tech: "JavaScript",
        desc: "Translator algorithm that converts English to 'Whale Talk' using loop structures."
    },
    {
        title: "Team Stats",
        tech: "JavaScript",
        desc: "Sports statistics tracker utilizing advanced object methods, getters, and setters."
    }
];

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8 font-gemola tracking-wide">Full Stack & Frontend Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
                <div key={idx} className="group bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide">{project.tech}</div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-3 group-hover:text-white">{project.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {project.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center text-sm text-zinc-500 font-mono">
                        <div className="w-2 h-2 bg-zinc-700 rounded-full mr-2 group-hover:bg-green-500 transition-colors"></div>
                        Code available on Github
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};
