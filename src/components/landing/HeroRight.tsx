
import React from "react";
import { HeroVisual } from "./HeroVisual";

export const HeroRight: React.FC = () => (
  <div className="flex items-center justify-center pt-16 md:pt-0 pb-6 md:pb-0 animate-fade-in">
    <div className="w-full max-w-xl">
      <HeroVisual />
    </div>
  </div>
);
