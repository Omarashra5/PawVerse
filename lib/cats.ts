import { fetchWithTimeout } from "./fetch.js";
import { cache, CACHE_TTL } from "./cache.js";
import { FALLBACK_CATS, CatBreed } from "./fallbackCats.js";

const CAT_API_KEY = process.env.CAT_API_KEY || "live_HjoR09ItnAN3ZNDNMbmliLRmBApLqDnBDriFM4jWhejtVSVFpbVABW0dfciRl2xf";
const CAT_API_BASE = "https://api.thecatapi.com/v1";

export async function getCatBreeds(): Promise<CatBreed[]> {
  const now = Date.now();
  if (cache.catBreeds && (now - cache.lastUpdated < CACHE_TTL)) {
    return cache.catBreeds;
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    };
    
    if (CAT_API_KEY) {
      headers["x-api-key"] = CAT_API_KEY.trim(); // تنظيف الفراغات إن وجدت
    }

    console.log(`[Cat API] Fetching live data with key length: ${CAT_API_KEY?.length || 0}`);
    const response = await fetchWithTimeout(`${CAT_API_BASE}/breeds`, headers, 15000);
    
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Status: ${response.status} - Response: ${text}`);
    }
    
    const data = await response.json();
    const processed = data.map((b: any) => ({
      ...b,
      image: b.image || (b.reference_image_id ? { url: `https://cdn2.thecatapi.com/images/${b.reference_image_id}.jpg` } : null)
    }));
    
    cache.catBreeds = processed;
    cache.lastUpdated = now;
    return processed;
  } catch (err: any) {
    console.error("[Cat API Error]: Live fetch failed, serving fallback database.", err.message || err);
    return cache.catBreeds || FALLBACK_CATS;
  }
}