"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  slides: {
    image: string;
    alt: string;
  }[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayText, setDisplayText] = useState("Pemuda");
  const [isDeleting, setIsDeleting] = useState(false);
  const words = React.useMemo(() => ["Pemuda", "Hastabrata"], []);
  const [wordIndex, setWordIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    setShowContent(true);
  }, []);

  const animateText = useCallback(() => {
    const currentWord = words[wordIndex];
    
    if (!isDeleting) {
      if (displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
      setDisplayText(currentWord.substring(0, displayText.length + 1));
    } else {
      if (displayText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      setDisplayText(currentWord.substring(0, displayText.length - 1));
    }
  }, [displayText, isDeleting, wordIndex, words]);

  useEffect(() => {
    const timer = setTimeout(animateText, isDeleting ? 100 : 200);
    return () => clearTimeout(timer);
  }, [animateText, isDeleting]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen w-full bg-white overflow-hidden">
      {/* Static overlay */}
      <div className="absolute inset-0 bg-blue-900/30 z-10"></div>
      
      {/* Background slideshow */}
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide.image}
          alt={slide.alt}
          fill
          className={`absolute transition-all duration-1000 object-cover ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          priority={index === 0}
        />
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-6 md:px-12 lg:px-32 z-20">
        <div className="mb-6 max-w-full">
          <h2 className={`text-4xl md:text-5xl lg:text-7xl font-bold text-blue-100 mb-4 transform transition-all duration-1000 ease-out
            ${showContent ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            Selamat datang di
          </h2>
          <h1 className={`text-5xl md:text-7xl lg:text-9xl font-bold text-blue-500 drop-shadow-lg whitespace-normal lg:whitespace-nowrap transform transition-all duration-1000 ease-out delay-200
            ${showContent ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            HMTI <span className="inline-block min-w-[1em] bg-gradient-to-r text-blue-500 bg-clip-text">{displayText}</span>
            <span className="animate-blink">|</span>
          </h1>
        </div>
        <p className={`text-lg md:text-xl lg:text-3xl text-blue-50 max-w-[90%] md:max-w-2xl lg:max-w-3xl backdrop-blur-sm bg-black/10 p-4 rounded-lg transform transition-all duration-1000 ease-out delay-400
          ${showContent ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          Mewujudkan mahasiswa Teknik Informatika yang kreatif, inovatif, dan 
          berkontribusi nyata dalam pengembangan teknologi untuk kemajuan bangsa.
        </p>
      </div>

      {/* Slide Navigation Dots */}
      <div className={`absolute bottom-10 left-0 right-0 flex justify-center z-20 transition-all duration-1000 ease-out delay-600
        ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 lg:p-4 transform transition-all duration-500 hover:scale-110">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 md:h-3 w-2 md:w-3 rounded-full mx-2 md:mx-3 lg:mx-4 transition-all duration-300 transform hover:scale-150 ${
                index === currentSlide ? 'bg-blue-600 w-4 md:w-6' : 'bg-blue-200'
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        @media (max-width: 640px) {
          .text-9xl {
            font-size: 4rem;
            line-height: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
