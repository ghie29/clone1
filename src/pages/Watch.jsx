import { Helmet } from "@dr.pogodin/react-helmet";
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import VideoPlayer from "../components/VideoPlayer";

export default function Watch() {
    const { slug } = useParams();
    const location = useLocation();

    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchBoards();
        fetchVideo();
        window.scrollTo(0, 0); // scroll top when video changes
    }, [slug]);

    const fetchBoards = async () => {
        let { data } = await supabase
            .from("boards")
            .select("*")
            .order("position", { ascending: true });
        setBoards(data || []);
    };

    const fetchVideo = async () => {
        let { data } = await supabase
            .from("videos")
            .select("*, boards(*)")
            .eq("slug", slug)
            .single();

        setVideo(data);
        if (data?.boards) {
            setSelectedBoard(data.boards);
            fetchRelatedVideos(data.boards.id, data.slug);
        }
    };

    const fetchRelatedVideos = async (boardId, currentSlug) => {
        let { data } = await supabase
            .from("videos")
            .select("id, slug, title, thumbnail_url")
            .eq("board_id", boardId) // same board only
            .neq("slug", currentSlug) // exclude current
            .limit(100);

        if (data) {
            const shuffled = data.sort(() => 0.5 - Math.random());
            setRelatedVideos(shuffled.slice(0, 18)); // pick 16
        }
    };

    const renderPlayer = () => {
        if (!video?.video_url) return null;

        const url = video.video_url;

        if (url.endsWith(".m3u8") || url.endsWith(".mp4")) {
            // add key so component resets on slug change
            return <VideoPlayer key={video.slug} src={url} fluid={true} />;
        }

        return (
            <iframe
                key={video.slug} // force reload iframe too
                src={url}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
            />
        );
    };


    // JSON-LD structured data
    const videoJsonLd = video
        ? {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description:
                video.description ||
                `Watch ${video.title} online on AVKorTV.`,
            thumbnailUrl: [video.thumbnail_url],
            uploadDate: video.created_at || new Date().toISOString(),
            contentUrl: video.video_url,
            embedUrl: `https://yourdomain.com/watch/${video.slug}`,
            publisher: {
                "@type": "Organization",
                name: "AVKorTV",
                logo: {
                    "@type": "ImageObject",
                    url: "https://yourdomain.com/logo.png",
                },
            },
        }
        : null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Helmet>
                <title>
                    {video ? `${video.title} | AVKorTV` : "Watch | AVKorTV"}
                </title>
                <meta
                    name="description"
                    content={
                        video?.description ||
                        (video
                            ? `Watch ${video.title} online on AVKorTV.`
                            : "Watch the latest videos on AVKorTV.")
                    }
                />
                <link
                    rel="canonical"
                    href={`https://yourdomain.com${location.pathname}`}
                />
                {/* Open Graph / Twitter tags omitted for brevity */}
                {videoJsonLd && (
                    <script type="application/ld+json">
                        {JSON.stringify(videoJsonLd)}
                    </script>
                )}
            </Helmet>

            {/* Header */}
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
                <h1 className="text-4xl font-bold">
                    <Link to="/">
                        <img
                            src="/avkortv_logo.png"
                            alt="AVKorTV Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </h1>
                <button
                    className="md:hidden bg-gray-700 px-3 py-1 rounded"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>
            </header>

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside
                    className={`bg-gray-800 w-64 p-4 border-r border-gray-700 absolute md:relative md:translate-x-0  z-20 transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:block"
                        }`}
                >
                    <h2 className="font-bold mb-2 text-gray-300">Menu</h2>
                    <ul className="space-y-1">
                        <li key="main">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block w-full text-left px-2 py-1 rounded ${!selectedBoard
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-700"
                                    }`}
                            >
                                Main
                            </Link>
                        </li>

                        {boards.map((b) => (
                            <li key={b.id}>
                                <Link
                                    to={`/${b.slug}/1`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block w-full text-left px-2 py-1 rounded ${selectedBoard?.id === b.id
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-700"
                                        }`}
                                >
                                    {b.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <h2 className="font-bold mb-2 text-gray-300 mt-4">How to Use?</h2>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tos"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                            >
                                TOS
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                            >
                                Privacy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/qna"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                            >
                                1:1 QnA
                            </Link>
                        </li>
                    </ul>
                </aside>


                {/* Main Content + Right Sidebar */}
                <div className="flex flex-1">
                    <main className="flex-1 p-4">
                        {!video ? (
                            <p className="text-gray-400">Loading video...</p>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold">
                                    {video.title}
                                </h2>
                                <div className="w-full aspect-video bg-black rounded overflow-hidden">
                                    {renderPlayer()}
                                </div>
                                <p className="text-gray-400">
                                    {video.description}
                                </p>

                                {/* Related Videos */}
                                {relatedVideos.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-bold mb-4">
                                            더 많은 동영상
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                            {relatedVideos.map((rv) => (
                                                <Link
                                                    key={rv.id}
                                                    to={`/watch/${rv.slug}`}
                                                    className="block bg-gray-800 rounded overflow-hidden hover:bg-gray-700 transition"
                                                >
                                                    <img
                                                        src={
                                                            rv.thumbnail_url ||
                                                            "https://via.placeholder.com/300x200?text=No+Image"
                                                        }
                                                        alt={rv.title}
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <div className="p-2 text-sm text-gray-200 line-clamp-2">
                                                        {rv.title}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block w-[300px] bg-gray-800 border-l border-gray-700 p-4">
                        <h2 className="font-bold text-gray-300 mb-2">
                            배너
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                                배너 광고 1
                            </div>
                            <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                                배너 광고 1
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-center p-4 text-sm text-gray-400">
                © {new Date().getFullYear()} AVKorTV. All rights reserved.
            </footer>
        </div>
    );
}
