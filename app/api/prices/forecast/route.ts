import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const species = searchParams.get("species") || "anchoveta"
    const week = searchParams.get("week") || "2024-W41"

    // Read the price forecast JSON file from public/prices
    const filePath = path.join(process.cwd(), "public", "prices", `${species}_price_forecast_${week}.json`)

    try {
      const fileContent = await fs.readFile(filePath, "utf-8")
      const priceData = JSON.parse(fileContent)

      return NextResponse.json({
        species,
        week,
        forecasts: priceData,
      })
    } catch (fileError) {
      // If file doesn't exist, return empty data
      return NextResponse.json({
        species,
        week,
        forecasts: [],
        error: "Price forecast not available for this species/week",
      })
    }
  } catch (error) {
    console.error("[v0] Error fetching price forecast:", error)
    return NextResponse.json({ error: "Failed to fetch price forecast" }, { status: 500 })
  }
}
