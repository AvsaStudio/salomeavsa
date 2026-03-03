
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const experiences = [
    {
        id: 1,
        role: "Freelancer / Founder",
        company: "AVSA Studio",
        location: "New York City",
        period: "Nov 2020 — Present",
        bullets: [
            "Helped entrepreneurs and startups create and launch their brands from the ground up.",
            "Designed websites, marketing materials, and visual content ensuring consistency.",
            "Directed photo shoots and crafted tailored brand experiences."
        ]
    },
    {
        id: 2,
        role: "Front-End Engineer",
        company: "Altronix",
        location: "Brooklyn, NY",
        period: "FEB 2020 — NOV 2022",
        bullets: [
            "Integrated APIs and backend services to improve application functionality.",
            "Built reusable UI components and optimized front-end workflows.",
            "Conducted debugging, testing, and code reviews."
        ]
    },

];

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 px-4 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-12 border-b border-zinc-800 pb-4 font-gemola tracking-wide">Employment History</h2>
      
      <div className="space-y-12 relative">
        {/* Vertical Line */}
        <div className="absolute left-0 top-2 bottom-0 w-px bg-zinc-800 md:left-8"></div>

        {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-8 md:pl-16">
                {/* Dot */}
                <div className="absolute left-[-4px] md:left-[28px] top-2 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-zinc-950"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <span className="text-sm font-mono text-zinc-500">{exp.period}</span>
                </div>
                
                <div className="text-lg text-zinc-300 font-medium mb-4">
                    {exp.company}, {exp.location}
                </div>

                <ul className="space-y-2">
                    {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="text-sm text-zinc-500 flex items-start">
                            <span className="mr-2 mt-1.5 w-1 h-1 bg-zinc-600 rounded-full shrink-0"></span>
                            {bullet}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
      </div>
    </section>
  );
};
