import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Heart, Scale, Trash2, ArrowUp, RefreshCw, Filter, Compass, 
  Search, SlidersHorizontal, Eye, Calendar, Sparkles, BookOpen 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BreedCard from "./components/BreedCard";
import BreedDetail from "./components/BreedDetail";
import GalleryGrid from "./components/GalleryGrid";
import CompareSection from "./components/CompareSection";
import CommandPalette from "./components/CommandPalette";
import ToastNotification, { ToastMessage } from "./components/ToastNotification";
import { Breed, BreedImage, ActiveFilters } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("explore");
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [catBreeds, setCatBreeds] = useState<Breed[]>([]);
  const [dogBreeds, setDogBreeds] = useState<Breed[]>([]);
  const [breedOfTheDay, setBreedOfTheDay] = useState<Breed | null>(null);
  
  const [loadingBreeds, setLoadingBreeds] = useState(true);
  const [loadingBreedOfTheDay, setLoadingBreedOfTheDay] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    origin: "",
    temperament: "",
    minLifeSpan: 0,
    minWeight: 0,
    sortBy: "alphabetical",
    type: "all",
  });

  const [favoriteBreedIds, setFavoriteBreedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pet-explorer-fav-breeds");
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteImages, setFavoriteImages] = useState<BreedImage[]>(() => {
    const saved = localStorage.getItem("pet-explorer-fav-images");
    return saved ? JSON.parse(saved) : [];
  });
  const [comparedBreeds, setComparedBreeds] = useState<Breed[]>([]);

  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("pet-explorer-theme");
    return (saved as "light" | "dark" | "system") || "system";
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: "light" | "dark" | "system") => {
      root.classList.remove("light", "dark");
      if (t === "system") {
        const matchesSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(matchesSystem ? "dark" : "light");
      } else {
        root.classList.add(t);
      }
    };
    applyTheme(theme);
    localStorage.setItem("pet-explorer-theme", theme);

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem("pet-explorer-fav-breeds", JSON.stringify(favoriteBreedIds));
  }, [favoriteBreedIds]);

  useEffect(() => {
    localStorage.setItem("pet-explorer-fav-images", JSON.stringify(favoriteImages));
  }, [favoriteImages]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingBreeds(true);
      setError(null);
      try {
        const [catsRes, dogsRes, botdRes] = await Promise.all([
          fetch("/api/cats/breeds"),
          fetch("/api/dogs/breeds"),
          fetch("/api/breed-of-the-day")
        ]);

        if (!catsRes.ok || !dogsRes.ok) {
          throw new Error("Unable to establish connection to breed registries.");
        }

        const cats: Breed[] = await catsRes.json();
        const dogs: Breed[] = await dogsRes.json();

        const catsTagged = cats.map(c => ({ ...c, type: "cat" as const }));
        const dogsTagged = dogs.map(d => ({ ...d, type: "dog" as const }));

        setCatBreeds(catsTagged);
        setDogBreeds(dogsTagged);

        if (botdRes.ok) {
          const botd: Breed = await botdRes.json();
          setBreedOfTheDay(botd);
        }
      } catch (err: any) {
        console.error("Data load error", err);
        setError(err.message || "An unexpected error occurred loading registries.");
        addToast("Error fetching live breed registries. Using fallback database.", "warning");
      } finally {
        setLoadingBreeds(false);
        setLoadingBreedOfTheDay(false);
      }
    };

    fetchAllData();
  }, []);

  const allBreeds = useMemo(() => {
    return [...catBreeds, ...dogBreeds];
  }, [catBreeds, dogBreeds]);

  const dynamicOrigins = useMemo(() => {
    const origins = allBreeds
      .map(b => b.origin?.trim())
      .filter((origin): origin is string => !!origin);
    return Array.from(new Set(origins)).sort();
  }, [allBreeds]);

  const dynamicTemperaments = useMemo(() => {
    const list: string[] = [];
    allBreeds.forEach(b => {
      if (b.temperament) {
        b.temperament.split(",").forEach(t => {
          const trimmed = t.trim();
          if (trimmed) list.push(trimmed);
        });
      }
    });
    return Array.from(new Set(list)).sort().slice(0, 40); 
  }, [allBreeds]);

  const addToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavoriteBreed = (breedId: string) => {
    setFavoriteBreedIds(prev => {
      const exists = prev.includes(breedId);
      if (exists) {
        addToast("Breed removed from saved lists", "info");
        return prev.filter(id => id !== breedId);
      } else {
        const b = allBreeds.find(item => item.id === breedId);
        addToast(`Saved ${b?.name || "breed"} to favorites`, "success");
        return [...prev, breedId];
      }
    });
  };

  const toggleFavoriteImage = (img: BreedImage) => {
    setFavoriteImages(prev => {
      const exists = prev.some(item => item.id === img.id);
      if (exists) {
        addToast("Removed portrait from saved deck", "info");
        return prev.filter(item => item.id !== img.id);
      } else {
        addToast("Portrait added to favorites deck", "success");
        return [...prev, img];
      }
    });
  };

  const toggleComparedBreed = (breed: Breed) => {
    setComparedBreeds(prev => {
      const exists = prev.some(item => item.id === breed.id);
      if (exists) {
        addToast(`Removed ${breed.name} from comparison`, "info");
        return prev.filter(item => item.id !== breed.id);
      } else {
        if (prev.length >= 2) {
          addToast("You can only compare up to 2 breeds side-by-side", "warning");
          return prev;
        }
        addToast(`Added ${breed.name} to comparison deck`, "success");
        return [...prev, breed];
      }
    });
  };

  const handleHeroTagClick = (tag: string) => {
    if (tag === "compare") {
      setCurrentTab("compare");
    } else if (tag === "gallery") {
      setCurrentTab("gallery");
    } else {
      setSearchQuery(tag);
      setCurrentTab("explore");
    }
  };

  const resetFilters = () => {
    setActiveFilters({
      origin: "",
      temperament: "",
      minLifeSpan: 0,
      minWeight: 0,
      sortBy: "alphabetical",
      type: "all",
    });
    setSearchQuery("");
    addToast("Exploration filters reset", "info");
  };

  const filteredBreeds = useMemo(() => {
    let result = [...allBreeds];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b => b.name.toLowerCase().includes(q) || 
             (b.temperament && b.temperament.toLowerCase().includes(q)) ||
             (b.origin && b.origin.toLowerCase().includes(q))
      );
    }

    if (activeFilters.type !== "all") {
      result = result.filter(b => b.type === activeFilters.type);
    }

    if (activeFilters.origin) {
      result = result.filter(b => b.origin === activeFilters.origin);
    }

    if (activeFilters.temperament) {
      const targetTemp = activeFilters.temperament.toLowerCase();
      result = result.filter(
        b => b.temperament && b.temperament.toLowerCase().includes(targetTemp)
      );
    }

    if (activeFilters.minLifeSpan > 0) {
      result = result.filter(b => {
        if (!b.life_span) return false;
        const matches = b.life_span.match(/\d+/g);
        if (!matches) return false;
        const avg = matches.map(Number).reduce((sum, val) => sum + val, 0) / matches.length;
        return avg >= activeFilters.minLifeSpan;
      });
    }

    if (activeFilters.minWeight > 0) {
      result = result.filter(b => {
        if (!b.weight?.metric) return false;
        const matches = b.weight.metric.match(/\d+/g);
        if (!matches) return false;
        const avg = matches.map(Number).reduce((sum, val) => sum + val, 0) / matches.length;
        return avg >= activeFilters.minWeight;
      });
    }

    if (activeFilters.sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeFilters.sortBy === "energy") {
      result.sort((a, b) => (b.energy_level || 0) - (a.energy_level || 0));
    } else if (activeFilters.sortBy === "intelligence") {
      result.sort((a, b) => (b.intelligence || 0) - (a.intelligence || 0));
    } else if (activeFilters.sortBy === "random") {
      result.sort(() => Math.random() - 0.5);
    }

    return result;
  }, [allBreeds, searchQuery, activeFilters]);

  const favoriteBreeds = useMemo(() => {
    return allBreeds.filter(b => favoriteBreedIds.includes(b.id));
  }, [allBreeds, favoriteBreedIds]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featuredCatsList = useMemo(() => {
    return catBreeds.slice(0, 3);
  }, [catBreeds]);

  const featuredDogsList = useMemo(() => {
    return dogBreeds.slice(0, 3);
  }, [dogBreeds]);
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 dark:bg-zinc-950 dark:text-slate-100 transition-colors duration-300 pb-12 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 dark:bg-orange-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          scrollToTop();
        }}
        favoritesCount={favoriteBreedIds.length + favoriteImages.length}
        comparisonCount={comparedBreeds.length}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 relative">
        <AnimatePresence mode="wait">
          
          {currentTab === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <Hero
                onSearchTag={handleHeroTagClick}
                breedOfTheDay={breedOfTheDay}
                onViewBreed={setSelectedBreed}
                loadingBreedOfTheDay={loadingBreedOfTheDay}
                featuredCats={featuredCatsList}
                featuredDogs={featuredDogsList}
              />

              <section id="interactive-registry" className="pt-16 space-y-8 scroll-mt-24 border-t border-slate-200 dark:border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-orange-500 font-bold">Interactive Search</span>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">Breed Registry Directory</h2>
                    <p className="text-xs text-slate-400">Search dynamically across traits, origin records, heights, weights, and behavioral attributes.</p>
                  </div>

                  <div className="flex w-full md:w-auto items-center space-x-2">
                    <div className="relative flex-1 md:w-72">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Husky, Persian, Friendly..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-semibold focus:outline-none focus:border-orange-500 text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm shadow-black/3"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                        showFilters 
                          ? "bg-orange-500/10 text-orange-500 border-orange-500/25" 
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-500"
                      }`}
                      title="Toggle Filters"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-white/1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                        
                        <div className="space-y-1.5">
                          <label className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Lineage Class</label>
                          <select
                            value={activeFilters.type}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, type: e.target.value as any, origin: "", temperament: "" }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200"
                          >
                            <option value="all">Combined (Cats & Dogs)</option>
                            <option value="cat">Cats Only</option>
                            <option value="dog">Dogs Only</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Origin Location</label>
                          <select
                            value={activeFilters.origin}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, origin: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200"
                          >
                            <option value="">All Origins</option>
                            {dynamicOrigins.map(origin => (
                              <option key={origin} value={origin}>{origin}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Temperament Focus</label>
                          <select
                            value={activeFilters.temperament}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, temperament: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200"
                          >
                            <option value="">All Temperaments</option>
                            {dynamicTemperaments.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Sort Metric</label>
                          <select
                            value={activeFilters.sortBy}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200"
                          >
                            <option value="alphabetical">A-Z Alphabetical</option>
                            <option value="energy">Highest Energy</option>
                            <option value="intelligence">Highest Intelligence</option>
                            <option value="random">Shuffle / Shuffle</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 space-y-1.5 pt-2">
                          <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono text-slate-400">
                            <span>Minimum Lifespan</span>
                            <span>{activeFilters.minLifeSpan || "Any"} years</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={activeFilters.minLifeSpan}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, minLifeSpan: Number(e.target.value) }))}
                            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5 pt-2">
                          <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono text-slate-400">
                            <span>Minimum Weight</span>
                            <span>{activeFilters.minWeight || "Any"} kg</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={activeFilters.minWeight}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, minWeight: Number(e.target.value) }))}
                            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                        </div>

                        <div className="lg:col-span-4 flex justify-end pt-2">
                          <button
                            onClick={resetFilters}
                            className="text-orange-500 hover:text-orange-600 font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin duration-3000" />
                            <span>Reset Filters</span>
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loadingBreeds ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <div key={n} className="h-[390px] rounded-3xl shimmer-bg border border-slate-200/40 dark:border-white/5" />
                    ))}
                  </div>
                ) : filteredBreeds.length === 0 ? (
                  <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/1">
                    <p className="text-slate-400 text-sm">No breeds found matching the current search parameters.</p>
                    <button onClick={resetFilters} className="text-xs font-semibold text-orange-500 underline cursor-pointer">
                      Reset Searches
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredBreeds.map((breed) => (
                      <BreedCard
                        key={breed.id}
                        breed={breed}
                        isFavorite={favoriteBreedIds.includes(breed.id)}
                        isCompared={comparedBreeds.some(cb => cb.id === breed.id)}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          toggleFavoriteBreed(breed.id);
                        }}
                        onToggleCompare={(e) => {
                          e.stopPropagation();
                          toggleComparedBreed(breed);
                        }}
                        onClick={() => setSelectedBreed(breed)}
                      />
                    ))}
                  </motion.div>
                )}
              </section>
            </motion.div>
          )}

          {currentTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GalleryGrid
                allBreeds={allBreeds}
                favorites={favoriteImages.map(item => item.id)}
                onToggleFavoriteImage={toggleFavoriteImage}
                addToast={addToast}
              />
            </motion.div>
          )}

          {currentTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 pt-20"
            >
              <div className="border-b border-slate-200/50 dark:border-white/5 pb-6">
                <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-orange-500 fill-current" />
                  <span>My Saved Collection</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your personalized visual scrapbook of breed lineages and custom high-resolution portraits.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-100 dark:border-white/3 pb-1.5">
                  Saved Breed Lineages ({favoriteBreeds.length})
                </h3>
                
                {favoriteBreeds.length === 0 ? (
                  <p className="text-xs font-sans text-slate-400 italic">No breed profiles favorited yet. Explore and save them from the Explore board.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteBreeds.map((breed) => (
                      <BreedCard
                        key={breed.id}
                        breed={breed}
                        isFavorite={true}
                        isCompared={comparedBreeds.some(cb => cb.id === breed.id)}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          toggleFavoriteBreed(breed.id);
                        }}
                        onToggleCompare={(e) => {
                          e.stopPropagation();
                          toggleComparedBreed(breed);
                        }}
                        onClick={() => setSelectedBreed(breed)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-100 dark:border-white/3 pb-1.5">
                  Saved Gallery Portraits ({favoriteImages.length})
                </h3>
                
                {favoriteImages.length === 0 ? (
                  <p className="text-xs font-sans text-slate-400 italic">No custom gallery photos saved yet. Visit the Gallery board to save portraits.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favoriteImages.map((img) => {
                      const breedInfo = img.breeds && img.breeds[0] ? img.breeds[0] : null;
                      return (
                        <div
                          key={img.id}
                          className="relative rounded-2xl overflow-hidden group border border-slate-200/40 dark:border-white/5 bg-slate-100"
                        >
                          <img src={img.url} alt="fav portrait" referrerPolicy="no-referrer" className="w-full h-48 object-cover transform group-hover:scale-102 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                            <div className="flex justify-end">
                              <button
                                onClick={() => toggleFavoriteImage(img)}
                                className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div>
                              {breedInfo && (
                                <div className="text-[10px]">
                                  <span className="text-orange-400 font-mono block font-bold uppercase">{breedInfo.type} breed</span>
                                  <span className="font-bold block font-display">{breedInfo.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentTab === "compare" && (
            <motion.div
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CompareSection
                comparedBreeds={comparedBreeds}
                allBreeds={allBreeds}
                onRemoveFromCompare={(id) => setComparedBreeds(prev => prev.filter(b => b.id !== id))}
                onAddToCompare={(b) => setComparedBreeds(prev => [...prev, b])}
                onViewBreed={setSelectedBreed}
                addToast={addToast}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {selectedBreed && (
        <BreedDetail
          breed={selectedBreed}
          isOpen={!!selectedBreed}
          onClose={() => setSelectedBreed(null)}
          isFavorite={favoriteBreedIds.includes(selectedBreed.id)}
          isCompared={comparedBreeds.some(cb => cb.id === selectedBreed.id)}
          onToggleFavorite={() => toggleFavoriteBreed(selectedBreed.id)}
          onToggleCompare={() => toggleComparedBreed(selectedBreed)}
          allBreeds={allBreeds}
          onSelectBreed={setSelectedBreed}
          addToast={addToast}
        />
      )}

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="back-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-200 hover:text-orange-500 shadow-xl cursor-pointer hover:scale-105 active:scale-95 z-30 transition-all"
            title="Scroll To Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        allBreeds={allBreeds}
        onSelectBreed={setSelectedBreed}
        setTab={(tab) => {
          setCurrentTab(tab);
          scrollToTop();
        }}
        setTheme={setTheme}
        addToast={addToast}
      />

      <ToastNotification 
        toasts={toasts} 
        removeToast={removeToast} 
      />

    </div>
  );
}
