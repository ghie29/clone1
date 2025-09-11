import { Helmet } from "@dr.pogodin/react-helmet";
import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import VideoPlayer from "../components/VideoPlayer";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Ads from "../components/Ads";

export default function Watch() {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // search
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchTotal, setSearchTotal] = useState(0);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 30;

    useEffect(() => {
        fetchBoards();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            fetchVideo();
        }
    }, [slug]);

    useEffect(() => {
        if (searchQuery.trim()) {
            fetchSearchVideos(page);
        }
    }, [searchQuery, page]);

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
        window.scrollTo(0, 0);
    };

    const fetchRelatedVideos = async (boardId, currentSlug) => {
        let { data } = await supabase
            .from("videos")
            .select("id, slug, title, thumbnail_url")
            .eq("board_id", boardId)
            .neq("slug", currentSlug)
            .limit(100);

        if (data) {
            const shuffled = data.sort(() => 0.5 - Math.random());
            setRelatedVideos(shuffled.slice(0, 18));
        }
    };

    const fetchSearchVideos = async (pageNum = 1) => {
        const from = (pageNum - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let { data, count, error } = await supabase
            .from("videos")
            .select("*", { count: "exact" })
            .or(
                `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
            )
            .order("created_at", { ascending: false })
            .range(from, to);

        if (!error) {
            setSearchResults(data || []);
            setSearchTotal(count || 0);
        } else {
            console.error(error);
        }
    };

    const totalPages = Math.max(1, Math.ceil(searchTotal / PAGE_SIZE));

    const changePage = (newPage) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    };

    const renderPlayer = () => {
        if (!video?.video_url) return null;
        const url = video.video_url.trim();

        if (url.endsWith(".m3u8") || url.endsWith(".mp4")) {
            return <VideoPlayer key={video.slug} src={url} fluid={true} />;
        }

        let hostname = "";
        try {
            hostname = new URL(url).hostname;
        } catch (e) {
            console.error("Bad video_url:", url);
        }

        if (hostname.includes("9xplayer.com")) {
            return (
                <iframe
                    key={video.slug}
                    src={url}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts"
                />
            );
        }

        return (
            <iframe
                key={video.slug}
                src={url}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
            />
        );
    };


    // JSON-LD
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
            embedUrl: `https://redbang.xyz/watch/${video.slug}`,
            publisher: {
                "@type": "Organization",
                name: "AVKorTV",
                logo: {
                    "@type": "ImageObject",
                    url: "https://redbang.xyz/avkortv_logo.png",
                },
            },
        }
        : null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Helmet>
                <title>
                    {searchQuery
                        ? `Search: ${searchQuery} - Page ${page} | AVKorTV`
                        : video
                            ? `${video.title} | AVKorTV`
                            : "Watch | AVKorTV"}
                </title>
                <meta
                    name="description"
                    content={
                        searchQuery
                            ? `Search results for ${searchQuery} on AVKorTV.`
                            : video?.description ||
                            (video
                                ? `Watch ${video.title} online on AVKorTV.`
                                : "Stay updated with the newest Korean AV content — uncensored and subtitled, only at AVKorTV.")
                    }
                />
                <link
                    rel="canonical"
                    href={`https://redbang.xyz${location.pathname}`}
                />
                {videoJsonLd && (
                    <script type="application/ld+json">
                        {JSON.stringify(videoJsonLd)}
                    </script>
                )}
            </Helmet>

            {/* Header */}
            <header className="bg-gray-800 text-white p-4 shadow">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">
                        <Link to="/">
                            <img
                                src="/avkortv_logo.png"
                                alt="AVKorTV Logo"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </h1>

                    <div className="flex items-center space-x-4">
                        {/* Search Icon */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600"
                        >
                            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                        </button>

                        {/* Avatar Icon */}
                        <button
                            className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600"
                        >
                            <UserCircleIcon className="h-6 w-6 text-white" />
                        </button>

                        {/* Hamburger Button */}
                        <button
                            className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Desktop Search Bar */}
                <div
                    className={`hidden md:block transition-all duration-300 overflow-hidden ${searchOpen ? "max-h-20 mt-4" : "max-h-0"
                        }`}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                </div>

                {/* Mobile Search Bar */}
                <div
                    className={`md:hidden transition-all duration-300 overflow-hidden ${searchOpen ? "max-h-20 mt-4" : "max-h-0"
                        }`}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    boards={boards}
                    selectedBoard={selectedBoard}
                />

                {/* Main */}
                <main className="flex-1 p-4">
                    {searchQuery ? (
                        <>
                            <Ads />
                            <h2 className="text-xl font-bold mb-4">
                                Search results for "{searchQuery}"
                            </h2>

                            {searchResults.length === 0 ? (
                                <p className="text-gray-400">
                                    No results found.
                                </p>
                            ) : (
                                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-6">
                                    {searchResults.map((v) => (
                                        <div
                                            key={v.id}
                                            className="bg-gray-800 border border-gray-700 rounded overflow-hidden shadow hover:shadow-lg transition"
                                        >
                                            <Link
                                                to={`/watch/${v.slug}`}
                                                className="block"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setPage(1);
                                                }}
                                            >
                                                {v.thumbnail_url ? (
                                                    <img
                                                        src={v.thumbnail_url}
                                                        alt={v.title}
                                                        loading="lazy"
                                                        className="w-full h-40 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400">
                                                        No Thumbnail
                                                    </div>
                                                )}
                                                <div className="p-2">
                                                    <h3 className="font-semibold text-white line-clamp-3">
                                                        {v.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 line-clamp-2">
                                                        {v.description}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {searchTotal > PAGE_SIZE && (
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm text-gray-400">
                                        Page {page} of {totalPages} (
                                        {searchTotal} videos)
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => changePage(1)}
                                            disabled={page === 1}
                                            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                                        >
                                            {"<<"}
                                        </button>
                                        <button
                                            onClick={() => changePage(page - 1)}
                                            disabled={page === 1}
                                            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => changePage(page + 1)}
                                            disabled={page === totalPages}
                                            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                        <button
                                            onClick={() => changePage(totalPages)}
                                            disabled={page === totalPages}
                                            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                                        >
                                            {">>"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : !video ? (
                        <p className="text-gray-400">Loading video...</p>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">{video.title}</h2>
                            <div className="w-full aspect-video bg-black rounded overflow-hidden">
                                {renderPlayer()}
                            </div>
                            <p className="text-gray-400">{video.description}</p>

                            {/* Related Videos */}
                            {relatedVideos.length > 0 && (
                                <div className="mt-8">
                                    <Ads />
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
                    <h2 className="font-bold text-gray-300 mb-2">배너</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                            배너 광고 1
                        </div>
                        <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                            배너 광고 2
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-center p-4 text-sm text-gray-400 space-y-2">
                <p>© {new Date().getFullYear()} AVKorTV. All rights reserved.</p>
                <p className="text-xs text-gray-500">
                    Disclaimer: AVKorTV does not own or host any videos or files. All content is provided by third-party services.
                </p>
            </footer>
        </div>
    );
}
