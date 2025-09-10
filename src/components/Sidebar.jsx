// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar({
    mobileMenuOpen,
    setMobileMenuOpen,
    boards,
    selectedBoard,
}) {
    return (
        <aside
            className={`bg-gray-800 w-64 p-4 border-r border-gray-700 absolute md:relative md:translate-x-0 z-20 transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:block"
                }`}
        >
            <h2 className="font-semibold mb-2 text-gray-300">Menu</h2>
            <ul className="space-y-1">
                <li key="main">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block w-full text-left px-2 py-1 rounded font-semibold ${!selectedBoard
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
                            className={`block w-full text-left px-2 py-1 rounded font-semibold ${selectedBoard?.id === b.id
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                                }`}
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
                        className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 font-semibold"
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
                <li>
                    <Link
                        to="/qna"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                    >
                        1:1 QnA
                    </Link>
                </li>
            </ul>
        </aside>
    );
}
