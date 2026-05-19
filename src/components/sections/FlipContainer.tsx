'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';

export default function FlipContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);
  
  const [frontHeight, setFrontHeight] = useState(0);
  const [backHeight, setBackHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Performance: Track visibility for Active Culling
  const [isBackVisible, setIsBackVisible] = useState(false);

  // Measure dynamic heights on mount and resize
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === frontFaceRef.current) {
          setFrontHeight(entry.contentRect.height);
        } else if (entry.target === backFaceRef.current) {
          setBackHeight(entry.contentRect.height);
        }
      }
    });

    if (frontFaceRef.current) observer.observe(frontFaceRef.current);
    if (backFaceRef.current) observer.observe(backFaceRef.current);
    
    // Initial measurements
    if (frontFaceRef.current) setFrontHeight(frontFaceRef.current.getBoundingClientRect().height);
    if (backFaceRef.current) setBackHeight(backFaceRef.current.getBoundingClientRect().height);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Track the scroll progress of the entire wrapper
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // ─── Linear Spring Dampening ───
  // Decouples native scroll-wheel crunchiness from the 3D transforms
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // ─── 1:1 Unified Physics Engine ───
  const flipDistance = windowHeight > 0 ? windowHeight * 1.5 : 1200; // Flip takes 1.5x screen height
  const frontMaxTranslate = Math.max(0, frontHeight - windowHeight);
  const backMaxTranslate = Math.max(0, backHeight - windowHeight);
  
  // Total scrollable distance encompasses both sections and the flip
  const totalScrollable = frontMaxTranslate + flipDistance + backMaxTranslate;
  
  // Set wrapper height so 1px of native scroll equals 1px of simulated scroll across the entire sequence
  const wrapperHeight = totalScrollable > 0 ? `${totalScrollable + windowHeight}px` : '300vh';

  // Phase 1: Front Translation (Experience)
  const frontY = useTransform(springScroll, (progress) => {
    if (totalScrollable === 0) return 0;
    const pixelsScrolled = progress * totalScrollable;
    // Clamp to frontMaxTranslate
    const y = Math.min(pixelsScrolled, frontMaxTranslate);
    return -y;
  });

  // Phase 2: The Flip
  const rotateY = useTransform(springScroll, (progress) => {
    if (totalScrollable === 0) return "0deg";
    const pixelsScrolled = progress * totalScrollable;
    
    // Don't start flipping until front translation is complete
    if (pixelsScrolled <= frontMaxTranslate) return "0deg";
    
    const flipProgress = (pixelsScrolled - frontMaxTranslate) / flipDistance;
    const factor = Math.min(Math.max(flipProgress, 0), 1);
    
    return `${factor * 180}deg`;
  });

  // Phase 3: Back Translation (Skills)
  const backY = useTransform(springScroll, (progress) => {
    if (totalScrollable === 0) return 0;
    const pixelsScrolled = progress * totalScrollable;
    
    // Don't start translating until flip is complete
    const flipEnd = frontMaxTranslate + flipDistance;
    if (pixelsScrolled <= flipEnd) return 0;
    
    const backScrolled = pixelsScrolled - flipEnd;
    const y = Math.min(backScrolled, backMaxTranslate);
    return -y;
  });

  // Phase 4: Pointer Events Toggling (Hit-box fix)
  const frontPointerEvents = useTransform(springScroll, (progress) => {
    if (totalScrollable === 0) return "auto";
    const pixelsScrolled = progress * totalScrollable;
    return pixelsScrolled > frontMaxTranslate + (flipDistance / 2) ? "none" : "auto";
  });

  const backPointerEvents = useTransform(springScroll, (progress) => {
    if (totalScrollable === 0) return "none";
    const pixelsScrolled = progress * totalScrollable;
    return pixelsScrolled > frontMaxTranslate + (flipDistance / 2) ? "auto" : "none";
  });

  // ─── Active Culling Logic ───
  // Monitor rotation to toggle rendering resources and fix z-fighting
  useMotionValueEvent(rotateY, "change", (latest) => {
    const angle = parseFloat(latest as string);
    setIsBackVisible(angle > 90);
  });

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: wrapperHeight }}>
      
      {/* Sticky top-0 container locks viewport while scrolling */}
      <div 
        className="sticky top-0 w-full h-screen overflow-hidden bg-black" 
        style={{ perspective: "1500px" }}
      >
        
        {/* 3D Card */}
        <motion.div 
          className="relative w-full h-full"
          style={{ 
            transformStyle: "preserve-3d",
            rotateY,
            willChange: "transform"
          }}
        >
          {/* ── Front Face: Experience ── */}
          <motion.div 
            className="absolute inset-0 w-full h-full bg-black"
            style={{ 
              backfaceVisibility: "hidden",
              pointerEvents: frontPointerEvents,
              opacity: isBackVisible ? 0 : 1
            }}
          >
            <motion.div 
              ref={frontFaceRef}
              style={{ y: frontY, willChange: "transform" }}
              className="w-full"
            >
              <Experience isPaused={isBackVisible} />
            </motion.div>
          </motion.div>

          {/* ── Back Face: Skills ── */}
          <motion.div 
            className="absolute inset-0 w-full h-full bg-black"
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)",
              pointerEvents: backPointerEvents,
              opacity: isBackVisible ? 1 : 0,
              display: isBackVisible ? "block" : "none"
            }}
          >
            <motion.div 
              ref={backFaceRef}
              style={{ y: backY, willChange: "transform" }}
              className="w-full"
            >
              <Skills />
            </motion.div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}
