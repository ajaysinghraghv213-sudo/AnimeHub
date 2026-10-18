'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Check, Globe, Heart, Mail, MessageCircle, Rss, Send } from 'lucide-react';
import { FaInstagram } from "react-icons/fa";
import GetNewUpdates from '../function/getnewupdates';
/* ---------- Editable data ---------- */
const BRAND = 'AnimeHub';
const TAGLINE = 'Your home for anime articles, theories, reviews and fan stories.';

const TICKER = ['Anime', 'Manga', 'Reviews', 'Theories', 'Fan Art', 'Community', 'Discussions'];

const LINK_GROUPS = [
    {
        title: 'Explore',
        links: [
            { label: 'Home', href: '/' },
            { label: 'All Posts', href: '/main/posts' },
            { label: 'Create Post', href: '/main/createpost' },
            { label: 'Featured', href: '/main/posts?featured=true' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'About Us', href: '/main/aboutus' },
            { label: 'Guidelines', href: '/main/guidelines' },
            { label: 'Contact', href: '/main/contactus' },
            { label: 'Help Center', href: '/main/help' },
        ],
    },
];

const SOCIALS = [
    { label: 'Discord', href: 'https://discord.gg/7c2vxxqff', icon: MessageCircle },
    { label: 'Instagram', href: 'https://www.instagram.com/animehub12392?rpxt=MTU0NDF6OW93ZnFleA==', icon: FaInstagram },
    { label: 'Email us', href: 'mailto:ajaysinghraghv213@gmail.com', icon: Mail },
];

const LEGAL = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/main/termsandservices' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Footer() {
    const year = new Date().getFullYear();

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [showTop, setShowTop] = useState(false);
    const [visible, setVisible] = useState(false);
    const footerRef = useRef<HTMLElement>(null);

    /* Back-to-top visibility */
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Reveal animation when the footer enters the viewport */
    useEffect(() => {
        const el = footerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0, rootMargin: '0px 0px 80px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault();
        const data = await GetNewUpdates({ email });
        if (!data.success) {
            setStatus('error');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setStatus('error');
            return;
        }
        setStatus('loading');
        try {
            // TODO: replace with your real API call, e.g.
            // await fetch('https://animehub-2-i11e.onrender.com/api/newsletter/', { method: 'POST', ... })
            await new Promise((r) => setTimeout(r, 800));
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 4000);
        } catch {
            setStatus('error');
        }
    };

    const reveal = (delay: number) => ({
        style: { animationDelay: `${delay}ms` },
        className: `footer-reveal${visible ? ' is-visible' : ''}`,
    });

    return (
        <footer
            ref={footerRef}
            className="relative  overflow-hidden border-t-4 border-violet-500 bg-[linear-gradient(180deg,#12143a_0%,#0b0c24_100%)] text-indigo-200"
        >
            {/* Ticker */}
            <div className="overflow-hidden border-b border-violet-500/40 bg-yellow-300 py-1.5 text-slate-950 sm:py-2" aria-hidden="true">
                <div className="footer-marquee-track flex w-max whitespace-nowrap">
                    {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((word, i) => (
                        <span key={i} className="mx-3 text-xs font-black uppercase sm:mx-4 sm:text-sm">
                            {word} <span className="ml-8 text-pink-600">✦</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="mx-auto max-w-7xl px-4 py-9 sm:px-8 sm:py-14 lg:px-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12">
                    {/* Brand */}
                    <div {...reveal(0)} className={`${reveal(0).className} lg:col-span-4`}>
                        <Link href="/" className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                            <span className="inline-block -skew-x-12 bg-pink-500 px-3 py-1 text-2xl font-black uppercase tracking-tight text-white shadow-[4px_4px_0_#8b5cf6]">
                                {BRAND}
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-indigo-300">{TAGLINE}</p>

                        <ul className="mt-6 flex gap-3">
                            {SOCIALS.map(({ label, href, icon: Icon }) => {
                                const external = href.startsWith('http');
                                return (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            aria-label={label}
                                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                            className="flex size-11 items-center justify-center rounded-lg border-2 border-violet-400/50 bg-violet-500/10 text-violet-200 transition duration-150 hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-500/20 hover:text-pink-200 hover:shadow-[3px_3px_0_#ec4899] active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                        >
                                            <Icon className="size-5" />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Link groups */}
                    {LINK_GROUPS.map((group, gi) => (
                        <nav
                            key={group.title}
                            aria-label={group.title}
                            {...reveal(120 + gi * 100)}
                            className={`${reveal(120 + gi * 100).className} lg:col-span-2`}
                        >
                            <h3 className="mb-4 w-fit -skew-x-12 bg-violet-500/30 px-2 py-0.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                                {group.title}
                            </h3>
                            <ul className="space-y-1">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                        >
                                            <span className="h-0.5 w-0 bg-pink-400 transition-all duration-200 group-hover:w-3" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}

                    {/* Newsletter */}
                    <div {...reveal(320)} className={`${reveal(320).className} sm:col-span-2 lg:col-span-4`}>
                        <h3 className="mb-4 w-fit -skew-x-12 bg-violet-500/30 px-2 py-0.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                            Join the club
                        </h3>
                        <p className="mb-4 text-sm text-indigo-300">Get the best posts and new releases in your inbox. No spam, promise.</p>

                        <form onSubmit={handleSubscribe} noValidate className="flex flex-col gap-2 sm:flex-row">
                            <label htmlFor="footer-email" className="sr-only">Email address</label>
                            <input
                                id="footer-email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === 'error') setStatus('idle');
                                }}
                                placeholder="you@example.com"
                                aria-invalid={status === 'error'}
                                className={`min-h-11 w-full min-w-0 rounded-lg border-2 bg-slate-950/60 px-3 text-base text-white placeholder:text-indigo-400/60 transition focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:text-sm ${
                                    status === 'error' ? 'border-red-400' : 'border-violet-400/50 focus:border-cyan-300'
                                }`}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-lg border-2 border-pink-400 bg-pink-500 px-4 text-sm font-bold text-white shadow-[3px_3px_0_#8b5cf6] transition duration-150 hover:bg-pink-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                            >
                                {status === 'success' ? <Check className="size-4" /> : <Send className="size-4" />}
                                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Joined!' : 'Subscribe'}
                            </button>
                        </form>

                        <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs font-semibold">
                            {status === 'error' && <span className="text-red-300">Please enter a valid email address.</span>}
                            {status === 'success' && <span className="text-emerald-300">You&apos;re in! Check your inbox soon.</span>}
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-9 flex flex-col items-center justify-between gap-4 border-t border-violet-400/30 pt-5 text-xs sm:mt-12 sm:flex-row sm:pt-6">
                    <p className="flex flex-wrap items-center justify-center gap-1 text-center text-indigo-300">
                        <span suppressHydrationWarning>© {year} {BRAND}.</span>
                        <span className="inline-flex items-center gap-1">
                            Made with <Heart className="size-3.5 animate-pulse fill-pink-400 text-pink-400" /> for anime fans.
                        </span>
                    </p>
                    <ul className="flex gap-5">
                        {LEGAL.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="font-semibold text-indigo-300 transition hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Back to top */}
            <button
                type="button"
                aria-label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-5 right-5 z-40 flex size-12 touch-manipulation items-center justify-center rounded-full border-2 border-cyan-300 bg-[#12143a] text-cyan-200 shadow-[3px_3px_0_#22d3ee] transition duration-300 hover:bg-cyan-400/20 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 ${
                    showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                }`}
            >
                <ArrowUp className="size-5" />
            </button>
        </footer>
    );
}