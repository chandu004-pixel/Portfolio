'use client';
import { useState, useRef } from 'react';

const CSS = `
@keyframes bookOpen {
  0%   { opacity:0; transform:perspective(700px) rotateY(-85deg) scaleX(0.3); }
  65%  { opacity:1; transform:perspective(700px) rotateY(8deg) scaleX(1.02); }
  100% { opacity:1; transform:perspective(700px) rotateY(0deg) scaleX(1); }
}
.circuit-card { transform-origin:left center; animation:bookOpen .38s cubic-bezier(.23,1,.32,1) forwards; }
.expand-body { overflow:hidden; transition:max-height .5s cubic-bezier(0.4,0,0.2,1), opacity .35s ease; }
`;

const ICON: Record<string,string> = {
  code:    'M-9-6L-15 0L-9 6 M8-6L14 0L8 6 M-2 9L2-9',
  layers:  'M-12 3L0-6L12 3L0 11Z M-12-3L0-12L12-3',
  chip:    'M-7-8H7V8H-7Z M-11-3H-7 M-11 2H-7 M7-3H11 M7 2H11 M-3-8V-11 M2-8V-11 M-3 8V11 M2 8V11',
  chart:   'M-9 8H9 M-7 8V2 M-2 8V-5 M4 8V3',
  bubble:  'M-9-8H9V5H1L-1 9L-4 5H-9Z',
  diamond: 'M0-11L11 0L0 11L-11 0Z',
};

interface SNode {
  id:number; name:string; preview:string;
  items:{ label:string; detail:string }[];
  x:number; y:number; r?:number;
  shape:'c'|'r'; side:'L'|'R'; icon:string;
}

