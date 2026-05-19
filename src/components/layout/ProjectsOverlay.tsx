'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import Projects from '@/components/sections/Projects';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsOverlay() {
  const { activeView, setActiveView } = useNavigation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    if (activeView === 'loading' && videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Autoplay prevented:", err));
    } else if (activeView === 'main') {
      setIsVideoVisible(false);
    }
  }, [activeView]);

  return (
    <AnimatePresence mode="wait">
      {activeView === 'loading' && (
        <motion.div 
          key="loading-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoVisible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <video 
              ref={videoRef}
              src="https://res.cloudinary.com/djsdrvkby/video/upload/q_auto,f_auto,so_3.2,eo_-1,e_sharpen:300/v1778602794/Screen_Recording_2026-05-12_at_9.49.18_PM_eivog2.mov"
              className="w-full h-full object-cover"
              onEnded={() => setActiveView('projects')}
              onPlay={() => setIsVideoVisible(true)}
              muted
              playsInline
            />
          </motion.div>
        </motion.div>
      )}

      {activeView === 'projects' && (
        <motion.div 
          key="projects-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black overflow-y-auto"
        >
          {/* Back button (<) on the extreme right */}
          <button 
            onClick={() => setActiveView('main')}
            className="fixed top-1/2 right-6 z-50 -translate-y-1/2 text-4xl md:text-6xl font-bold text-white/50 hover:text-white transition-all hover:scale-110"
          >
            &lt;
          </button>
          
          <div className="min-h-screen">
            <Projects />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
