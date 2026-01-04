import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const raw = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com').trim()
  const baseWithScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  const base = baseWithScheme.replace(/\/api\/?$/i, "").replace(/\/+$/g, "")
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const target = id
      ? `${base}/api/properties/${id}`
      : `${base}/api/properties`

    const res = await fetch(target, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    if (new URL(request.url).searchParams.get('id')) {
      return NextResponse.json({ property: null, error: String(e) }, { status: 200 })
    }
    return NextResponse.json({ properties: [], error: String(e) }, { status: 200 })
  }
}



