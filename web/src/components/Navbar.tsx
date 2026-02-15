"use client";

import { useRouter } from "next/navigation";
import ReactiveButton from "./common/ReactiveButton";
import Toggle from "./common/Toggle";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const router = useRouter();
  const { isLightMode, toggle } = useTheme();

  return (
    <header
      className="inline top-0 left-0 w-full z-50 transition-opacity duration-300"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="p-4 flex flex-row w-full justify-between items-center px-12">
        <div className="flex gap-6">
          <ReactiveButton 
            className="text-xl sm:text-2xl font-cursive font-bold py-2 px-4"
            onClick={() => router.push('/')}
          >
            LOGO
          </ReactiveButton>
          <ReactiveButton 
            className="text-xl sm:text-2xl font-cursive font-bold py-2 px-4"
            onClick={() => router.push('/map')}
          >
            MAP
          </ReactiveButton>
        </div>
        <div className="flex items-center">
          <Toggle 
            state={isLightMode}
            onToggle={toggle}
          />
          <img 
            src="/placeholder-pfp.png" 
            alt="User Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}