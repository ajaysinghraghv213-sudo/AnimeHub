
    
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "./loading";
const SECTIONS = [
  {
    id: "respect",
    title: "Be Respectful to Everyone",
    blocks: [
      {
        ul: [
          "Treat every member with kindness and respect.",
          "Respect different opinions about anime, characters, storylines, and genres.",
          "Disagreements are fine, but personal attacks, harassment, bullying, and threats are not.",
          "Do not target users based on their identity, background, or personal characteristics.",
        ],
      },
    ],
  },
  {
    id: "content",
    title: "Share Anime Content Responsibly",
    blocks: [
      {
        ul: [
          "Share anime-related images, videos, edits, fan art, and discussions that contribute to the community.",
          "Do not upload illegal content, malicious files, or content that violates another person's rights.",
          "Give credit to the original artist or creator whenever possible.",
          "Do not claim someone else's artwork or edits as your own.",
          "Avoid repeatedly posting the same content or flooding the feed with spam.",
        ],
      },
    ],
  },
  {
    id: "copyright",
    title: "Follow Copyright Rules",
    blocks: [
      {
        ul: [
          "Only upload content you own or have permission to share, or content you are otherwise legally allowed to use.",
          "Credit is appreciated, but credit alone does not grant permission to use copyrighted work.",
          "Do not distribute pirated episodes, unauthorized downloads, or other infringing material.",
          "If you believe your content has been used without authorization, contact the AnimeHub moderation team.",
        ],
      },
    ],
  },
  {
    id: "spoilers",
    title: "Use Spoiler Warnings",
    blocks: [
      {
        ul: [
          "Use spoiler warnings when discussing major plot twists, character deaths, endings, or important story reveals.",
          "Avoid putting major spoilers directly in post titles or preview text.",
          "Respect fans who are watching a series for the first time.",
          "When possible, mention the anime and episode or chapter relevant to the spoiler.",
        ],
      },
    ],
  },
  {
    id: "discussions",
    title: "Keep Comments and Discussions Healthy",
    blocks: [
      {
        ul: [
          "Keep comments relevant to the post or discussion.",
          "Do not post hate speech, threats, abusive language, or deliberately provocative content intended to harass others.",
          "Do not manipulate discussions with fake accounts or coordinated spam.",
          "Healthy debates about anime are welcome; attacking other fans is not.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "Respect Privacy in Chats",
    blocks: [
      {
        ul: [
          "Do not share another user's private messages, personal information, or private images without permission.",
          "Do not use direct messages to harass, threaten, spam, or exploit other members.",
          "Never pressure someone to reveal their real name, address, passwords, or other sensitive information.",
          "Block or report users who make you uncomfortable.",
        ],
      },
    ],
  },
  {
    id: "profile",
    title: "Keep Your Profile Authentic",
    blocks: [
      {
        ul: [
          "Choose a username and profile picture that do not impersonate another person.",
          "Do not pretend to be an official anime studio, artist, celebrity, or another user.",
          "Do not use your profile to advertise scams, spread malicious links, or repeatedly promote unrelated services.",
        ],
      },
    ],
  },
  {
    id: "spam",
    title: "No Spam, Scams, or Malicious Links",
    blocks: [
      {
        ul: [
          "Do not flood posts, comments, or chats with repetitive messages.",
          "Do not distribute phishing links, malware, fraudulent offers, or deceptive promotions.",
          "Do not attempt to access another user's account or interfere with the platform's security.",
          "Respect other members' time and attention.",
        ],
      },
    ],
  },
  {
    id: "report",
    title: "Report Problems",
    blocks: [
      {
        p: "If you encounter harassment, impersonation, stolen content, spam, or other guideline violations, use the available reporting tools or contact the AnimeHub moderation team.",
      },
      {
        p: "Please do not retaliate against users who violate these guidelines. Report the issue and let the moderation team review it.",
      },
    ],
  },
  {
    id: "enforcement",
    title: "Moderation and Enforcement",
    blocks: [
      {
        p: "AnimeHub may review reported content and take appropriate action when these guidelines are violated. Depending on the severity and frequency of the violation, actions may include:",
      },
      {
        ladder: [
          "Removing posts, comments, or other content.",
          "Issuing a warning.",
          "Restricting certain account features.",
          "Temporarily suspending an account.",
          "Permanently banning an account for serious or repeated violations.",
        ],
      },
      {
        p: "Severe misconduct may result in immediate action. Users may contact the moderation team to appeal a moderation decision where an appeal process is available.",
      },
    ],
  },
  {
    id: "community",
    title: "Help Us Build a Better Anime Community",
    blocks: [
      {
        p: "AnimeHub belongs to everyone who contributes positively to it. Share your creativity, support other creators, discover new anime, and make meaningful connections.",
      },
    ],
  },
];

export default function GuidelinesPage() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [loading, setLoading] = useState(true);

  // Highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
      <main className="min-h-screen bg-slate-950 text-slate-300 selection:bg-violet-500/40 selection:text-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-violet-500/20">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="mb-4 text-sm font-medium text-cyan-300">
            Community Guidelines
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              AnimeHub
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            A place where anime fans connect, create, and share their passion.
            AnimeHub is a community for anime lovers to share fan art, post
            edits, discuss their favorite characters, discover new series, and
            connect with fellow fans. To keep our community enjoyable, safe,
            and respectful, please follow these guidelines.
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-12 px-5 py-10 sm:px-8 lg:py-16">
        {/* Desktop table of contents */}
        <aside className="sticky top-8 hidden h-fit w-64 shrink-0 lg:block">
          <nav aria-label="Guidelines sections">
            <ul className="space-y-1 border-l border-slate-800">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors focus:outline-none focus-visible:text-cyan-300 ${
                      active === s.id
                        ? "border-cyan-400 font-medium text-white"
                        : "border-transparent text-slate-500 hover:border-violet-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="mr-2 tabular-nums text-slate-600">
                      {i + 1}.
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
     
        <div className="min-w-0 flex-1">
          {/* Mobile section chips */}
          <nav
            aria-label="Guidelines sections"
            className="sticky top-0 z-10 -mx-5 mb-8 overflow-x-auto border-b border-slate-800 bg-slate-950/90 px-5 py-3 backdrop-blur lg:hidden"
          >
            <ul className="flex gap-2">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    className={`block rounded-full border px-3 py-1 text-xs transition-colors ${
                      active === s.id
                        ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200"
                        : "border-slate-700 text-slate-400"
                    }`}
                  >
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="space-y-14">
            {SECTIONS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-20 lg:scroll-mt-10"
              >
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="bg-gradient-to-b from-violet-400 to-cyan-300 bg-clip-text text-3xl font-black tabular-nums text-transparent sm:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {s.title}
                  </h2>
                </div>

                <div className="space-y-4 rounded-2xl border border-violet-500/15 bg-slate-900/60 p-5 sm:p-7">
                  {s.blocks.map((b, j) => {
                    if (b.p)
                      return (
                        <p
                          key={j}
                          className="max-w-prose leading-relaxed text-slate-300"
                        >
                          {b.p}
                        </p>
                      );
                    if (b.ul)
                      return (
                        <ul key={j} className="space-y-3">
                          {b.ul.map((item) => (
                            <li
                              key={item}
                              className="flex max-w-prose gap-3 leading-relaxed"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-cyan-400"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    // Escalating enforcement steps (a real sequence, so they are numbered)
                    return (
                      <ol key={j} className="space-y-2">
                        {b.ladder.map((item, k) => (
                          <li
                            key={item}
                            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                            style={{ marginLeft: `${k * 0.5}rem` }}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">
                              {k + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Closing */}
          <footer className="mt-16 rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-violet-600/20 via-slate-900 to-cyan-500/15 p-8 text-center sm:p-12">
            <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Create. Connect. Respect. Celebrate Anime.
            </p>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
              By using AnimeHub, you agree to follow these Community Guidelines
              and any applicable Terms of Service. These guidelines may be
              updated as the community grows.
            </p>
            <Link
              href="/main/posts"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Browse posts
            </Link>
          </footer>
        </div>
      </div>
    </main>
     )}
    </>
  );
}