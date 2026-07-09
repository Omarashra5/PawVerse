import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Keyboard, Sparkles, Compass, Images, Heart, Scale, 
  Laptop, Sun, Moon, CornerDownLeft, Command, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Breed } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  allBreeds: Breed[];
  onSelectBreed: (breed: Breed) => void;
  setTab: (tab: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  addToast: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  allBreeds,
  onSelectBreed,
  setTab,
  setTheme,
  addToast,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: "nav-explore", label: "Go to Explore Panel", action: () => { setTab("explore"); onClose(); } },
    { id: "nav-gallery", label: "Go to HD Media Gallery", action: () => { setTab("gallery"); onClose(); } },
    { id: "nav-favorites", label: "Go to Favorites Deck", action: () => { setTab("favorites"); onClose(); } },
    { id: "nav-compare", label: "Go to Comparison Matrix", action: () => { setTab("compare"); onClose(); } },
    { id: "theme-dark", label: "Appearance: Set to Dark Theme", action: () => { setTheme("dark"); onClose(); addToast("Theme switched to Dark mode", "info"); } },
    { id: "theme-light", label: "Appearance: Set to Light Theme",  action: () => { setTheme("light"); onClose(); addToast("Theme switched to Light mode", "info"); } },
    { id: "theme-system", label: "Appearance: Set to System Preference", action: () => { setTheme("system"); onClose(); addToast("Theme aligned with system preference", "info"); } },
  ];

  const matchedBreeds = allBreeds
    .filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(b => ({
      id: `breed-${b.id}`,
      label: `Breed Profile: Explore ${b.name} (${b.type})`,
      action: () => { onSelectBreed(b); onClose(); }
    }));

  const matchedCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const combinedItems = [...matchedBreeds, ...matchedCommands];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((activeIndex + 1) % combinedItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((activeIndex - 1 + combinedItems.length) % combinedItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (combinedItems[activeIndex]) {
        combinedItems[activeIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-10"
        />

        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onKeyDown={handleKeyDown}
          className="relative w-full max-w-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg rounded-[24px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 z-20 flex flex-col"
        >
          <div className="relative border-b border-slate-200 dark:border-white/5 p-4 flex items-center">
            <Search className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search breeds, navigate tabs, or toggle appearance..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              className="w-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent outline-none focus:ring-0 focus:outline-none"
            />
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-mono text-slate-400">
              <span>ESC</span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {combinedItems.length > 0 ? (
              combinedItems.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? "bg-orange-500/10 text-orange-500 border border-orange-500/10" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-500/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="truncate">{item.label}</span>
                    </div>

                    {isActive && (
                      <div className="flex items-center space-x-1 text-[10px] font-mono text-orange-500">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No commands or breeds matching "{query}"
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/1 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <div className="flex space-x-4">
              <span className="flex items-center"><Keyboard className="w-3 h-3 mr-1" /> Use Arrow keys to navigate</span>
              <span className="flex items-center"><CornerDownLeft className="w-3 h-3 mr-1" /> Press Enter to execute</span>
            </div>
            <span className="flex items-center"><Command className="w-3 h-3 mr-0.5" /> K</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
