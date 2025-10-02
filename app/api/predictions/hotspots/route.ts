import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const week = searchParams.get("week") || "2024-W28" // Default to first available week

    // Read the GeoJSON file from public/predictions
    const filePath = path.join(process.cwd(), "public", "predictions", `${week}.geojson`)

    try {
      const fileContent = await fs.readFile(filePath, "utf-8")
      const geojsonData = JSON.parse(fileContent)

      return NextResponse.json({
        week,
        data: geojsonData,
        availableWeeks: ["2024-W28", "2024-W29", "2024-W30"],
      })
    } catch (fileError) {
      // If file doesn't exist, return empty data
      return NextResponse.json({
        week,
        data: { type: "FeatureCollection", features: [] },
        availableWeeks: ["2024-W28", "2024-W29", "2024-W30"],
        error: "Week data not available",
      })
    }
  } catch (error) {
    console.error("[v0] Error fetching hotspot predictions:", error)
    return NextResponse.json({ error: "Failed to fetch hotspot predictions" }, { status: 500 })
  }
}
