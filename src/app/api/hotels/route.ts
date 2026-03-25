import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { Hotel, HotelContent } from '@/types'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

export async function GET() {
  try {
    // 1. Fetch hotel list from Laravel API (server-side, no CORS issues)
    const apiRes = await fetch(`${BACKEND_URL}/api/hotels?per_page=200`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 }, // cache 5 min
    })

    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Laravel API error' }, { status: apiRes.status })
    }

    const apiData = await apiRes.json()
    const hotels: Hotel[] = apiData.data ?? apiData

    // 2. Batch-fetch MongoDB content for all hotel IDs
    const hotelIds = hotels.map(h => h.id)
    const db = await getDb()
    const contents = await db
      .collection<HotelContent>('hotel_content')
      .find({ hotel_id: { $in: hotelIds } })
      .project<HotelContent>({
        hotel_id: 1,
        slug: 1,
        short_description: 1,
        highlights: 1,
        amenities_list: 1,
      })
      .toArray()

    // 3. Build lookup map  hotel_id → content
    const contentMap = new Map(contents.map(c => [c.hotel_id, c]))

    // 4. Merge: MySQL data wins for metadata, MongoDB fills content fields
    const enriched = hotels.map(hotel => {
      const content = contentMap.get(hotel.id)
      if (!content) return hotel
      return {
        ...hotel,
        short_description: content.short_description ?? hotel.short_description,
        highlights: content.highlights,
        amenities_list: content.amenities_list,
      }
    })

    return NextResponse.json(enriched, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    console.error('[BFF /api/hotels]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
