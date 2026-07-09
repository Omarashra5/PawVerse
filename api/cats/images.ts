import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchWithTimeout } from "../../lib/fetch";
import { getCatBreeds } from "../../lib/cats.js";

const CAT_API_KEY = process.env.CAT_API_KEY || "live_HjoR09ItnAN3ZNDNMbmliLRmBApLqDnBDriFM4jWhejtVSVFpbVABW0dfciRl2xf";
const CAT_API_BASE = "https://api.thecatapi.com/v1";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { breed_ids, limit = 24, page = 0 } = req.query;

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
    return res.status(200).json(data);
  } catch (err) {
    console.warn("Cat API images fetch failed, serving breed-related image fallbacks");
    try {
      const breeds = await getCatBreeds();
      const targetBreed = breeds.find(b => b.id === breed_ids);
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