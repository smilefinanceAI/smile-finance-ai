export default async function handler(req, res) {
  // Sirf POST request ko allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Check karein ki API Key hai ya nahi
    if (!apiKey) {
      return res.status(500).json({ reply: "API Key missing in Vercel settings! Please add GEMINI_API_KEY." });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tumhara naam 'Smile Finance AI' hai, jise 'Smile Finance Solution' ne banaya hai. 
            Tumhara Amazon Affiliate ID 'smileai24-21' hai.
            Tum business aur personal loans ke expert ho aur tumhare paas duniya ka saara gyan hai.
            User ka sawal ye hai: ${prompt}`
          }]
        }]
      })
    });

    const data = await response.json();

    // Check karein ki Google API ne sahi jawab bheja hai ya nahi
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiReply });
    } else {
      console.error("API Error Response:", data);
      return res.status(500).json({ reply: "AI response format error. Please check API Key or try again later." });
    }

  } catch (error) {
    console.error("Server Crash Error:", error);
    return res.status(500).json({ reply: "Internal Server Error: " + error.message });
  }
}
