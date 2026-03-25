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
    const apiRes = await fetch(`${BACKEND_URL}/api/hotel/${slug}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!apiRes.ok) {
      const status = apiRes.status === 404 ? 404 : 502
      return NextResponse.json({ error: 'Hotel not found' }, { status })
    }

    const apiData = await apiRes.json()
    const hotel: Hotel = apiData.data ?? apiData

    const db = await getDb()
    const content = await db
      .collection<HotelContent>('hotel_content')
      .findOne({ slug })

    return NextResponse.json({
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
    })
  } catch (err) {
    console.error(`[Admin GET /api/admin/hotels/${slug}]`, err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const body = await req.json() as Partial<HotelContent>

    // Resolve hotel_id from Laravel if not provided
    let hotel_id = body.hotel_id
    if (!hotel_id) {
      const apiRes = await fetch(`${BACKEND_URL}/api/hotel/${slug}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (apiRes.ok) {
        const apiData = await apiRes.json()
        const hotel: Hotel = apiData.data ?? apiData
        hotel_id = hotel.id
      }
    }

    const doc: Partial<HotelContent> = {
      ...body,
      slug,
      updated_at: new Date().toISOString(),
    }
    if (hotel_id) doc.hotel_id = hotel_id

    const db = await getDb()
    const result = await db
      .collection<HotelContent>('hotel_content')
      .findOneAndUpdate(
        { slug },
        { $set: doc },
        { upsert: true, returnDocument: 'after' }
      )

    return NextResponse.json({ ok: true, data: result })
  } catch (err) {
    console.error(`[Admin PUT /api/admin/hotels/${slug}]`, err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const db = await getDb()
    const result = await db
      .collection<HotelContent>('hotel_content')
      .deleteOne({ slug })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[Admin DELETE /api/admin/hotels/${slug}]`, err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
