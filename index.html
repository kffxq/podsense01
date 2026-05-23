export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { input } = req.body || {};
  if (!input || typeof input !== 'string') return res.status(400).json({ error: 'Missing input' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment variables' });

  const prompt = `You are a real-time podcast explainer for curious beginners.
Given this transcript snippet, return ONLY valid JSON — no markdown fences, no preamble, no trailing text:
{
  "summary": "2-3 clear sentences explaining what is being discussed and why it matters. Write for someone with zero background — a smart curious person hearing this topic for the first time.",
  "terms": [
    {"name": "the exact technical term as used", "definition": "plain English, 1-2 sentences, zero jargon"}
  ],
  "analogy": "One vivid real-world analogy that makes the core idea click instantly. Begin with: Think of it like…"
}
Include 2–4 terms. Only flag genuine technical or specialist words. Be concrete, warm, and illuminating.

TRANSCRIPT:
${input}`;

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

    const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
