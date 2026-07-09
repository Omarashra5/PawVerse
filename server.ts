import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const CAT_API_KEY = process.env.CAT_API_KEY || "live_HjoR09ItnAN3ZNDNMbmliLRmBApLqDnBDriFM4jWhejtVSVFpbVABW0dfciRl2xf";
const DOG_API_KEY = process.env.DOG_API_KEY || ""; 
const CAT_API_BASE = "https://api.thecatapi.com/v1";
const DOG_API_BASE = "https://api.thedogapi.com/v1";

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const FALLBACK_CATS = [
  {
    id: "pers",
    name: "Persian",
    origin: "Iran (Persia)",
    temperament: "Affectionate, Loyal, Quiet, Quiet",
    life_span: "14 - 15",
    description: "The Persian cat is a long-haired breed of cat characterized by its round face and short muzzle. It is also known as the \"Persian Longhair\" in the English-speaking countries.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Persian_cat",
    energy_level: 2,
    affection_level: 5,
    child_friendly: 3,
    dog_friendly: 2,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "7 - 14", metric: "3 - 6" },
    image: { url: "https://cdn2.thecatapi.com/images/0XYv78Zg9.jpg" }
  },
  {
    id: "beng",
    name: "Bengal",
    origin: "United States",
    temperament: "Alert, Agile, Energetic, Demanding, Intelligent",
    life_span: "12 - 15",
    description: "Bengals are a lot of fun to live with, but they're definitely not the cat for everyone, or for first-time cat owners. Extremely intelligent, active and inquisitive, they require a lot of interaction and stimulation.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bengal_cat",
    energy_level: 5,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "6 - 12", metric: "3 - 7" },
    image: { url: "https://cdn2.thecatapi.com/images/O3btZ7TxO.jpg" }
  },
  {
    id: "mcoo",
    name: "Maine Coon",
    origin: "United States",
    temperament: "Adaptable, Active, Affectionate, Gentle, Friendly, Intelligent",
    life_span: "12 - 15",
    description: "Perhaps the oldest native breed in North America, the Maine Coon is known for its large size, rugged coat, and gentle, loving disposition. They are highly social and make wonderful family companions.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Maine_Coon",
    energy_level: 3,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    intelligence: 4,
    rare: 0,
    weight: { imperial: "10 - 25", metric: "5 - 11" },
    image: { url: "https://cdn2.thecatapi.com/images/Oux4868As.jpg" }
  },
  {
    id: "siam",
    name: "Siamese",
    origin: "Thailand",
    temperament: "Active, Loving, Social, Vocal, Demanding, Intelligent",
    life_span: "12 - 15",
    description: "The Siamese is one of the first distinctly recognized breeds of Asian cat. Derived from the Wichianmat landrace, one of several varieties of cat native to Thailand.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Siamese_cat",
    energy_level: 4,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "8 - 15", metric: "4 - 7" },
    image: { url: "https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg" }
  },
  {
    id: "ragd",
    name: "Ragdoll",
    origin: "United States",
    temperament: "Friendly, Gentle, Quiet, Easygoing, Loving",
    life_span: "12 - 17",
    description: "The Ragdoll is a cat breed with a color point coat and blue eyes. They are large and muscular semi-longhair cats with a soft and silky coat. Developed by American breeder Ann Baker in the 1960s.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Ragdoll",
    energy_level: 3,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "10 - 20", metric: "5 - 9" },
    image: { url: "https://cdn2.thecatapi.com/images/o7mC3FtGL.jpg" }
  },
  {
    id: "sphy",
    name: "Sphynx",
    origin: "Canada",
    temperament: "Active, Friendly, Intelligent, Quiet, Conversational",
    life_span: "12 - 14",
    description: "The Sphynx cat is a breed of cat known for its lack of coat. Hairlessness in cats is a naturally occurring genetic mutation; however, the Sphynx cat, as a breed, was developed through selective breeding.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Sphynx_cat",
    energy_level: 4,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 4,
    rare: 1,
    weight: { imperial: "6 - 12", metric: "3 - 5" },
    image: { url: "https://cdn2.thecatapi.com/images/3b6_itC7g.jpg" }
  }
];

