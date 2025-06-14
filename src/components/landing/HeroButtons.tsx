
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroButtons: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Button
        variant="outline"
        size="lg"
        className="border-2 border-sunset-orange text-sunset-orange bg-white hover:bg-[#FFF6F2] shadow-md transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-sunset-orange font-semibold"
        onClick={() => navigate("/auth")}
      >
        Login
      </Button>
      <Button
        variant="default"
        size="lg"
        className="bg-gradient-to-br from-golden-yellow via-sunset-orange to-warm-coral text-white shadow-xl px-8 py-4 rounded-xl font-bold transition hover:scale-105 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-warm-coral"
        onClick={() => navigate("/auth?signup=true")}
      >
        Sign Up Free
      </Button>
    </div>
  );
};
