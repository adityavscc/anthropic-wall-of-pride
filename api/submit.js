const UPSTASH_URL = () => process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = () => process.env.KV_REST_API_TOKEN;

async function redis(command) {
  const res = await fetch(`${UPSTASH_URL()}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  // Validate URL format
  const tweetMatch = url?.match(/(?:x\.com|twitter\.com)\/(\w+)\/status\/(\d+)/);
  if (!tweetMatch) {
    return res.status(400).json({
      error: 'Invalid URL. Please provide a valid X/Twitter post URL.',
    });
  }

  const tweetId = tweetMatch[2];
  const handle = tweetMatch[1];
  const normalizedUrl = `https://x.com/${handle}/status/${tweetId}`;

  // Check for duplicates in approved list
  const existing = await redis(['LRANGE', 'approved_tweets', '0', '-1']);
  if ((existing || []).some(t => t.includes(tweetId))) {
    return res.status(409).json({ error: 'This post has already been added.' });
  }

  // Check if already submitted
  const seen = await redis(['SISMEMBER', 'seen_tweets', tweetId]);
  if (seen) {
    return res.status(409).json({ error: 'This post has already been submitted.' });
  }

  // Fetch tweet content via Twitter oEmbed (no API key needed)
  let tweetText = '';
  try {
    const oembedRes = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(normalizedUrl)}&omit_script=true&dnt=true`
    );
    if (!oembedRes.ok) {
      return res.status(400).json({
        error: 'Could not fetch this post. It may be private or deleted.',
      });
    }
    const oembed = await oembedRes.json();
    tweetText = oembed.html
      ?.replace(/<[^>]*>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim() || '';
  } catch {
    return res.status(400).json({
      error: 'Could not fetch this post. Please check the URL.',
    });
  }

  if (!tweetText || tweetText.length < 10) {
    return res.status(400).json({
      error: 'Could not read the content of this post.',
    });
  }

  // Auto-review with OpenRouter
  let approved = false;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: `You are reviewing a tweet for a "Wall of Pride" celebrating support for Anthropic refusing the Pentagon's demands to remove AI safety guardrails (no mass surveillance, no autonomous weapons without human oversight).

APPROVE if: expresses support/pride/solidarity with Anthropic, praises Anthropic/Dario Amodei, supports AI safety principles, amplifies the statement positively.

REJECT if: critical of Anthropic, spam/unrelated/promotional, hateful, supports Pentagon against Anthropic, neutral news reporting.

Tweet: "${tweetText}"

Respond ONLY "APPROVED" or "REJECTED" with a one-sentence reason.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const verdict = data.choices?.[0]?.message?.content || '';
    approved = verdict.toUpperCase().startsWith('APPROVED');
  } catch (error) {
    console.error('LLM review failed:', error);
    await redis(['SADD', 'seen_tweets', tweetId]);
    await redis(['LPUSH', 'pending_review', normalizedUrl]);
    return res.status(202).json({
      status: 'pending',
      message: 'Your submission is queued for review. Thank you!',
    });
  }

  // Mark as seen
  await redis(['SADD', 'seen_tweets', tweetId]);

  if (approved) {
    await redis(['LPUSH', 'approved_tweets', normalizedUrl]);
    return res.status(200).json({
      status: 'approved',
      message: 'Your post has been added to the Wall of Pride!',
    });
  } else {
    return res.status(200).json({
      status: 'rejected',
      message: "This post doesn't appear to be in support of Anthropic's stance. Only supportive posts are featured on the Wall.",
    });
  }
}
