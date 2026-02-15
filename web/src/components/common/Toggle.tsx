"use client";

import React from "react";

interface ToggleProps {
  state: boolean;
  onToggle: () => void;
}

export default function Toggle({ state, onToggle }: ToggleProps) {
  return (
    <div
      onClick={onToggle}
      className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        state ? 'bg-[var(--foreground)]' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          state ? 'translate-x-8 bg-[var(--background)]' : 'translate-x-0 bg-[var(--foreground)]'
        }`}
      />
    </div>
  );
}