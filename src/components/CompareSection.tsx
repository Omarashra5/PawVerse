import React, { useState } from "react";
import { 
  X, Scale, ArrowLeftRight, HelpCircle, AlertCircle, Plus, Sparkles, 
  Search, ShieldCheck, Heart, Zap, UserCheck 
} from "lucide-react";
import { motion } from "motion/react";
import { Breed } from "../types";

interface CompareSectionProps {
  comparedBreeds: Breed[];
  allBreeds: Breed[];
  onRemoveFromCompare: (breedId: string) => void;
  onAddToCompare: (breed: Breed) => void;
  onViewBreed: (breed: Breed) => void;
  addToast: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function CompareSection({
  comparedBreeds,
  allBreeds,
  onRemoveFromCompare,
  onAddToCompare,
  onViewBreed,
  addToast,
}: CompareSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const uncomparedBreeds = allBreeds.filter(
    b => !comparedBreeds.some(cb => cb.id === b.id)
  );

  const filteredSearchList = uncomparedBreeds
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const handleSelectBreed = (breed: Breed) => {
    if (comparedBreeds.length >= 2) {
      addToast("You can only compare up to 2 breeds side-by-side", "warning");
      return;
    }
    onAddToCompare(breed);
    setSearchQuery("");
    setShowSearchDropdown(false);
    addToast(`Added ${breed.name} to comparison deck`, "success");
  };

  const getPercentageValue = (value: number) => {
    return (value / 5) * 100;
  };

  const attributes = [
    { label: "Energy Level", key: "energy_level", color: "from-amber-400 to-orange-400" },
    { label: "Affection", key: "affection_level", color: "from-orange-500 to-amber-500" },
    { label: "Intelligence", key: "intelligence", color: "from-amber-600 to-yellow-500" },
    { label: "Child Friendliness", key: "child_friendly", color: "from-teal-400 to-emerald-400" },
    { label: "Dog Friendliness", key: "dog_friendly", color: "from-sky-400 to-blue-500" },
  ];

  return (
    <div id="compare-section" className="space-y-8 pt-20 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 dark:border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white flex items-center space-x-2">
            <ArrowLeftRight className="w-6 h-6 text-orange-500" />
            <span>Interactive Comparison</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Compare physical specs and behavioral traits between feline and canine breeds.</p>
        </div>

        {comparedBreeds.length < 2 && (
          <div className="relative w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search breed to add..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 focus:outline-none focus:border-orange-500 text-slate-700 dark:text-slate-200 cursor-pointer"
              />
            </div>

            {showSearchDropdown && searchQuery.trim() !== "" && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowSearchDropdown(false)} />
                <div className="absolute right-0 left-0 mt-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-40 max-h-56 overflow-y-auto">
                  {filteredSearchList.length > 0 ? (
                    filteredSearchList.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBreed(b)}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left hover:bg-slate-500/5 transition-all cursor-pointer"
                      >
                        <img 
                          src={b.image?.url} 
                          alt={b.name} 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-slate-100" 
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.name}</p>
                          <span className="text-[9px] font-mono capitalize text-slate-400">{b.type} breed</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center py-4 text-xs text-slate-400">No matching breeds found</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {comparedBreeds.length === 0 ? (
        <div className="py-24 text-center space-y-6 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/5 flex items-center justify-center text-orange-500 mb-2">
            <Scale className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Comparison deck is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">Search breeds above or select "Add to Compare" on breed cards to begin comparison.</p>
          </div>
          
          <div className="space-y-2 pt-4">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Suggested Pairings</span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  const b1 = allBreeds.find(b => b.name === "Persian");
                  const b2 = allBreeds.find(b => b.name === "Maine Coon");
                  if (b1) onAddToCompare(b1);
                  if (b2) onAddToCompare(b2);
                  addToast("Loaded Persian vs Maine Coon", "info");
                }}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-white/3 dark:hover:bg-white/5 text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Persian vs. Maine Coon (Cats)
              </button>
              <button
                onClick={() => {
                  const b1 = allBreeds.find(b => b.name.includes("Golden Retriever"));
                  const b2 = allBreeds.find(b => b.name.includes("German Shepherd"));
                  if (b1) onAddToCompare(b1);
                  if (b2) onAddToCompare(b2);
                  addToast("Loaded Retriever vs German Shepherd", "info");
                }}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-white/3 dark:hover:bg-white/5 text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Retriever vs. German Shepherd (Dogs)
              </button>
            </div>
          </div>
        </div>
      ) : comparedBreeds.length === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          <div className="rounded-[32px] border border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white ${
                  comparedBreeds[0].type === "cat" ? "bg-orange-500" : "bg-slate-700 dark:bg-zinc-800"
                }`}>
                  {comparedBreeds[0].type}
                </span>
                <button
                  onClick={() => onRemoveFromCompare(comparedBreeds[0].id)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={comparedBreeds[0].image?.url}
                  alt={comparedBreeds[0].name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
                />
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{comparedBreeds[0].name}</h3>
                  <span className="text-xs text-slate-400 font-mono">Origin: {comparedBreeds[0].origin || "Global"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewBreed(comparedBreeds[0])}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-orange-500/20 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer text-center"
            >
              See Full Profile
            </button>
          </div>

          <div className="rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/5 text-amber-500 flex items-center justify-center">
              <Plus className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Add a Second Breed</h4>
              <p className="text-xs text-slate-400 max-w-xs">Select or search for an additional breed to trigger the visual trait overlay matrices.</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6 items-stretch">
            
            <div className="rounded-[32px] border border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 p-5 relative">
              <button
                onClick={() => onRemoveFromCompare(comparedBreeds[0].id)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={comparedBreeds[0].image?.url}
                  alt={comparedBreeds[0].name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="text-center sm:text-left overflow-hidden">
                  <span className="text-[8px] font-mono font-bold text-orange-500 uppercase tracking-widest">{comparedBreeds[0].type}</span>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">{comparedBreeds[0].name}</h3>
                  <p className="text-xs text-slate-400 truncate">{comparedBreeds[0].origin || "Global"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 p-5 relative">
              <button
                onClick={() => onRemoveFromCompare(comparedBreeds[1].id)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={comparedBreeds[1].image?.url}
                  alt={comparedBreeds[1].name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="text-center sm:text-left overflow-hidden">
                  <span className="text-[8px] font-mono font-bold text-amber-500 uppercase tracking-widest">{comparedBreeds[1].type}</span>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">{comparedBreeds[1].name}</h3>
                  <p className="text-xs text-slate-400 truncate">{comparedBreeds[1].origin || "Global"}</p>
                </div>
              </div>
            </div>

          </div>

          <div className="rounded-[32px] border border-slate-200/50 dark:border-white/5 bg-white/35 dark:bg-zinc-950/30 backdrop-blur-md overflow-hidden shadow-xl">
            
            <div className="p-6 space-y-4">
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Physical Traits Breakdown</span>
              </h4>
              
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-200/30 dark:border-white/3 pb-3">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Origin ({comparedBreeds[0].name})</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comparedBreeds[0].origin || "Global"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Origin ({comparedBreeds[1].name})</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comparedBreeds[1].origin || "Global"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-200/30 dark:border-white/3 pb-3">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Lifespan ({comparedBreeds[0].name})</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comparedBreeds[0].life_span || "N/A"} years</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Lifespan ({comparedBreeds[1].name})</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comparedBreeds[1].life_span || "N/A"} years</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Weight ({comparedBreeds[0].name})</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comparedBreeds[0].weight?.metric || "N/A"} kg</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Weight ({comparedBreeds[1].name})</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comparedBreeds[1].weight?.metric || "N/A"} kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-500/[0.01] border-t border-slate-200/50 dark:border-white/5 space-y-6">
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Zap className="w-4 h-4" />
                <span>Behavioral Traits Overlay</span>
              </h4>

              <div className="space-y-5">
                {attributes.map((attr) => {
                  const val1 = comparedBreeds[0][attr.key as keyof Breed] as number || 4;
                  const val2 = comparedBreeds[1][attr.key as keyof Breed] as number || 4;
                  return (
                    <div key={attr.key} className="space-y-1.5">
                       <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{attr.label}</span>
                        <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-400">
                          <span className="font-bold text-orange-500">{val1}</span>
                          <span>vs</span>
                          <span className="font-bold text-amber-500">{val2}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden relative">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                            style={{ width: `${getPercentageValue(val1)}%` }}
                          />
                        </div>

                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden relative">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                            style={{ width: `${getPercentageValue(val2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
