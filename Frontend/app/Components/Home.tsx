import Link from "next/link";
import {recentPosts} from '../function/recentposts';
import RecentpostComponent from './RecentpostComponent';
import FeaturedPosts from "./FeaturedPosts";
import HomeCategories from "./HomeCategories";
import Footer from "./Footer";
import RegisterCTA from "./RegisterCTA";


export default function Home() {
	return (
		<div className="min-h-screen bg-[#0b0d24] font-['Trebuchet_MS','Segoe_UI',system-ui,sans-serif] text-slate-100 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] bg-size-[22px_22px]">
			<main>
				<section className="group/hero relative isolate min-h-[min(520px,calc(100svh-4rem))] overflow-hidden border-b border-white/15 bg-slate-950 sm:min-h-[min(660px,calc(100svh-4rem))]">
					<video
						aria-hidden="true"
						autoPlay
						muted
						loop
						playsInline
						preload="metadata"
						className="absolute inset-0 size-full object-cover object-[58%_center] transition-transform duration-12000 ease-out motion-safe:group-hover/hero:scale-105 sm:object-center"
					>
						<source src="/videos/gojo3.mp4" type="video/mp4" />
					</video>
					<div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,20,0.94)_0%,rgba(8,9,29,0.79)_48%,rgba(10,10,30,0.35)_100%)]" />
					<div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#0b0d24_0%,transparent_32%,rgba(9,8,27,0.08)_70%,rgba(5,7,20,0.3)_100%)]" />
					<div className="relative z-20 mx-auto flex min-h-[min(520px,calc(100svh-4rem))] max-w-7xl items-center px-5 py-12 sm:min-h-[min(660px,calc(100svh-4rem))] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
						<div className="max-w-4xl animate-card-in motion-reduce:animate-none">
							<p className="mb-4 flex items-center gap-3 text-xs font-extrabold uppercase text-pink-200 sm:mb-6 sm:text-sm">
								<span className="h-0.5 w-12 bg-[linear-gradient(90deg,#f472b6,#22d3ee)]" />
								Your daily reading room
							</p>
							<h1 className="max-w-4xl text-4xl font-black italic leading-none text-white drop-shadow-[2px_2px_0_#ec4899] sm:text-6xl sm:drop-shadow-[3px_3px_0_#ec4899] lg:text-7xl">
								Ideas to read, people to meet, stories to share.
							</h1>
							<p className="mt-4 max-w-2xl border-l-2 border-cyan-300/70 pl-4 text-sm leading-6 text-white/90 sm:mt-8 sm:text-lg sm:leading-8">
								Discover thoughtful articles and honest posts from a growing community of curious writers.
							</p>
							<div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center">
								<RegisterCTA />
								<Link href="/main/aboutus" className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-200/70 bg-slate-950/40 px-7 py-3 font-bold text-cyan-100 backdrop-blur-md transition hover:border-cyan-100 hover:bg-cyan-300/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
									About ArticleHub
								</Link>
							</div>
						</div>

						
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
					<div className="mb-6 flex flex-col justify-between gap-3 border-l-2 border-pink-500 pl-3 sm:mb-8 sm:flex-row sm:items-end sm:gap-4 sm:border-l-4 sm:pl-4">
						<div>
							<p className="text-sm font-extrabold uppercase tracking-[0.2em] text-pink-300">Editor&apos;s picks</p>
							<h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Worth your attention</h2>
						</div>
						<Link href="/main/posts" className="font-bold text-cyan-300 transition hover:text-pink-300">View all articles -&gt;</Link>
					</div>

					
						<FeaturedPosts />
					
				</section>

				<section className="border-y border-violet-500/30 bg-[linear-gradient(180deg,#12143a_0%,#191349_100%)]">
					<div className="mx-auto max-w-7xl px-4 py-9 sm:px-8 sm:py-12 lg:px-12">
						<div>
							<h2 className="mb-4 border-l-2 border-cyan-300 pl-3 text-xl font-bold text-white sm:border-l-4 sm:text-2xl">
								Categories
							</h2>
							<HomeCategories />
						</div>
					</div>
				</section>

				<section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-12 lg:py-20">
					<div>
						<div className="flex items-end justify-between gap-4">
							<div className="border-l-4 border-pink-500 pl-4">
								<p className="text-sm font-extrabold uppercase tracking-[0.2em] text-pink-300">Community pulse</p>
								<h2 className="mt-2 text-3xl font-black tracking-tight text-white">From the post desk</h2>
							</div>
							<Link href="/main/posts" className="text-sm font-bold text-cyan-300 hover:text-pink-300">See all -&gt;</Link>
						</div>
						<div className="mt-5 divide-y divide-violet-500/20 border-y border-violet-500/30 text-slate-200 sm:mt-7">
							<RecentpostComponent />
						</div>
					</div>

					<aside className="relative overflow-hidden rounded-xl border border-white/60 bg-[linear-gradient(145deg,#ec4899_0%,#8b5cf6_100%)] p-5 text-white shadow-[5px_5px_0_#22d3ee] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[repeating-conic-gradient(from_0deg_at_100%_0%,rgba(255,255,255,0.12)_0deg_2deg,transparent_2deg_12deg)] sm:p-8 sm:shadow-[8px_8px_0_#22d3ee]">
						<p className="relative text-sm font-extrabold uppercase tracking-[0.2em] text-yellow-200">For writers</p>
						<h2 className="relative mt-5 text-3xl font-black italic leading-tight tracking-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)] sm:text-4xl">Your next post could be featured post!</h2>
						<p className="relative mt-5 leading-7 text-white/90">Share your niche, a story, or a point of view with anime fans who are ready to stay awhile.</p>
						<Link href="/main/createpost" className="relative mt-8 inline-flex rounded-full border-2 border-slate-950 bg-yellow-300 px-6 py-3 font-black text-slate-950 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-yellow-200 hover:shadow-[6px_6px_0_#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Create a post <span className="ml-2" aria-hidden="true">-&gt;</span></Link>
					</aside>
				</section>
			</main>
			<Footer />
		</div>

	);
}

