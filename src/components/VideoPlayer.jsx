import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({ src }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;

        if (playerRef.current) {
            playerRef.current.dispose();
        }

        playerRef.current = videojs(videoRef.current, {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true, // 👈 Makes the player fluid width
            preload: "auto",
            sources: [
                {
                    src,
                    type: src.endsWith(".m3u8")
                        ? "application/x-mpegURL"
                        : "video/mp4",
                },
            ],
        });

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
