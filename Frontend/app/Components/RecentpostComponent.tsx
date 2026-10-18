'use client'

import {recentPosts} from '../function/recentposts';
import { useEffect, useState } from 'react';
import Link from 'next/link';



const RecentpostComponent = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            const data = await recentPosts();
            setPosts(data);
        };
        fetchRecentPosts();
    }, []);

    return (
         <div className="w-full py-5 sm:py-6">
     <div className="mx-auto w-full">

        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div className="border-l-2 border-cyan-300 pl-3 sm:border-l-4">
                <h2 className="text-lg font-bold text-white sm:text-2xl">
                    Recent Posts
                </h2>

                <p className="mt-1 text-sm text-indigo-300">
                    Latest articles from our community
                </p>
            </div>

            
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {posts.map((post: any) => (
                <Link
                    key={post.id}
                    href={`/main/posts/${post.post.id}`}
                    className="group rounded-lg border border-violet-400/25 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] p-4 shadow-sm shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:border-pink-400/70 hover:bg-[#211b59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:rounded-xl sm:p-5"
                >
                    {/* Post title */}
                    <h3 className="line-clamp-2 text-base font-extrabold leading-6 text-white transition-colors group-hover:text-pink-300 sm:text-lg">
                        {post.post.title}
                    </h3>

                    {/* Author */}
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-sm font-black text-white ring-2 ring-white/80 ring-offset-2 ring-offset-[#12143a]">
                            {post.user.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-cyan-200">
                                {post.user.username}
                            </p>

                            <p className="text-xs text-indigo-300">
                                Author
                            </p>
                        </div>
                    </div>

                    {/* Read more */}
                    <div className="mt-4 border-t border-violet-400/20 pt-3 sm:mt-5 sm:pt-4">
                        <span className="text-sm font-semibold text-cyan-200 transition-colors group-hover:text-pink-200">
                            Read article →
                        </span>
                    </div>
                </Link>
            ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
            <div className="rounded-lg border border-dashed border-violet-400/30 bg-[#12143a]/50 px-4 py-8 text-center sm:rounded-xl sm:px-6 sm:py-10">
                <p className="text-sm font-semibold text-indigo-300">
                    No recent posts available.
                </p>
            </div>
        )}
    </div>
</div>
    );
};

export default RecentpostComponent;