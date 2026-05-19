export default function Projects() {
  const placeholderProjects = [
    { title: 'FinanceX', desc: 'A FinTech dashboard integrating real-time market data.', url: '#' },
    { title: 'Wanderlust', desc: 'Travel planning platform with dynamic itineraries.', url: '#' },
    { title: 'AURA', desc: 'Generative AI application for image synthesis.', url: '#' },
  ];

  return (
    <section id="projects" className="relative z-10 bg-black border-t border-white/10 px-6 py-24">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-12 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
          Selected Works
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placeholderProjects.map((project, idx) => (
            <div key={idx} className="group relative border border-white/10 bg-black p-8 transition-colors hover:border-white/40">
              <div className="mb-8 aspect-video w-full bg-white/5" />
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{project.desc}</p>
              <a
                href={project.url}
                className="mt-6 inline-flex items-center text-sm font-bold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                VIEW PROJECT
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
