import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { date: string } }) {
  try {
    const date = params.date

    console.log("[v0] Fetching catch details for date:", date)

    const dateOnly = date.split("T")[0]
    console.log("[v0] Extracted date only:", dateOnly)

    const result = await sql`
      SELECT 
        vessel as ship_name,
        species,
        total_kg as kg_caught,
        price_per_kg,
        total_value as subtotal
      FROM catch_logs
      WHERE DATE(date) = ${dateOnly}
      ORDER BY vessel, species
    `

    console.log("[v0] Query returned", result.length, "rows")
    console.log("[v0] Sample data:", result[0])

    // Group by ship (vessel)
    const groupedByShip = result.reduce(
      (acc: any, row: any) => {
        const shipName = row.ship_name
        if (!acc[shipName]) {
          acc[shipName] = {
            shipName,
            crewCount: 0, // catch_logs doesn't have crew_count, default to 0
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

    const finalData = Object.values(groupedByShip)
    console.log("[v0] Returning", finalData.length, "ships")

    return NextResponse.json(finalData)
  } catch (error) {
    console.error("[v0] Error fetching catch details:", error)
    return NextResponse.json({ error: "Failed to fetch catch details" }, { status: 500 })
  }
}