const NODES: SNode[] = [
  { id:0, name:'Programming Languages', preview:'Core languages powering everything from interactive UIs to data pipelines and system-level logic.',
    items:[
      { label:'JavaScript', detail:'ES2024+, async/await, closures, event loop, Promises, DOM manipulation and modern browser APIs.' },
      { label:'TypeScript', detail:'Type inference, generics, utility types (Partial, Record, Pick), strict mode and discriminated unions.' },
      { label:'Python',     detail:'Scripting, automation, REST API consumption, data manipulation with pandas, and AI SDK integration.' },
      { label:'C++',        detail:'Memory management, pointers, performance-critical algorithms and competitive programming fundamentals.' },
    ],
    x:200, y:200, r:28, shape:'c', side:'L', icon:'code' },

  { id:1, name:'Frontend Development', preview:'Building performant, pixel-perfect interfaces from wireframe to production with modern frameworks.',
    items:[
      { label:'React.js',         detail:'Hooks, context, compound component patterns, custom hooks, render optimisation with memo and useMemo.' },
      { label:'Next.js',          detail:'App Router, Server Components, SSR/ISR/SSG, API routes, middleware and edge runtime.' },
      { label:'HTML5 & CSS3',     detail:'Semantic markup, accessibility (ARIA), CSS Grid, Flexbox, custom properties and keyframe animations.' },
      { label:'Tailwind CSS',     detail:'Utility-first design, JIT compiler, custom config, dark mode and responsive breakpoints.' },
      { label:'Responsive Design',detail:'Mobile-first strategy, fluid typography, container queries and cross-browser compatibility.' },
    ],
    x:800, y:200, r:28, shape:'c', side:'R', icon:'layers' },

  { id:2, name:'Technical Expertise', preview:'Deep-stack creative and analytical skills spanning 3D rendering, animation, databases and data analysis.',
    items:[
      { label:'Three.js',      detail:'3D scene graphs, WebGL shaders (GLSL), PBR materials, post-processing and custom geometries.' },
      { label:'GSAP',          detail:'Timeline animations, ScrollTrigger, Draggable, MorphSVG and complex sequencing for UI storytelling.' },
      { label:'SQL',           detail:'Complex joins, window functions, indexing strategies, query optimisation and schema design.' },
      { label:'Python',        detail:'FastAPI backends, data pipelines, Jupyter notebooks and integration with ML inference APIs.' },
      { label:'Data Analytics',detail:'KPI dashboards, cohort analysis, funnel visualisation and reporting using Matplotlib & Plotly.' },
    ],
    x:420, y:112, shape:'r', side:'L', icon:'chip' },

  { id:3, name:'Marketing & Strategy', preview:'Blending technical fluency with business development instincts to generate qualified leads and close contracts.',
    items:[
      { label:'Cold Outreach',          detail:'High-conversion email and call scripts targeting boutique business owners; A/B tested messaging frameworks.' },
      { label:'LinkedIn Lead Gen',      detail:'Boolean search, Sales Navigator workflows, connection sequences and profile optimisation for outreach.' },
      { label:'Tender Management',      detail:'End-to-end RFP/RFQ preparation, compliance checklists, technical writing and submission tracking.' },
      { label:'Market Analysis',        detail:'Competitor benchmarking, TAM/SAM/SOM estimation, SWOT frameworks and pricing strategy.' },
      { label:'Campaign Execution',     detail:'Multi-channel campaign planning, performance tracking, iteration cycles and ROI reporting.' },
    ],
    x:150, y:420, r:24, shape:'c', side:'L', icon:'chart' },

  { id:4, name:'Soft Skills', preview:'The human layer that makes technical work impactful — communication, strategy and relationship-building.',
    items:[
      { label:'Communication',          detail:'Translating complex technical concepts into clear executive summaries, proposals and presentations.' },
      { label:'Strategic Thinking',     detail:'Long-horizon planning, prioritisation frameworks (RICE, MoSCoW) and trade-off analysis.' },
      { label:'Negotiation',            detail:'Interest-based negotiation, contract structuring, pricing discussions and stakeholder alignment.' },
      { label:'Team Coordination',      detail:'Cross-functional sprint facilitation, async collaboration via GitHub and Notion, conflict resolution.' },
      { label:'Client Relationships',   detail:'Discovery calls, regular status updates, expectation management and long-term account nurturing.' },
    ],
    x:850, y:420, r:24, shape:'c', side:'R', icon:'bubble' },

  { id:5, name:'Core Competencies', preview:'Operational disciplines ensuring projects stay on scope, on time and consistently aligned to client goals.',
    items:[
      { label:'Progress Monitoring', detail:'Milestone tracking, burn-down charts, blockers log and weekly health-check reports to stakeholders.' },
      { label:'Proposal Docs',       detail:'Technical proposals, SOWs, case studies and pitch decks crafted for both technical and non-technical audiences.' },
      { label:'B2B Interaction',     detail:'Executive-level meetings, needs discovery, solution positioning and post-sale onboarding.' },
      { label:'Strategy Alignment',  detail:'OKR mapping, quarterly planning, ensuring engineering deliverables directly serve business KPIs.' },
    ],
    x:580, y:112, shape:'r', side:'R', icon:'diamond' },
];

const RH = 18;

