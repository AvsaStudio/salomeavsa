import React from "react";
import { Link } from "react-router-dom";
import {
  EMAIL_ADDRESS,
  navigationItems,
  type SitePage,
} from "../../data/site";
import { scrollToSection } from "../../utils/scroll";

interface SiteHeaderProps {
  activePage: SitePage;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ activePage }) => {
  const handleSectionClick =
    (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (activePage !== "home") {
        return;
      }

      event.preventDefault();
      scrollToSection(sectionId);
    };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="font-gemola text-2xl font-bold tracking-tighter transition-opacity hover:opacity-80"
        >
          AVSA<span className="text-blue-500">.</span>
        </Link>

        <div className="hidden items-center space-x-8 text-sm font-medium text-zinc-400 md:flex">
          {navigationItems.map((item) => {
            if (item.type === "route") {
              const isActive = activePage === item.page;

              return isActive ? (
                <span key={item.label} className="font-semibold text-white">
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              );
            }

            if (activePage === "home") {
              return (
                <a
                  key={item.label}
                  href={`#${item.sectionId}`}
                  onClick={handleSectionClick(item.sectionId)}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                to={{ pathname: "/", hash: `#${item.sectionId}` }}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <a
          href={`mailto:${EMAIL_ADDRESS}`}
          className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-900 transition-colors hover:bg-white"
        >
          Get in Touch
        </a>
      </div>
    </nav>
  );
};
