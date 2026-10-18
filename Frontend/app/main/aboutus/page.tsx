"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";

const focusAreas = [
	{
		number: "01",
		title: "Ideas worth keeping",
		text: "Long-form thinking, useful explainers, and the small details that make a story stay with you.",
		color: "bg-indigo-100 text-indigo-700",
	},
	{
		number: "02",
		title: "People behind the work",
		text: "A place for writers to share what they know, what they are learning, and what they are still figuring out.",
		color: "bg-amber-100 text-amber-700",
	},
	{
		number: "03",
		title: "Conversations with range",
		text: "Technology, culture, craft, and everyday observations can all belong on the same thoughtful homepage.",
		color: "bg-emerald-100 text-emerald-700",
	},
];

const topics = ["anime stories", "character analyses", "fan theories", "reviews"];

export default function AboutUs() {
	const [topicIndex, setTopicIndex] = useState(0);
	const [readers, setReaders] = useState(0);
	const [access, setAccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setAccess(localStorage.getItem("accessToken"));
		setLoading(false);

		const topicTimer = window.setInterval(() => {
			setTopicIndex((current) => (current + 1) % topics.length);
		}, 2600);

		const readerTimer = window.setInterval(() => {
			setReaders((current) => {
				if (current >= 1248) {
					window.clearInterval(readerTimer);
					return 1248;
				}

				return current + 24;
			});
		}, 35);

		return () => {
			window.clearInterval(topicTimer);
			window.clearInterval(readerTimer);
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#0b0d24] font-['Trebuchet_MS','Segoe_UI',system-ui,sans-serif] text-slate-100 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
			

			<main>
				<section className="relative overflow-hidden border-b-4 border-pink-500 bg-[linear-gradient(135deg,#1b1450_0%,#2a1466_50%,#4a1d78_100%)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:[background-image:repeating-conic-gradient(from_0deg_at_78%_50%,rgba(255,255,255,0.07)_0deg_1.5deg,transparent_1.5deg_9deg)]">
					<div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-12 lg:py-28">
						<div>
							<p className="mb-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.28em] text-pink-300">
								<span className="h-0.5 w-10 bg-[linear-gradient(90deg,#f472b6,#22d3ee)]" />
								About AnimeHub
							</p>
							<h1 className="max-w-3xl text-5xl font-black italic leading-[1] tracking-tight text-white drop-shadow-[3px_3px_0_#ec4899] sm:text-7xl">
								A home for anime stories, characters, and worlds that deserve a little more time.
							</h1>
							<p className="mt-8 max-w-xl text-lg leading-8 text-indigo-100/90 sm:text-xl">
								AnimeHub is an independent space for anime enthusiasts to explore, discuss, and share their love for Japanese animation. We believe anime is more than just entertainment—it’s a world of unforgettable stories, compelling characters, and meaningful perspectives that inspire us long after the screen fades to black.
							</p>
							<div className="mt-10 flex flex-col gap-3 sm:flex-row">
								{!access ? (
									<Link
										href="/register"
										className="inline-flex items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-7 py-3 font-bold text-white shadow-[4px_4px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
									>
										Join the community
										<span className="ml-2" aria-hidden="true">-&gt;</span>
									</Link>
								) : (
									<Link
										href="/main/profile"
										className="inline-flex items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-7 py-3 font-bold text-white shadow-[4px_4px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
									>
										View Profile
										<span className="ml-2" aria-hidden="true">-&gt;</span>
									</Link>
								)}
								<Link
									href="/"
									className="inline-flex items-center justify-center rounded-full border-2 border-cyan-300 bg-slate-950/30 px-7 py-3 font-bold text-cyan-200 backdrop-blur transition hover:bg-cyan-300/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
								>
									Explore anime stories
								</Link>
							</div>
						</div>

						<div className="relative mx-auto w-full max-w-md lg:mr-0">
							<div className="absolute -right-4 -top-5 h-28 w-28 rounded-full bg-pink-500/60 blur-3xl" />
							<div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-cyan-400/50 blur-3xl" />
							<div className="relative rotate-2 border-4 border-white bg-slate-900 p-3 shadow-[10px_10px_0_#ec4899]">
								<div className="flex aspect-4/5 flex-col justify-between border-2 border-cyan-300 bg-[linear-gradient(160deg,#241a5e_0%,#6d28d9_100%)] p-7 text-white sm:p-10">
									<div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">
										<span>Issue 01</span>
										<span className="text-pink-300">2026</span>
									</div>
									<div>
										<p className="mb-4 text-sm font-bold text-pink-200">The thoughtful internet</p>
										<p className="text-5xl font-black italic leading-[0.95] tracking-tight drop-shadow-[3px_3px_0_#ec4899] sm:text-6xl">Make room for better questions.</p>
									</div>
									<div className="flex items-end justify-between border-t-2 border-dashed border-pink-400/60 pt-4 text-xs text-indigo-200">
										<span>Stories / Reviews / Notes</span>
										<span className="text-2xl text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]">✳</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="border-b-2 border-violet-500/40 bg-[linear-gradient(180deg,#12143a_0%,#191349_100%)]">
					<div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-20">
						<div className="border-l-4 border-cyan-300 pl-4">
							<p className="text-sm font-extrabold uppercase tracking-[0.2em] text-cyan-300">Why we exist</p>
							<h2 className="mt-4 max-w-sm text-3xl font-black tracking-tight text-white sm:text-4xl">Less noise. More signal.</h2>
						</div>
						<div className="max-w-2xl text-lg leading-8 text-indigo-200">
							<p>Anime moves fast. The stories that stay with us deserve more than a passing glance. AnimeHub was built for the space between episodes and endless scrolling—a place where fans can dive deeper into their favorite worlds, explore character journeys, share theories, and discover perspectives that make every anime experience more meaningful.</p>
							<p className="mt-5">Whether you're sharing a thoughtful anime review, an in-depth character analysis, a fan theory, or a personal reflection on a story that moved you, there's room on AnimeHub for every unique perspective..</p>
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
					<div className="grid gap-5 md:grid-cols-3">
						{focusAreas.map((area) => (
							<article key={area.number} className="group rounded-xl border-2 border-violet-500/50 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] p-6 shadow-[5px_5px_0_rgba(139,92,246,0.45)] transition duration-200 hover:-translate-y-1 hover:border-pink-400 hover:shadow-[7px_7px_0_#ec4899]">
								<div className="flex items-start justify-between gap-4">
									<span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white/80 ring-offset-2 ring-offset-[#12143a] ${area.color}`}>
										{area.number}
									</span>
									<span className="text-3xl text-violet-400/60 transition-colors group-hover:text-pink-300" aria-hidden="true">↗</span>
								</div>
								<h3 className="mt-10 text-2xl font-black tracking-tight text-white transition-colors group-hover:text-pink-300">{area.title}</h3>
								<p className="mt-4 leading-7 text-indigo-200">{area.text}</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-y-4 border-violet-500/50 bg-[#080a1c] text-white">
					<div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:px-12 lg:py-20">
						<div>
							<p className="text-sm font-extrabold uppercase tracking-[0.2em] text-cyan-300">Always exploring</p>
							<h2 className="mt-5 max-w-2xl text-4xl font-black italic leading-tight tracking-tight sm:text-6xl">
								We are thinking about <span className="text-yellow-300 drop-shadow-[2px_2px_0_#ec4899]">{topics[topicIndex]}.</span>
							</h2>
							<p className="mt-6 max-w-xl leading-7 text-indigo-200">The anime world is always evolving, and every fan has a story to tell. Follow the conversations, share your voice, and discover new perspectives that bring us closer to the worlds and characters we love. On AnimeHub, the next great discussion is always just around the corner.
                             </p>
						</div>
						<div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl border-2 border-violet-500/60 bg-violet-500/60 shadow-[6px_6px_0_rgba(139,92,246,0.4)]">
							<div className="bg-[#12143a] p-6 sm:p-8">
								<p className="text-4xl font-black text-yellow-300">{readers.toLocaleString()}+</p>
								<p className="mt-2 text-sm text-indigo-300">curious readers</p>
							</div>
							<div className="bg-[#12143a] p-6 sm:p-8">
								<p className="text-4xl font-black text-cyan-300">24/7</p>
								<p className="mt-2 text-sm text-indigo-300">room for ideas</p>
							</div>
							<div className="col-span-2 bg-[#12143a] p-6 sm:p-8">
								<p className="border-l-4 border-pink-500 pl-4 text-sm font-semibold italic leading-6 text-indigo-100">“Great anime stories don't just entertain you. They give you new worlds to explore, characters to understand, and ideas that stay with you long after the credits roll.”</p>
							</div>
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden border-t-4 border-white bg-[linear-gradient(145deg,#ec4899_0%,#8b5cf6_100%)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:[background-image:repeating-conic-gradient(from_0deg_at_100%_0%,rgba(255,255,255,0.12)_0deg_2deg,transparent_2deg_12deg)]">
					<div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-16">
						<div>
							<p className="text-sm font-extrabold uppercase tracking-[0.2em] text-yellow-200">Your turn</p>
							<h2 className="mt-3 max-w-2xl text-4xl font-black italic tracking-tight text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.35)] sm:text-5xl">Bring the idea you have been carrying around.</h2>
						</div>
						<Link href="/register" className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-slate-950 bg-yellow-300 px-7 py-4 font-black text-slate-950 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-yellow-200 hover:shadow-[6px_6px_0_#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
							Start writing <span className="ml-2" aria-hidden="true">-&gt;</span>
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
