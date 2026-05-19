'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

// ─── Data ────────────────────────────────────────────────────────────────────

type MediaEntry = {
  id: string;
  company: string;
  companyUrl?: string | null;
  role: string;
  date: string;
  description: string;
  bullets?: string[];
  mediaUrl?: string;
  image?: string;
};

const experiences: MediaEntry[] = [
  {
    id: '01',
    company: 'RajyaSampark',
    companyUrl: 'https://rajya-sampark.vercel.app',
    role: 'Full-Stack Intern',
    date: 'May 2025 — Jul 2025',
    description:
      'Engineered mobile-responsive UI architectures and seamless REST API integrations. Orchestrated cross-functional collaboration via rigorous GitHub workflows and structured code reviews. Applied Postman-driven validation pipelines to ensure endpoint reliability end-to-end.',
    bullets: [
      'Built responsive UI components using React, HTML5 & CSS3',
      'Developed REST APIs with backend troubleshooting & issue resolution',
      'Collaborated via GitHub pull requests and structured code reviews',
      'Validated APIs extensively using Postman testing workflows',
    ],
    mediaUrl: 'https://res.cloudinary.com/djsdrvkby/video/upload/c_scale,w_1280,q_auto:low/f_auto/Untitled_design_xhx2qz.mp4',
  },
  {
    id: "02",
    company: "Independent Consultant",
    role: "Lead Generator & Negotiator",
    date: "Jan 2024 — Present",
    description: "Architected and executed targeted cold outreach strategies for boutique businesses. Iteratively refined value propositions based on market telemetry and prospect response patterns to secure high-value contracts and build lasting client relationships.",
    bullets: [
      "Solo lead generation via cold calls, emails & LinkedIn outreach",
      "Adapted value propositions based on prospect response data",
      "Managed full sales cycle from discovery to contract closure",
      "Improved lead conversion trends across multiple engagement campaigns"
    ],
    mediaUrl: "https://res.cloudinary.com/djsdrvkby/video/upload/c_scale,w_1280,q_auto:low/f_auto/v1778588655/mp__ahhjp8.mp4"
  },
];

// ─── Section ─────────────────────────────────────────────────────────────────

export default function Experience({ isPaused = false }: { isPaused?: boolean }) {
  return (
    <section
      id="experience"
      className="relative z-10 bg-black border-t border-white/10 w-full overflow-hidden py-24 px-8 md:px-24"
    >
      {/* Section header */}
      <div className="mb-16">
        <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-4">Chapter 02</p>
        <h2 className="font-serif text-6xl md:text-8xl text-white tracking-tight leading-none">
          Experience.
        </h2>
      </div>

      {/* Editorial blocks */}
      <div className="flex flex-col gap-0">
        {experiences.map((exp, index) => (
          <ExperienceBlock key={exp.id} exp={exp} index={index} isPaused={isPaused} />
        ))}
      </div>
    </section>
  );
}

// ─── Block ────────────────────────────────────────────────────────────────────

function ExperienceBlock({
  exp,
  index,
  isPaused,
}: {
  exp: MediaEntry;
  index: number;
  isPaused: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Increase playback pace for a more cinematic feel, and handle Active Culling pause signals
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.75;
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log("Autoplay prevented during culling:", e));
      }
    }
  }, [isPaused]);

  // Internal parallax is disabled because FlipContainer handles the scroll translation.
  // Native intersection observers will not trigger accurately during CSS translation.

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-16 md:gap-16 w-full`}
    >
      {/* ── Media window ── */}
      {(exp.mediaUrl || exp.image) && (
        <motion.div
          className={`group relative w-full ${
            index === 1 
              ? 'md:w-[50%] h-[600px] md:mt-24' 
              : 'md:w-[70%] h-[420px] md:mt-48'
          } overflow-hidden`}
        >
        <motion.div
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          {exp.mediaUrl ? (
            /* ── Cinematic video texture ── */
            <video
              ref={videoRef}
              src={exp.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover contrast-125 opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
          ) : (
            /* ── Static image fallback ── */
            <Image
              src={exp.image || ''}
              alt={exp.role}
              fill
              priority={index === 0}
              unoptimized
              className="object-cover grayscale contrast-125"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </motion.div>
      )}

      {/* ID badge - Always visible for context */}
      {!exp.mediaUrl && !exp.image && (
        <div className={`w-full ${index === 1 ? 'md:w-[50%]' : 'md:w-[70%]'} flex justify-start items-center`}>
           <span className="font-serif text-8xl text-white/10 leading-none select-none">
            {exp.id}
          </span>
        </div>
      )}

      {/* ── Text content ── */}
      <motion.div
        className={`w-full ${exp.mediaUrl || exp.image ? (index === 1 ? 'md:w-[45%]' : 'md:w-[30%]') : 'md:w-full'} flex flex-col justify-center`}
      >
        {/* Company + number */}
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-serif text-xl text-neutral-500 italic">{exp.id}</span>
          {exp.companyUrl ? (
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 tracking-[0.22em] uppercase text-xs hover:text-white transition-colors"
            >
              {exp.company}
            </a>
          ) : (
            <span className="text-neutral-400 tracking-[0.22em] uppercase text-xs">
              {exp.company}
            </span>
          )}
        </div>

        {/* Role — serif display */}
        <h3 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-8">
          {exp.role}
        </h3>

        {/* Description */}
        <p className="text-neutral-400 text-lg leading-relaxed font-light max-w-lg mb-8">
          {exp.description}
        </p>

        {/* Bullet points */}
        {exp.bullets && exp.bullets.length > 0 && (
          <ul className="space-y-2 mb-10">
            {exp.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-500">
                <span className="mt-[6px] h-1 w-4 shrink-0 bg-white/30" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Date */}
        <p className="text-white tracking-widest uppercase text-xs font-bold border-b border-white/20 pb-2 inline-block self-start">
          {exp.date}
        </p>
      </motion.div>
    </div>
  );
}
