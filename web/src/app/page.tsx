"use client";
// import PortalAnchor from "@/components/PortalAnchor";
// import Globe from "../components/Globe";

export default function Page() {
  return (
    <div className="h-full" >
      <div className="w-64 h-64 md:w-80 md:h-80 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center mb-10">
        <span className="text-gray-400">Image Placeholder</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        Build. Connect. Empower.
      </h1>

      <p className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
        Our mission is to create a platform that brings people together through innovation.
        We believe in turning ideas into impact by building tools that empower communities
        and make collaboration effortless.
      </p>
    </div>
  );
}