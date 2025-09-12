import React, { useEffect } from "react";

const Ads = () => {
    useEffect(() => {
        // Dynamically load JuicyAds script
        const script = document.createElement("script");
        script.src = "https://poweredby.jads.co/js/jads.js";
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        document.body.appendChild(script);

        // Push adzone after script loads
        script.onload = () => {
            if (window.adsbyjuicy) {
                window.adsbyjuicy.push({ adzone: 1078510 });
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Example links (replace with your real ad links)
    const adLinks = [
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
        "https://t.me/sunmoa144",
    ];

    return (
        <div>
            {/* JuicyAds - Mobile only */}
            <div className="flex justify-center mb-4 block md:hidden">
                <ins id="1078510" data-width="300" data-height="250"></ins>
            </div>

            {/* Ads Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 8 }, (_, i) => {
                    const index = i + 1;
                    const ext =
                        index === 4 || index === 5 || index === 6 || index === 7 || index === 8 || index === 11 || index === 12 ? "png" : "jpg";

                    return (
                        <a
                            key={index}
                            href={adLinks[i]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <img
                                src={`/ads/${index}.${ext}`}
                                alt={`Ad ${index}`}
                                loading="lazy"
                                className="w-full h-auto"
                            />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default Ads;
