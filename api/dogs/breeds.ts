import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDogBreeds } from "../../lib/dogs.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const breeds = await getDogBreeds();
    return res.status(200).json(breeds);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to load dog breeds" });
  }
}