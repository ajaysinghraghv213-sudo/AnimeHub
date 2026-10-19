"use client";
import AutoPlayVideo from "./AutoplayVideo";
import { getAllPosts } from "../function/allpost";
import { useEffect, useState } from "react";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { likePost, UnlikePost } from "@/app/function/like";
import Comments from "@/app/Components/Comments";
import CreateComment from "@/app/Components/CreateComment";
import { toast } from "sonner";
import Link from "next/link";

const AllPostsComponent = () => {
  const [access, setAccess] = useState<string | null>(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleComment, setVisibleComment] = useState<number | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
   

  const toggleExpanded = (postId: number) => {
    setExpandedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };
  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();

      if (!data) return;

      setPosts(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error as any);
      setLoading(false);
    }
  };

  useEffect(() => {
    setAccess(localStorage.getItem("accessToken"));
    setCurrentUserId(localStorage.getItem("user_id"));
    fetchPosts();
  }, []);

  const handleLikeToggle = async (post: any) => {
    const hasLiked = post.likes?.some(
      (like: any) => String(like.user) === String(currentUserId),
    );

    try {
      if (hasLiked) {
        await UnlikePost(post.id);
        toast.success("Post unliked");
      } else {
        await likePost(post.id);
        toast.success("Post liked");
      }
      fetchPosts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update like",
      );
    }
  };


  return (
    <div className="w-full">
      <div className="space-y-5">
        <h3 className="border-l-2 border-cyan-300 pl-3 text-lg font-bold text-white">
          All Posts
        </h3>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post: any) => {
              const authorName =
                typeof post.author === "object" && post.author !== null
                  ? post.author.username || "Anonymous"
                  : post.author || "Anonymous";
              const authorHref =
                typeof post.author === "object" && post.author?.id
                  ? `/main/profile/${post.author.id}`
                  : null;
              const authorIdentity = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500/25 text-sm font-bold text-cyan-100 ring-1 ring-white/10">
                    {post.author?.profile_pic ? (
                      <img
                        src={
                          post.author.profile_pic.startsWith("http")
                            ? post.author.profile_pic
                            : `https://animehub-3-kbnb.onrender.com${post.author.profile_pic.startsWith("/") ? "" : "/"}${post.author.profile_pic}`
                        }
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      String(authorName).charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-medium uppercase text-indigo-300/75">
                      Author
                    </span>
                    <span className="block truncate text-sm font-semibold text-cyan-100">
                      {authorName}
                    </span>
                  </span>
                </>
              );

              return (
              <article
                key={post.id}
                className="overflow-hidden rounded-xl border border-violet-400/20 bg-[#12143a]/75 shadow-sm shadow-black/10 transition-colors hover:border-violet-300/40"
              >
                <div className="flex items-center justify-between gap-3 border-b border-violet-400/15 px-4 py-3 sm:px-5">
                  {authorHref ? (
                    <Link
                      href={authorHref}
                      aria-label={`View ${authorName}'s profile`}
                      className="group flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                    >
                      {authorIdentity}
                    </Link>
                  ) : (
                    <div className="flex min-w-0 items-center gap-3">
                      {authorIdentity}
                    </div>
                  )}
                  <time className="shrink-0 text-xs tabular-nums text-indigo-300/80 sm:text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                </div>

                <div className="p-4 sm:p-5">
                  <h4 className="wrap-break-word text-lg font-semibold leading-snug text-white sm:text-xl">
                    {post.title}
                  </h4>

                  <div className="mt-3">
                  <p className="whitespace-pre-line wrap-break-word text-sm leading-6 text-indigo-100/90 sm:leading-7">
                    {expandedPosts.includes(post.id) ? post.content : `${post.content.slice(0, 50)}...`}
                  </p>
                 {post.content.length > 50 && (
                  <button 
                    type="button"
                    onClick={() => toggleExpanded(post.id)}
                    aria-expanded={expandedPosts.includes(post.id)}
                    className="mt-2 text-sm font-bold text-pink-400 hover:text-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  >
                    {expandedPosts.includes(post.id) ? "Show less" : "Read more"}
                  </button>
                 )}
                  </div>

                {/* Image */}
                {post.image && (
                  <img
                    src={
                      post.image.startsWith("http")
                        ? post.image
                        : `https://animehub-3-kbnb.onrender.com${post.image.startsWith("/") ? "" : "/"}${post.image}`
                    }
                    alt={post.title}
                    loading="lazy"
                    className="mt-4 max-h-[35rem] w-full rounded-lg border border-violet-400/20 bg-slate-950/70 object-contain"
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
      (like: any) =>
        String(like.user) === String(currentUserId),
    )
      ? "border-violet-400/60 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30"
      : "border-slate-600/70 bg-transparent text-slate-300 hover:border-slate-500 hover:bg-white/5 hover:text-white"
  }`}
  aria-pressed={post.likes?.some(
    (like: any) => String(like.user) === String(currentUserId),
  )}
>
  <ThumbsUp
    className={
      post.likes?.some(
        (like: any) =>
          String(like.user) === String(currentUserId),
      )
        ? "h-4 w-4 fill-current text-violet-300"
        : "h-4 w-4 text-slate-400"
    }
  />
  {post.likes?.some(
    (like: any) => String(like.user) === String(currentUserId),
  )
    ? "Unlike"
    : "Like"}
  <span className="ml-0.5 border-l border-current/30 pl-2 text-xs tabular-nums opacity-80">
    {post.likes?.length ?? 0}
  </span>
</button>
                </div>
                {/* Comments */}

                {/* Comments */}
                {visibleComment === post.id && (
                  <>
                    {access && (
                      <>
                        <Comments
                          articleId={post.id}
                          onClose={() => setVisibleComment(null)}
                        >
                          <CreateComment articleId={post.id} />
                        </Comments>
                      </>
                    )}
                    {!access && (
                      <p className="mt-4 border-l-4 border-pink-500 bg-pink-500/10 px-4 py-3 text-sm font-semibold text-pink-200">
                        Please log in to view and create comments.
                      </p>
                    )}
                  </>
                )}
                </div>
              </article>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="mt-6 rounded-xl border-2 border-dashed border-violet-500/50 bg-[#0b0d24]/60 p-6 text-center">
              <p className="font-semibold text-indigo-300">
                No posts available.
              </p>
            </div>
          )
        )}
      </div>

      {loading && (
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

            <p className="mt-2 text-xs text-indigo-300">Please wait a moment</p>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-4 border-l-4 border-pink-500 bg-pink-500/10 px-4 py-3 text-sm font-semibold text-pink-200">
          Error: {error.message}
        </p>
      )}
    </div>
  );
};

export default AllPostsComponent;
