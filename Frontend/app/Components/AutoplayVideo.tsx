

"use client";

import { useEffect, useRef } from "react";

interface AutoPlayVideoProps {
    src: string;
    poster?: string;
    fill?: boolean;
}

export default function AutoPlayVideo({
    src,
    poster,
    fill = false,
}: AutoPlayVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isVisible = false;

    const observer = new IntersectionObserver(
        async (entries) => {
            for (const entry of entries) {
                isVisible = entry.isIntersecting;

                if (isVisible) {
                    try {
                        await video.play();
                    } catch (error) {
                        // Ignore expected interruptions
                        if (
                            error instanceof DOMException &&
                            error.name !== "AbortError"
                        ) {
                            console.error("Video playback error:", error);
                        }
                    }
                } else {
                    video.pause();
                }
            }
        },
        {
            threshold: 0.25,
        }
    );

    observer.observe(video);

    return () => {
        observer.disconnect();
        video.pause();
    };
}, [src]);
    return (
        <div
            className={`relative w-full overflow-hidden rounded-xl bg-black ${fill ? "h-full" : ""}`}
            onClick={(event) => event.stopPropagation()}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                controls
                className={`block w-full object-contain ${fill ? "absolute inset-0 h-full" : "h-auto max-h-[75vh] sm:max-h-[600px]"}`}
            >
                Your browser does not support video playback.
            </video>
        </div>
    );
}