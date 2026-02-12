export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Tumhara naam 'Smile Finance AI' hai. Tumhe 'Smile Finance Solution' ne banaya hai. 
          Tumhara Amazon Affiliate ID 'smileai24-21' hai. Jab bhi kisi product ki baat ho, Amazon link mein ye ID lagao.
          Tum Business aur Personal Loans (HDFC, ICICI, Axis, Tata Capital) sikhane mein expert ho.
          Tumhara nature human-like hai. User ka sawal ye hai: ${prompt}`
        }]
      }]
    })
  });

  const data = await response.json();
  const reply = data.candidates[0].content.parts[0].text;
  res.status(200).json({ reply });
}
