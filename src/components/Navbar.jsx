import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo.jsx";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-x-0 border-t-0">
      <nav className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
        <a href="#top" aria-label="TrackNexa home"><Logo /></a>
        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          {links.map((l) => (
            <li key={l.href}><a href={l.href} className="hover:text-white transition">{l.label}</a></li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white px-3 py-2">Log in</Link>
          <Link to="/login" className="text-sm font-semibold bg-electric-500 hover:bg-electric-600 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-electric-500/25">
            Start Tracking
          </Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-white/10 px-5 py-4 space-y-3 bg-navy-900">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white">{l.label}</a>
          ))}
          <Link to="/login" className="block text-center font-semibold bg-electric-500 text-white px-4 py-2 rounded-lg">Start Tracking</Link>
        </div>
      )}
    </header>
  );
}
