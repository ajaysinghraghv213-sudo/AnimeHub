'use client'

import { userPost } from '@/app/function/userspost';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import AutoPlayVideo from './AutoplayVideo';
import CreateComment from './CreateComment';
import Comments from './Comments';
import { Check, LoaderCircle, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { mediaUrl } from '../function/mediaUrl';
import { likePost, UnlikePost } from '../function/like';
import { deletePost } from '../function/deletepost';

/* ---------------------------------- Card ---------------------------------- */

const actionBtn =
    "inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-black uppercase tracking-wide transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:text-sm";

const SelfPostCard = ({
    post,
    onDelete,
}: {
    post: any;
    onDelete: (id: number) => Promise<void>;
}) => {
    const [liked, setLiked] = useState(post.is_liked ?? false);
    const [likes, setLikes] = useState(post.likes_count ?? post.likes?.length ?? 0);
    const [updatingLike, setUpdatingLike] = useState(false);
    const [copied, setCopied] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [visibleComment, setVisibleComment] = useState<number | null>(null);

    const [access, setAccess] = useState<string | null>(null);

    useEffect(() => {
        setAccess(localStorage.getItem('accessToken'));
    }, []);

    useEffect(() => {
        if (post.is_liked === undefined && Array.isArray(post.likes)) {
            const currentUserId = localStorage.getItem("user_id");
            setLiked(post.likes.some(
                (like: any) => String(like.user) === String(currentUserId)
            ));
        }
    }, [post.is_liked, post.likes]);

   

    const handleLikeToggle = async () => {
        if (updatingLike) return;
        const nextLiked = !liked;
        setUpdatingLike(true);
        try {
            if (liked) {
                await UnlikePost(post.id);
                toast.success('Post unliked');
            } else {
                await likePost(post.id);
                toast.success('Post liked');
            }
            setLiked(nextLiked);
            setLikes((currentLikes: number) => Math.max(0, currentLikes + (nextLiked ? 1 : -1)));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not update like');
        } finally {
            setUpdatingLike(false);
        }
    };


    const handleShare = async () => {
        const url = `${window.location.origin}/main/posts/${post.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* share cancelled */
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(post.id);
            toast.success('Post deleted');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not delete post');
        } finally {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <div className="rounded-xl border-2 border-violet-500/40 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] p-4 transition hover:border-pink-400 hover:shadow-[4px_4px_0_#ec4899] sm:p-5">
            {/* Post Title */}
            <h4 className="wrap-break-word text-lg font-black text-white sm:text-xl">
                {post.title}
            </h4>

            {/* Post Information */}
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-indigo-300">
                <span className="font-semibold text-cyan-200">
                    Author: {typeof post.author === 'object' && post.author !== null ? post.author.username : post.author}
                </span>
                <span className="hidden text-pink-400 sm:inline">•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {/* Post Content */}
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-indigo-100/90">
                {post.content}
            </p>

            {/* Image */}
            {post.image && (
                <img
                    src={mediaUrl(post.image)}
                    alt={post.title}
                    className="mt-5 max-h-[35rem] w-full rounded-xl border-2 border-violet-500/50 bg-slate-950 object-contain"
                />
            )}

            {/* Video */}
            {post.video && (
                <AutoPlayVideo src={mediaUrl(post.video)} />
            )}
            <button
                                    type="button"
                                    onClick={() => setVisibleComment(visibleComment === post.id ? null : post.id)}
                                    className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-cyan-300/70 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                    aria-expanded={visibleComment === post.id}
                                >
                                    <span aria-hidden="true">{visibleComment === post.id ? "-" : "+"}</span>
                                    {visibleComment === post.id ? "Hide comments" : "View comments"}
                                </button>

            {/* Action Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-violet-500/30 pt-4">
                <button
                    type="button"
                    onClick={handleLikeToggle}
                    disabled={updatingLike}
                    className={`inline-flex min-h-11 w-[calc(50%-0.25rem)] shrink-0 items-center justify-center gap-2 rounded-lg border-2 px-3 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-wait disabled:opacity-60 sm:w-32 sm:px-3 sm:text-sm ${
                        liked
                            ? "border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] text-white shadow-[3px_3px_0_#22d3ee] hover:brightness-110"
                            : "border-violet-400/60 bg-slate-900/40 text-indigo-200 hover:border-pink-400 hover:bg-pink-400/10 hover:text-pink-200"
                    }`}
                    aria-pressed={liked}
                >
                    <ThumbsUp className={`size-4 shrink-0 ${liked ? "fill-yellow-300 text-yellow-300" : "text-indigo-300"}`} />
                    <span>{liked ? "Unlike" : "Like"}</span>
                    <span className="min-w-5 text-xs tabular-nums opacity-80">{likes}</span>
                </button>

               <button
  type="button"
  onClick={handleShare}
  aria-label={copied ? 'Link copied' : 'Share this post'}
  className="
    inline-flex min-h-11 w-[calc(50%-0.25rem)] shrink-0 select-none touch-manipulation
    items-center justify-center gap-2 rounded-lg
    border-2 border-violet-400/50 bg-violet-500/10 px-3
    text-sm font-bold text-violet-200
    [-webkit-tap-highlight-color:transparent]
    transition duration-150
    hover:bg-violet-500/30 hover:shadow-[2px_2px_0_#8b5cf6]
    active:translate-x-[2px] active:translate-y-[2px] active:bg-violet-500/40 active:shadow-none
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300
    sm:w-32
  "
>
  {copied ? <Check className="size-4 shrink-0" /> : <Share2 className="size-4 shrink-0" />}
  <span className="whitespace-nowrap" aria-live="polite">
    {copied ? 'Copied!' : 'Share'}
  </span>
</button>

                {/* Owner actions */}
                <div className="flex w-full gap-2 sm:ml-auto sm:w-auto">
                    
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className={`${actionBtn} min-h-11 flex-1 justify-center whitespace-nowrap border-rose-500/60 bg-rose-500/10 text-rose-300 hover:bg-rose-500 hover:text-white hover:shadow-[2px_2px_0_#fda4af] sm:w-32 sm:flex-none`}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>

            {visibleComment === post.id && (
                <div className="mt-4 w-full border-t border-violet-500/25 pt-1">
                    {access ? (
                        <>
                            <div className="max-h-[50vh] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#8b5cf6_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-violet-500/10 hover:[&::-webkit-scrollbar-thumb]:bg-violet-400 sm:max-h-96">
                                <Comments articleId={post.id} onClose={() => setVisibleComment(null)} />
                            </div>
                            <CreateComment articleId={post.id} />
                        </>
                    ) : (
                        <p className="mt-4 rounded-lg border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-sm leading-6 text-pink-100">
                            Please log in to view and add comments.
                        </p>
                    )}
                </div>
            )}

            {/* Delete confirmation */}
            {confirmDelete && createPortal(
                <div
                    className="delete-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !deleting) setConfirmDelete(false);
                    }}
                >
                    <section
                        aria-labelledby={`delete-title-${post.id}`}
                        aria-describedby={`delete-description-${post.id}`}
                        aria-modal="true"
                        className="delete-modal-panel w-full max-w-sm rounded-xl border-2 border-rose-400/70 bg-[#17152f] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6"
                        role="dialog"
                    >
                        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
                            <Trash2 aria-hidden="true" className="size-5" />
                        </div>
                        <h3 className="text-lg font-black text-white" id={`delete-title-${post.id}`}>
                            Delete this post?
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-indigo-200" id={`delete-description-${post.id}`}>
                            This action can&apos;t be undone.
                        </p>
                        <div className="mt-6 flex gap-2">
                            <button
                                autoFocus
                                onClick={() => setConfirmDelete(false)}
                                disabled={deleting}
                                className="min-h-11 flex-1 rounded-lg border-2 border-violet-500/50 px-3 text-sm font-bold text-indigo-100 transition hover:border-pink-400 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500 px-3 text-sm font-bold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                                {deleting ? 'Deleting...' : 'Delete post'}
                            </button>
                        </div>
                    </section>
                </div>,
                document.body
            )}

        </div>
    );
};

