import React, { Suspense, lazy } from "react";
import { CodesmithChallenges } from "../components/CodesmithChallenges";
import { Experience } from "../components/Experience";
import { Hero } from "../components/Hero";
import { Photography } from "../components/Photography";
import { Projects } from "../components/Projects";
import { Terminal } from "../components/Terminal";
import { UXDesign } from "../components/UXDesign";
import { ContactSection } from "../components/layout/ContactSection";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SkillsStrip } from "../components/layout/SkillsStrip";
import "./HomePage.css";

const CoffeeChatbot = lazy(() =>
  import("../components/CoffeeChatbot").then((module) => ({
    default: module.CoffeeChatbot,
  }))
);

const sectionFallback = (
  <div className="home-page__section-fallback">
    Loading BrewBot...
  </div>
);

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <SiteHeader activePage="home" />

      <main className="home-page__main">
        <Hero />
        <SkillsStrip />
        <Experience />
        <Terminal />
        <Suspense fallback={sectionFallback}>
          <CoffeeChatbot />
        </Suspense>
        <Photography />
        <CodesmithChallenges />
        <UXDesign />
        <Projects />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
};
