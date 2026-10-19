import AutoPlayVideo from "./AutoplayVideo";

import {useState, useEffect} from "react";
import { MessageCircle, ThumbsUp } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../function/categories";
import Comments from "@/app/Components/Comments";
import { likePost, UnlikePost } from "@/app/function/like";
import CreateComment from "@/app/Components/CreateComment";
import { toast } from 'sonner';
const PostbyCategory = () => {

    const [posts,setPosts] = useState([]);
    const [categoryies,setCategoryies] = useState([]);
    const [error,setError] = useState(null);
    const { categoryId } = useSelector((state:{category:{categoryId:number}}) => state.category);   
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const [visibleComment, setVisibleComment] = useState<number | null>(null);
    const displayProducts = async () =>{

        const data = await categories();
        if (data) {
            setCategoryies(data);
        }
    }
    useEffect(() => {
        setCurrentUserId(localStorage.getItem("user_id"));
        displayProducts();
    }, []);

    const handleLikeToggle = async (post: any) => {
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
            displayProducts();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not update like');
        }
    };
    
    return (
       <div className="w-full">
    {categoryies
        .filter((category: any) => category.id === categoryId)
        .map((category: any) => (
            <div
                key={category.id}
                className="rounded-2xl border-2 border-violet-500/50 bg-[#12143a]/90 p-4 shadow-[6px_6px_0_rgba(139,92,246,0.4)] sm:p-6"
            >
                {/* Category Header */}
                <div className="flex flex-col items-start gap-4 border-b-2 border-dashed border-violet-400/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-lg font-black text-white shadow-[3px_3px_0_#22d3ee]">
                            {category.id}
                        </div>

                        <div>
                            <p className="text-sm text-indigo-300">
                                Selected Category
                            </p>

                            <h2 className="wrap-break-word text-xl font-black italic text-white drop-shadow-[2px_2px_0_#ec4899]">
                                {category.name}
                            </h2>
                        </div>
                    </div>

                    <span className="self-start rounded-full border border-cyan-300/60 bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-300 sm:self-auto">
                        Selected
                    </span>
                </div>

                {/* Posts */}
                {category.posts && category.posts.length > 0 ? (
                    <div className="mt-6 space-y-4">
                        <h3 className="border-l-4 border-pink-500 pl-3 text-lg font-black text-white">
                            Posts
                        </h3>

                        {category.posts.map((post: any) => (
                            <div
                                key={post.id}
                                className="rounded-xl border-2 border-violet-500/40 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] p-4 transition hover:border-pink-400 hover:shadow-[4px_4px_0_#ec4899] sm:p-5"
                            >
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

                                    <span>
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Post Content */}
                                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-indigo-100/90">
                                    {post.content}
                                </p>

                                {/* Image */}
                                {post.image && (
                                        <img
                                        src={
                                            post.image.startsWith("http")
                                                ? post.image
                                                : `https://animehub-3-kbnb.onrender.com${post.image.startsWith("/") ? "" : "/"}${post.image}`
                                        }
                                        alt={post.title}
                                            className="mt-5 max-h-[35rem] w-full rounded-xl border-2 border-violet-500/50 bg-slate-950 object-contain"
                                    />
                                )}

                                {/* Video */}
                                {post.video && (
                                    <AutoPlayVideo
                                        src={
                                            post.video.startsWith("http")
                                                ? post.video
                                                : `https://animehub-3-kbnb.onrender.com${post.video.startsWith("/") ? "" : "/"}${post.video}`
                                        }
                                    />
                                )}
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-violet-400/15 pt-3">
                                 <button
                  type="button"
                  onClick={() =>
                    setVisibleComment(
                      visibleComment === post.id ? null : post.id,
                    )
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-200 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  aria-expanded={visibleComment === post.id}
                >
                                    <MessageCircle aria-hidden="true" className="size-4" />
                  {visibleComment === post.id
                    ? "Hide comments"
                    : "View comments"}
                </button>
                                <button
                                    type="button"
                                    onClick={() => handleLikeToggle(post)}
                                    className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                                        post.likes?.some(
                                            (like: any) => String(like.user) === String(currentUserId)
                                        )
                                            ? "border-violet-400/60 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30"
                                            : "border-slate-600/70 bg-transparent text-slate-300 hover:border-slate-500 hover:bg-white/5 hover:text-white"
                                    }`}
                                    aria-pressed={post.likes?.some(
                                        (like: any) => String(like.user) === String(currentUserId)
                                    )}
                                >
                                    <ThumbsUp  className={post.likes?.some(
                                            (like: any) => String(like.user) === String(currentUserId)
                                        ) ? "fill-current text-violet-300" : "text-slate-400"} />
                                    {post.likes?.some(
                                        (like: any) => String(like.user) === String(currentUserId)
                                    )
                                        ? "Unlike"
                                        : "Like"}
                                    <span className="ml-0.5 border-l border-current/30 pl-2 text-xs tabular-nums opacity-80">{post.likes?.length ?? 0}</span>
                                </button>
                                </div>

                                {/* Comments */}
                                {visibleComment === post.id && (
                                    <>
                                        <Comments articleId={post.id} onClose={() => setVisibleComment(null)} />
                                        <CreateComment articleId={post.id} />
                                    </>
                                )}
                               
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-xl border-2 border-dashed border-violet-500/50 bg-[#0b0d24]/60 p-6 text-center">
                        <p className="font-semibold text-indigo-300">
                            No posts available in this category.
                        </p>
                    </div>
                )}
            </div>
        ))}
</div>
    )
};

export default PostbyCategory;