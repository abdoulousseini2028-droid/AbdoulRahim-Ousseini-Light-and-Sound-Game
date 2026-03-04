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
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `You are an AI food analyst. When given an image of food, analyze each food item visible and estimate the virtual water content (water footprint in gallons) required to produce that food.

For each food item, provide a JSON response with this exact structure (return ONLY valid JSON, no other text):
{
  "foods": [
    {
      "name": "Food Name",
      "quantity": "amount (e.g., 1 cup, 100g)",
      "gallons": 50.5,
      "origin_note": "Brief info about origin/sustainability"
    }
  ],
  "total_gallons": 150.5,
  "comparison": "This is equivalent to [X] showers or [Y] days of drinking water for a person."
}

Be accurate with virtual water estimates. Common examples:
- 1 kg beef: ~1,800 gallons
- 1 kg chicken: ~430 gallons
- 1 kg rice: ~700 gallons
- 1 apple: ~25 gallons
- 1 liter milk: ~190 gallons`
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
