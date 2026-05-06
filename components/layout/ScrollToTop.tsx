import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetWindowScroll, scrollToSection } from "../../utils/scroll";

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        scrollToSection(hash.replace("#", ""), "auto");
      });
      return;
    }

    resetWindowScroll();
  }, [hash, pathname]);

  return null;
};
