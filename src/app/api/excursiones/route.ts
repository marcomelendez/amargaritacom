import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const apiRes = await fetch(`${BACKEND_URL}/api/excursions?destination=isla-de-margarita&per_page=100`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })

    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Laravel API error' }, { status: apiRes.status })
    }

    const data = await apiRes.json()
    return NextResponse.json(data.data ?? data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    console.error('[BFF /api/excursions]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
