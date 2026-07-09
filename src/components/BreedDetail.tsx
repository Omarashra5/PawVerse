import React, { useState, useEffect } from "react";
import { 
  X, ExternalLink, Heart, Scale, Sparkles, AlertCircle, Info, 
  Dribbble, Award, UserCheck, ShieldCheck, Zap, HelpCircle, Eye, Download 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Breed, BreedImage } from "../types";

interface BreedDetailProps {
  breed: Breed;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
  allBreeds: Breed[];
  onSelectBreed: (breed: Breed) => void;
  addToast: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function BreedDetail({
  breed,
  isOpen,
  onClose,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  allBreeds,
  onSelectBreed,
  addToast,
}: BreedDetailProps) {
  const [galleryImages, setGalleryImages] = useState<BreedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoadingImages(true);
    setGalleryImages([]);
    
    const fetchRelatedImages = async () => {
      try {
        const endpoint = breed.type === "cat" 
          ? `/api/cats/images?breed_ids=${breed.id}&limit=8`
          : `/api/dogs/images?breed_ids=${breed.id}&limit=8`;
        
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setGalleryImages(data);
          if (data.length > 0) {
            setActiveImage(data[0].url);
          } else if (breed.image?.url) {
            setActiveImage(breed.image.url);
          }
        }
      } catch (err) {
        console.error("Failed to load breed gallery", err);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchRelatedImages();
  }, [breed, isOpen]);

  if (!isOpen) return null;

  const getSimilarBreeds = () => {
    const breedTemps = breed.temperament ? breed.temperament.split(",").map(t => t.trim().toLowerCase()) : [];
    return allBreeds
      .filter(b => b.id !== breed.id && b.type === breed.type)
      .map(b => {
        let score = 0;
        if (b.origin === breed.origin) score += 3;
        const bTemps = b.temperament ? b.temperament.split(",").map(t => t.trim().toLowerCase()) : [];
        const matches = bTemps.filter(t => breedTemps.includes(t));
        score += matches.length * 2;
        return { breed: b, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.breed);
  };

  const similarBreeds = getSimilarBreeds();

  const metrics = [
    { label: "Energy Level", value: breed.energy_level || 3, color: "bg-amber-400" },
    { label: "Affection", value: breed.affection_level || 4, color: "bg-orange-500" },
    { label: "Intelligence", value: breed.intelligence || 4, color: "bg-amber-600" },
    { label: "Child Friendly", value: breed.child_friendly || 4, color: "bg-teal-500" },
    { label: "Dog Friendly", value: breed.dog_friendly || 4, color: "bg-sky-500" },
  ];

  const handleDownloadActiveImage = async () => {
    if (!activeImage) return;
    try {
      const response = await fetch(activeImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${breed.name.toLowerCase().replace(/\s+/g, "-")}-hd-image.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addToast("High-resolution photo download started", "success");
    } catch {
      window.open(activeImage, "_blank");
      addToast("Opened high-res photo in new tab", "info");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-10"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/5 z-20 max-h-[90vh] flex flex-col"
        >
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-30">
            <button
              onClick={onToggleFavorite}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer ${
                isFavorite 
                  ? "bg-orange-500 text-white shadow-lg" 
                  : "bg-white/10 dark:bg-black/40 hover:bg-white/20 text-slate-800 dark:text-white border border-slate-200/20 dark:border-white/10"
              }`}
              title="Save Favorite"
            >
              <Heart className={`w-4.5 h-4.5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={onToggleCompare}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 hover:scale-110 cursor-pointer ${
                isCompared 
                  ? "bg-amber-500 text-white shadow-lg" 
                  : "bg-white/10 dark:bg-black/40 hover:bg-white/20 text-slate-800 dark:text-white border border-slate-200/20 dark:border-white/10"
              }`}
              title="Add to Compare"
            >
              <Scale className="w-4.5 h-4.5" />
            </button>
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-white border border-slate-200/20 dark:border-white/10 transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="relative h-[300px] sm:h-[380px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 shadow-md group">
                  <img
                    src={activeImage || breed.image?.url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80"}
                    alt={breed.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <button
                      onClick={handleDownloadActiveImage}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white text-xs backdrop-blur-sm shadow transition-all cursor-pointer"
                      title="Download HD Photo"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>HD</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    HD Breed Gallery ({galleryImages.length > 0 ? galleryImages.length : 1} Images)
                  </span>
                  
                  {loadingImages ? (
                    <div className="flex gap-2 animate-pulse overflow-x-auto py-1">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-white/5 flex-shrink-0" />
                      ))}
                    </div>
                  ) : galleryImages.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                      {galleryImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImage(img.url)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            activeImage === img.url 
                              ? "border-orange-500 scale-102 shadow-lg" 
                              : "border-transparent hover:border-slate-300 dark:hover:border-white/15"
                          }`}
                        >
                          <img src={img.url} alt="breed thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : breed.image?.url ? (
                    <button
                      onClick={() => setActiveImage(breed.image!.url!)}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-orange-500"
                    >
                      <img src={breed.image.url} alt="breed default" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-sans italic">No images currently indexed.</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${
                      breed.type === "cat" ? "bg-orange-500" : "bg-slate-700 dark:bg-zinc-800"
                    }`}>
                      {breed.type}
                    </span>
                    {breed.rare === 1 && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-black uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Rare Specimen</span>
                      </span>
                    )}
                  </div>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                    {breed.name}
                  </h1>
                  {breed.temperament && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-sans italic">
                      {breed.temperament}
                    </p>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans border-t border-slate-200/50 dark:border-white/5 pt-4">
                  {breed.description || "A pristine example of selective lineage, notable for its exceptional temperament, structural qualities, and beautiful visual traits."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Origin</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{breed.origin || "Global"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Lifespan</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{breed.life_span || "N/A"} years</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Weight (kg)</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{breed.weight?.metric || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Height (cm)</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{breed.height?.metric || "Standard"}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Behavioral & Attribute Scores</span>
                  </h3>
                  
                  <div className="space-y-3.5">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{metric.label}</span>
                          <span className="font-mono text-slate-400">{metric.value} / 5</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(metric.value / 5) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${metric.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {breed.wikipedia_url && (
                  <div className="pt-2">
                    <a
                      href={breed.wikipedia_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-orange-500/25 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Learn more on Wikipedia</span>
                    </a>
                  </div>
                )}

                {similarBreeds.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-white/5">
                    <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest block">
                      Similar Breed Lineage
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {similarBreeds.map((simBreed) => (
                        <div
                          key={simBreed.id}
                          onClick={() => {
                            onSelectBreed(simBreed);
                            addToast(`Loading ${simBreed.name} profile`, "info");
                          }}
                          className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 hover:border-orange-500/15 bg-slate-50 hover:bg-slate-100 dark:bg-white/3 dark:hover:bg-white/5 cursor-pointer transition-all hover:scale-101"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-white/5">
                            <img src={simBreed.image?.url} alt={simBreed.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <div className="overflow-hidden min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{simBreed.name}</h5>
                            <span className="text-[9px] font-mono text-slate-400">{simBreed.origin || "Global"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
