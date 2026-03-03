export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageData } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Identify all food items visible in this image. For each item, estimate its virtual water footprint in gallons using Water Footprint Network standards. Account for the fact that virtual water varies by country of origin — mention the global average and note if origin significantly changes the number. Return your response as JSON only in this format: { 'foods': [{ 'name': string, 'quantity': string, 'gallons': number, 'origin_note': string }], 'total_gallons': number, 'comparison': string }`
            },
            { inlineData: { mimeType: 'image/jpeg', data: imageData } }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
