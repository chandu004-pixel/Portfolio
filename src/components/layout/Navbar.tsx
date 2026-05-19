import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white">
          CHANDRIL_DAS
        </Link>
        <div className="flex gap-6 text-sm font-medium text-neutral-400">
          <Link href="#experience" className="hover:text-white transition-colors">
            EXPERIENCE
          </Link>
          <Link href="#projects" className="hover:text-white transition-colors">
            PROJECTS
          </Link>
          <Link href="#skills" className="hover:text-white transition-colors">
            SKILLS
          </Link>
        </div>
      </div>
    </nav>
  );
}
