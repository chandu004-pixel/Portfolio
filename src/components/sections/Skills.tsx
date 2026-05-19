import CircuitTree from '@/components/3d/CircuitTree';

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 bg-black border-t border-white/10 px-6 py-24">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
          Capabilities
        </h2>
        <p className="mb-16 text-xs font-medium uppercase tracking-[0.2em] text-neutral-600">
          Circuit map — hover a node
        </p>
        <CircuitTree />
      </div>
    </section>
  );
}
