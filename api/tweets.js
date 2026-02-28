export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/lrange/approved_tweets/0/-1`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    });
    const data = await response.json();
    const tweets = data.result || [];
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ tweets });
  } catch (error) {
    console.error('Failed to fetch tweets:', error);
    return res.status(200).json({ tweets: [] });
  }
}
