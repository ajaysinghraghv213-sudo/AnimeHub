'use client'

import {getFeaturedPosts} from '@/app/function/featuredposts'
import {useState,useEffect,useCallback,useRef} from 'react'
import { useDispatch } from 'react-redux';
import { fetchOtherProfileView } from '@/app/redux/features/otherprofileview';
import {useRouter} from 'next/navigation'
import AutoPlayVideo from './AutoplayVideo';
import { ChevronLeft, ChevronRight } from 'lucide-react';





type Author = {
    id?: number | string;
    username?: string;
    profile_pic?: string | null;
};

type FeaturedPost = {
    id: number | string;
    title: string;
    video?: string | null;
    image?: string | null;
    is_featured?: boolean;
    author?: Author;
    created_at?: string;
};

type AppDispatch = (action: unknown) => unknown;

const FeaturedPosts = () => {
    const dispatch = useDispatch() as unknown as AppDispatch;
    const [posts, setPosts] = useState<FeaturedPost[]>([]);
    
const scrollRef = useRef<HTMLDivElement | null>(null);
const [progress, setProgress] = useState(0);
const [canPrev, setCanPrev] = useState(false);
const [canNext, setCanNext] = useState(false)


   const featured = posts.filter((post) => post.is_featured);

const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
}, []);

useEffect(() => {
    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
}, [updateScroll, featured.length]);

const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
};
;




    useEffect(() => {
        const fetchPosts = async () => {
            const allPosts = await getFeaturedPosts();
            console.log(allPosts);
            setPosts(allPosts);
        };
        fetchPosts();
    }, []);

    const router = useRouter();

    const handleProfileView = (userId?: number | string) => {
        if (userId === undefined) return;
        dispatch(fetchOtherProfileView(String(userId)));
        router.push(`/main/profile/${userId}`);
    };

    return (
        <div className="relative">
    {canPrev && (
        <button
            type="button"
            aria-label="Previous featured posts"
            onClick={() => scrollByCard(-1)}
            className="absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0b0d24]/85 text-white shadow-lg backdrop-blur transition hover:bg-violet-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:flex"
        >
            <ChevronLeft />
        </button>
    )}
    {canNext && (
        <button
            type="button"
            aria-label="Next featured posts"
            onClick={() => scrollByCard(1)}
            className="absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0b0d24]/85 text-white shadow-lg backdrop-blur transition hover:bg-violet-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:flex"
        >
            <ChevronRight />
        </button>
    )}

    <div
        ref={scrollRef}
        onScroll={updateScroll}
        className="
            flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth
            touch-pan-x px-1 pb-6 pt-2 pr-3 sm:gap-5 sm:pb-8
            [-webkit-overflow-scrolling:touch]
            scrollbar-none [&::-webkit-scrollbar]:hidden
        "
    >
        {posts
            .filter((post) => post.is_featured)
            .map((post, i) => (
                <article
                    key={post.id}
                    style={{ animationDelay: `${i * 90}ms` }}
                    onClick={() => router.push(`/main/posts/${post.id}`)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            router.push(`/main/posts/${post.id}`);
                        }
                    }}
                    role="link"
                    tabIndex={0}
                    className="group flex w-[91%] shrink-0 snap-start animate-card-in flex-col overflow-hidden rounded-xl border border-violet-400/30 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] shadow-md shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-pink-400/70 hover:shadow-lg hover:shadow-pink-950/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 motion-reduce:animate-none sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
                >
                    {/* Media, Content, Footer: exactly as you have them */}
                  
                <div className="relative aspect-16/10 overflow-hidden border-b border-violet-400/25 bg-slate-950 transition-colors group-hover:border-pink-400/60">
                    {post.video ? (
                       <AutoPlayVideo
                           src={` https://animehub-3-kbnb.onrender.com${post.video}`}
                           fill
                       />
                    ) : post.image ? (
                        <img
                            src={` https://animehub-3-kbnb.onrender.com${post.image}`}
                            alt={post.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:saturate-125"
                        />
                    ) : (
                        <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,#ec4899_0%,#8b5cf6_55%,#22d3ee_100%)] p-6">
                            <span className="text-6xl font-black italic tracking-tight text-white/40 drop-shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
                                Aa
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">

                    {/* Featured label */}
                    <p className="w-fit rounded-sm bg-yellow-300 px-2 py-1 text-[10px] font-black uppercase text-slate-950 sm:text-xs">
                        Featured
                    </p>

                    {/* Title */}
                    <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-pink-300 sm:text-xl">
                        {post.title.substring(0, 25) + (post.title.length > 25 ? "..." : "")}
                    </h2>


                    {/* Footer */}
                    <div className="mt-auto flex flex-col gap-3 border-t border-violet-400/20 pt-4 text-sm text-indigo-300 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <img 
                            onClick={(event) => {
                                event.stopPropagation();
                                handleProfileView(post.author?.id);
                            }}
                            style={{ cursor: 'pointer' }}
                            
                                src={post.author?.profile_pic
                                    ? ` https://animehub-3-kbnb.onrender.com${post.author.profile_pic}`
                                    : '/file.svg'}
                                alt={post.author?.username || "Anonymous"}
                                className="h-9 w-9 shrink-0 rounded-full bg-slate-900 object-cover ring-2 ring-pink-400 ring-offset-2 ring-offset-[#12143a] transition hover:ring-cyan-300"
                            />
                            <span className="truncate font-bold text-cyan-200">
                                {post.author?.username || "Anonymous"}
                            </span>
                        </div>

                        {post.created_at && (
                            <span className="shrink-0 font-semibold  text-indigo-300">
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    </div>
                </article>
            ))}
    </div>
</div>
    );
};

export default FeaturedPosts;



