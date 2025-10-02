import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    let result

    if (search) {
      const searchPattern = `%${search}%`
      result = await sql`
        SELECT * FROM catch_logs
        WHERE 
          LOWER(vessel) LIKE LOWER(${searchPattern}) OR
          LOWER(species) LIKE LOWER(${searchPattern}) OR
          CAST(date AS TEXT) LIKE ${searchPattern}
        ORDER BY date DESC 
        LIMIT 50
      `
    } else {
      result = await sql`
        SELECT * FROM catch_logs
        ORDER BY date DESC 
        LIMIT 50
      `
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching catch logs:", error)
    return NextResponse.json({ error: "Failed to fetch catch logs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, vessel, species, total_kg, price_per_kg, total_value } = body

    const result = await sql`
      INSERT INTO catch_logs (date, vessel, species, total_kg, price_per_kg, total_value)
      VALUES (${date}, ${vessel}, ${species}, ${total_kg}, ${price_per_kg}, ${total_value})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating catch log:", error)
    return NextResponse.json({ error: "Failed to create catch log" }, { status: 500 })
  }
}
