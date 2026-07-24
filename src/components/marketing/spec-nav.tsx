'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
];

const sectionIds = ['features', 'pricing'];

export function SpecNav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <header className="sticky top-0 z-20 glass-nav">
      <div className="flex max-w-7xl mx-auto items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'} role="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{ color: 'rgb(255, 255, 255)', width: '24px', height: '24px' }}>
            <path fill="#b4a4ef" d="M4.979 9.685C2.993 8.891 2 8.494 2 8s.993-.89 2.979-1.685l2.808-1.123C9.773 4.397 10.767 4 12 4s2.227.397 4.213 1.192l2.808 1.123C21.007 7.109 22 7.506 22 8s-.993.89-2.979 1.685l-2.808 1.124C14.227 11.603 13.233 12 12 12s-2.227-.397-4.213-1.191z" />
            <path fill="#b4a4ef" fillRule="evenodd" d="M2 8c0 .494.993.89 2.979 1.685l2.808 1.124C9.773 11.603 10.767 12 12 12s2.227-.397 4.213-1.191l2.808-1.124C21.007 8.891 22 8.494 22 8s-.993-.89-2.979-1.685l-2.808-1.123C14.227 4.397 13.233 4 12 4s-2.227.397-4.213 1.192L4.98 6.315C2.993 7.109 2 7.506 2 8" clipRule="evenodd" />
            <path fill="#b4a4ef" d="m5.766 10l-.787.315C2.993 11.109 2 11.507 2 12s.993.89 2.979 1.685l2.808 1.124C9.773 15.603 10.767 16 12 16s2.227-.397 4.213-1.191l2.808-1.124C21.007 12.891 22 12.493 22 12s-.993-.89-2.979-1.685L18.234 10l-2.021.809C14.227 11.603 13.233 12 12 12s-2.227-.397-4.213-1.191z" opacity=".7" />
            <path fill="#b4a4ef" d="m5.766 14l-.787.315C2.993 15.109 2 15.507 2 16s.993.89 2.979 1.685l2.808 1.124C9.773 19.603 10.767 20 12 20s2.227-.397 4.213-1.192l2.808-1.123C21.007 16.891 22 16.494 22 16c0-.493-.993-.89-2.979-1.685L18.234 14l-2.021.809C14.227 15.603 13.233 16 12 16s-2.227-.397-4.213-1.191z" opacity=".4" />
          </svg>
          <Link href="/" className="font-medium text-white">Veriflow</Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isSection = link.href.startsWith('#');
            const isActive = isSection && activeSection === link.href.slice(1);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors duration-200 nav-link relative ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-3 ml-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 hover:bg-white/5 transition-colors text-sm text-zinc-300 border border-zinc-700 rounded-full px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 transition-all text-sm text-white bg-accent rounded-full px-5 py-2 font-medium hover:brightness-110"
            >
              Sign up
            </Link>
          </div>
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden rounded-lg p-2 text-zinc-200 hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <aside
        className={`fixed z-50 bg-slate-950/95 w-[80%] max-w-sm border-l border-white/10 px-6 py-6 top-0 right-0 bottom-0 backdrop-blur transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Veriflow</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-zinc-200 hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <ul className="mt-6 space-y-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2 text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block text-center rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="block text-center rounded-xl bg-accent px-4 py-2 text-sm text-white font-medium hover:brightness-110 transition-all"
          >
            Sign up
          </Link>
        </div>
      </aside>

      <style jsx>{`
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          top: 100%;
          width: 0;
          height: 2px;
          background: #7458db;
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
}
