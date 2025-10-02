import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, category, priority, reporterName, reporterEmail } = body

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Insert issue into database
    const result = await sql`
      INSERT INTO issues (title, description, category, priority, reporter_name, reporter_email)
      VALUES (${title}, ${description}, ${category}, ${priority || "medium"}, ${reporterName || null}, ${reporterEmail || null})
      RETURNING id, title, created_at
    `

    return NextResponse.json(
      {
        message: "Issue reported successfully",
        issue: result[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating issue:", error)
    return NextResponse.json({ message: "Failed to report issue" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Fetch all issues, ordered by most recent first
    const issues = await sql`
      SELECT id, title, description, category, priority, status, reporter_name, reporter_email, created_at, updated_at
      FROM issues
      ORDER BY created_at DESC
    `

    return NextResponse.json({ issues })
  } catch (error) {
    console.error("[v0] Error fetching issues:", error)
    return NextResponse.json({ message: "Failed to fetch issues" }, { status: 500 })
  }
}
