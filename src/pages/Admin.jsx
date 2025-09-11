import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
    // ---------- AUTH ----------
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    // ---------- BOARDS ----------
    const [boards, setBoards] = useState([]);
    const [boardName, setBoardName] = useState("");
    const [boardCategory, setBoardCategory] = useState("");

    // ---------- VIDEOS ----------
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState({
        title: "",
        description: "",
        board_id: "",
        video_url: "",
        thumbnail_url: "",
        slug: "",
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});

    // ---------- AUTH EFFECT ----------
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    // ---------- BOARDS EFFECT ----------
    useEffect(() => {
        fetchBoards();
    }, []);

    // ---------- VIDEOS EFFECT ----------
    useEffect(() => {
        fetchVideos();
    }, [search, page, boards]);

    // ---------- AUTH FUNCS ----------
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError("");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (loading) return <p className="p-6">Loading...</p>;

    // ---------- LOGIN SCREEN ----------
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                    {authError && <p className="text-red-500 text-sm mb-3">{authError}</p>}
                    <form onSubmit={handleLogin} className="space-y-3">
                        <input
                            type="email"
                            className="border w-full px-3 py-2 rounded"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="border w-full px-3 py-2 rounded"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ---------- HELPERS ----------
    const slugifyKorean = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9가-힣-]/g, "");
    };

    // ---------- BOARDS FUNCS ----------
    const fetchBoards = async () => {
        let { data, error } = await supabase
            .from("boards")
            .select("*")
            .order("position", { ascending: true });

        if (error) {
            console.error("fetchBoards error", error);
            setBoards([]);
            return;
        }
        setBoards(data || []);
    };

    const addBoard = async () => {
        if (!boardName) return;

        const slug = slugifyKorean(boardName);
        const { data: maxBoard } = await supabase
            .from("boards")
            .select("position")
            .order("position", { ascending: false })
            .limit(1)
            .maybeSingle();

        const newPosition = maxBoard ? maxBoard.position + 1 : 0;

        await supabase.from("boards").insert([{
            name: boardName,
            slug,
            position: newPosition,
            category: boardCategory || null,
        }]);

        setBoardName("");
        setBoardCategory("");
        fetchBoards();
    };

    const updateBoard = async (id, field, value) => {
        if (!value) return;
        await supabase.from("boards").update({ [field]: value }).eq("id", id);
        fetchBoards();
    };

    const moveBoard = async (id, direction) => {
        const index = boards.findIndex((b) => b.id === id);
        if (index === -1) return;

        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= boards.length) return;

        const currentBoard = boards[index];
        const swapBoard = boards[swapIndex];

        await supabase.from("boards")
            .update({ position: swapBoard.position })
            .eq("id", currentBoard.id);

        await supabase.from("boards")
            .update({ position: currentBoard.position })
            .eq("id", swapBoard.id);

        fetchBoards();
    };
    // ---------- VIDEOS FUNCS ----------
    const fetchVideos = async () => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
            .from("videos")
            .select("*, boards(name)", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (search && search.trim() !== "") {
            query = query.ilike("title", `%${search}%`);
        }

        const { data, count, error } = await query;
        if (error) {
            console.error("fetchVideos error", error);
            setVideos([]);
            setTotal(0);
            return;
        }
        setVideos(data || []);
        setTotal(count || 0);
        setSelectedIds([]);
    };

    const addVideo = async () => {
        if (!newVideo.title || !newVideo.video_url || !newVideo.board_id) return;
        const slug = newVideo.slug?.trim()
            ? slugifyKorean(newVideo.slug)
            : slugifyKorean(newVideo.title);

        const payload = {
            title: newVideo.title,
            description: newVideo.description || null,
            board_id: newVideo.board_id,
            video_url: newVideo.video_url,
            thumbnail_url: newVideo.thumbnail_url || null,
            slug,
        };

        await supabase.from("videos").insert([payload]);
        setNewVideo({ title: "", description: "", board_id: "", video_url: "", thumbnail_url: "", slug: "" });
        setPage(1);
        fetchVideos();
    };

    const startEdit = (video) => {
        setEditingId(video.id);
        setEditingData({
            title: video.title || "",
            description: video.description || "",
            video_url: video.video_url || "",
            thumbnail_url: video.thumbnail_url || "",
            board_id: video.board_id || "",
            slug: video.slug || "",
        });
    };

    const saveEdit = async (id) => {
        const payload = {
            title: editingData.title,
            description: editingData.description || null,
            video_url: editingData.video_url,
            thumbnail_url: editingData.thumbnail_url || null,
            board_id: editingData.board_id,
            slug: editingData.slug
                ? slugifyKorean(editingData.slug)
                : slugifyKorean(editingData.title),
        };
        await supabase.from("videos").update(payload).eq("id", id);
        setEditingId(null);
        setEditingData({});
        fetchVideos();
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === videos.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(videos.map((v) => v.id));
        }
    };

    const deleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} selected videos? This cannot be undone.`)) return;
        await supabase.from("videos").delete().in("id", selectedIds);
        setSelectedIds([]);
        fetchVideos();
    };

    const deleteVideo = async (id) => {
        if (!confirm("Delete this video?")) return;
        await supabase.from("videos").delete().eq("id", id);
        fetchVideos();
    };

    const totalPages = Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));
    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    // ---------- RETURN UI ----------
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Boards Section */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Boards</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            className="border px-2 py-1 flex-1"
                            placeholder="New board name"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                        />
                        <input
                            className="border px-2 py-1 flex-1"
                            placeholder="Category (e.g. Korean)"
                            value={boardCategory}
                            onChange={(e) => setBoardCategory(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white px-3 rounded"
                            onClick={addBoard}
                        >
                            Add
                        </button>
                    </div>

                    <ul className="space-y-2">
                        {boards.map((b, idx) => (
                            <li key={b.id} className="flex items-center justify-between border p-2 rounded">
                                <div className="flex-1 flex gap-2">
                                    <input
                                        className="border px-2 py-1 flex-1"
                                        defaultValue={b.name}
                                        onBlur={(e) => updateBoard(b.id, "name", e.target.value)}
                                    />
                                    <input
                                        className="border px-2 py-1 flex-1"
                                        defaultValue={b.category || ""}
                                        placeholder="Category"
                                        onBlur={(e) => updateBoard(b.id, "category", e.target.value)}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 mr-4">/{b.slug}</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => moveBoard(b.id, "up")}
                                        disabled={idx === 0}
                                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveBoard(b.id, "down")}
                                        disabled={idx === boards.length - 1}
                                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Videos Section */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Videos</h2>

                    {/* Add Video Form */}
                    <div className="space-y-2 mb-4 border-b pb-4">
                        <input
                            className="border px-2 py-1 w-full"
                            placeholder="Title"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        />
                        <input
                            className="border px-2 py-1 w-full"
                            placeholder="Slug (optional)"
                            value={newVideo.slug}
                            onChange={(e) => setNewVideo({ ...newVideo, slug: e.target.value })}
                        />
                        <textarea
                            className="border px-2 py-1 w-full"
                            placeholder="Description"
                            value={newVideo.description}
                            onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        />
                        <select
                            className="border px-2 py-1 w-full"
                            value={newVideo.board_id}
                            onChange={(e) => setNewVideo({ ...newVideo, board_id: e.target.value })}
                        >
                            <option value="">Select board</option>
                            {boards.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        <input
                            className="border px-2 py-1 w-full"
                            placeholder="Video URL (iframe/mp4/m3u8)"
                            value={newVideo.video_url}
                            onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                        />
                        <input
                            className="border px-2 py-1 w-full"
                            placeholder="Thumbnail URL"
                            value={newVideo.thumbnail_url}
                            onChange={(e) => setNewVideo({ ...newVideo, thumbnail_url: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={addVideo}
                            >
                                Add Video
                            </button>
                        </div>
                    </div>

                    {/* Search & bulk actions */}
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="checkbox"
                            checked={selectedIds.length === videos.length && videos.length > 0}
                            onChange={toggleSelectAll}
                        />
                        <span className="text-sm text-gray-600">Select All</span>
                        <input
                            className="border px-2 py-1 flex-1"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                            onClick={deleteSelected}
                            disabled={selectedIds.length === 0}
                        >
                            Bulk Delete ({selectedIds.length})
                        </button>
                    </div>

                    {/* Videos list */}
                    <div className="space-y-2">
                        {videos.map((v) => (
                            <div key={v.id} className="border p-2 rounded flex gap-3 items-start">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(v.id)}
                                    onChange={() => toggleSelect(v.id)}
                                    className="mt-1"
                                />
                                <div className="w-28 h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                                    {v.thumbnail_url ? (
                                        <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                                            No Thumbnail
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    {editingId === v.id ? (
                                        <div className="space-y-2">
                                            <input
                                                className="border px-2 py-1 w-full"
                                                value={editingData.title}
                                                onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                                            />
                                            <input
                                                className="border px-2 py-1 w-full"
                                                value={editingData.slug}
                                                onChange={(e) => setEditingData({ ...editingData, slug: e.target.value })}
                                                placeholder="slug"
                                            />
                                            <textarea
                                                className="border px-2 py-1 w-full"
                                                value={editingData.description}
                                                onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                                            />
                                            <select
                                                className="border px-2 py-1 w-full"
                                                value={editingData.board_id}
                                                onChange={(e) => setEditingData({ ...editingData, board_id: e.target.value })}
                                            >
                                                <option value="">Select board</option>
                                                {boards.map((b) => (
                                                    <option key={b.id} value={b.id}>
                                                        {b.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                className="border px-2 py-1 w-full"
                                                value={editingData.video_url}
                                                onChange={(e) => setEditingData({ ...editingData, video_url: e.target.value })}
                                                placeholder="video url"
                                            />
                                            <input
                                                className="border px-2 py-1 w-full"
                                                value={editingData.thumbnail_url}
                                                onChange={(e) => setEditingData({ ...editingData, thumbnail_url: e.target.value })}
                                                placeholder="thumbnail url"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                    onClick={() => saveEdit(v.id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-gray-300 px-3 py-1 rounded"
                                                    onClick={() => { setEditingId(null); setEditingData({}); }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{v.title}</p>
                                                    <p className="text-sm text-gray-600">Board: {v.boards?.name}</p>
                                                    <p className="text-sm text-gray-500">/{v.slug}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-2 py-1 bg-yellow-300 rounded"
                                                        onClick={() => startEdit(v)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                                        onClick={() => deleteVideo(v.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <a href={v.video_url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                                                Open source URL
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Showing page {page} of {totalPages} — {total || 0} total
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => goToPage(1)}
                                disabled={page === 1}
                            >
                                {"<<"}
                            </button>
                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                            >
                                Prev
                            </button>
                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => goToPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => goToPage(totalPages)}
                                disabled={page === totalPages}
                            >
                                {">>"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