/* ---------------------------------- Page ---------------------------------- */

export const SelfPosts = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await userPost();
                if (!Array.isArray(data)) {
                    throw data instanceof Error ? data : new Error('Could not load posts');
                }
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not load posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id: number) => {
        await deletePost(id);
        setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
    };

    return (
        <div>
            {loading && <p className="py-8 text-center text-sm text-indigo-200" role="status">Loading posts...</p>}

            {/* Error */}
            {error && (
                <div className="mb-5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && posts.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-violet-500/40 bg-[#12143a]/60 px-6 py-12 text-center">
                    <p className="text-3xl">🌸</p>
                    <h4 className="mt-3 text-lg font-black text-white">
                        No posts yet
                    </h4>
                    <p className="mt-1 text-sm text-indigo-300">
                        Your adventure starts with your first post.
                    </p>
                    <button
                        onClick={() => router.push('/main/createpost')}
                        className="mt-5 rounded-lg border-2 border-pink-400 bg-pink-500 px-5 py-2 text-sm font-black text-white transition hover:shadow-[3px_3px_0_#f9a8d4] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                        ✨ Create Post
                    </button>
                </div>
            )}

            {/* Posts */}
            <div className="flex flex-col gap-6">
                {posts.map((post) => (
                    <SelfPostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};