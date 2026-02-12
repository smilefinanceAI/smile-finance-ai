export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;

  try {
    // URL mein humne v1beta ko badal kar v1 kar diya hai jo ki stable hai
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Tumhara naam Smile Finance AI hai. Tum Smile Finance Solution ke liye kaam karte ho. Tumhare paas duniya ka sara gyan hai. Amazon Affiliate ID 'smileai24-21' hai. User ka sawal: ${prompt}` 
          }] 
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: reply });
    } else {
      // Agar ab bhi error aaye toh wo detail yahan dikhegi
      const errorMsg = data.error ? data.error.message : "Response format issue";
      return res.status(200).json({ reply: "Google API Update: " + errorMsg });
    }
  } catch (error) {
    return res.status(500).json({ reply: "Server Connection Error: " + error.message });
  }
}
