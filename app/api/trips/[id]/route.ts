import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await sql`
      SELECT 
        id,
        ship_name,
        captain,
        crew_members,
        TO_CHAR(departure_time, 'HH24:MI') as departure_time,
        TO_CHAR(return_time, 'HH24:MI') as return_time,
        location,
        target_species,
        fishing_zone,
        status,
        trip_date,
        estimated_income,
        duration_days
      FROM trips
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error fetching trip details:", error)
    return NextResponse.json({ error: "Failed to fetch trip details" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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
      status,
      trip_date,
      estimated_income,
      duration_days,
    } = body

    const result = await sql`
      UPDATE trips
      SET 
        ship_name = ${ship_name},
        captain = ${captain || null},
        crew_members = ${crew_members || null},
        departure_time = ${departure_time}::TIME,
        return_time = ${return_time}::TIME,
        location = ${location},
        target_species = ${target_species},
        fishing_zone = ${fishing_zone || null},
        status = ${status},
        trip_date = ${trip_date}::DATE,
        estimated_income = ${estimated_income || null},
        duration_days = ${duration_days || null}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating trip:", error)
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 })
  }
}
