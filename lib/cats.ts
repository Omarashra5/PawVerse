import { fetchWithTimeout } from "./fetch";
import { cache, CACHE_TTL } from "./cache";
import { FALLBACK_CATS, CatBreed } from "./fallbackCats";

const CAT_API_KEY = process.env.CAT_API_KEY || "live_HjoR09ItnAN3ZNDNMbmliLRmBApLqDnBDriFM4jWhejtVSVFpbVABW0dfciRl2xf";
const CAT_API_BASE = "https://api.thecatapi.com/v1";

export async function getCatBreeds(): Promise<CatBreed[]> {
  const now = Date.now();
  if (cache.catBreeds && (now - cache.lastUpdated < CACHE_TTL)) {
    return cache.catBreeds;
  }

  try {
    const headers: HeadersInit = {};
    if (CAT_API_KEY) {
      headers["x-api-key"] = CAT_API_KEY;
    }
    const response = await fetchWithTimeout(`${CAT_API_BASE}/breeds`, headers);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Cat API error: ${response.status} ${response.statusText} - ${text}`);
    }
    const data = await response.json();
    
    const processed = data.map((b: any) => ({
      ...b,
      image: b.image || (b.reference_image_id ? { url: `https://cdn2.thecatapi.com/images/${b.reference_image_id}.jpg` } : null)
    }));
    
    cache.catBreeds = processed;
    cache.lastUpdated = now;
    return processed;
  } catch (err) {
    console.warn("Failed to fetch live Cat Breeds, using fallback", err);
    return cache.catBreeds || FALLBACK_CATS;
  }
}