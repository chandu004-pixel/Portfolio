# Chandril Das | Portfolio
Live link: https://portfolio-mu-henna-80.vercel.app/

**Full-Stack Engineer & Creative Technologist**

Welcome to my portfolio repository. This project is a brutalist, cinematic showcase of my skills, experience, and creative engineering capabilities. It combines modern web development frameworks with high-performance WebGL and complex animations to create a unique, interactive experience.

---

## 👨‍💻 Profile Summary

I am a Full-Stack Engineer blending technical fluency with business development instincts. My expertise spans:
- **Programming Languages**: JavaScript (ES2024+), TypeScript, Python, C++
- **Frontend Development**: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Responsive Design
- **Technical Expertise**: Three.js, GSAP, SQL, Python, Data Analytics
- **Marketing & Strategy**: Cold Outreach, LinkedIn Lead Gen, Tender Management, Market Analysis
- **Soft Skills**: Communication, Strategic Thinking, Negotiation, Team Coordination

### Professional Experience
- **RajyaSampark** | *Full-Stack Intern* (May 2025 — Jul 2025)
  Engineered mobile-responsive UI architectures and seamless REST API integrations.
- **Independent Consultant** | *Lead Generator & Negotiator* (Jan 2024 — Present)
  Architected and executed targeted cold outreach strategies for boutique businesses.

---

## 🛠️ Detailed Tech Audit

This portfolio is built with performance, aesthetics, and modularity in mind. Here is a detailed breakdown of the technology stack and architectural decisions:

### Core Frameworks & Libraries
1. **Next.js 16.2.6 (App Router)**
   - Utilized for Server-Side Rendering (SSR) and edge-ready API routes.
   - Leverages `next/font` for optimized loading of the Geist font family.
2. **React 19**
   - Implements React's latest concurrent features, hooks, and context for state management.
3. **TypeScript**
   - End-to-end type safety, employing interfaces, type aliases, and strict typing across all components.
4. **Tailwind CSS v4**
   - Utility-first styling methodology for creating a highly customized Brutalist design language.
   - Configured for responsive, mobile-first layouts without writing custom CSS classes.

### 3D & Graphics Engine
1. **Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)**
   - Powers the interactive background layer (`WaterCanvas`), using custom GLSL shaders (Fragment/Vertex) to generate real-time ripple dynamics and distortion effects.
2. **Interactive SVG DOM (`CircuitTree`)**
   - Deeply customized SVG nodes that represent the skill tree. 
   - Makes use of complex `<animateMotion>` and CSS keyframes (`@keyframes bookOpen`) for high-fidelity micro-interactions and hover expansions.

### Animations & Interactions
1. **Framer Motion (`framer-motion`)**
   - Orchestrates scroll-triggered animations (`useScroll`, `useTransform`) for smooth parallax effects in the `Experience` section.
2. **Cinematic Parallax & Layout Structuring**
   - `FlipContainer`: A specialized component designed to handle layout flipping and scroll translation to create narrative-driven UI transitions.

### Project Structure & Methodology
- `src/app/`: Core Next.js routing, layout configuration, and global styles.
- `src/components/3d/`: Houses WebGL components, shaders, and complex SVG interactions (`WaterCanvas.tsx`, `CircuitTree.tsx`).
- `src/components/sections/`: Modularized page segments like `Hero.tsx`, `Experience.tsx`, `Projects.tsx`, and `Skills.tsx`.
- `src/components/ui/` & `layout/`: Reusable interface elements and structural wrappers.

---

## 🚀 Getting Started

To run this project locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Designed & Engineered by Chandril Das.*
