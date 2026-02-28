import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tweets = await kv.lrange('approved_tweets', 0, -1);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ tweets: tweets || [] });
  } catch (error) {
    console.error('Failed to fetch tweets:', error);
    return res.status(200).json({ tweets: [] });
  }
}
