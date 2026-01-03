import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com'
    const res = await fetch(`${backend}/api/metrics/frontend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // allow the request to complete even if the client disconnects
      cache: 'no-store',
    })

    const text = await res.text()
    return new NextResponse(text, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'forward_error' }, { status: 500 })
  }
}