const FALLBACK_DOGS = [
  {
    id: "121",
    name: "Golden Retriever",
    origin: "Scotland",
    temperament: "Intelligent, Kind, Reliable, Friendly, Trustworthy, Confident",
    life_span: "10 - 12 years",
    description: "The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name. They are friendly, intelligent, and highly devoted.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Golden_Retriever",
    energy_level: 4,
    affection_level: 5,
    child_friendly: 5,
    dog_friendly: 5,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "55 - 75", metric: "25 - 34" },
    height: { imperial: "21.5 - 24", metric: "55 - 61" },
    image: { url: "https://cdn2.thedogapi.com/images/1-7c_2ZaG.jpg" }
  },
  {
    id: "115",
    name: "German Shepherd Dog",
    origin: "Germany",
    temperament: "Alert, Watchful, Intelligent, Curious, Obedient, Loyal, Brave",
    life_span: "10 - 13 years",
    description: "The German Shepherd Dog is one of America's most popular dog breeds — for good reason. They are intelligent and capable working dogs, loyal and protective companions.",
    wikipedia_url: "https://en.wikipedia.org/wiki/German_Shepherd",
    energy_level: 4,
    affection_level: 4,
    child_friendly: 4,
    dog_friendly: 3,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "50 - 90", metric: "23 - 41" },
    height: { imperial: "22 - 26", metric: "56 - 66" },
    image: { url: "https://cdn2.thedogapi.com/images/SkmRJg9VQ.jpg" }
  },
  {
    id: "149",
    name: "Labrador Retriever",
    origin: "Newfoundland",
    temperament: "Kind, Outgoing, Agile, Gentle, Intelligent, Trustworthy, Even-tempered",
    life_span: "10 - 12 years",
    description: "The sweet-faced, lovable Labrador Retriever is America's most popular dog breed. Labs are friendly, outgoing, and high-spirited companions who have more than enough affection to go around.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Labrador_Retriever",
    energy_level: 5,
    affection_level: 5,
    child_friendly: 5,
    dog_friendly: 5,
    intelligence: 4,
    rare: 0,
    weight: { imperial: "55 - 80", metric: "25 - 36" },
    height: { imperial: "21.5 - 24.5", metric: "55 - 62" },
    image: { url: "https://cdn2.thedogapi.com/images/B18S1gq4M.jpg" }
  },
  {
    id: "222",
    name: "Siberian Husky",
    origin: "Siberia",
    temperament: "Outgoing, Friendly, Alert, Gentle, Intelligent",
    life_span: "12 - 15 years",
    description: "The Siberian Husky, a thickly coated, compact sled dog of medium size and great endurance, was developed to work in packs, pulling light loads at moderate speeds over vast frozen expanses.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Siberian_Husky",
    energy_level: 5,
    affection_level: 5,
    child_friendly: 5,
    dog_friendly: 5,
    intelligence: 4,
    rare: 0,
    weight: { imperial: "35 - 60", metric: "16 - 27" },
    height: { imperial: "20 - 23.5", metric: "51 - 60" },
    image: { url: "https://cdn2.thedogapi.com/images/S139gZ5Vm.jpg" }
  },
  {
    id: "101",
    name: "French Bulldog",
    origin: "France",
    temperament: "Playful, Affectionate, Keen, Easygoing, Lively, Sociable, Alert",
    life_span: "9 - 11 years",
    description: "The French Bulldog is a breed of domestic dog, bred to be companion dogs. The breed is the result of a cross between Toy Bulldogs imported from England, and local ratters in Paris, France.",
    wikipedia_url: "https://en.wikipedia.org/wiki/French_Bulldog",
    energy_level: 3,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "28 max", metric: "13 max" },
    height: { imperial: "11 - 12", metric: "28 - 30" },
    image: { url: "https://cdn2.thedogapi.com/images/H1S6na9Um.jpg" }
  },
  {
    id: "201",
    name: "Pug",
    origin: "China",
    temperament: "Docile, Clever, Charming, Stubborn, Sociable, Playful, Quiet, Attentive",
    life_span: "12 - 14 years",
    description: "The Pug is a breed of dog with physically distinctive features of a wrinkly, short-muzzled face, and curled tail. The breed has a fine, glossy coat that comes in a variety of colours.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pug",
    energy_level: 2,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "14 - 18", metric: "6 - 8" },
    height: { imperial: "10 - 12", metric: "25 - 30" },
    image: { url: "https://cdn2.thedogapi.com/images/HyEx7o7v7.jpg" }
  }
];

