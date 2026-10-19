"use client";

import { useEffect, useState } from "react";
import { fetchComments } from "@/app/function/comments";
import { useDispatch, useSelector } from "react-redux";
import { removeComment, setComments } from "@/app/redux/features/comments";
import DeleteCommentButton from "./DeleteCommentButton";
import { MessageCircle, MoreVertical, X } from "lucide-react";
import Link from "next/link";
import ReplyComponent from "./ReplyComponent";

type CommentAuthor = {
  id?: string | number;
  content?: string;
  profile_pic?: string;
  username?: string;
  name?: string;
};

type Comment = {
  id: string | number;
  content: string;
  replies?: Comment[];
  author?: CommentAuthor | string | number;
  user?: CommentAuthor;
  created_at?: string;
};

const Comments = ({
  articleId,
  onClose,
}: {
  articleId: string | number;
  onClose: () => void;
}) => {
  const comments = useSelector((state: any) => state.comments.comments);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleReply, setVisibleReply] = useState<string | number | null>(
    null,
  );
  const [visibleReplies, setVisibleReplies] = useState<string | number | null>(
    null,
  );
  const [replyContent, setReplyContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("user_id"));
  }, []);

  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const data = (await fetchComments(String(articleId))) as {
          comments?: Comment[];
          total_comments?: number;
        };
        if (!Array.isArray(data?.comments)) {
          throw new Error("Comments could not be loaded");
        }
        dispatch(setComments(data.comments));
        setTotalComments(data.total_comments ?? data.comments.length);
        console.log("Fetched comments:", data);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getComments();
  }, [articleId]);

  return (
    <section
      className="mt-5 border-t border-violet-400/30 pt-5"
      aria-label="Comments"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
            <MessageCircle aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h5 className="text-base font-bold text-white">Discussion</h5>
              {!isLoading && !hasError && (
                <span className="rounded-full bg-violet-400/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-violet-200">
                  {totalComments}
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-300">Reader comments</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-indigo-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          aria-label="Close comments"
          title="Close comments"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3" aria-live="polite">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-start gap-3 rounded-lg border border-violet-500/20 p-3"
            >
              <div className="size-9 shrink-0 rounded-full bg-violet-500/30" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-28 rounded-full bg-violet-500/30" />
                <div className="h-3 w-full rounded-full bg-violet-500/20" />
                <div className="h-3 w-2/3 rounded-full bg-violet-500/20" />
              </div>
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div
          className="mt-5 rounded-lg border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-sm leading-6 text-pink-100"
          role="alert"
        >
          Comments couldn&apos;t be loaded. Please try again later.
        </div>
      ) : comments.length > 0 ? (
        <div className="mt-4 space-y-3">
          {comments.map((comment: Comment) => {
            const author =
              typeof comment.author === "object" && comment.author !== null
                ? comment.author
                : undefined;
            const authorName =
              author?.name ||
              author?.username ||
              `Reader ${author?.id ?? comment.author ?? ""}`.trim();
            const profileHref = author?.id
              ? `/main/profile/${author.id}`
              : undefined;
            const isOwnComment =
              currentUserId !== null &&
              String(author?.id ?? comment.author) === String(currentUserId);
            const isMenuOpen = openMenuId === comment.id;

            return (
              <article
                key={comment.id}
                className="group flex min-w-0 items-start gap-3 rounded-xl border border-violet-500/25 bg-[#0b0d24]/60 p-4 transition-colors hover:border-violet-400/50 sm:gap-4 sm:p-5"
              >
                {profileHref ? (
                  <Link
                    href={profileHref}
                    aria-label={`View ${authorName}'s profile`}
                    className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500/40 text-sm font-bold text-white ring-1 ring-violet-300/30 transition hover:ring-2 hover:ring-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  >
                    {author?.profile_pic ? (
                      <img
                        src={
                          author.profile_pic.startsWith("http")
                            ? author.profile_pic
                            : `https://animehub-3-kbnb.onrender.com${author.profile_pic.startsWith("/") ? "" : "/"}${author.profile_pic}`
                        }
                        alt={authorName}
                        className="size-full object-cover"
                      />
                    ) : (
                      authorName.charAt(0).toUpperCase()
                    )}
                  </Link>
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-500/40 text-sm font-bold text-white ring-1 ring-violet-300/30"
                  >
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="relative min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    {profileHref ? (
                      <Link
                        href={profileHref}
                        className="min-w-0 wrap-break-word rounded px-1 py-0.5 text-sm font-semibold text-cyan-100 transition hover:text-cyan-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                      >
                        {authorName}
                      </Link>
                    ) : (
                      <p className="min-w-0 wrap-break-word px-1 py-0.5 text-sm font-semibold text-cyan-100">
                        {authorName}
                      </p>
                    )}
                    <div className="flex shrink-0 items-center gap-1">
                      {comment.created_at && (
                        <time
                          className="text-right text-[11px] font-medium text-indigo-300 sm:text-xs"
                          dateTime={comment.created_at}
                        >
                          {new Date(comment.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </time>
                      )}
                      {isOwnComment && (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : comment.id)
                          }
                          aria-label="Comment options"
                          aria-expanded={isMenuOpen}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-indigo-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                        >
                          <MoreVertical aria-hidden="true" className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 rounded-lg bg-black/20 px-3 py-2.5 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-indigo-100/90 sm:px-4 sm:py-3">
                    {comment.content}
                  </p>
                  {/* Reply button (YouTube-style action) */}
<button
  type="button"
  onClick={() =>
    setVisibleReply(visibleReply === comment.id ? null : comment.id)
  }
  aria-expanded={visibleReply === comment.id}
  className="mt-1 -ml-2 inline-flex items-center rounded-full px-3 py-1.5
             text-xs font-semibold text-indigo-200 transition
             hover:bg-white/10 hover:text-white active:bg-white/15
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300
             sm:text-sm sm:px-4 sm:py-2"
>
  {visibleReply === comment.id ? "Cancel" : "Reply"}
</button>

{/* Reply form */}
{visibleReply === comment.id && (
  <div className="mt-2">
    <ReplyComponent comment_id={Number(comment.id)} />
  </div>
)}

{/* "View N replies" toggle */}
{comment.replies && comment.replies.length > 0 && (
  <button
    type="button"
    onClick={() =>
      setVisibleReplies(visibleReplies === comment.id ? null : comment.id)
    }
    aria-expanded={visibleReplies === comment.id}
    className="mt-1 -ml-2 flex items-center gap-2 rounded-full px-3 py-1.5
               text-xs font-semibold text-cyan-300 transition
               hover:bg-cyan-300/10 active:bg-cyan-300/20
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300
               sm:text-sm sm:px-4 sm:py-2"
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 transition-transform sm:h-4 sm:w-4 ${
        visibleReplies === comment.id ? "rotate-180" : ""
      }`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
    {visibleReplies === comment.id ? "Hide" : "View"} {comment.replies.length}{" "}
    {comment.replies.length === 1 ? "reply" : "replies"}
  </button>
)}

{/* Replies list */}
{visibleReplies === comment.id &&
  comment.replies &&
  comment.replies.length > 0 && (
    <div className="mt-3 space-y-4">
      {comment.replies.map((reply) => {
        const replyAuthor =
          typeof reply.author === "object" && reply.author !== null
            ? reply.author
            : undefined;
        const name =
          replyAuthor?.name || replyAuthor?.username || "Reader";
        const replyProfileHref = replyAuthor?.id
          ? `/main/profile/${replyAuthor.id}`
          : undefined;
        return (
          <div key={reply.id} className="flex items-start gap-3 rounded-lg bg-[#0b0d24]/50 p-3 sm:gap-4 sm:p-4">
            {replyProfileHref ? (
              <Link
                href={replyProfileHref}
                aria-label={`View ${name}'s profile`}
                className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500/40 text-xs font-bold text-white ring-1 ring-violet-300/30 transition hover:ring-2 hover:ring-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:size-9"
              >
                {replyAuthor?.profile_pic ? (
                  <img
                    src={
                      replyAuthor.profile_pic.startsWith("http")
                        ? replyAuthor.profile_pic
                        : `https://animehub-3-kbnb.onrender.com${replyAuthor.profile_pic.startsWith("/") ? "" : "/"}${replyAuthor.profile_pic}`
                    }
                    alt={name}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </Link>
            ) : (
              <div
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500/40 text-xs font-bold uppercase text-white ring-1 ring-violet-300/30 sm:size-9"
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              {replyProfileHref ? (
                <Link
                  href={replyProfileHref}
                  className="inline-block rounded px-1 py-0.5 text-xs font-semibold text-white transition hover:text-cyan-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:text-[13px]"
                >
                  {name}
                </Link>
              ) : (
                <p className="px-1 py-0.5 text-xs font-semibold text-white sm:text-[13px]">
                  {name}
                </p>
              )}
              <p className="mt-1 rounded-md bg-black/20 px-3 py-2 whitespace-pre-wrap wrap-break-word text-sm leading-5 text-indigo-100/90">
                {reply.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )}
                  {isOwnComment && isMenuOpen && (
                    <div className="absolute right-0 top-10 z-10 rounded-lg border border-violet-400/50 bg-[#1a1650] px-3 py-2 text-pink-100 shadow-lg">
                      <DeleteCommentButton
                        commentId={comment.id}
                        onDelete={() => {
                          dispatch(removeComment(comment.id));
                          setOpenMenuId(null);
                        }}
                      />
                    </div>
                  )}
                   </div>
                   
               
                </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-violet-500/35 px-4 py-6 text-center">
          <MessageCircle
            aria-hidden="true"
            className="mx-auto size-5 text-violet-300"
          />
          <p className="mt-2 text-sm font-semibold text-white">
            No comments yet
          </p>
          <p className="mt-1 text-sm text-indigo-300">
            Be the first to join the discussion.
          </p>
        </div>
      )}
    </section>
  );
};

export default Comments;
