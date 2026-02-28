import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tweets = await redis.lrange('approved_tweets', 0, -1);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ tweets: tweets || [] });
  } catch (error) {
    console.error('Failed to fetch tweets:', error);
    return res.status(200).json({ tweets: [] });
  }
}
