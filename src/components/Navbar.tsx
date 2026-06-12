import { useState, useEffect } from 'react';
import { Brain, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#overview', label: 'Overview' },
  { href: '#demo', label: 'Demo' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#tech', label: 'Tech Stack' },
  { href: '#results', label: 'Results' },
  { href: '#code', label: 'Code' },
  { href: '#timeline', label: 'Timeline' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              DeepEnhance
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-white px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-400 hover:text-white px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
