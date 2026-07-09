import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. بناخد الـ limit والـ breed_id لو الفرونت إند باعتهم في الـ Query
    const { limit = "24", breed_id } = req.query;

    // 2. بنبني الـ URL وبنحدد عدد الصور المطلوبة
    let apiUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}`;
    if (breed_id) {
      apiUrl += `&breed_ids=${breed_id}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY || "", // 👈 تأكد إن الـ Key مبعوت في الـ Headers
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}