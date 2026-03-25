import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { Hotel, HotelContent } from '@/types'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    // 1. Fetch hotel detail from Laravel API
    const apiRes = await fetch(`${BACKEND_URL}/api/hotel/${slug}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })

    if (!apiRes.ok) {
      const status = apiRes.status === 404 ? 404 : 502
      return NextResponse.json({ error: 'Hotel not found' }, { status })
    }

    const apiData = await apiRes.json()
    const hotel: Hotel = apiData.data ?? apiData

    // 2. Fetch full content from MongoDB (all fields for detail page)
    const db = await getDb()
    const content = await db
      .collection<HotelContent>('hotel_content')
      .findOne({ slug })

    // 3. Merge: full content enrichment for detail page
    if (!content) {
      return NextResponse.json(hotel)
    }

    const enriched: Hotel = {
      ...hotel,
      short_description: content.short_description ?? hotel.short_description,
      description: content.description ?? hotel.description,
      highlights: content.highlights,
      amenities_list: content.amenities_list,
      check_in: content.check_in,
      check_out: content.check_out,
      faqs: content.faqs,
      seo: content.seo,
    }

    return NextResponse.json(enriched, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    console.error(`[BFF /api/hotels/${slug}]`, err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
