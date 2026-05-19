export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Chandril Das. All rights reserved.</p>
        <p className="mt-2 text-xs uppercase tracking-widest">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
