export type SitePage = "home" | "experience";

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
  { type: "route", label: "Experience", href: "/experience", page: "experience" },
  { type: "section", label: "Python Lab", sectionId: "python-interactive" },
  { type: "section", label: "Darkroom", sectionId: "photography" },
  { type: "section", label: "JS Lab", sectionId: "js-challenges" },
  { type: "section", label: "UX / UI", sectionId: "ux-design" },
  { type: "section", label: "Projects", sectionId: "projects" },
  { type: "section", label: "Contact", sectionId: "contact" },
];

export const technicalArsenal = [
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "Brand Strategy",
  "Adobe Suite",
  "Figma",
  "Photography",
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
