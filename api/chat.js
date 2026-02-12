export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Check 1: Kya Vercel ko Key mil rahi hai?
  if (!apiKey || apiKey.trim() === "") {
    return res.status(200).json({ 
      reply: "⚠️ ERROR: Vercel ko GEMINI_API_KEY nahi mili. Kripya Vercel Settings mein check karein." 
    });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tum Smile Finance AI ho. Amazon ID smileai24-21 hai. User ka sawal: ${prompt}`
          }]
        }]
      })
    });

    const data = await response.json();

    // Check 2: Kya Google API ne koi error bheja?
    if (data.error) {
      return res.status(200).json({ 
        reply: `❌ Google API Error: ${data.error.message} (Code: ${data.error.code})` 
      });
    }

    // Check 3: Kya sahi jawab mila?
    if (data.candidates && data.candidates[0].content) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiReply });
    } else {
      return res.status(200).json({ 
        reply: "⚠️ AI Response Khali Hai. Shayad Safety Filters ne block kiya hai." 
      });
    }

  } catch (error) {
    return res.status(200).json({ 
      reply: `🚨 Server Crash: ${error.message}` 
    });
  }
}
