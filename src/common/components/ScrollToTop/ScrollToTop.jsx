import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    const header = document.getElementById("header");
    if (header) observer.observe(header);
    return () => observer.disconnect();
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-4 right-4 w-8 h-8 sm:w-12 sm:h-12 bg-black/20 text-white rounded-full z-50 flex items-center justify-center text-lg sm:text-xl"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
