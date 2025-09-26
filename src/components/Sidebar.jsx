// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import {
    HomeIcon,
    InformationCircleIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

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
                        className={`flex items-center gap-2 px-2 py-1 rounded font-semibold ${!selectedBoard ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                            }`}
                    >
                        <HomeIcon className="w-5 h-5" />
                        Main
                    </Link>
                </li>

                {boards.map((b) => (
                    <li key={b.id}>
                        <Link
                            to={`/${b.slug}/1`}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-2 px-2 py-1 rounded font-semibold ${selectedBoard?.id === b.id
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                                }`}
                        >
                            <ArrowRightIcon className="w-5 h-5" />
                            {b.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <h2 className="font-semibold mb-2 text-gray-300 mt-4">How to Use?</h2>
            <ul className="space-y-1">
                <li>
                    <Link
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                    >
                        <InformationCircleIcon className="w-5 h-5" />
                        About Us
                    </Link>
                </li>
                <li>
                    <Link
                        to="/tos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                    >
                        <ShieldCheckIcon className="w-5 h-5" />
                        TOS
                    </Link>
                </li>
                <li>
                    <Link
                        to="/privacy"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                    >
                        <LockClosedIcon className="w-5 h-5" />
                        Privacy
                    </Link>
                </li>
                <li>
                    <a
                        href="https://t.me/dowinn0629"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 font-semibold"
                    >
                        <ArrowRightIcon className="w-5 h-5" />
                        Banner Inquiry
                    </a>
                </li>
            </ul>
        </aside>
    );
}
