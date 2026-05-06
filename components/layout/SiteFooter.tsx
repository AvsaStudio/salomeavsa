import React from "react";

export const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t border-zinc-900 py-8 text-center font-mono text-sm text-zinc-600">
      &copy; {new Date().getFullYear()} Salome Avsa Miller. All rights reserved.
    </footer>
  );
};
