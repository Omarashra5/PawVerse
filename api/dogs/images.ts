import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { limit = "24", breed_id } = req.query;
    let apiUrl = `https://api.thedogapi.com/v1/images/search?limit=${limit}`;
    if (breed_id) {
      apiUrl += `&breed_ids=${breed_id}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        "x-api-key": process.env.DOG_API_KEY || "",
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}