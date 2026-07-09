import { fetchWithTimeout } from "./fetch";
import { cache, CACHE_TTL } from "./cache";
import { FALLBACK_DOGS, DogBreed } from "./fallbackDogs";

const DOG_API_KEY = process.env.DOG_API_KEY || "";
const DOG_API_BASE = "https://api.thedogapi.com/v1";

export async function getDogBreeds(): Promise<DogBreed[]> {
  const now = Date.now();
  if (cache.dogBreeds && (now - cache.lastUpdated < CACHE_TTL)) {
    return cache.dogBreeds;
  }

  try {
    const headers: HeadersInit = {};
    if (DOG_API_KEY) {
      headers["x-api-key"] = DOG_API_KEY;
    }
    const response = await fetchWithTimeout(`${DOG_API_BASE}/breeds`, headers);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Dog API error: ${response.status} ${response.statusText} - ${text}`);
    }
    const data = await response.json();
    
    const processed = data.map((b: any) => {
      const temp = (b.temperament || "").toLowerCase();
      
      const energy_level = temp.includes("active") || temp.includes("playful") || temp.includes("energetic") ? 5 :
                           temp.includes("lively") || temp.includes("wild") ? 4 : 3;

      const affection_level = temp.includes("loving") || temp.includes("friendly") || temp.includes("affectionate") || temp.includes("devoted") ? 5 : 4;
      const child_friendly = temp.includes("gentle") || temp.includes("friendly") || temp.includes("kind") || temp.includes("trustworthy") ? 5 : 4;
      const dog_friendly = temp.includes("sociable") || temp.includes("companion") || temp.includes("outgoing") ? 5 : 4;
      const intelligence = temp.includes("intelligent") || temp.includes("clever") || temp.includes("obedient") ? 5 :
                           temp.includes("alert") || temp.includes("curious") ? 4 : 3;

      const description = b.description || b.bred_for ? 
        `The ${b.name} was originally bred for ${b.bred_for || "companionship"}. They are known for being ${b.temperament?.toLowerCase() || "loyal and wonderful companions"}.` :
        `The ${b.name} is a wonderful dog breed originating from ${b.origin || "various regions"}. Known for a distinct temperament of: ${b.temperament || "friendly and active"}.`;

      return {
        ...b,
        description,
        energy_level,
        affection_level,
        child_friendly,
        dog_friendly,
        intelligence,
        rare: temp.includes("rare") || temp.includes("ancient") ? 1 : 0,
        image: b.image || (b.reference_image_id ? { url: `https://cdn2.thedogapi.com/images/${b.reference_image_id}.jpg` } : null),
        wikipedia_url: b.wikipedia_url || `https://en.wikipedia.org/wiki/${encodeURIComponent(b.name)}`
      };
    });

    cache.dogBreeds = processed;
    cache.lastUpdated = now;
    return processed;
  } catch (err) {
    console.warn("Failed to fetch live Dog Breeds, using fallback", err);
    return cache.dogBreeds || FALLBACK_DOGS;
  }
}