// In-Memory Cache
const cache: {
  catBreeds: any[] | null;
  dogBreeds: any[] | null;
  lastUpdated: number;
} = {
  catBreeds: null,
  dogBreeds: null,
  lastUpdated: 0
};

const CACHE_TTL = 2 * 60 * 60 * 1000;

async function fetchWithTimeout(url: string, headers: HeadersInit, timeout = 6000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function getCatBreeds(): Promise<any[]> {
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

async function getDogBreeds(): Promise<any[]> {
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


app.get("/api/cats/breeds", async (req, res) => {
  try {
    const breeds = await getCatBreeds();
    res.json(breeds);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load cat breeds" });
  }
});

app.get("/api/dogs/breeds", async (req, res) => {
  try {
    const breeds = await getDogBreeds();
    res.json(breeds);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load dog breeds" });
  }
});

app.get("/api/cats/images", async (req, res) => {
  const { breed_ids, limit = 12, page = 0 } = req.query;
  try {
    const url = `${CAT_API_BASE}/images/search?breed_ids=${breed_ids || ""}&limit=${limit}&page=${page}&has_breeds=1`;
    const headers: HeadersInit = {};
    if (CAT_API_KEY) {
      headers["x-api-key"] = CAT_API_KEY;
    }
    const response = await fetchWithTimeout(url, headers);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Cat API images error: ${response.status} ${response.statusText} - ${text}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    console.warn("Cat API images fetch failed, serving breed-related image fallbacks");
    try {
      const breeds = await getCatBreeds();
      const targetBreed = breeds.find(b => b.id === breed_ids);
      if (targetBreed && targetBreed.image) {
        return res.json([
          { id: `${breed_ids}-1`, url: targetBreed.image.url, breeds: [targetBreed] },
          { id: `${breed_ids}-2`, url: targetBreed.image.url, breeds: [targetBreed] }
        ]);
      }
    } catch {}
    res.json([]);
  }
});

app.get("/api/dogs/images", async (req, res) => {
  const { breed_ids, limit = 12, page = 0 } = req.query;
  try {
    const url = `${DOG_API_BASE}/images/search?breed_ids=${breed_ids || ""}&limit=${limit}&page=${page}&has_breeds=1`;
    const headers: HeadersInit = {};
    if (DOG_API_KEY) {
      headers["x-api-key"] = DOG_API_KEY;
    }
    const response = await fetchWithTimeout(url, headers);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Dog API images error: ${response.status} ${response.statusText} - ${text}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    console.warn("Dog API images fetch failed, serving breed-related image fallbacks");
    try {
      const breeds = await getDogBreeds();
      const targetBreed = breeds.find(b => String(b.id) === String(breed_ids));
      if (targetBreed && targetBreed.image) {
        return res.json([
          { id: `${breed_ids}-1`, url: targetBreed.image.url, breeds: [targetBreed] },
          { id: `${breed_ids}-2`, url: targetBreed.image.url, breeds: [targetBreed] }
        ]);
      }
    } catch {}
    res.json([]);
  }
});

app.get("/api/breed-of-the-day", async (req, res) => {
  try {
    const catBreeds = await getCatBreeds();
    const dogBreeds = await getDogBreeds();
    
    const combined = [
      ...catBreeds.map(c => ({ ...c, type: "cat" })),
      ...dogBreeds.map(d => ({ ...d, type: "dog" }))
    ];

    if (combined.length === 0) {
      return res.status(404).json({ error: "No breeds available" });
    }

    const startOfCurrentYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();
    const diff = today.getTime() - startOfCurrentYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % combined.length;
    const selected = combined[index];

    res.json(selected);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to select breed of the day" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
