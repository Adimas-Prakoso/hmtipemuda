"use client";

import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import scrollUpAnimation from "../../../public/lottie/scroll_up.json";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Check scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Reset animation after scrolling
    setTimeout(() => {
      setIsScrolling(false);
      setIsVisible(false);
    }, 1000);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: scrollUpAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {isVisible && (
        <div
          className={`fixed bottom-8 right-8 cursor-pointer z-50 transition-all duration-1000 transform ${
            isScrolling ? "-translate-y-[100vh]" : "translate-y-0"
          }`}
          onClick={scrollToTop}
        >
          <div className="w-12 h-12 sm:w-15 sm:h-15 md:w-20 md:h-20 lg:w-30 lg:h-30">
            <Lottie
              options={defaultOptions}
              height="100%"
              width="100%"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
