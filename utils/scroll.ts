export const SCROLL_OFFSET = 96;

export const resetWindowScroll = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const scrollToSection = (
  sectionId: string,
  behavior: ScrollBehavior = "smooth"
) => {
  const target = document.getElementById(sectionId);

  if (!target) {
    return false;
  }

  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
  );

  window.scrollTo({ top, behavior });
  return true;
};
