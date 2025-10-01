import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const result = await sql`
      SELECT 
        id,
        ship_name,
        image_url,
        TO_CHAR(departure_time, 'HH12:MI AM') as departure,
        TO_CHAR(return_time, 'HH12:MI AM') as return,
        location,
        target_species as target,
        status
      FROM trips
      WHERE trip_date = ${date}
      ORDER BY departure_time ASC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching trips:", error)
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}
