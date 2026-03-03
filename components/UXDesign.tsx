
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';

interface UXProject {
    id: number;
    title: string;
    subtitle: string;
    year: string;
    category: string[];
    tools: string[];
    challenge: string;
    solution: string;
    deliverables: string[];
    outcome: string;
    featured?: boolean;
    link?: string;
}

const projects: UXProject[] = [
    {
        id: 1,
        title: "MTA Subway App",
        subtitle: "Contactless Mobile Payment Redesign",
        year: "2019",
        category: ["Mobile", "Transit", "Payments"],
        tools: ["Adobe XD", "Illustrator", "InDesign"],
        challenge:
            "NYC subway riders faced friction with paper MetroCards — lost cards, broken kiosks, and long queues. The goal was to redesign the end-to-end ticketing experience as a contactless, mobile-first app that reduced purchase time and improved accessibility for all riders.",
        solution:
            "Mapped user task flows and built wireframes before iterating to high-fidelity interactive screens in Adobe XD. Designed interactive elements including NFC tap-to-ride, stored-value and time-based pass options, and a streamlined onboarding flow — prioritizing accessibility throughout.",
        deliverables: [
            "User task flows & interaction diagrams",
            "Low-fi wireframes → high-fi interactive prototype in Adobe XD",
            "Visual design system (typography, color, iconography)",
            "Final presentation with usability findings",
        ],
        outcome:
            "Capstone project for FIT UX/UI Design certificate program. Prototype demonstrated a significantly simplified payment flow compared to the existing MetroCard system.",
        featured: true,
        link: "https://salomeavsa.wixsite.com/salomeavsa/ux-ui-design-mta-app",
    },
    {
        id: 2,
        title: "Kollins",
        subtitle: "UX / UI Designer — Full Product Role",
        year: "Sep – Nov 2022",
        category: ["Web", "Mobile", "Design System"],
        tools: ["Figma", "InVision", "Miro", "Balsamiq"],
        challenge:
            "Kollins needed a UX designer who could embed across cross-functional teams — bridging product, engineering, and stakeholders — to drive user-centered design decisions using both qualitative and quantitative data.",
        solution:
            "Applied design thinking methodologies throughout: discovery, definition, ideation, prototyping, and testing. Built and maintained a design system to ensure visual and interaction consistency. Used real user data to validate design decisions and iterated rapidly based on feedback from engineering and product leads.",
        deliverables: [
            "Design system components & documentation",
            "Wireframes and high-fidelity prototypes",
            "Usability research synthesis",
            "Engineering-ready annotated specs",
        ],
        outcome:
            "Delivered design-to-development handoffs that reduced revision cycles. Established repeatable design system patterns adopted across the product.",
    },
    {
        id: 3,
        title: "H. Stabbins Security Systems",
        subtitle: "UX / UI Designer — Interaction Design & Visual Standards",
        year: "Sep 2019 – Feb 2020",
        category: ["Web", "B2B", "Security"],
        tools: ["Figma", "Axure", "FlowMapp"],
        challenge:
            "H. Stabbins needed clear UX requirements, defined interaction patterns, and consistent visual standards for their digital product suite — translating complex security system workflows into intuitive user experiences.",
        solution:
            "Defined UX requirements and user experience strategies from the ground up. Created detailed wireframes and high-level designs, established page interaction standards and visual guidelines, and documented interaction patterns to ensure consistency across the product.",
        deliverables: [
            "UX requirements & strategy documentation",
            "Wireframes and high-level design comps",
            "Interaction pattern library",
            "Visual standards guide",
        ],
        outcome:
            "Delivered a cohesive UX foundation that unified interaction patterns and visual standards across the product, enabling faster, more consistent development.",
    },
    {
        id: 4,
        title: "Price Shop Insurance",
        subtitle: "UX / UI Designer — Workflow & Concept Design",
        year: "Aug – Nov 2019",
        category: ["Web", "Fintech", "Insurance"],
        tools: ["Adobe XD", "Sketch", "Miro"],
        challenge:
            "Price Shop Insurance needed to simplify a dense, complex insurance quoting and comparison workflow for consumers who are typically overwhelmed by insurance terminology and multi-step processes.",
        solution:
            "Developed UX requirements and mapped end-to-end workflows for the core user journeys. Created wireframes and concept designs that broke the complex quoting flow into digestible steps, applied consistent interaction patterns and visual standards throughout, and iterated based on stakeholder review.",
        deliverables: [
            "End-to-end workflow diagrams",
            "Wireframes & concept designs",
            "Interaction patterns & visual standards",
            "Stakeholder review presentations",
        ],
        outcome:
            "Produced a clear, structured design direction for the quoting flow that addressed user comprehension pain points and aligned with business requirements.",
    },
];

