import Link from 'next/link';
import { WaterCanvas } from '@/components/3d/WaterCanvas';

export default function Hero() {
  return (
    <section id="hero" className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-black">
      
      {/* LAYER 1: The 3D WebGL Background */}
      <div className="absolute inset-0 z-0">
        <WaterCanvas imageUrl="/me.png" />
      </div>

      {/* Dark gradient overlay for brutalist legibility (sits over the 3D canvas, under text) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Vertical 'Click to ripple' text on the extreme right */}
      <div className="pointer-events-none absolute right-8 top-1/2 z-10 -translate-y-1/2 md:right-24 mix-blend-difference">
        <p className="[writing-mode:vertical-lr] rotate-180 text-xs font-medium uppercase tracking-[0.3em] text-white opacity-90">
          Click to ripple
        </p>
      </div>

      {/* LAYER 2: The Brutalist HTML Foreground */}
      {/* perfectly left aligned, matching the padding of the sections below */}
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-start justify-center px-8 md:px-24">
        {/* Brutalist ruled line */}
        <div className="mb-6 h-px w-24 bg-white" />

        <h1 className="text-5xl font-black uppercase leading-none tracking-tighter text-white md:text-7xl lg:text-9xl">
          Chandril<br />Das.
        </h1>

        <h2 className="mt-6 text-lg font-medium uppercase tracking-[0.2em] text-neutral-400 md:text-xl">
          Full-Stack Engineer &amp; Creative Technologist
        </h2>

        {/* pointer-events-auto makes the buttons clickable again */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row pointer-events-auto">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center border border-white bg-white px-8 text-sm font-bold tracking-widest text-black transition-colors hover:bg-transparent hover:text-white"
          >
            GITHUB PROFILE
          </Link>
          <a
            href="/api/resume"
            className="inline-flex h-12 items-center justify-center border border-white/30 bg-transparent px-8 text-sm font-bold tracking-widest text-white transition-colors hover:border-white hover:bg-white/10"
          >
            DOWNLOAD CV
          </a>
        </div>

        {/* Brutalist scroll cue */}
        <p className="mt-20 text-xs font-medium uppercase tracking-[0.3em] text-neutral-600">
          Scroll to explore
        </p>
      </div>
    </section>
  );
}
