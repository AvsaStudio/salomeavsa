import React from "react";
import { contactCards } from "../../data/site";

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="scroll-mt-28 border-t border-zinc-900 bg-zinc-900/20 px-4 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 font-gemola text-5xl font-bold text-white">
          Let's Build Something Unique.
        </h2>
        <p className="mb-8 text-lg text-zinc-400">
          I am currently open to new opportunities in software engineering and
          brand development.
        </p>
        <div className="flex flex-col items-center justify-center gap-6 text-zinc-300 md:flex-row">
          {contactCards.map((item) => (
            <div
              key={item.label}
              className="flex w-64 flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <span className="mb-2 font-mono text-xs text-zinc-500">
                {item.label}
              </span>
              {item.href ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-blue-400"
                >
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
