import { promises as fs } from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

const SIZE = { width: 1200, height: 630 };

let _cache = null;
async function getData() {
  if (_cache) return _cache;
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const [profilesRaw, browsersRaw] = await Promise.all([
    fs.readFile(path.join(dataDir, 'quiz', 'browser-profiles.json'), 'utf8'),
    fs.readFile(path.join(dataDir, 'browsers.json'), 'utf8'),
  ]);
  _cache = {
    profiles: JSON.parse(profilesRaw),
    browsers: JSON.parse(browsersRaw),
  };
  return _cache;
}

async function getLogoDataUrl(logoPath) {
  if (!logoPath || logoPath.endsWith('.svg')) return null;
  try {
    const buf = await fs.readFile(path.join(process.cwd(), 'public', logoPath));
    const ext = path.extname(logoPath).slice(1).toLowerCase();
    const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

function fallbackCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '64px', fontWeight: 700, color: '#ffffff' }}>
          Find Your Perfect Browser
        </div>
        <div style={{ fontSize: '28px', color: '#c4b5fd' }}>
          browserating.com/quiz
        </div>
      </div>
    ),
    SIZE
  );
}

export async function GET(request) {
  let profile, logoDataUrl;
  try {
    const r = request.nextUrl.searchParams.get('r');
    const { profiles, browsers } = await getData();

    profile = r ? profiles.find((p) => p.id === r.toLowerCase()) : null;
    if (!profile) return fallbackCard();

    const browserEntry = browsers.find(
      (b) => b.name.toLowerCase() === profile.name.toLowerCase()
    );
    logoDataUrl = await getLogoDataUrl(browserEntry?.logo ?? null);
  } catch {
    return fallbackCard();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          padding: '60px',
          gap: '60px',
        }}
      >
        {logoDataUrl && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '220px',
              height: '220px',
              flexShrink: 0,
            }}
          >
            <img
              src={logoDataUrl}
              width={200}
              height={200}
              alt={profile.name}
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}
        >
          <div style={{ fontSize: '28px', color: '#c4b5fd', fontWeight: 400 }}>
            Your browser match:
          </div>
          <div
            style={{ fontSize: '80px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}
          >
            {profile.name}
          </div>
          <div style={{ fontSize: '26px', color: '#a78bfa', marginTop: '16px' }}>
            Find yours at browserating.com/quiz
          </div>
        </div>
      </div>
    ),
    SIZE
  );
}
