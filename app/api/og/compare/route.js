import { ImageResponse } from 'next/og';
import { getComparisonData } from '../../../lib/getComparisonData.js';
import { canonicalPair, parsePairSlug } from '../../../lib/comparisonUrl.js';
import { comparisonCard } from '../../../lib/comparisonCard.js';

export const runtime = 'nodejs';

const SIZE = { width: 1200, height: 630 };
const BACKGROUND = 'linear-gradient(135deg, #0a1f44 0%, #0052cc 100%)';

// Satori needs each text node as one string, so all interpolation uses template literals.
function fallbackCard() {
  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: BACKGROUND,
        gap: '16px',
      }}
    >
      <div style={{ fontSize: '64px', fontWeight: 700, color: '#ffffff' }}>Compare browsers</div>
      <div style={{ fontSize: '30px', color: '#b3d4ff' }}>Recorded Speedometer 3.1 results</div>
    </div>,
    SIZE
  );
}

export async function GET(request) {
  let card = null;
  try {
    const parts = parsePairSlug(request.nextUrl.searchParams.get('pair') || '');
    // Only canonical slugs: one card URL per indexable page.
    if (parts && !canonicalPair(...parts).reversed) {
      card = comparisonCard(await getComparisonData(...parts));
    }
  } catch {
    card = null;
  }
  if (!card) return fallbackCard();

  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: BACKGROUND,
        padding: '64px 72px',
        gap: '20px',
      }}
    >
      <div style={{ fontSize: '64px', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
        {card.title}
      </div>
      <div style={{ fontSize: '30px', color: '#b3d4ff' }}>{card.platform}</div>
      <div style={{ display: 'flex', gap: '32px', marginTop: '16px' }}>
        {card.rows.map((row) => (
          <div
            key={row.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '24px 28px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ fontSize: '30px', color: '#ffffff' }}>{row.name}</div>
            <div style={{ fontSize: '64px', fontWeight: 700, color: '#ffffff' }}>{row.score}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '28px', color: '#ffffff', marginTop: '8px' }}>{card.outcome}</div>
    </div>,
    SIZE
  );
}
