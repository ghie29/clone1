import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Watch from "./pages/Watch";
import About from "./pages/About";
import Tos from "./pages/Tos";
import Privacy from "./pages/Privacy";

export default function App() {
    return (
        <Routes>
            {/* Home + Boards */}
            <Route path="/" element={<Home />} />
            <Route path="/:boardSlug" element={<Home />} />
            <Route path="/:boardSlug/:page" element={<Home />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Video Watch Page */}
            <Route path="/watch/:slug" element={<Watch />} />

            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/tos" element={<Tos />} />
            <Route path="/privacy" element={<Privacy />} />
        </Routes>
    );
}
