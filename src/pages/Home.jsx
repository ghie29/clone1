import { Helmet } from "@dr.pogodin/react-helmet";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Ads from "../components/Ads";

export default function Home() {
    const { boardSlug, page: pageParam } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [boards, setBoards] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // pagination
    const [page, setPage] = useState(Number(pageParam) || 1);
    const [total, setTotal] = useState(0);
    const PAGE_SIZE = 30;

    useEffect(() => {
        fetchBoards();
    }, []);

    useEffect(() => {
        if (boardSlug && boards.length > 0) {
            const board = boards.find((b) => b.slug === boardSlug);
            setSelectedBoard(board || null);
            setPage(Number(pageParam) || 1);
        } else {
            setSelectedBoard(null);
            setVideos([]);
        }
    }, [boardSlug, pageParam, boards]);

    useEffect(() => {
        if (selectedBoard) {
            fetchVideos(selectedBoard.id, page);
        }
    }, [selectedBoard, page]);

    const fetchBoards = async () => {
        let { data } = await supabase
            .from("boards")
            .select("*")
            .order("position", { ascending: true });
        setBoards(data || []);
    };

    const fetchVideos = async (boardId, pageNum = 1) => {
        const from = (pageNum - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let { data, count, error } = await supabase
            .from("videos")
            .select("*", { count: "exact" })
            .eq("board_id", boardId)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (!error) {
            setVideos(data || []);
            setTotal(count || 0);
        } else {
            console.error(error);
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const changePage = (newPage) => {
        if (!selectedBoard) return;
        setPage(newPage);
        navigate(`/${selectedBoard.slug}/${newPage}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Helmet>
                <title>
                    {selectedBoard
                        ? `${selectedBoard.name} - Page ${page} | AVKorTV`
                        : "AVKorTV - Home"}
                </title>
                <meta
                    name="description"
                    content={
                        selectedBoard
                            ? `Browse ${selectedBoard.name} videos on page ${page}. Watch the latest updates on AVKorTV.`
                            : "Explore the latest uncensored, subbed, and Korean AV videos on AVKorTV."
                    }
                />
                <link
                    rel="canonical"
                    href={`https://yourdomain.com${location.pathname}`}
                />
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

                <div className="flex items-center space-x-4">
                    {/* Search Icon */}
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600">
                        <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                    </button>

                    {/* Hamburger Button */}
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600 md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        ☰
                    </button>
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
                    {!selectedBoard ? (
                        <>
                            <Ads />
                        </>
                    ) : videos.length === 0 ? (
                        <p className="text-gray-400">
                            No videos found in {selectedBoard.name}.
                        </p>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-4">
                                        <Ads />
                                {selectedBoard.name}
                            </h2>
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-6">
                                {videos.map((v) => (
                                    <div
                                        key={v.id}
                                        className="bg-gray-800 border border-gray-700 rounded overflow-hidden shadow hover:shadow-lg transition"
                                    >
                                        <Link
                                            to={`/watch/${v.slug}`}
                                            className="block"
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

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-sm text-gray-400">
                                    Page {page} of {totalPages} ({total} videos)
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
                        </>
                    )}
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-center p-4 text-sm text-gray-400">
                © {new Date().getFullYear()} AVKorTV. All rights reserved.
            </footer>
        </div>
    );
}
