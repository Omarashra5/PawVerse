import React from "react";
import { Heart, Scale, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Breed } from "../types";

interface BreedCardProps {
  breed: Breed;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleCompare: (e: React.MouseEvent) => void;
  onClick: () => void;
  key?: string;
}

export default function BreedCard({
  breed,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onClick,
}: BreedCardProps) {
  const temperaments = breed.temperament 
    ? breed.temperament.split(",").slice(0, 3).map(t => t.trim())
    : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="group relative flex flex-col justify-between h-[390px] rounded-[32px] overflow-hidden bg-white/45 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/50 dark:border-white/5 hover:border-orange-500/25 dark:hover:border-orange-500/25 shadow-sm hover:shadow-xl hover:shadow-orange-500/[0.02] cursor-pointer transition-all duration-300"
    >
      <div>
        <div className="relative h-[180px] w-full overflow-hidden">
          <img
            src={breed.image?.url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80"}
            alt={breed.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
          />
          
          <div className="absolute top-3 left-3 flex space-x-1.5 pointer-events-none">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              breed.type === "cat" 
                ? "bg-orange-500 text-white" 
                : "bg-slate-700 dark:bg-zinc-800 text-white"
            }`}>
              {breed.type}
            </span>
            {breed.rare === 1 && (
              <span className="flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Rare</span>
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
            <button
              onClick={onToggleFavorite}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer ${
                isFavorite 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/35" 
                  : "bg-black/40 hover:bg-black/60 text-white border border-white/10"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={onToggleCompare}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer ${
                isCompared 
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/35" 
                  : "bg-black/40 hover:bg-black/60 text-white border border-white/10"
              }`}
              title={isCompared ? "Remove from Compare List" : "Add to Compare List"}
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none">
            <h3 className="font-display font-bold text-lg text-white line-clamp-1 truncate group-hover:text-orange-100 transition-colors">
              {breed.name}
            </h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Origin: {breed.origin || "Global"}</span>
            <span>{breed.life_span || "N/A"} years</span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {breed.description || "A wonderful breed with characteristic features and loving disposition."}
          </p>

          <div className="flex flex-wrap gap-1">
            {temperaments.map((temp) => (
              <span
                key={temp}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 text-[9px] font-medium text-slate-600 dark:text-slate-300"
              >
                {temp}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-slate-200/40 dark:border-white/5">
        <div className="grid grid-cols-3 gap-2 pt-3 text-[10px] font-mono">
          <div className="space-y-1">
            <span className="text-slate-400 text-[8px] uppercase tracking-wider block">Energy</span>
            <div className="flex space-x-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`h-1.5 flex-1 rounded-sm ${
                    level <= (breed.energy_level || 3)
                      ? "bg-amber-400"
                      : "bg-slate-200 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 text-[8px] uppercase tracking-wider block">Affection</span>
            <div className="flex space-x-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`h-1.5 flex-1 rounded-sm ${
                    level <= (breed.affection_level || 4)
                      ? "bg-orange-500"
                      : "bg-slate-200 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 text-[8px] uppercase tracking-wider block">Intellect</span>
            <div className="flex space-x-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`h-1.5 flex-1 rounded-sm ${
                    level <= (breed.intelligence || 4)
                      ? "bg-amber-600"
                      : "bg-slate-200 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
