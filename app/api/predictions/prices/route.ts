import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const species = searchParams.get("species")
    const region = searchParams.get("region")
    const dateRange = searchParams.get("dateRange")

    // Calculate date limit for filtering
    let dateLimitDays = 30 // default
    if (dateRange === "7days") dateLimitDays = 7
    else if (dateRange === "14days") dateLimitDays = 14

    // Build query based on filter combinations using tagged templates
    let result

    const hasSpeciesFilter = species && species !== "all"
    const hasRegionFilter = region && region !== "all"
    const hasDateFilter = dateRange && dateRange !== "all"

    if (hasSpeciesFilter && hasRegionFilter && hasDateFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE species = ${species}
          AND region = ${region}
          AND forecast_date <= CURRENT_DATE + ${dateLimitDays}::integer
        ORDER BY forecast_date ASC, species ASC
      `
    } else if (hasSpeciesFilter && hasRegionFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE species = ${species}
          AND region = ${region}
        ORDER BY forecast_date ASC, species ASC
      `
    } else if (hasSpeciesFilter && hasDateFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE species = ${species}
          AND forecast_date <= CURRENT_DATE + ${dateLimitDays}::integer
        ORDER BY forecast_date ASC, species ASC
      `
    } else if (hasRegionFilter && hasDateFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE region = ${region}
          AND forecast_date <= CURRENT_DATE + ${dateLimitDays}::integer
        ORDER BY forecast_date ASC, species ASC
      `
    } else if (hasSpeciesFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE species = ${species}
        ORDER BY forecast_date ASC, species ASC
      `
    } else if (hasRegionFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE region = ${region}
        ORDER BY forecast_date ASC, species ASC
      `
    } else if (hasDateFilter) {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        WHERE forecast_date <= CURRENT_DATE + ${dateLimitDays}::integer
        ORDER BY forecast_date ASC, species ASC
      `
    } else {
      result = await sql`
        SELECT 
          id, species, region, forecast_date, price, 
          confidence_level, trend, created_at
        FROM price_forecasts
        ORDER BY forecast_date ASC, species ASC
      `
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching price forecasts:", error)
    return NextResponse.json({ error: "Failed to fetch price forecasts" }, { status: 500 })
  }
}