export default function CircuitTree() {
  const [hoverId,    setHoverId]    = useState<number|null>(null);
  const [expandedId, setExpandedId] = useState<number|null>(null);
  const [cardKey,    setCardKey]    = useState(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Card is visible when hovering or expanded
  const activeId   = expandedId ?? hoverId;
  const activeNode = activeId !== null ? NODES.find(n=>n.id===activeId) ?? null : null;
  const isExpanded = expandedId !== null && expandedId === activeId;

  const cancelLeave = () => { if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; } };
  const scheduleLeave = () => {
    if (expandedId !== null) return;
    leaveTimer.current = setTimeout(() => setHoverId(null), 160);
  };

  const onNodeEnter = (id:number) => {
    cancelLeave();
    if (expandedId !== null) return;
    // Only reset animation when switching to a different node
    if (hoverId !== id) setCardKey(k=>k+1);
    setHoverId(id);
  };
  const onNodeLeave = scheduleLeave;
  const onCardEnter = (id:number) => { cancelLeave(); if (expandedId===null) setHoverId(id); };
  const onCardLeave = scheduleLeave;

  const viewMore = () => { if (activeId!==null) setExpandedId(activeId); };
  const viewLess = () => { setExpandedId(null); };

  const pct = (v:number, max:number) => `${(v/max)*100}%`;
  const cardLeft = (n:SNode) =>
    n.side==='R' ? `calc(${pct(n.x,1000)} - ${isExpanded?'460':'340'}px)`
                 : `calc(${pct(n.x,1000)} + 44px)`;
  const cardTop  = (n:SNode) => `calc(${pct(n.y,1200)} - 28px)`;

  return (
    <div className="relative w-full select-none">
      <style>{CSS}</style>

      {/* ── Skill Card ─────────────────────────────────────────────────── */}
      {activeNode && (
        <div
          key={cardKey}
          className="circuit-card absolute z-40 border border-[#31C4AC] bg-black/97 backdrop-blur-sm shadow-[0_0_50px_rgba(49,196,172,0.4)]"
          style={{
            left: cardLeft(activeNode),
            top:  cardTop(activeNode),
            width: isExpanded ? '440px' : '320px',
            transition: 'width .45s cubic-bezier(0.4,0,0.2,1), left .45s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'auto',
          }}
          onMouseEnter={()=>onCardEnter(activeNode.id)}
          onMouseLeave={onCardLeave}
        >
          {/* Header */}
          <div className="border-b border-[#31C4AC]/30 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5FE3C8]">{activeNode.name}</p>
          </div>

          {/* Preview text */}
          <p className="px-5 pt-4 pb-2 text-xs leading-relaxed text-neutral-400">{activeNode.preview}</p>

          {/* Compact skill list (always visible) */}
          <ul className="space-y-1.5 px-5 pb-3">
            {activeNode.items.map((item,i)=>(
              <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-neutral-200">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#31C4AC]"/>
                {item.label}
              </li>
            ))}
          </ul>

          {/* Expanded detail section */}
          <div
            className="expand-body"
            style={{ maxHeight: isExpanded ? '700px' : '0px', opacity: isExpanded ? 1 : 0 }}
          >
            <div className="border-t border-[#31C4AC]/20 mx-5 mb-1"/>
            <ul className="space-y-4 px-5 py-4">
              {activeNode.items.map((item,i)=>(
                <li key={i}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#5FE3C8] mb-1">{item.label}</p>
                  <p className="text-xs leading-relaxed text-neutral-400">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* View More / View Less */}
          <div className="border-t border-[#31C4AC]/20 px-5 py-3 flex justify-end">
            {!isExpanded
              ? <button onClick={viewMore}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#31C4AC] hover:text-white transition-colors flex items-center gap-1.5">
                  View More <span className="text-[#31C4AC]">↓</span>
                </button>
              : <button onClick={viewLess}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#31C4AC] hover:text-white transition-colors flex items-center gap-1.5">
                  View Less <span>↑</span>
                </button>
            }
          </div>

          <div className="h-px bg-gradient-to-r from-[#31C4AC] via-[#5FE3C8] to-transparent"/>
        </div>
      )}

      {/* ── SVG ───────────────────────────────────────────────────────── */}
      <svg viewBox="0 0 1000 1200"
        className="w-full max-w-4xl mx-auto h-auto drop-shadow-[0_0_30px_rgba(49,196,172,0.45)]"
        fill="none"
        overflow="visible"
      >
        <defs>
          <filter id="fu" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="16" result="b1"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b2"/>
            <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fg" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fs" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fn" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Roots */}
        <g strokeWidth="4">
          <rect x="420" y="800" width="160" height="30" fill="#F9B45C"/>
          <rect x="400" y="810" width="20"  height="10" fill="#F9B45C"/>
          <rect x="580" y="810" width="20"  height="10" fill="#F9B45C"/>
          <g stroke="#E68A45">
            <path d="M440 830V950H380V1050"/><circle cx="380" cy="1050" r="8"  fill="#F9B45C" stroke="none"/>
            <path d="M460 830V900H420V1000"/><rect x="415" y="995" width="10" height="10" fill="#E68A45" stroke="none"/>
            <path d="M430 830V1020"/>        <circle cx="430" cy="1020" r="5"  fill="#F9B45C" stroke="none"/>
            <path d="M540 830V920H620V1020"/><circle cx="620" cy="1020" r="10" fill="#F9B45C" stroke="none"/>
            <path d="M560 830V880H590V960"/><rect x="585" y="955" width="10" height="10" fill="#F9B45C" stroke="none"/>
            <path d="M520 830V1080"/>        <rect x="515" y="1080" width="10" height="15" fill="#E68A45" stroke="none"/>
          </g>
        </g>

        {/* Trunk */}
        <g stroke="#31C4AC" strokeWidth="8">
          <path d="M470 800V450"/><path d="M500 800V400"/><path d="M530 800V450"/>
        </g>

        {/* Canopy */}
        <g stroke="#31C4AC" strokeWidth="5">
          <path d="M470 450H350V300H200V200"/>
          <path d="M350 450V380H250V280H120"/>
          <circle cx="120" cy="280" r="12" fill="#5FE3C8" stroke="none" filter="url(#fs)"/>
          <path d="M350 300V200H420V120"/>
          <path d="M470 520H280V420H150"/>
          <path d="M530 450H650V300H800V200"/>
          <path d="M650 450V380H750V280H880"/>
          <circle cx="880" cy="280" r="12" fill="#5FE3C8" stroke="none" filter="url(#fs)"/>
          <path d="M650 300V200H580V120"/>
          <path d="M530 520H720V420H850"/>
          <path d="M500 400H400V250H300V150"/>
          <circle cx="300" cy="150" r="10" fill="#5FE3C8" stroke="none"/>
          <path d="M500 400H600V250H700V150"/>
          <circle cx="700" cy="150" r="10" fill="#5FE3C8" stroke="none"/>
        </g>

        {/* Decorative nodes */}
        <g fill="#5FE3C8" stroke="none">
          <rect x="245" y="375" width="10" height="10"/>
          <circle cx="350" cy="380" r="6"/>
          <rect x="275" y="415" width="10" height="10"/>
          <rect x="745" y="375" width="10" height="10"/>
          <circle cx="650" cy="380" r="6"/>
          <rect x="715" y="415" width="10" height="10"/>
        </g>

        {/* Signal pulses */}
        {/* pulse circles — pointer-events:none so they never intercept mouse */}
        <g pointerEvents="none">
        <circle r="6" fill="#ffffff" filter="url(#fu)"><animateMotion dur="1.8s" begin="0s"   repeatCount="indefinite" path="M500 800V400"/></circle>
        <circle r="5" fill="#5FE3C8" filter="url(#fg)"><animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite" path="M470 800V450"/></circle>
        <circle r="5" fill="#5FE3C8" filter="url(#fg)"><animateMotion dur="2.0s" begin="1.4s" repeatCount="indefinite" path="M530 800V450"/></circle>
        <circle r="4" fill="#5FE3C8" filter="url(#fg)"><animateMotion dur="2.6s" begin="0.3s" repeatCount="indefinite" path="M470 450H350V300H200V200"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="2.6s" begin="1.5s" repeatCount="indefinite" path="M470 450H350V300H200V200"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="2.9s" begin="1.0s" repeatCount="indefinite" path="M350 450V380H250V280H120"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="1.9s" begin="0.5s" repeatCount="indefinite" path="M350 300V200H420V120"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="3.1s" begin="1.6s" repeatCount="indefinite" path="M470 520H280V420H150"/></circle>
        <circle r="4" fill="#5FE3C8" filter="url(#fg)"><animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite" path="M530 450H650V300H800V200"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="2.6s" begin="2.0s" repeatCount="indefinite" path="M530 450H650V300H800V200"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="2.9s" begin="0.2s" repeatCount="indefinite" path="M650 450V380H750V280H880"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="1.9s" begin="1.9s" repeatCount="indefinite" path="M650 300V200H580V120"/></circle>
        <circle r="3" fill="#31C4AC" filter="url(#fs)"><animateMotion dur="3.1s" begin="0.7s" repeatCount="indefinite" path="M530 520H720V420H850"/></circle>
        <circle r="3" fill="#5FE3C8" filter="url(#fs)"><animateMotion dur="2.4s" begin="1.1s" repeatCount="indefinite" path="M500 400H400V250H300V150"/></circle>
        <circle r="3" fill="#5FE3C8" filter="url(#fs)"><animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite" path="M500 400H600V250H700V150"/></circle>
        <circle r="4" fill="#F9B45C" filter="url(#fs)"><animateMotion dur="2.5s" begin="0s"   repeatCount="indefinite" path="M440 830V950H380V1050"/></circle>
        <circle r="3" fill="#E68A45" filter="url(#fs)"><animateMotion dur="2.0s" begin="0.9s" repeatCount="indefinite" path="M540 830V920H620V1020"/></circle>
        <circle r="3" fill="#F9B45C" filter="url(#fs)"><animateMotion dur="2.8s" begin="0.4s" repeatCount="indefinite" path="M520 830V1080"/></circle>
        <circle r="3" fill="#E68A45" filter="url(#fs)"><animateMotion dur="1.6s" begin="1.3s" repeatCount="indefinite" path="M460 830V900H420V1000"/></circle>
        <circle r="2" fill="#F9B45C" filter="url(#fs)"><animateMotion dur="2.3s" begin="0.6s" repeatCount="indefinite" path="M430 830V1020"/></circle>
        </g>

        {/* Interactive nodes */}
        {NODES.map(node=>{
          const isHover = hoverId===node.id || expandedId===node.id;
          const r  = node.r ?? 24;
          const cx = node.x, cy = node.y;
          const fill   = isHover ? '#ffffff' : '#5FE3C8';
          const filter = isHover ? 'url(#fn)' : 'url(#fs)';

          return (
            <g key={node.id}
              onMouseEnter={()=>onNodeEnter(node.id)}
              onMouseLeave={onNodeLeave}
              style={{cursor:'crosshair'}}
            >
              {node.shape==='c'
                ? <circle cx={cx} cy={cy} r={r+20} fill="transparent"/>
                : <rect x={cx-RH-14} y={cy-RH-14} width={(RH+14)*2} height={(RH+14)*2} fill="transparent"/>
              }
              {isHover && (node.shape==='c'
                ? <><circle cx={cx} cy={cy} r={r+18} fill="none" stroke="#31C4AC" strokeWidth="1" opacity="0.2"/>
                     <circle cx={cx} cy={cy} r={r+10} fill="none" stroke="#5FE3C8" strokeWidth="1.5" opacity="0.4"/></>
                : <><rect x={cx-RH-14} y={cy-RH-14} width={(RH+14)*2} height={(RH+14)*2} fill="none" stroke="#31C4AC" strokeWidth="1" opacity="0.25"/>
                     <rect x={cx-RH-7}  y={cy-RH-7}  width={(RH+7)*2}  height={(RH+7)*2}  fill="none" stroke="#5FE3C8" strokeWidth="1.5" opacity="0.4"/></>
              )}
              {node.shape==='c'
                ? <circle cx={cx} cy={cy} r={r} fill={fill} filter={filter} stroke="none"/>
                : <rect x={cx-RH} y={cy-RH} width={RH*2} height={RH*2} fill={fill} filter={filter} stroke="none"/>
              }
              <g transform={`translate(${cx},${cy})`} stroke={isHover?'#051a16':'#041210'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d={ICON[node.icon]}/>
              </g>

              {/* Persistent Text Label */}
              <text
                transform={`translate(${cx}, ${cy})`}
                x={node.side === 'L' ? -(r + 20) : r + 20}
                y="1"
                fill={isHover ? '#ffffff' : '#5FE3C8'}
                fontSize="12"
                fontWeight="700"
                textAnchor={node.side === 'L' ? 'end' : 'start'}
                dominantBaseline="middle"
                className="uppercase tracking-[0.2em] pointer-events-none transition-colors duration-300"
                style={{ textShadow: '0 0 10px rgba(49,196,172,0.3)' }}
                opacity={isHover ? 1 : 0.65}
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-neutral-600">
        Hover a node · Click <span className="text-[#31C4AC]">View More</span> to expand
      </p>
    </div>
  );
}
