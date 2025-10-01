import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lng = searchParams.get("lng") || "-81.1"
  const lat = searchParams.get("lat") || "-5.1"
  const zoom = searchParams.get("zoom") || "10"
  const width = searchParams.get("width") || "800"
  const height = searchParams.get("height") || "600"

  const mapboxToken = process.env.MAPBOX_TOKEN

  if (!mapboxToken) {
    return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
  }

  // This allows the client's browser to fetch directly from Mapbox,
  // which works with URL restrictions while keeping the token secure
  const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lng},${lat},${zoom},0/${width}x${height}@2x?access_token=${mapboxToken}`

  return NextResponse.json(
    { url: mapboxUrl },
    {
      headers: {
        "Cache-Control": "private, max-age=300", // Cache for 5 minutes
      },
    },
  )
}
