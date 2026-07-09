import React, { useState, useEffect } from "react";
import { 
  Menu, X, Search, Sparkles, Heart, Scale, HelpCircle, 
  Sun, Moon, Laptop, Keyboard, Compass, Images 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  favoritesCount: number;
  comparisonCount: number;
  openCommandPalette: () => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  favoritesCount,
  comparisonCount,
  openCommandPalette,
  theme,
  setTheme,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "favorites", label: "Favorites", icon: Heart, badge: favoritesCount > 0 ? favoritesCount : undefined },
    { id: "compare", label: "Compare", icon: Scale, badge: comparisonCount > 0 ? comparisonCount : undefined },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark": return <Moon className="w-4 h-4 text-orange-400" />;
      case "light": return <Sun className="w-4 h-4 text-amber-500" />;
      default: return <Laptop className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3 shadow-sm" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <button 
            id="nav-logo-btn"
            onClick={() => handleNavClick("explore")}
            className="flex items-center space-x-2 group cursor-pointer"
          >
         
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Pet<span className="text-orange-500">Explorer</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "text-orange-500 bg-orange-500/5 dark:bg-orange-500/10" 
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-500/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white leading-none scale-90">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button
              id="cmd-k-trigger"
              onClick={openCommandPalette}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-sans transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 font-mono text-[9px] text-slate-500">
                <Keyboard className="w-2.5 h-2.5" />
                <span>K</span>
              </kbd>
            </button>

            <div className="relative">
              <button
                id="theme-toggle-btn"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                {getThemeIcon()}
              </button>

              <AnimatePresence>
                {showThemeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-36 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-md p-1.5 shadow-xl z-50"
                    >
                      {(["light", "dark", "system"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTheme(t);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left capitalize transition-all cursor-pointer ${
                            theme === t 
                              ? "bg-orange-500/10 text-orange-500" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-500/5 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {t === "light" && <Sun className="w-3.5 h-3.5" />}
                          {t === "dark" && <Moon className="w-3.5 h-3.5" />}
                          {t === "system" && <Laptop className="w-3.5 h-3.5" />}
                          <span>{t}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <button
              id="mobile-search-btn"
              onClick={openCommandPalette}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-black/5 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    id={`mobile-nav-item-${item.id}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                      isActive 
                        ? "text-orange-500 bg-orange-500/5 dark:bg-orange-500/10" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-500/5"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="border-t border-black/5 dark:border-white/5 pt-3 my-2" />
              
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Appearance</span>
                <div className="flex space-x-1 rounded-full p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                        theme === t 
                          ? "bg-white dark:bg-black/40 text-orange-500 shadow-sm" 
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
