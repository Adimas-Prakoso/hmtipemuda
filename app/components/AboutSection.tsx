"use client";

import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView,
  easeInOut, 
  easeOut 
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import VisiMisiSection from "./VisiMisiSection";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -200px 0px",
    amount: 0.3
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Improved transform values with proper easing functions
  const aboutOpacity = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.4], 
    [1, 0.8, 0],
    { ease: easeInOut }
  );
  
  const visionOpacity = useTransform(
    scrollYProgress, 
    [0.4, 0.45, 0.5], 
    [0, 0.8, 1],
    { ease: easeInOut }
  );
  
  // Smoother transform transitions with proper easing functions
  const aboutY = useTransform(
    scrollYProgress, 
    [0, 0.4], 
    [0, -30],
    { ease: easeOut }
  );
  
  const visionY = useTransform(
    scrollYProgress, 
    [0.4, 0.5], 
    [30, 0],
    { ease: easeOut }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delay: 0.5,
      },
    },
  };

  const leftVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const rightVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 1,
      },
    },
  };

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="w-full min-h-[200vh] py-20 bg-gray-50 relative"
    >
      <div className="container mx-auto max-w-screen-xl px-4 md:px-8 sticky top-20 h-[calc(100vh-40px)]">
        {/* About Content */}
        <motion.div
          ref={aboutRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ 
            opacity: aboutOpacity,
            y: aboutY,
            willChange: "transform, opacity"
          }}
          className="grid md:grid-cols-2 md:gap-8 items-center min-h-[calc(100vh-160px)] pt-8 md:pt-0"
        >
          <motion.div
            variants={leftVariants}
            className="space-y-8 order-2 md:order-1"
          >
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tentang HMTI
              </h2>
              <div className="w-20 h-1 mx-auto md:mx-0 bg-blue-600"></div>
            </div>
            <div className="text-justify text-gray-600 leading-relaxed space-y-8">
              {isMobile ? (
                <>
                  <p>
                    Himpunan Mahasiswa Teknologi Informasi (HMTI) adalah wadah aspirasi dan pelayanan bagi mahasiswa Jurusan Teknologi Informasi. Didirikan pada 02 Februari 2020 di Jakarta, HMTI mendukung pengembangan skill mahasiswa sebagai calon teknisi dan akademisi aktif.
                  </p>
                  <p>
                    HMTI menjadi wadah penting bagi mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika untuk mengembangkan ide-ide brilian dan kemampuan dalam materi informatika, serta kreativitas praktis, menjadikan mereka akademisi profesional.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Himpunan Mahasiswa Teknologi Informasi (HMTI) adalah wadah aspirasi dan
                    pelayanan bagi mahasiswa Jurusan Teknologi Informasi. HMTI didirikan
                    pada tanggal 02 Februari 2020 bertempat di Jakarta. Himpunan Mahasiswa
                    Teknologi Informasi terbentuk dengan dilatar belakangi oleh kebutuhan
                    mahasiswa program studi Teknologi Informasi untuk terciptanya
                    lingkungan yang mendukung pengembangan skill mahasiswa pada program
                    studi tersebut sebagai calon teknisi dan akademisi aktif yang akan
                    turun ke tengah-tengah masyarakat.
                  </p>

                  <p>
                    Terbentuknya HMTI adalah sebagai salah satu wadah organisasi yang
                    sangat dibutuhkan oleh seluruh mahasiswa Teknologi Informasi
                    Universitas Bina Sarana Informatika untuk mencurahkan ide-ide brilian
                    dan mengembangkan kemampuan mereka dalam menguasai materi-materi
                    informatika, dan mengembangkan kreativitas yang tidak hanya bersifat
                    teoritis, sehingga mereka menjadi akademisi yang profesional dan patut
                    diteladani.
                  </p>

                  <p>
                    Memperhatikan realita kemampuan mahasiswa dalam mengelola kepribadian
                    serta kemampuan intelektual dalam sisi akademisi aktif dilingkungan
                    perkuliahan, baik dalam segi teknisi informasi, berkomunikasi atau
                    public speaking dan lain-lain, maka dari itu dengan keinginan luhur
                    dan dukungan dari seluruh mahasiswa Teknologi Informasi Universitas
                    Bina Sarana Informatika memutuskan satu kesepakatan untuk membentuk
                    sebuah organisasi yang bernama HMTI sebagai wadah diskusi mahasiswa
                    Teknologi Informasi dan pengembangan softskill secara produktif.
                  </p>
                </>
              )}
            </div>
          </motion.div>
          <motion.div
            variants={rightVariants}
            className="sketchfab-embed-wrapper h-full order-1 md:order-2"
          >
            <iframe
              title="Rog"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-lg"
              src="https://sketchfab.com/models/79ae047052694df184812dd5847f7df6/embed?autostart=1&preload=1&transparent=1&ui_hint=0&ui_infos=0&ui_controls=0&ui_watermark=0"
            />
          </motion.div>
        </motion.div>

        {/* Vision and Mission Content */}
        <motion.div
          ref={visionRef}
          style={{ 
            opacity: visionOpacity,
            y: visionY,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            willChange: "transform, opacity",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
          className="flex items-center justify-center"
        >
          <div className="w-full h-full px-2 sm:px-4 md:px-8 py-4 md:py-0 overflow-y-auto md:overflow-visible">
            <VisiMisiSection />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;