import React from "react";

const Ads = () => {
    return (
        <div>
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
