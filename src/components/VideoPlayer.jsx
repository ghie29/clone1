import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({ src }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;

        // Dispose previous instance if exists
        if (playerRef.current) {
            playerRef.current.dispose();
        }

        // Initialize Video.js player
        playerRef.current = videojs(videoRef.current, {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            preload: "auto",
            sources: [
                {
                    src, // pass your proxied HLS URL here
                    type: "application/x-mpegURL",
                },
            ],
        });

        // Cleanup on unmount
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, [src]);

    return (
        <div data-vjs-player className="w-full">
            <video
                ref={videoRef}
                className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9 w-full h-full"
                playsInline
            />
        </div>
    );
}
