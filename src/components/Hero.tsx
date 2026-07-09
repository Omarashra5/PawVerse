import React from "react";
import { Sparkles, Trophy, Flame, ChevronRight, Compass, ShieldCheck, Heart } from "lucide-react";
import { motion } from "motion/react";
import { Breed } from "../types";

interface HeroProps {
  onSearchTag: (tag: string) => void;
  breedOfTheDay: Breed | null;
  onViewBreed: (breed: Breed) => void;
  loadingBreedOfTheDay: boolean;
  featuredCats: Breed[];
  featuredDogs: Breed[];
}

export default function Hero({
  onSearchTag,
  breedOfTheDay,
  onViewBreed,
  loadingBreedOfTheDay,
  featuredCats,
  featuredDogs,
}: HeroProps) {
  const trendingTags = ["Persian", "Bengal", "Husky", "Retriever", "Maine Coon", "Pug", "Siamese"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div id="hero-section" className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      
      <div className="absolute top-1/4 left-1/12 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-1/4 right-1/12 w-[450px] h-[450px] bg-amber-600/10 dark:bg-amber-600/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse duration-7000" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full filter blur-[90px] pointer-events-none animate-pulse duration-6000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/15">
              <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest">
                The Ultimate Pet Discovery Engine
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Discover the world of <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Feline & Canine
              </span>{" "}
              majesty.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-sans max-w-xl leading-relaxed"
            >
              Explore and compare breed lineage, distinctive temperaments, lifespans, and premium image collections powered by real-time API services.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-3">
              <span className="flex items-center space-x-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Trending Breeds</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                   <button
                     key={tag}
                     onClick={() => onSearchTag(tag)}
                     className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all cursor-pointer hover:scale-102"
                   >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/5 pt-8"
            >
              <div className="space-y-1">
                <p className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">180+</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Global Breeds</p>
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">50k+</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">HD Images</p>
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">100%</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accurate Data</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              variants={itemVariants}
              className="relative rounded-[32px] overflow-hidden glass p-4 bg-white/5 dark:bg-black/35 shadow-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-orange-500">
                  <Trophy className="w-4 h-4" />
                  <span className="uppercase tracking-widest font-mono text-[10px]">Breed of the Day</span>
                </span>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
              </div>

              {loadingBreedOfTheDay ? (
                <div className="h-[320px] rounded-2xl shimmer-bg flex items-center justify-center">
                  <span className="text-xs text-slate-400 font-mono">Selecting today's elite breed...</span>
                </div>
              ) : breedOfTheDay ? (
                <div className="space-y-4">
                  <div className="relative h-[240px] rounded-2xl overflow-hidden group">
                    <img
                      src={breedOfTheDay.image?.url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80"}
                      alt={breedOfTheDay.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-lg">
                        {breedOfTheDay.type}
                      </span>
                      <h3 className="text-xl font-display font-bold text-white mt-1.5">{breedOfTheDay.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 px-2 text-sm">
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {breedOfTheDay.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Origin</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{breedOfTheDay.origin || "Unknown"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Lifespan</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{breedOfTheDay.life_span || "N/A"}</span>
                      </div>
                    </div>
                    
                    <button
                      id="view-breed-day-btn"
                      onClick={() => onViewBreed(breedOfTheDay)}
                      className="w-full mt-3 flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 cursor-pointer transition-all hover:shadow-orange-500/30"
                    >
                      <span>Explore Lineage & Stats</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-[320px] rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <span className="text-xs text-slate-400">Failed to load breed of the day</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        <section className="mt-28 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-500">
              <span className="uppercase tracking-widest font-mono text-[10px]">Curated Showcases</span>
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Aesthetics in Every Breed
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Discover the most famous breeds selected from our global registry, displaying distinct traits, beautiful details, and lineage.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Distinguished Felines (Cats)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCats.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onViewBreed(cat)}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-white/5 hover:border-orange-500/30 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={cat.image?.url || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80"}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-104 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                        {cat.origin}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Exemplary Canines (Dogs)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDogs.map((dog, i) => (
                <motion.div
                  key={dog.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onViewBreed(dog)}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-white/5 hover:border-amber-500/30 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={dog.image?.url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80"}
                      alt={dog.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-104 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {dog.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                        {dog.origin || "Global"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {dog.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta-section" className="mt-28 relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-amber-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full filter blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Registry
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight">
              Curious how different breeds compare?
            </h2>
            <p className="text-white/80 font-sans text-sm sm:text-base leading-relaxed">
              Use our interactive comparison engine to overlay weights, lifespans, and temperamental data side-by-side. Save your favorites to access them offline anytime.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="cta-compare-btn"
                onClick={() => onSearchTag("compare")}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-orange-700 text-sm font-semibold shadow-xl hover:scale-103 transition-all cursor-pointer"
              >
                Launch Breed Comparison
              </button>
              <button
                id="cta-explore-btn"
                onClick={() => onSearchTag("gallery")}
                className="px-6 py-3 rounded-xl bg-amber-500/25 border border-white/20 hover:bg-amber-500/40 text-white text-sm font-semibold hover:scale-103 transition-all cursor-pointer"
              >
                Browse HD Galleries
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-28 border-t border-slate-200 dark:border-white/5 pt-12 pb-6 text-slate-400 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <div className="space-y-4">
              <span className="font-display font-bold text-sm tracking-tight text-slate-800 dark:text-white">
                Pet<span className="text-orange-500">Explorer</span>
              </span>
              <p className="text-[11px] leading-relaxed max-w-xs text-slate-400">
                A premium, responsive exploratory environment celebrating the pedigree, visual aesthetic, and statistics of domestic dogs and cats.
              </p>
            </div>
            <div className="space-y-3">
              <span className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">APIs Implemented</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="NotFound" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">The Cat API</a></li>
                <li><a href="NotFound" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500">The Dog API</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">Platform Core</span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Created with React, Vite, Express, and Tailwind CSS. Built with in-memory server caching, client-side persistence, and responsive glassmorphism styles.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 dark:border-white/5 pt-6 text-[10px]">
            <span>&copy; {new Date().getFullYear()} PetExplorer Platform. All rights reserved.</span>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <span className="flex items-center text-orange-500/85">
                <Heart className="w-3 h-3 mr-1" /> Dedicated to our pets
              </span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
