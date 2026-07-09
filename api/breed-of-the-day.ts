import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCatBreeds } from "../lib/cats";
import { getDogBreeds } from "../lib/dogs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Highly optimized parallel operations
    const [catBreeds, dogBreeds] = await Promise.all([
      getCatBreeds(),
      getDogBreeds()
    ]);
    
    const combined: any[] = [
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

    return res.status(200).json(selected);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to select breed of the day" });
  }
}