
import React from "react";
import { HeroVisual } from "./HeroVisual";

export const HeroRight: React.FC = () => (
  <div className="flex items-center justify-center pt-8 md:pt-0 pb-2 md:pb-0 animate-fade-in">
    <div className="w-full max-w-lg rounded-3xl shadow-2xl bg-gradient-to-br from-blue-100 via-white to-purple-100 p-2 md:p-4">
      <HeroVisual />
    </div>
  </div>
);
