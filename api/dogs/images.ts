import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchWithTimeout } from "../../lib/fetch";
import { getDogBreeds } from "../../lib/dogs.js";

const DOG_API_KEY = process.env.DOG_API_KEY || "";
const DOG_API_BASE = "https://api.thedogapi.com/v1";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
    return res.status(200).json(data);
  } catch (err) {
    console.warn("Dog API images fetch failed, serving breed-related image fallbacks");
    try {
      const breeds = await getDogBreeds();
      const targetBreed = breeds.find(b => String(b.id) === String(breed_ids));
      if (targetBreed && targetBreed.image) {
        return res.status(200).json([
          { id: `${breed_ids}-1`, url: targetBreed.image.url, breeds: [targetBreed] },
          { id: `${breed_ids}-2`, url: targetBreed.image.url, breeds: [targetBreed] }
        ]);
      }
    } catch {}
    return res.status(200).json([]);
  }
}