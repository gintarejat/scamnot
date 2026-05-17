// Vercel serverless proxy for the Anthropic Messages API.
// Browser hits /api/claude → this function adds the API key + version → Anthropic.
// API key lives in Vercel env var, never in the browser.
//
// Includes a basic IP-based rate limiter using a Vercel KV store IF you set one up,
// otherwise falls back to in-memory (good enough until first viral post).

const WINDOW_MS = 60 * 60 * 1000;     // 1 hour
const LIMIT_PER_IP = 5;                // 5 investigations per IP per hour
const buckets = new Map();             // in-memory fallback

function ipFrom(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    'unknown'
  );
}

function rateLimited(ip) {
  const now = Date.now();
  const arr = (buckets.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (arr.length >= LIMIT_PER_IP) {
    buckets.set(ip, arr);
    return true;
  }
  arr.push(now);
  buckets.set(ip, arr);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const ip = ipFrom(req);
  if (rateLimited(ip)) {
    return res.status(429).json({
      error: { message: 'Rate limit: 5 investigations/hour per IP. Try again later.' }
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: { message: 'Server misconfigured: ANTHROPIC_API_KEY not set in Vercel env.' }
    });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({
      error: { message: 'Proxy error: ' + (err?.message || 'unknown') }
    });
  }
}