const processSteps = ["Research", "Wireframes", "Prototype", "Test", "Iterate"];

export const UXDesign: React.FC = () => {
    const [expanded, setExpanded] = useState<number | null>(null);
    const featured = projects.find(p => p.featured);
    const secondary = projects.filter(p => !p.featured);

    return (
        <section id="ux-design" className="py-20 px-4 max-w-6xl mx-auto">
            {/* Section header */}
            <div className="mb-12">
                <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">Design Portfolio</p>
                <h2 className="text-4xl font-bold text-white font-gemola tracking-wide mb-4">UX / UI Design</h2>
                <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed mb-5">
                    UX/UI practice spanning fintech, transit, security, and SaaS products.
                    Formally trained at <span className="text-zinc-300">FIT (2019)</span> and applied across professional roles including{' '}
                    <span className="text-zinc-300">Kollins</span>, <span className="text-zinc-300">H. Stabbins</span>, and{' '}
                    <span className="text-zinc-300">Price Shop Insurance</span>. Tools include Figma, Adobe XD,
                    InVision, Axure, Balsamiq, Miro, Sketch, and FlowMapp.
                </p>
                {/* Design process steps */}
                <div className="flex flex-wrap gap-x-3 gap-y-2 items-center">
                    {processSteps.map((step, i) => (
                        <div key={step} className="flex items-center gap-2 text-xs">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-[10px]">
                                {i + 1}
                            </div>
                            <span className="text-zinc-400 font-mono">{step}</span>
                            {i < processSteps.length - 1 && <span className="text-zinc-700">→</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured project */}
            {featured && (
                <div className="mb-8 group bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/40 rounded-2xl p-8 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
                        {/* Left column */}
                        <div className="lg:w-1/2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-bold font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full uppercase tracking-widest">
                                    Featured
                                </span>
                                <span className="text-xs font-mono text-zinc-500">{featured.year}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-100 transition-colors">
                                {featured.title}
                            </h3>
                            <p className="text-zinc-400 text-sm mb-4">{featured.subtitle}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {featured.category.map(c => (
                                    <span key={c} className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                                        {c}
                                    </span>
                                ))}
                                {featured.tools.map(t => (
                                    <span key={t} className="text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-500 px-2 py-1 rounded">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Challenge</p>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{featured.challenge}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Approach</p>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{featured.solution}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="lg:w-1/2 mt-6 lg:mt-0 space-y-4">
                            <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-5">
                                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Deliverables</p>
                                <ul className="space-y-2">
                                    {featured.deliverables.map(d => (
                                        <li key={d} className="flex items-start gap-2 text-sm text-zinc-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-5">
                                <p className="text-[10px] font-mono text-blue-400/70 uppercase tracking-widest mb-2">Outcome</p>
                                <p className="text-zinc-300 text-sm leading-relaxed">{featured.outcome}</p>
                            </div>

                            {featured.link && (
                                <a
                                    href={featured.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                    </svg>
                                    View Case Study
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Secondary projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondary.map(project => (
                    <div
                        key={project.id}
                        className="bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer group"
                        onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <span className="text-xs font-mono text-zinc-500 block mb-1">{project.year}</span>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-zinc-500 text-xs mt-0.5">{project.subtitle}</p>
                            </div>
                            <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-xl font-light select-none ml-2 flex-shrink-0">
                                {expanded === project.id ? '−' : '+'}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.category.map(c => (
                                <span key={c} className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                                    {c}
                                </span>
                            ))}
                            {project.tools.map(t => (
                                <span key={t} className="text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-600 px-2 py-0.5 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>

                        {expanded !== project.id && (
                            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                                {project.challenge}
                            </p>
                        )}

                        {expanded === project.id && (
                            <div className="space-y-3 mt-2 border-t border-zinc-800 pt-4">
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Challenge</p>
                                    <p className="text-zinc-300 text-xs leading-relaxed">{project.challenge}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Approach</p>
                                    <p className="text-zinc-300 text-xs leading-relaxed">{project.solution}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Deliverables</p>
                                    <ul className="space-y-1.5">
                                        {project.deliverables.map(d => (
                                            <li key={d} className="flex items-start gap-2 text-xs text-zinc-400">
                                                <div className="w-1 h-1 rounded-full bg-blue-500/60 mt-1.5 flex-shrink-0" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-zinc-950/50 rounded-lg p-3">
                                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Outcome</p>
                                    <p className="text-zinc-400 text-xs leading-relaxed">{project.outcome}</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center text-xs text-zinc-600 font-mono">
                            <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></div>
                            {expanded === project.id ? 'Click to collapse' : 'Click to expand'}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
