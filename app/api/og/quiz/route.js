import { promises as fs } from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';
import { getQuizData } from '../../../lib/getQuizData.js';

export const runtime = 'nodejs';

const SIZE = { width: 1200, height: 630 };

// Route handlers are outside React's Server Component cache scope.
let dataPromise;
function getData() {
  if (!dataPromise) {
    dataPromise = getQuizData().catch((error) => {
      dataPromise = null;
      throw error;
    });
  }
  return dataPromise;
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

function fallbackCard(origin) {
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
        <div style={{ fontSize: '28px', color: '#c4b5fd' }}>{`${origin}/quiz`}</div>
      </div>
    ),
    SIZE
  );
}

export async function GET(request) {
  const origin = request.nextUrl.origin;
  let profile, logoDataUrl;
  try {
    const r = request.nextUrl.searchParams.get('r');
    const { profiles, browsers } = await getData();

    profile = r ? profiles.find((p) => p.id === r.toLowerCase()) : null;
    if (!profile) return fallbackCard(origin);

    const browserEntry = browsers.find(
      (b) => b.name.toLowerCase() === profile.name.toLowerCase()
    );
    logoDataUrl = await getLogoDataUrl(browserEntry?.logo ?? null);
  } catch {
    return fallbackCard(origin);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: logoDataUrl ? 'flex-start' : 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          padding: '60px',
          gap: logoDataUrl ? '60px' : '0',
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
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image is unsupported inside Satori/ImageResponse rendering */}
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
            alignItems: logoDataUrl ? 'flex-start' : 'center',
            textAlign: logoDataUrl ? 'left' : 'center',
            gap: '12px',
            flex: 1,
          }}
        >
          <div style={{ fontSize: '28px', color: '#c4b5fd', fontWeight: 400 }}>
            Someone matched with
          </div>
          <div
            style={{ fontSize: '80px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}
          >
            {profile.name}
          </div>
          <div style={{ fontSize: '26px', color: '#a78bfa', marginTop: '16px' }}>
            {`What's yours? Take the quiz at ${origin}/quiz`}
          </div>
        </div>
      </div>
    ),
    SIZE
  );
}
