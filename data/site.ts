export type SitePage = "home" | "experience" | "projects";

type RouteNavigationItem = {
  type: "route";
  label: string;
  href: string;
  page: SitePage;
};

type SectionNavigationItem = {
  type: "section";
  label: string;
  sectionId: string;
};

export type NavigationItem = RouteNavigationItem | SectionNavigationItem;

export const EMAIL_ADDRESS = "salome.a.miller@gmail.com";

export const navigationItems: NavigationItem[] = [
  { type: "route", label: "Home", href: "/", page: "home" },
  { type: "route", label: "Experience", href: "/experience", page: "experience" },
  { type: "route", label: "Projects", href: "/projects", page: "projects" },
  { type: "section", label: "Contact", sectionId: "contact" },
];

export const technicalArsenal = [
  "Python",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "PostgreSQL",
  "REST APIs",
  "Stripe",
  "HTML & CSS",
  "Git & GitHub",
  "Figma & Design Systems",
];

export const contactCards = [
  {
    label: "EMAIL",
    value: EMAIL_ADDRESS,
    href: `mailto:${EMAIL_ADDRESS}`,
  },
  {
    label: "PHONE",
    value: "347 873 1451",
  },
  {
    label: "LOCATION",
    value: "Hillsdale, NJ",
  },
];
