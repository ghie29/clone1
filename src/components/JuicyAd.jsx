// src/components/JuicyAd.jsx
import React from "react";

/**
 * JuicyAd
 * Renders a JuicyAds v3.0 ad unit using dangerouslySetInnerHTML.
 * @param {number} zone - JuicyAds adzone ID (default 1047744)
 * @param {number} width - Width of the ad in pixels (default 300)
 * @param {number} height - Height of the ad in pixels (default 262)
 */
export default function JuicyAd({
  zone = 1047744,
  width = 300,
  height = 262,
}) {
  return (
    <div
      className="bg-gray-700 h-60 flex items-center justify-center text-gray-400"
      dangerouslySetInnerHTML={{
        __html: `
          <script type="text/javascript" data-cfasync="false" async src="https://poweredby.jads.co/js/jads.js"></script>
          <ins id="${zone}" data-width="${width}" data-height="${height}"></ins>
          <script type="text/javascript" data-cfasync="false" async>
            (adsbyjuicy = window.adsbyjuicy || []).push({'adzone': ${zone}});
          </script>
        `,
      }}
    />
  );
}
