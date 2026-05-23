module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { input } = req.body || {};
  if (!input || typeof input !== 'string') return res.status(400).json({ error: 'Missing input' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const prompt = `You are a real-time podcast explainer for curious beginners. Given this transcript snippet, return ONLY valid JSON — no markdown fences, no preamble:
{
  "summary": "2-3 clear sentences for someone with zero background.",
  "terms": [{"name": "technical term", "definition": "plain English, no jargon"}],
  "analogy": "One vivid analogy starting with: Think of it like…"
}
Include 2-4 terms. TRANSCRIPT:\n${input}`;

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1000 }
        })
      }
    );
    const data = await upstream.json();
    if (data.error) return res.status(502).json({ error: data.error.message });
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
