"use client";

import { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  text: string;
  speed?: number;
}

export default function Marquee({ text, speed = 50 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const textWidth = textEl.scrollWidth;
    const containerWidth = container.offsetWidth;
    
    // Only enable animation if text is wider than container
    if (textWidth > containerWidth) {
      const distance = textWidth - containerWidth;
      setAnimationDuration(distance / speed);
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
  }, [text, speed]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative" }}
    >
      <div
        ref={textRef}
        className={`inline-block ${isHovered && shouldAnimate ? "animate-marquee" : ""}`}
        style={{
          transform: "translateX(0)",
          animationDuration: `${animationDuration}s`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
        }}
      >
        {text}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% + 10vw));
          }
        }
        .animate-marquee {
          animation-name: marquee;
        }
      `}</style>
    </div>
  );
}