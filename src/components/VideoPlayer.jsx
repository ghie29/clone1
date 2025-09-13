import { useEffect, useRef } from "react";

export default function VideoPlayer({ src }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // If Hls.js is available and supported by this browser
        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            // Clean up when src changes or component unmounts
            return () => {
                hls.destroy();
            };
        }

        // Fallback for Safari (built-in HLS support)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else {
            // For MP4 or other direct video sources
            video.src = src;
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            playsInline
            className="w-full h-full rounded-md bg-black"
        />
    );
}
