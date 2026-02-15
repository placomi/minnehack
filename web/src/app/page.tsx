"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

// import PortalAnchor from "@/components/PortalAnchor";
// import Globe from "../components/Globe";

export default function Page() {
  const { isLightMode } = useTheme();
  return (
    <div className="flex min-h-screen">
      {/* Left side - Text */}
      <div className="flex-1 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Kintsugi
        </h1>
        <h2 className="text-2xl md:text-4xl mb-4">
          Healing starts with seeing.
        </h2>
        <p className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed">

        </p>
        <p className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed">
          {"Kintsugi is the Japanese art of mending broken pottery with gold. It doesn't hide cracks. It highlights them."}
        </p>
      </div>

      {/* Right side - Image (25% off screen) */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-256 lg:h-256 self-center" style={{ marginRight: "-20%" }}>
        <Image
          src={isLightMode ? "/images/upscaled_dark.png" : "/images/upscaled_light.png"}
          alt="Logo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
}