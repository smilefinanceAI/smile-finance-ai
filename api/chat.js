export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Debugging ke liye logs mein data print hoga
    console.log("Google API Response:", JSON.stringify(data));

    if (data.candidates && data.candidates[0].content) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: reply });
    } else {
      // Agar API key galat hai ya model block hai
      const errorMsg = data.error ? data.error.message : "Response format unexpected";
      return res.status(200).json({ reply: "API Error: " + errorMsg });
    }
  } catch (error) {
    return res.status(500).json({ reply: "Server Crash: " + error.message });
  }
}
