export type JobCategory = "Engineering" | "UX/UI Design";

export interface JobHighlightGroup {
  label: string;
  bullets: string[];
}

export interface Job {
  id: number;
  role: string;
  company: string;
  companyDisplay?: string;
  location: string;
  period: string;
  category: JobCategory;
  preview: string;
  summary: string;
  highlights: JobHighlightGroup[];
  tech: string[];
}

export const employmentHistory: Job[] = [
  {
    id: 1,
    role: "Software Engineer — Web Development",
    company: "Manana Bridal Designer",
    location: "Remote",
    period: "Dec 2024 — Present",
    category: "Engineering",
    preview:
      "Architected and built a full responsive web presence from scratch with React, TypeScript, and third-party integrations for booking and payments.",
    summary:
      "Sole engineer and technical lead for a boutique bridal brand, delivering a full web presence from architecture to deployment. Responsible for the entire development lifecycle across multiple client-facing projects.",
    highlights: [
      {
        label: "Architecture & Development",
        bullets: [
          "Architected and built a responsive, performance-optimized website from scratch using React and TypeScript, targeting Core Web Vitals benchmarks.",
          "Developed reusable component library with consistent design tokens, reducing future feature development time.",
          "Managed full development lifecycle: discovery, requirements gathering, design, implementation, QA, and deployment.",
        ],
      },
      {
        label: "Client & Product",
        bullets: [
          "Translated client business goals into precise technical specifications and measurable product features.",
          "Integrated third-party APIs for appointment booking, payment processing, and marketing analytics.",
          "Implemented dynamic UI interactions such as filterable galleries, booking flows, and animated transitions that increased engagement and conversion.",
        ],
      },
      {
        label: "Process & Collaboration",
        bullets: [
          "Utilized Git and GitHub for version control, branching strategy, and project management across ongoing deliverables.",
          "Applied UX/UI principles throughout development, reducing friction in user flows and improving overall usability.",
        ],
      },
    ],
    tech: [
      "React",
      "TypeScript",
      "HTML",
      "CSS",
      "JavaScript",
      "Git",
      "Stripe API",
      "REST APIs",
    ],
  },
  {
    id: 2,
    role: "Software Engineer — Full-Stack Web & Booking Systems",
    company: "AVSA Studio",
    companyDisplay: "AVSA Studio — Photography Platform with Custom Booking System",
    location: "New York City, NY",
    period: "Feb 2022 — 2024",
    category: "Engineering",
    preview:
      "Built a custom full-stack photography booking platform with real-time scheduling, Stripe payments, and automated email notifications.",
    summary:
      "Founded and engineered a custom photography booking platform end-to-end, serving as sole developer and product owner. Built the system from architecture to production, handling real clients, real payments, and real scheduling constraints.",
    highlights: [
      {
        label: "Booking System & Scheduling",
        bullets: [
          "Designed and built a custom real-time booking engine: clients select packages, choose time slots, and confirm appointments without double-booking conflicts.",
          "Implemented availability logic with calendar state management, preventing booking collisions and supporting multi-session scheduling.",
          "Developed a multi-step booking flow with persistent client state across form stages, reducing drop-off and improving conversion.",
        ],
      },
      {
        label: "Payments & Client Management",
        bullets: [
          "Integrated Stripe for secure deposit and full payment processing within the booking flow, supporting multiple package tiers.",
          "Built automated email notification system for booking confirmations, reminders, and session updates using transactional email APIs.",
          "Created client management dashboard for viewing bookings, tracking session status, and managing appointment lifecycle.",
        ],
      },
      {
        label: "Front-End & Architecture",
        bullets: [
          "Built responsive React front-end optimized for mobile booking, with a focus on reducing user friction in checkout.",
          "Architected reusable UI component system and state management pattern, enabling rapid iteration on booking features.",
          "Connected front-end with RESTful APIs for scheduling, payment processing, and analytics data, ensuring consistent data flow and error handling.",
          "Managed full project lifecycle: planning, architecture, development, testing, and production deployment.",
        ],
      },
    ],
    tech: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Stripe",
      "Node.js",
      "REST APIs",
      "Git/GitHub",
      "PostgreSQL",
    ],
  },
  {
    id: 3,
    role: "Front-End Engineer",
    company: "Altronix",
    companyDisplay: "Altronix — Security Systems Manufacturer",
    location: "Brooklyn, NY",
    period: "Feb 2020 — Sep 2022",
    category: "Engineering",
    preview:
      "Built and maintained responsive product pages in HTML, CSS, JavaScript, and React while improving UX, SEO, and mobile performance across a large catalog.",
    summary:
      "Front-end engineer on a manufacturer's web team, responsible for building and maintaining product pages across a large catalog. Worked cross-functionally with product, marketing, and creative to ship high-quality pages quickly and consistently.",
    highlights: [
      {
        label: "Front-End Development",
        bullets: [
          "Built and maintained responsive product pages using HTML, CSS, and JavaScript, with React for complex UI features, ensuring clean UX, accessibility compliance, and solid mobile performance.",
          "Created and documented reusable page templates and component patterns, standardizing publishing workflow and reducing page-build time across the catalog.",
          "Improved page speed and SEO fundamentals through semantic markup, structured content, and optimized asset delivery, directly supporting discoverability and conversion.",
        ],
      },
      {
        label: "Content & Asset Production",
        bullets: [
          "Photographed new product launches in a controlled studio environment; handled color-accurate retouching, format optimization, and web-ready exports.",
          "Uploaded and managed assets in the CMS and DAM system, standardizing image specs and naming conventions to streamline the publishing pipeline.",
          "Partnered with product and marketing teams to plan page architecture, write technically accurate copy, and align visuals with brand guidelines.",
        ],
      },
      {
        label: "Collaboration & Delivery",
        bullets: [
          "Collaborated cross-functionally to launch feature updates and new product lines on tight timelines with minimal rework.",
          "Supported rapid iteration cycles by building new pages, responding to product changes, and shipping updates across a large, active product catalog.",
        ],
      },
    ],
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "CMS",
      "DAM",
      "SEO",
      "Photoshop",
      "Lightroom",
    ],
  },
  {
    id: 4,
    role: "Web Developer & UX/UI Designer",
    company: "MILLSTA",
    companyDisplay: "MILLSTA — Security Systems Website Redesign",
    location: "New York City, NY",
    period: "Sep 2019 — Feb 2020",
    category: "UX/UI Design",
    preview:
      "Led an end-to-end redesign of a security company website, from UX research and wireframes through the final responsive build.",
    summary:
      "Led a complete end-to-end redesign and rebuild of a security company's web presence as the sole designer and developer. Took the project from initial discovery and UX research through final deployment.",
    highlights: [
      {
        label: "Design & UX",
        bullets: [
          "Gathered UX requirements through stakeholder interviews and competitive analysis, then defined user flows and information architecture.",
          "Translated research into wireframes, interactive prototypes, and polished high-fidelity visual designs, iterating based on feedback.",
          "Documented interaction patterns and visual standards to create a scalable, consistent design system for ongoing brand use.",
        ],
      },
      {
        label: "Development",
        bullets: [
          "Built responsive, accessible pages from scratch using HTML, CSS, and JavaScript, optimizing for fast load times and smooth cross-device interactions.",
          "Modernized the brand's digital presence, taking the site from an outdated layout to a clean, professional experience aligned with its market positioning.",
        ],
      },
    ],
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "Figma",
      "Adobe XD",
      "Wireframing",
      "Prototyping",
    ],
  },
  {
    id: 5,
    role: "UX/UI Designer",
    company: "Price Shop Insurance",
    companyDisplay: "Price Shop Insurance — Website & Mobile App",
    location: "New York City, NY",
    period: "Aug 2019 — Nov 2019",
    category: "UX/UI Design",
    preview:
      "Designed UX flows, wireframes, and high-fidelity mockups for an insurance website and companion mobile app.",
    summary:
      "Designed the end-to-end user experience for an insurance company's website and companion mobile app, from initial research through final visual design.",
    highlights: [
      {
        label: "Research & Strategy",
        bullets: [
          "Gathered UX requirements through stakeholder sessions and user interviews, developing experience strategy aligned with business goals.",
          "Defined user flows and task sequences, identifying friction points in existing insurance quoting and comparison workflows.",
        ],
      },
      {
        label: "Design Execution",
        bullets: [
          "Created concept maps, user workflows, wireframes, and high-fidelity mockups for both web and mobile surfaces.",
          "Established interaction patterns and visual standards, building a consistent design language across website and app.",
        ],
      },
    ],
    tech: [
      "Figma",
      "Adobe XD",
      "InVision",
      "Wireframing",
      "User Research",
      "Prototyping",
    ],
  },
  {
    id: 6,
    role: "UX/UI Designer — Certification Capstone",
    company: "MTA App",
    companyDisplay: "MTA App — NYC Transit Mobile App Redesign",
    location: "New York City, NY",
    period: "Feb 2019 — Jun 2019",
    category: "UX/UI Design",
    preview:
      "Redesigned the NYC transit payment experience as a mobile app, covering user research, task flows, and interactive prototyping in Adobe XD.",
    summary:
      "Capstone project for FIT UX/UI certificate: redesigned the NYC MTA transit payment and navigation experience as a mobile app, applying full UX methodology from research to interactive prototype.",
    highlights: [
      {
        label: "Research & Discovery",
        bullets: [
          "Conducted user research with NYC commuters to surface real pain points in existing transit payment flows.",
          "Synthesized research into task flows, journey maps, and prioritized design requirements.",
        ],
      },
      {
        label: "Design & Prototyping",
        bullets: [
          "Translated research insights into detailed wireframes and interactive high-fidelity prototypes using Adobe XD and Illustrator.",
          "Created cohesive visual systems covering color, typography, iconography, and layout patterns, ensuring accessibility and clarity across screens.",
          "Developed interaction patterns consistent with iOS and Android platform conventions, validated through peer critique and instructor review.",
        ],
      },
    ],
    tech: [
      "Adobe XD",
      "Illustrator",
      "InDesign",
      "Wireframing",
      "Prototyping",
      "User Research",
    ],
  },
];
