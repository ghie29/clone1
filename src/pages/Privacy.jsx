import { Helmet } from "@dr.pogodin/react-helmet";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Privacy() {
    const location = useLocation();
    const [boards, setBoards] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        let { data } = await supabase
            .from("boards")
            .select("*")
            .order("position", { ascending: true });
        setBoards(data || []);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Helmet>
                <title>Privacy Policy | AVKorTV</title>
                <meta
                    name="description"
                    content="Read the Privacy Policy of AVKorTV to understand how we handle your data."
                />
                <link
                    rel="canonical"
                    href={`https://yourdomain.com${location.pathname}`}
                />
            </Helmet>

            {/* Header */}
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
                <h1 className="text-lg font-bold">
                    <Link to="/">AVKorTV</Link>
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
                    className={`bg-gray-800 w-64 p-4 border-r border-gray-700 absolute md:relative md:translate-x-0 h-full z-20 transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:block"
                        }`}
                >
                    <h2 className="font-bold mb-2 text-gray-300">Menu</h2>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/"
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Main
                            </Link>
                        </li>
                        {boards.map((b) => (
                            <li key={b.id}>
                                <Link
                                    to={`/${b.slug}/1`}
                                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
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
                    <main className="flex-1 p-4 space-y-4">
                        <h2 className="text-xl font-bold">Privacy Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Your privacy is important to us. AVKorTV does not share
                            or sell your personal data to third parties. We only
                            collect minimal information necessary to improve our
                            platform and user experience.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            By using AVKorTV, you consent to the terms of this
                            privacy policy. Updates may occur from time to time, so
                            please review this page periodically.
                        </p>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block w-[300px] bg-gray-800 border-l border-gray-700 p-4">
                        <h2 className="font-bold text-gray-300 mb-2">Sponsored</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                                Banner Ad 1
                            </div>
                            <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                                Banner Ad 2
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-center p-4 text-sm text-gray-400 border-t border-gray-700">
                © {new Date().getFullYear()} AVKorTV. All rights reserved.
            </footer>
        </div>
    );
}
