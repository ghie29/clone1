import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
    return (
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-lg transition group">
            {/* Thumbnail */}
            <div className="relative w-full h-48 overflow-hidden">
                {video.thumbnail_url ? (
                    <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                        No Thumbnail
                    </div>
                )}
                {/* Overlay hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition"></div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-white line-clamp-1">{video.title}</h3>
                {video.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                    {/* Internal watch route using slug */}
                    <Link
                        to={`/watch/${video.slug}`}
                        className="text-blue-400 text-sm font-medium hover:text-blue-300 transition"
                    >
                        ▶ Watch
                    </Link>

                    {/* External link fallback */}
                    <a
                        href={video.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-300 transition"
                    >
                        Open URL
                    </a>
                </div>
            </div>
        </div>
    );
}
