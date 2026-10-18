'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById } from "@/app/function/getpostbyid";
import { likePost, UnlikePost } from "@/app/function/like";
import { MessageCircle, ThumbsUp } from "lucide-react";
import Comments from "@/app/Components/Comments";
import CreateComment from "@/app/Components/CreateComment";
import { toast } from 'sonner';
import RelatedPost from "@/app/Components/RelatedPost";

const PostDetailComponent = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);

    const fetchPost = async () => {
        try {
            const data = await getPostById(id);
            setPost(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentUserId(localStorage.getItem("user_id"));
        fetchPost();
    }, [id]);

    const handleLikeToggle = async () => {
        const hasLiked = post.likes?.some(
            (like: any) => String(like.user) === String(currentUserId)
        );

        try {
            if (hasLiked) {
                await UnlikePost(post.id);
                toast.success('Post unliked');
            } else {
                await likePost(post.id);
                toast.success('Post liked');
            }
            await fetchPost();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not update like');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0d24] px-4 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
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
        </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <p className="text-sm font-medium text-red-500">
                    {error?.message || "Post not found"}
                </p>
            </div>
        );
    }

    const hasLiked = post.likes?.some(
        (like: any) => String(like.user) === String(currentUserId)
    );

    return (
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-4 rounded-full border-2 border-transparent px-3 py-1 text-sm font-bold text-cyan-300 transition hover:border-pink-400 hover:bg-pink-400/10 hover:text-pink-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    ← Back
                </button>
               
                <div className="rounded-2xl border-2 border-violet-500/60 bg-[#12143a]/95 p-5 shadow-[8px_8px_0_rgba(139,92,246,0.45)] sm:p-6">
                    <h1 className="wrap-break-word border-l-4 border-pink-500 pl-3 text-xl font-black italic text-white drop-shadow-[2px_2px_0_#ec4899] sm:text-2xl">
                        {post.title}
                    </h1>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-indigo-300">
                        <span className="font-semibold text-cyan-200">
                            Author: {typeof post.author === 'object' && post.author !== null ? post.author.username : post.author}
                        </span>
                        <span className="hidden text-pink-400 sm:inline">•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-indigo-100/90">
                        {post.content}
                    </p>

                    {post.image && (
                        <img
                            src={`https://animehub-2-i11e.onrender.com${post.image}`}
                            alt={post.title}
                            className="mt-5 max-h-140 w-full rounded-xl border-2 border-violet-500/50 bg-slate-950 object-contain"
                        />
                    )}

                    {post.video && (
                        <video
                        autoPlay
                            src={`https://animehub-2-i11e.onrender.com${post.video}`}
                            controls
                            className="mt-5 max-h-140 w-full rounded-xl border-2 border-violet-500/50 bg-black"
                        />
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-violet-400/15 pt-3">
                    <button
                        type="button"
                        onClick={handleLikeToggle}
                        className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                            hasLiked
                                ? "border-violet-400/60 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30"
                                : "border-slate-600/70 bg-transparent text-slate-300 hover:border-slate-500 hover:bg-white/5 hover:text-white"
                        }`}
                        aria-pressed={hasLiked}
                    >
                        <ThumbsUp className={hasLiked ? "size-4 fill-current text-violet-300" : "size-4 text-slate-400"} />
                        {hasLiked ? "Unlike" : "Like"}
                        <span className="ml-0.5 border-l border-current/30 pl-2 text-xs tabular-nums opacity-80">{post.likes?.length ?? 0}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowComments((prev) => !prev)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-200 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                        aria-expanded={showComments}
                    >
                        <MessageCircle aria-hidden="true" className="size-4" />
                        {showComments ? "Hide comments" : "View comments"}
                    </button>
                    </div>

                    {showComments && (
                        <>
                            <Comments articleId={post.id} onClose={() => setShowComments(false)} />
                            <CreateComment articleId={post.id} />
                        </>
                    )}
                </div>
                 <RelatedPost postId={post.id} />

            </div>
        </div>
    );
};

export default PostDetailComponent;
