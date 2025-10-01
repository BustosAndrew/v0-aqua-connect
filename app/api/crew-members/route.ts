import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const result = await sql`
      SELECT 
        cm.id,
        cm.name,
        cm.role,
        cm.ship_id,
        cm.avatar_url,
        s.name as ship_name
      FROM crew_members cm
      LEFT JOIN ships s ON cm.ship_id = s.id
      ORDER BY cm.name ASC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching crew members:", error)
    return NextResponse.json({ error: "Failed to fetch crew members" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, ship_id, avatar_url } = body

    const result = await sql`
      INSERT INTO crew_members (name, role, ship_id, avatar_url)
      VALUES (${name}, ${role}, ${ship_id || null}, ${avatar_url || null})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating crew member:", error)
    return NextResponse.json({ error: "Failed to create crew member" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, role, ship_id, avatar_url } = body

    const result = await sql`
      UPDATE crew_members
      SET name = ${name}, role = ${role}, ship_id = ${ship_id || null}, avatar_url = ${avatar_url || null}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating crew member:", error)
    return NextResponse.json({ error: "Failed to update crew member" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Crew member ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM crew_members WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting crew member:", error)
    return NextResponse.json({ error: "Failed to delete crew member" }, { status: 500 })
  }
}
