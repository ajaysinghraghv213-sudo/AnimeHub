'use client'


import { likedPosts } from "../function/likedposts";
import { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { UnlikePost } from "@/app/function/like";
import { toast } from 'sonner';

type LikedPost = {
    post: {
        id: number;
        title: string;
        content?: string;
        image?: string;
        video?: string;
        category?: { name?: string };
    };
};

const LikedPosts = () => {
    const [posts, setPosts] = useState<LikedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                const data = await likedPosts();
                console.log(data);
                setPosts(data);
            } catch (error) {
                console.error(error);
                setError(error instanceof Error ? error : new Error("Failed to fetch liked posts"));
            } finally {
                setLoading(false);
            }
        };
        fetchLikedPosts();
    }, []);

    const handleUnlike = async (postId: number) => {
        try {
            await UnlikePost(postId);
            setPosts((currentPosts) =>
                currentPosts.filter((likedPost) => likedPost.post.id !== postId)
            );
            toast.success('Post removed from liked posts');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not unlike post');
        }
    };

    return (
        <div>
           
            <div className="min-h-screen bg-[#0b0d24] px-4 py-6 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 border-l-4 border-pink-500 pl-4 sm:mb-8">
            <h1 className="text-2xl font-black italic tracking-tight text-white drop-shadow-[2px_2px_0_#ec4899] sm:text-3xl">
                Liked Posts
            </h1>

            <p className="mt-1 text-sm text-indigo-300 sm:text-base">
                Posts you have liked
            </p>
        </div>

        {/* Empty state */}
        {posts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-violet-500/50 bg-[#12143a]/90 px-6 py-14 text-center shadow-[6px_6px_0_rgba(139,92,246,0.4)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-2xl text-white shadow-[3px_3px_0_#22d3ee]">
                    ♥
                </div>

                <h2 className="mt-4 text-lg font-black text-white">
                    No liked posts yet
                </h2>

                <p className="mt-2 text-sm text-indigo-300">
                    Posts you like will appear here.
                </p>
            </div>
        ) : (

            /* Liked posts */
            <div className="space-y-5">
                {posts.map((post) => (
                    <div
                        key={post.post.id}
                        className="group overflow-hidden rounded-2xl border-2 border-violet-500/50
                                   bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] shadow-[6px_6px_0_rgba(139,92,246,0.45)] transition-all duration-200
                                   hover:-translate-y-0.5 hover:border-pink-400 hover:shadow-[8px_8px_0_#ec4899]"
                    >

                        {/* Media */}
                        {(post.post.image || post.post.video) && (
                            <div className="relative aspect-[16/8] w-full overflow-hidden border-b-2 border-violet-500/50 bg-slate-950 transition-colors group-hover:border-pink-400 sm:aspect-[16/7]">

                                {post.post.video ? (
                                    <video
                                        src={
                                            post.post.video.startsWith("http")
                                                ? post.post.video
                                                : `https://animehub-3-kbnb.onrender.com${post.post.video.startsWith("/") ? "" : "/"}${post.post.video}`
                                        }
                                        controls
                                        className="h-full w-full object-cover"
                                    />
                                ) : post.post.image ? (
                                    <img
                                        src={
                                            post.post.image.startsWith("http")
                                                ? post.post.image
                                                : `https://animehub-3-kbnb.onrender.com${post.post.image.startsWith("/") ? "" : "/"}${post.post.image}`
                                        }
                                        alt={post.post.title}
                                        className="h-full w-full object-cover transition-transform
                                                   duration-300 group-hover:scale-[1.02] group-hover:saturate-125"
                                    />
                                ) : null}

                                {/* Liked badge */}
                                <div className="absolute left-3 top-3 flex items-center gap-1.5
                                                rounded-full border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-3 py-1.5
                                                text-xs font-bold text-white shadow-[2px_2px_0_#22d3ee]
                                                backdrop-blur-sm">
                                    <ThumbsUp className="h-4 w-4" />
                                    Liked
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start gap-3">

                                {/* Like icon */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center
                                                rounded-full border-2 border-cyan-300/70 bg-cyan-300/10 text-cyan-300">
                                    <ThumbsUp className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">

                                    {/* Title */}
                                    <h2 className="text-lg font-black leading-snug text-white transition-colors group-hover:text-pink-300
                                                   sm:text-xl">
                                        {post.post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    {post.post.content && (
                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-indigo-100/90
                                                      sm:text-base">
                                            {post.post.content}
                                        </p>
                                    )}

                                    {/* Bottom information */}
                                    <div className="mt-4 flex flex-wrap items-center gap-2">

                                        {post.post.category?.name && (
                                            <span className="rounded-full border border-violet-400/60 bg-violet-500/15 px-3 py-1
                                                             text-xs font-bold text-violet-200">
                                                {post.post.category.name}
                                            </span>
                                        )}

                                        <button
                                        onClick={() => handleUnlike(post.post.id)}
                                        
                                         className="rounded-full border-2 border-pink-400/70 bg-pink-500/10 px-3 py-1
                                                         text-xs font-bold text-pink-200 transition hover:bg-pink-500/25 hover:text-white
                                                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
                                            <ThumbsDown
                                            
                                            className="h-4 w-4 inline-block mr-1" />
                                            Dislike
                                        </button>

                                    </div>
                                </div>

                                {/* Desktop arrow */}
                                <span className="hidden shrink-0 text-xl text-violet-400/60
                                                 transition-colors group-hover:text-pink-300
                                                 sm:block">
                                    →
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
</div>
            {loading && <div className="min-h-screen flex items-center justify-center bg-[#0b0d24] px-4 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
            <div className="flex flex-col items-center">

                {/* Spinner */}
                <div className="relative flex h-14 w-14 items-center justify-center">
                    <div className="absolute h-14 w-14 rounded-full border-4 border-violet-500/30"></div>

                    <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-pink-400 border-r-cyan-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>

                    <div className="h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse"></div>
                </div>

                {/* Loading text */}
                <div className="mt-5 flex items-center gap-1">
                    <span className="text-sm font-extrabold italic tracking-wide text-white">
                        Loading
                    </span>

                    <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0ms]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:300ms]"></span>
                    </span>
                </div>

                <p className="mt-2 text-xs text-indigo-300">
                    Please wait a moment
                </p>
            </div>
        </div>}
            {error && <p className="mx-auto mt-4 max-w-5xl border-l-4 border-pink-500 bg-pink-500/10 px-4 py-3 text-sm font-semibold text-pink-200">Error: {error.message}</p>}
        </div>
    );
};

export default LikedPosts;