export const dynamic = 'force-dynamic';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const res = await fetch(`${base}/api/marketplace/endpoints`, { cache: 'no-store' });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : res.status,
    headers: { 'content-type': 'application/json' },
  });
}


