
import React from "react";

export const PulseIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 52,
  className = '',
}) => (
  <span className={`relative flex items-center justify-center ${className}`}>
    <span
      className="absolute bg-sunset-orange rounded-full blur-md animate-pulse-ring opacity-60"
      style={{
        width: size * 1.2,
        height: size * 1.2,
        left: -(size * 0.1),
        top: -(size * 0.1),
      }}
      aria-hidden="true"
    ></span>
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="z-10"
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="url(#pulse-gradient)"
        opacity="0.92"
      />
      <path
        d="M15 24c2 0 2.5 10 6 10s4-20 8-20"
        stroke="#FFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <radialGradient
          id="pulse-gradient"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(24 24) scale(22)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC93C" />
          <stop offset="0.55" stopColor="#FF6B35" />
          <stop offset="1" stopColor="#F67280" />
        </radialGradient>
      </defs>
    </svg>
  </span>
);
