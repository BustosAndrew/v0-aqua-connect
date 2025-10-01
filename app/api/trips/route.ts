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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      ship_name,
      captain,
      crew_members,
      departure_time,
      return_time,
      location,
      target_species,
      fishing_zone,
      trip_date,
      estimated_income,
      duration_days,
      image_url,
    } = body

    const result = await sql`
      INSERT INTO trips (
        ship_name,
        captain,
        crew_members,
        departure_time,
        return_time,
        location,
        target_species,
        fishing_zone,
        status,
        trip_date,
        estimated_income,
        duration_days,
        image_url
      )
      VALUES (
        ${ship_name},
        ${captain || null},
        ${crew_members || null},
        ${departure_time}::TIME,
        ${return_time}::TIME,
        ${location},
        ${target_species},
        ${fishing_zone || null},
        'In Progress',
        ${trip_date}::DATE,
        ${estimated_income || null},
        ${duration_days || null},
        ${image_url || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating trip:", error)
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 })
  }
}
