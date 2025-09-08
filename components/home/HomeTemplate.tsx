"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { GameSection } from "@/components/game-section/GameSection";
import { OtherGames } from "@/components/other-games/OtherGames";
import { Features } from "@/components/features/Features";
import { WhatIs } from "@/components/what-is/WhatIs";
import { HowToPlay } from "@/components/how-to-play/HowToPlay";
import { FAQ } from "@/components/faq/FAQ";
import { Rating } from "@/components/rating/Rating";
import { Footer } from "@/components/layout/Footer";
import { getOtherGames } from "@/app/games/game-data";
import AdUnit, { AdaptiveBanner, MobileStickyAd } from "@/components/Ads/AdUnit";

export function HomeTemplate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const game = getOtherGames().find(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (game) {
      const element = document.getElementById("other-games");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* 顶部横幅广告 / Header Banner Ad */}
      <div className="w-full flex justify-center py-1 bg-gray-50/50">
        <AdaptiveBanner position="headerBanner" className="max-w-6xl" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <GameSection />
        
        {/* 游戏上方广告 / Above Game Ad */}
        <div className="w-full flex justify-center my-8">
          <AdUnit position="gameTopBanner" />
        </div>
        
        <OtherGames
          games={getOtherGames()}
          onGameSelect={setActiveGame}
        />
        
        {/* 内容区域广告 / Content Area Ad */}
        <div className="w-full flex justify-center my-12">
          <AdUnit position="contentBanner" />
        </div>
        
        <Features />
        <WhatIs />
        
        {/* 游戏下方广告 / Below Game Ad */}
        <div className="w-full flex justify-center my-12">
          <AdUnit position="gameBottomBanner" />
        </div>
        
        <HowToPlay />
        <FAQ />
        <section className="mb-16" id="rating">
          <Rating />
        </section>
      </main>

      <Footer />
      
      {/* 移动端底部广告 / Mobile Sticky Ad */}
      <MobileStickyAd />
    </div>
  );
}