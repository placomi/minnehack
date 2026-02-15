"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

// import PortalAnchor from "@/components/PortalAnchor";
// import Globe from "../components/Globe";

export default function Page() {
  const { isLightMode } = useTheme();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        Kintsugi
      </h1>
      <h2>
        Healing starts with seeing.
      </h2>
        <p className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
          
        </p>
      <div className="w-64 h-64 md:w-80 md:h-80">
        <Image
          src={isLightMode ? "/images/logo_colored.png" : "/images/logo_light.png"}
          alt="Logo"
          width={400}
          height={400}
          priority
        />
      </div>
      <p>
        Kintsugi is the Japanese art of mending broken pottery with gold.
It doesn’t hide cracks.
It highlights them.

      </p>
    </div>
  );
}