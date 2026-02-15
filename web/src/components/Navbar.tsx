"use client";

import { useRouter } from "next/navigation";
import ReactiveButton from "./common/ReactiveButton";
import Toggle from "./common/Toggle";
import { useState } from "react";
// import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const router = useRouter();
  const { isLightMode, toggle } = useTheme();
  // const isLightMode = true;
  // const toggle = () => {};

  return (
    <header
      className="inline top-0 left-0 w-full z-50 transition-opacity duration-300"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="p-4 flex flex-row w-full justify-between items-center px-12">
        <div className="flex gap-6">
          <ReactiveButton 
            className="text-xl sm:text-3xl font-cursive font-bold py-2 px-4"
            onClick={() => router.push('/')}
          >
            LOGO HERE
            {/* <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              priority
            /> */}
          </ReactiveButton>
          <ReactiveButton 
            className="text-xl sm:text-3xl font-cursive font-bold py-2 px-4"
            onClick={() => router.push('/map')}
          >
            Map
          </ReactiveButton>
        </div>
        <div className="flex items-center gap-6">
          <Toggle 
            state={isLightMode}
            onToggle={toggle}
          />
          <Image
            src="/images/default_pfp.jpg"
            alt="Profile Picture"
            width={40}
            height={40}
            priority
            className="rounded-full border-2 border-gray-300"
          />
        </div>
      </div>
    </header>
  );
}