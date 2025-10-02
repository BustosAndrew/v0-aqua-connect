import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const port = searchParams.get("port")
    const species = searchParams.get("species")
    const days = Number.parseInt(searchParams.get("days") || "7")

    const dateThreshold = new Date()
    dateThreshold.setDate(dateThreshold.getDate() - days)

    // Get latest prices
    if (!species) {
      let result

      if (port && port !== "All Ports") {
        result = await sql`
          SELECT DISTINCT ON (species, port)
            species,
            port,
            price_per_kg,
            change_percentage,
            recorded_at
          FROM market_prices
          WHERE recorded_at >= ${dateThreshold.toISOString()}
            AND port = ${port}
          ORDER BY species, port, recorded_at DESC
        `
      } else {
        result = await sql`
          SELECT DISTINCT ON (species, port)
            species,
            port,
            price_per_kg,
            change_percentage,
            recorded_at
          FROM market_prices
          WHERE recorded_at >= ${dateThreshold.toISOString()}
          ORDER BY species, port, recorded_at DESC
        `
      }

      return NextResponse.json(result)
    }

    // Get historical data for a specific species
    let result

    if (port && port !== "All Ports") {
      result = await sql`
        SELECT 
          species,
          port,
          price_per_kg,
          change_percentage,
          recorded_at
        FROM market_prices
        WHERE species = ${species}
          AND recorded_at >= ${dateThreshold.toISOString()}
          AND port = ${port}
        ORDER BY recorded_at ASC
      `
    } else {
      result = await sql`
        SELECT 
          species,
          port,
          price_per_kg,
          change_percentage,
          recorded_at
        FROM market_prices
        WHERE species = ${species}
          AND recorded_at >= ${dateThreshold.toISOString()}
        ORDER BY recorded_at ASC
      `
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching market prices:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
