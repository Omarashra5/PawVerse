import React, { useState, useEffect } from "react";
import { 
  Heart, Download, Link, Eye, Sparkles, Filter, ChevronRight, 
  Search, Maximize2, Share2, X, ChevronLeft, Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Breed, BreedImage } from "../types";

interface GalleryGridProps {
  allBreeds: Breed[];
  favorites: string[];
  onToggleFavoriteImage: (img: BreedImage) => void;
  addToast: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function GalleryGrid({
  allBreeds,
  favorites,
  onToggleFavoriteImage,
  addToast,
}: GalleryGridProps) {
  const [images, setImages] = useState<BreedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedBreedId, setSelectedBreedId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"all" | "cat" | "dog">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredBreeds = allBreeds.filter(b => 
    selectedType === "all" ? true : b.type === selectedType
  );

  const fetchImages = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const nextPage = isLoadMore ? page + 1 : 0;
      
      let endpoint = `/api/cats/images?limit=12&page=${nextPage}`;
      if (selectedType === "dog") {
        endpoint = `/api/dogs/images?limit=12&page=${nextPage}`;
      } else if (selectedType === "all") {
        endpoint = nextPage % 2 === 0 
          ? `/api/cats/images?limit=12&page=${Math.floor(nextPage / 2)}`
          : `/api/dogs/images?limit=12&page=${Math.floor(nextPage / 2)}`;
      }

      if (selectedBreedId) {
        const breedObj = allBreeds.find(b => b.id === selectedBreedId);
        if (breedObj) {
          endpoint = breedObj.type === "cat"
            ? `/api/cats/images?breed_ids=${selectedBreedId}&limit=12&page=${nextPage}`
            : `/api/dogs/images?breed_ids=${selectedBreedId}&limit=12&page=${nextPage}`;
        }
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data: BreedImage[] = await response.json();
        const validData = data.filter(img => img && img.url);

        if (isLoadMore) {
          setImages(prev => [...prev, ...validData]);
          setPage(nextPage);
        } else {
          setImages(validData);
          setPage(0);
        }
      }
    } catch (err) {
      console.error("Failed to load gallery images", err);
      addToast("Failed to fetch gallery images from the API", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(false);
  }, [selectedBreedId, selectedType]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast("Image URL copied to clipboard", "success");
  };

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `pet-explorer-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      addToast("Download started successfully", "success");
    } catch {
      window.open(url, "_blank");
      addToast("Opened photo in new window", "info");
    }
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };
  const prevSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div id="gallery-container" className="space-y-8 pt-20">
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-200/50 dark:border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">HD Media Gallery</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Explore visual profiles and high-res portraits of domestic cats and dogs.</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 dark:bg-white/5 rounded-full p-1 border border-slate-200/40 dark:border-white/5 text-xs font-semibold">
            {(["all", "cat", "dog"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedType(t);
                  setSelectedBreedId("");
                }}
                className={`px-4 py-1.5 rounded-full capitalize cursor-pointer transition-all ${
                  selectedType === t 
                    ? "bg-white dark:bg-black/40 text-orange-500 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {t === "all" ? "Combined" : t + "s"}
              </button>
            ))}
          </div>

          <select
            id="gallery-breed-filter"
            value={selectedBreedId}
            onChange={(e) => setSelectedBreedId(e.target.value)}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer max-w-[180px] sm:max-w-xs"
          >
            <option value="">All Breeds</option>
            {filteredBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {images.length === 0 && !loading ? (
        <div className="py-20 text-center space-y-4 rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/1">
          <p className="text-slate-400 text-sm">No images found for the active filter.</p>
          <button 
            onClick={() => { setSelectedType("all"); setSelectedBreedId(""); }}
            className="text-xs font-semibold text-orange-500 underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, index) => {
            const isFav = favorites.includes(img.id);
            const breedInfo = img.breeds && img.breeds[0] ? img.breeds[0] : null;
            return (
              <motion.div
                key={`${img.id}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="break-inside-avoid relative rounded-2xl overflow-hidden group border border-slate-200/50 dark:border-white/5 bg-slate-100 dark:bg-white/3 shadow-sm hover:shadow-lg transition-all"
              >
                <img
                  src={img.url}
                  alt={breedInfo?.name || "Pet Explorer photo"}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-end">
                    <button
                      onClick={() => onToggleFavoriteImage(img)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                        isFav 
                          ? "bg-orange-500 text-white" 
                          : "bg-black/40 hover:bg-black/60 border border-white/15"
                      }`}
                      title={isFav ? "Remove from Saved Photos" : "Save Photo"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {breedInfo && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider font-mono text-orange-400">
                          {breedInfo.type} breed
                        </span>
                        <h4 className="text-sm font-bold truncate font-display">{breedInfo.name}</h4>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center border-t border-white/10 pt-2 text-xs">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openLightbox(index)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                          title="View Fullscreen"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDownload(img.url, img.id)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                          title="Download Portrait"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopyLink(img.url)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          <Link className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex justify-center pt-8">
          <button
            id="load-more-btn"
            onClick={() => fetchImages(true)}
            disabled={loading}
            className="relative px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black font-semibold text-xs transition-all shadow-lg hover:scale-102 cursor-pointer flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-white animate-spin mr-1" />
            ) : null}
            <span>{loading ? "Caching more portraits..." : "Load More Portraits"}</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            
            <div className="absolute inset-0" onClick={closeLightbox} />

            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/10 cursor-pointer z-10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={prevSlide}
              className="absolute left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/10 cursor-pointer z-10 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center z-10"
            >
              <img
                src={images[lightboxIndex]?.url}
                alt="Pet Explorer Large Screen portrait"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />

              {images[lightboxIndex]?.breeds && images[lightboxIndex].breeds![0] && (
                <div className="mt-4 text-center text-white space-y-1">
                  <span className="text-[9px] tracking-widest font-mono text-orange-400 uppercase">
                    {images[lightboxIndex].breeds![0].type} breed
                  </span>
                  <h3 className="text-xl font-display font-bold">
                    {images[lightboxIndex].breeds![0].name}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md line-clamp-1 italic px-4">
                    {images[lightboxIndex].breeds![0].temperament}
                  </p>
                </div>
              )}
            </motion.div>

            <button
              onClick={nextSlide}
              className="absolute right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/10 cursor-pointer z-10 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
