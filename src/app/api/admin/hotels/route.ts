import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { Hotel, HotelContent } from '@/types'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const apiRes = await fetch(`${BACKEND_URL}/api/hotels?per_page=200`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Laravel API error' }, { status: apiRes.status })
    }

    const apiData = await apiRes.json()
    const hotels: Hotel[] = apiData.data ?? apiData

    const db = await getDb()
    const contents = await db
      .collection<HotelContent>('hotel_content')
      .find({})
      .toArray()

    const contentMap = new Map(contents.map(c => [c.slug, c]))

    const merged = hotels.map(hotel => {
      const content = contentMap.get(hotel.slug)
      return {
        ...hotel,
        has_content: !!content,
        ...(content ? {
          short_description: content.short_description,
          description: content.description,
          highlights: content.highlights,
          amenities_list: content.amenities_list,
          gallery: content.gallery,
          check_in: content.check_in,
          check_out: content.check_out,
          faqs: content.faqs,
          seo: content.seo,
          updated_at: content.updated_at,
        } : {}),
      }
    })

    return NextResponse.json(merged)
  } catch (err) {
    console.error('[Admin GET /api/admin/hotels]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
