import { CatBreed } from "./fallbackCats.js";
import { DogBreed } from "./fallbackDogs.js";

export interface CacheSchema {
  catBreeds: CatBreed[] | null;
  dogBreeds: DogBreed[] | null;
  lastUpdated: number;
}

// Global scope ensures memory survives between hot executions inside same runtime instances on Vercel
const globalCache = global as unknown as { __appCache?: CacheSchema };

if (!globalCache.__appCache) {
  globalCache.__appCache = {
    catBreeds: null,
    dogBreeds: null,
    lastUpdated: 0,
  };
}

export const cache = globalCache.__appCache;
export const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 Hours