'use client'

import  {categories as fetchCategories}  from "@/app/function/categories";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCategoryId } from "@/app/redux/features/categoryslicer"; 
import { setPosts } from "@/app/redux/features/postbycategoryslicer"; 


const  Categories = () => {

  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const pendingDelta = useRef(0);
  const rafId = useRef<number | null>(null);
  const isDesktop = useRef(false);

    useEffect(() => {
        const fetchCategoriesData = async () => {
            const data = await fetchCategories();
            if (data) {
                setCategories(data);
                console.log(data);
            }
        };
        fetchCategoriesData();
    }, []);

    useEffect(() => {
        isDesktop.current = window.matchMedia("(pointer: fine)").matches;
    }, []);

    const flushWheel = () => {
        const el = scrollRef.current;
        rafId.current = null;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        el.scrollLeft = Math.min(Math.max(el.scrollLeft + pendingDelta.current, 0), maxScroll);
        pendingDelta.current = 0;
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // Only hijack the wheel on desktop pointers; touch devices keep native swipe scrolling.
        if (!isDesktop.current || e.deltaY === 0) return;
        e.preventDefault();
        pendingDelta.current += e.deltaY;
        'behavior: smooth';
        if (rafId.current === null) {
            rafId.current = requestAnimationFrame(flushWheel);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDesktop.current || !scrollRef.current) return;
        isDragging.current = true;
        dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft };
    };

    const stopDragging = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDesktop.current || !isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x);
    };

    return(
     <div className="mx-auto mt-8 max-w-6xl px-3 sm:px-4">
    <div className="relative">

        {/* Left Slider */}
        

        {/* Categories */}
       <div className="mx-auto mt-8 max-w-6xl px-3 sm:px-4">
    <div
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onMouseMove={handleMouseMove}
        className="
            flex
            snap-x
            snap-proximity
            gap-2.5
            overflow-x-auto
            scroll-smooth
            px-1
            pb-3
            pt-1
            cursor-grab
            active:cursor-grabbing
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:gap-2.5
        "
    >

        <button
            type="button"
            onClick={() => (
                dispatch(setCategoryId(null)),
                dispatch(setPosts([]))
            )}
            className="
                flex shrink-0 snap-start items-center
                gap-1.5 rounded-full
                border-2 border-pink-400
                bg-[linear-gradient(90deg,#ec4899,#8b5cf6)]
                px-3 py-1.5
                text-sm font-black text-white
                shadow-[3px_3px_0_#22d3ee]
                transition
                hover:-translate-y-0.5
                hover:brightness-110
                hover:shadow-[4px_4px_0_#22d3ee]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300
                sm:gap-2 sm:px-4 sm:py-2
            "
        >
            All
        </button>

        {categories.map((category: any) => (
            <button
                type="button"
                onClick={() => (
                    dispatch(setCategoryId(category.id)),
                    dispatch(setPosts(category.posts ?? []))
                )}
                key={category.id}
                className="
                    flex shrink-0 snap-start items-center
                    gap-1.5 rounded-full
                    border-2 border-violet-500/60
                    bg-[#1a1650]
                    px-3 py-1.5
                    text-sm
                    shadow-[3px_3px_0_rgba(139,92,246,0.45)]
                    transition
                    hover:-translate-y-0.5
                    hover:border-pink-400
                    hover:shadow-[4px_4px_0_#ec4899]
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300
                    sm:gap-2 sm:px-4 sm:py-2
                "
            >
                <span className="text-xs font-bold text-indigo-100 sm:text-sm">
                    {category.name}
                </span>

                <span className="rounded-full border border-cyan-300/60 bg-cyan-300/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 sm:px-2 sm:text-xs">
                    {category.posts?.length ?? 0}
                </span>
            </button>
        ))}

    </div>
</div>
</div>
</div>
    )
}
export default Categories;