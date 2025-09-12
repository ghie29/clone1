import { Helmet } from "@dr.pogodin/react-helmet";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function About() {
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
                <title>About Us | AVKorTV</title>
                <meta
                    name="description"
                    content="Learn more about AVKorTV – your source for curated Korean videos."
                />
                <link
                    rel="canonical"
                    href={`https://redbang.xyz${location.pathname}`}
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
                    className={`bg-gray-800 w-64 p-4 border-r border-gray-700 absolute md:relative md:translate-x-0 z-20 transition-transform duration-200 ${mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:block"
                        }`}
                >
                    <h2 className="font-semibold mb-2 text-gray-300">Menu</h2>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/"
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Main
                            </Link>
                        </li>
                        {boards.map((b) => (
                            <li key={b.id}>
                                <Link
                                    to={`/${b.slug}/1`}
                                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {b.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <h2 className="font-semibold mb-2 text-gray-300 mt-4">
                        How to Use?
                    </h2>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded bg-blue-600 text-white font-semibold"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tos"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                            >
                                TOS
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                            >
                                Privacy
                            </Link>
                        </li>
                    </ul>
                </aside>

                {/* Main Content + Right Sidebar */}
                <div className="flex flex-1">
                    <main className="flex-1 p-6 space-y-4">
                        <h2 className="text-2xl font-bold">About Us</h2>
                        <p className="text-gray-300 leading-relaxed">
                            AVKorTV is a platform dedicated to curating and
                            sharing high-quality Korean videos. Our mission is
                            to deliver the best entertainment experience with an
                            easy-to-use and fast-loading website.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            We work hard to ensure that our content library
                            stays fresh and relevant. Thank you for choosing
                            AVKorTV as your entertainment destination.
                        </p>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block w-[300px] bg-gray-800 border-l border-gray-700 p-4">
                        <h2 className="font-bold text-gray-300 mb-2">
                            Sponsored
                        </h2>
                        <div className="space-y-4">
                            <div
                                className="bg-gray-700 h-60 flex items-center justify-center text-gray-400"
                                dangerouslySetInnerHTML={{
                                    __html: `
          <script type="text/javascript" data-cfasync="false" async src="https://poweredby.jads.co/js/jads.js"></script>
          <ins id="1047744" data-width="300" data-height="262"></ins>
          <script type="text/javascript" data-cfasync="false" async>
            (adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1047744});
          </script>
        `,
                                }}
                            />
                            <div className="bg-gray-700 h-60 flex items-center justify-center text-gray-400">
                                Banner Ad 2
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
