import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { date: string } }) {
  try {
    const date = params.date

    const result = await sql`
      SELECT 
        ship_name,
        crew_count,
        species,
        kg_caught,
        price_per_kg,
        subtotal
      FROM catch_details
      WHERE date = ${date}
      ORDER BY ship_name, species
    `

    // Group by ship
    const groupedByShip = result.reduce(
      (acc: any, row: any) => {
        const shipName = row.ship_name
        if (!acc[shipName]) {
          acc[shipName] = {
            shipName,
            crewCount: row.crew_count,
            totalIncome: 0,
            catches: [],
          }
        }
        acc[shipName].catches.push({
          species: row.species,
          kgCaught: Number(row.kg_caught),
          pricePerKg: Number(row.price_per_kg),
          subtotal: Number(row.subtotal),
        })
        acc[shipName].totalIncome += Number(row.subtotal)
        return acc
      },
      {} as Record<string, any>,
    )

    return NextResponse.json(Object.values(groupedByShip))
  } catch (error) {
    console.error("[v0] Error fetching catch details:", error)
    return NextResponse.json({ error: "Failed to fetch catch details" }, { status: 500 })
  }
}
