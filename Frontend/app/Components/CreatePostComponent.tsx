"use client";

import { useState, useEffect } from "react";
import { createPost } from "@/app/function/createpost";
import { categories as fetchCategories } from "@/app/function/categories";
import { toast } from 'sonner';

const CreatePostComponent = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);
        try {
            setLoading(true);
            await createPost(title, content, category, image, video);
            setSuccess(true);
            toast.success('Post published successfully');
            setTitle("");
            setContent("");
            setCategory("");
            setImage(null);
            setVideo(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create post";
            setError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
       <div className="min-h-screen bg-[#0b0d24] flex items-center justify-center px-4 py-10 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
            <div className="w-full max-w-xl">
                <div className="relative overflow-hidden bg-[#12143a]/95 border-2 border-violet-500/60 rounded-2xl shadow-[8px_8px_0_rgba(139,92,246,0.45)] p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black italic text-white drop-shadow-[3px_3px_0_#ec4899]">Create a post</h1>
                        <p className="mt-2 text-sm text-indigo-300">Share your thoughts with the community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-cyan-200 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give your post a title"
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] text-white placeholder-indigo-400/60 outline-none transition focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-cyan-200 mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post..."
                                rows={6}
                                required
                                className="w-full resize-y px-4 py-3 rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] text-white placeholder-indigo-400/60 outline-none transition focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-cyan-200 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] text-white outline-none transition [color-scheme:dark] focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899] [&>option]:bg-[#0b0d24] [&>option]:text-white"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-cyan-200 mb-2">Image,video (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className="w-full rounded-xl border-2 border-dashed border-violet-400/50 bg-violet-500/10 p-3 text-sm text-indigo-200 transition hover:border-pink-400 file:mr-4 file:rounded-full file:border-0 file:bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:brightness-110"
                            />
                            {image && <p className="mt-2 text-xs text-cyan-300">{image.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-cyan-200 mb-2">Video (optional)</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
                                className="w-full rounded-xl border-2 border-dashed border-violet-400/50 bg-violet-500/10 p-3 text-sm text-indigo-200 transition hover:border-pink-400 file:mr-4 file:rounded-full file:border-0 file:bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:brightness-110"
                            />
                            {video && <p className="mt-2 text-xs text-cyan-300">{video.name}</p>}
                        </div>

                        {error && <p className="border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-sm font-semibold text-pink-200">{error}</p>}
                        {success && <p className="border-l-4 border-cyan-300 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-200">Post created successfully.</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#22d3ee]"
                        >
                            {isSubmitting ? "Posting..." : "Create Post"}
                        </button>
                    </form>
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
        </div>
    );
};

export default CreatePostComponent;