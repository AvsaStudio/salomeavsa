import React from "react";
import { technicalArsenal } from "../../data/site";

export const SkillsStrip: React.FC = () => {
  return (
    <section className="w-full overflow-hidden border-y border-zinc-800 bg-zinc-900/30 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-6 text-center font-mono text-sm uppercase tracking-widest text-zinc-500">
          Technical Arsenal
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-medium text-zinc-300">
          {technicalArsenal.map((skill, index) => (
            <React.Fragment key={skill}>
              {index > 0 && <span className="text-zinc-700">/</span>}
              <span>{skill}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
