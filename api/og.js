import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        },
        children: [
          // Top glow
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-200px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(196,149,106,0.15) 0%, transparent 70%)',
              },
            },
          },
          // Badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '100px',
                border: '1px solid #333',
                background: '#141414',
                fontSize: '18px',
                color: '#8a8580',
                marginBottom: '32px',
                letterSpacing: '0.05em',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#c4956a',
                    },
                  },
                },
                'March 2026',
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: '80px',
                color: '#e8e4df',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                display: 'flex',
                gap: '16px',
              },
              children: [
                'Wall of ',
                {
                  type: 'span',
                  props: {
                    style: { color: '#c4956a', fontStyle: 'italic' },
                    children: 'Pride',
                  },
                },
              ],
            },
          },
          // Quote
          {
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                color: '#8a8580',
                marginTop: '28px',
                maxWidth: '700px',
                textAlign: 'center',
                lineHeight: '1.6',
                fontStyle: 'italic',
              },
              children:
                '\u201CWe cannot in good conscience accede to their request.\u201D',
            },
          },
          // Attribution
          {
            type: 'div',
            props: {
              style: {
                fontSize: '16px',
                color: '#555',
                marginTop: '12px',
                letterSpacing: '0.03em',
              },
              children: 'Dario Amodei, CEO of Anthropic',
            },
          },
          // Bottom line
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '40px',
                fontSize: '16px',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              children: 'The community stands with Anthropic',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
