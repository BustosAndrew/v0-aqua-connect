import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const result = await sql`
      SELECT 
        s.id,
        s.name,
        s.port,
        s.image_url,
        COUNT(cm.id) as crew_count
      FROM ships s
      LEFT JOIN crew_members cm ON s.id = cm.ship_id
      GROUP BY s.id, s.name, s.port, s.image_url
      ORDER BY s.name ASC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching ships:", error)
    return NextResponse.json({ error: "Failed to fetch ships" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, port, image_url } = body

    const result = await sql`
      INSERT INTO ships (name, port, image_url)
      VALUES (${name}, ${port}, ${image_url || null})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating ship:", error)
    return NextResponse.json({ error: "Failed to create ship" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, port, image_url } = body

    const result = await sql`
      UPDATE ships
      SET name = ${name}, port = ${port}, image_url = ${image_url || null}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating ship:", error)
    return NextResponse.json({ error: "Failed to update ship" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Ship ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM ships WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting ship:", error)
    return NextResponse.json({ error: "Failed to delete ship" }, { status: 500 })
  }
}
