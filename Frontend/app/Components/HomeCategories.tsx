'use client'

import { homeCategories } from "../function/homecategories";
import React, { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import { setCategoryId } from "../redux/features/categoryslicer";
import { useRouter } from "next/navigation";


type Category = { id: number; name: string; posts: unknown[] };

const HomeCategories = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await homeCategories();
                setCategories(data);
            } catch (error) {
                console.error(error);
                setError(error instanceof Error ? error : new Error("Failed to fetch categories"));
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
       <div>
            {loading &&  <div className="flex min-h-40 items-center justify-center rounded-xl border border-violet-500/20 bg-[#0b0d24]/50 px-4 py-8">
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
            {error && <p className="mt-4 border-l-4 border-pink-500 bg-pink-500/10 px-4 py-3 text-sm font-semibold text-pink-200">Error: {error.message}</p>}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
    {categories.map((category) => (
        <div
            key={category.id}
            className="group cursor-pointer rounded-lg border border-violet-400/25 bg-[linear-gradient(160deg,#1a1650_0%,#12143a_100%)] p-3 shadow-sm shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:border-pink-400/70 hover:bg-[#211b59] sm:rounded-xl sm:p-5"
        >
            <div
                onClick={() => {
                    dispatch(setCategoryId(category.id));
                    router.push("/main/posts");
                }}
                className="flex min-h-20 touch-manipulation flex-col items-center justify-center gap-2 text-center"
            >
                <h3 className="text-xs font-semibold text-indigo-100 transition-colors
                               group-hover:text-white sm:text-base">
                    {category.name}
                </h3>
                <h4 className="min-w-8 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-cyan-200 transition-colors group-hover:border-pink-300/60 group-hover:bg-pink-400/15 group-hover:text-pink-100 sm:text-sm">
                    {category.posts.length}
                </h4>
            </div>
        </div>
    ))}
</div>
</div>
    );
};

export default HomeCategories;