import { relatedPosts } from '../function/relatedposts';
import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import Link from 'next/link';
const API = "https://animehub-2-i11e.onrender.com";
import AutoPlayVideo from './AutoplayVideo';
interface RelatedPostProps {
  postId: number;
}

interface RelatedPostItem {
  id: number;
  title?: string;
  image?: string;
  video?: string;
  created_at?: string;
  author?: { username?: string; profile_pic?: string };
}

const RelatedPost = ({ postId }: RelatedPostProps) => {
  const [relatedPostsData, setRelatedPostsData] = useState<RelatedPostItem[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      try {
        const data = await relatedPosts(postId);
        console.log("Fetched related posts data:", data);
        setRelatedPostsData(data);
      } catch (error) {
        console.error("Error fetching related posts:", error);
        setError(error instanceof Error ? error : new Error("Failed to fetch related posts"));
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedPosts();
  }, [postId]);

  return (
    <div>
      <section aria-labelledby="related-heading" className="mt-12 border-t-4 border-violet-500/60 pt-8 sm:mt-16">
            <h2
                id="related-heading"
                className="mb-6 w-fit -skew-x-12 bg-yellow-300 px-3 py-1 text-sm font-black uppercase tracking-[0.18em] text-slate-950 sm:text-base"
            >
                Related Posts
            </h2>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 lg:grid-cols-3">
                {relatedPostsData.map((post, i) => (
                    <li
                        key={post.id}
                        style={{ animationDelay: `${i * 80}ms` }}
                        className="animate-card-in motion-reduce:animate-none"
                    >
                        <Link
                            href={`/main/posts/${post.id}`}
                            className="group flex h-full flex-row overflow-hidden border-2 border-violet-500/60 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] shadow-[4px_4px_0_rgba(139,92,246,0.5)] transition duration-300 hover:-translate-y-1 hover:border-pink-400 hover:shadow-[7px_7px_0_#ec4899] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:flex-col sm:shadow-[6px_6px_0_rgba(139,92,246,0.5)]"
                        >
                            {/* Media: small square on mobile, wide banner on larger screens */}
                            <div className="relative aspect-square w-28 shrink-0 overflow-hidden border-r-2 border-violet-500/60 bg-slate-950 transition-colors group-hover:border-pink-400 sm:aspect-5/3 sm:w-full sm:border-b-2 sm:border-r-0">
                                {post.image ? (
                                    <img
                                        src={`${API}${post.image}`}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:saturate-125"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#ec4899_0%,#8b5cf6_55%,#22d3ee_100%)]">
                                        {post.video ? (
                                            <AutoPlayVideo src={`${API}${post.video}`} fill />
                                        ) : (
                                            <span className="text-3xl font-black italic text-white/40 sm:text-5xl">Aa</span>
                                        )}
                                    </div>
                                )}
                                {post.video && post.image && (
                                    <span className="absolute bottom-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/70 text-white">
                                        <Play className="size-3 fill-white" />
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:p-5">
                                <h3 className="line-clamp-2 break-words text-base font-black leading-snug text-white transition-colors group-hover:text-pink-300 sm:text-lg">
                                    {post.title || 'Untitled post'}
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-indigo-300">
                                    <img
                                        src={post.author?.profile_pic ? `${API}${post.author.profile_pic}` : '/file.svg'}
                                        alt=""
                                        className="size-6 shrink-0 rounded-full bg-slate-900 object-cover ring-2 ring-pink-400"
                                    />
                                    <span className="min-w-0 truncate font-bold text-cyan-200">
                                        {post.author?.username || 'Anonymous'}
                                    </span>
                                    {post.created_at && (
                                        <span className="ml-auto shrink-0 font-semibold">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
      {error && <p>Error fetching related posts: {error.message}</p>}
      {loading && <div className="min-h-screen flex items-center justify-center bg-[#0b0d24] px-4 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] bg-size-[22px_22px]">
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
        </div> }
    </div>
  );
};

export default RelatedPost;