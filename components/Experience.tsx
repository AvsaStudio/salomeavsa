/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import { employmentHistory } from "../data/employment";

const categoryStyles = {
  Engineering: "bg-blue-500/10 text-blue-400",
  "UX/UI Design": "bg-violet-500/10 text-violet-400",
} as const;

export const Experience: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="experience" className="py-20 px-4 max-w-5xl mx-auto">
      <div className="flex items-baseline justify-between mb-12 border-b border-zinc-800 pb-4">
        <h2 className="text-4xl font-bold text-white font-gemola tracking-wide">Experience</h2>
        <button
          onClick={() => navigate('/experience')}
          className="text-xs font-mono text-zinc-400 hover:text-blue-400 transition-colors uppercase tracking-widest"
        >
          Full History →
        </button>
      </div>

      <div className="space-y-0 divide-y divide-zinc-800/60">
        {employmentHistory.map((job) => (
          <div key={job.id} className="py-6 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="sm:w-40 shrink-0">
              <span className="text-xs font-mono text-zinc-500">{job.period}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-white">{job.role}</h3>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-mono ${categoryStyles[job.category]}`}
                >
                  {job.category}
                </span>
              </div>
              <div className="text-sm text-zinc-400 font-medium mb-2">{job.company}</div>
              <p className="text-sm text-zinc-500 leading-relaxed">{job.preview}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-zinc-800">
        <button
          onClick={() => navigate('/experience')}
          className="w-full sm:w-auto px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-white transition-colors"
        >
          View Full Employment History →
        </button>
      </div>
    </section>
  );
};
