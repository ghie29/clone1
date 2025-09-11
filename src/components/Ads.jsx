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

    return (
        <div>
            {/* JuicyAds - Mobile only */}
            <div className="flex justify-center mb-4 block md:hidden">
                <ins id="1078510" data-width="300" data-height="250"></ins>
            </div>

            {/* Your Ads grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 16 }, (_, i) => {
                    const index = i + 1;
                    const ext =
                        index === 9 || index === 11 || index === 12 ? "png" : "jpg";
                    return (
                        <div key={index}>
                            <img
                                src={`/ads/${index}.${ext}`}
                                alt={`Ad ${index}`}
                                loading="lazy"
                                className="w-full h-auto rounded"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Ads;
