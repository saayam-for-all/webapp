import { useEffect, useState } from "react";
import "./ScrollToTop.css";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShow(window.scrollY > 200);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        })
      }
      className="scroll-to-top w-11 h-11 sm:w-12 sm:h-12 bg-gray-200 text-black hover:bg-gray-300 rounded-full flex items-center justify-center text-2xl font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-md"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
};

export default ScrollToTop;
