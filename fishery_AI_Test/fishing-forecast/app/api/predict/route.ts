import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // we need fs, not edge

type Feature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] }; // [lon, lat]
  properties: { p: number } & Record<string, any>;
};
type FeatureCollection = { type: "FeatureCollection"; features: Feature[] };

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const PORTS: Record<string, [number, number]> = {
  Paita: [-5.09, -81.11],
  Chimbote: [-9.07, -78.59],
  Callao: [-12.06, -77.15],
  Pisco: [-13.71, -76.22],
  Matarani: [-17.0, -72.1],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const week = searchParams.get("week") || "2024-W30";
  const port = searchParams.get("port") || "Callao";
  const lam = Number(searchParams.get("lam") || "0.02");

  const portCoords = PORTS[port] ?? PORTS["Callao"];
  const [plat, plon] = portCoords;

  // Precomputed file: put your Python-generated file here
  const filePath = path.join(process.cwd(), "public", "predictions", `${week}.geojson`);

  let fc: FeatureCollection;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    fc = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: `GeoJSON not found for week ${week}` },
      { status: 404 }
    );
  }

  // Compute distance + score; recolor by score
  for (const f of fc.features) {
    const [lon, lat] = f.geometry.coordinates;
    const p = Math.max(0, Math.min(1, Number(f.properties?.p ?? 0)));
    const dist_km = haversineKm(plat, plon, lat, lon);
    const score = Math.max(0, Math.min(1, p - lam * dist_km));
    // Save for client
    f.properties = {
      ...f.properties,
      p,
      dist_km,
      score,
      // RGBA for deck.gl or mapbox
      color: [Math.round(255 * score), 50, Math.round(200 * (1 - score)), 200],
    };
  }

  // Top-10 nearest-highest scoring
  const ranked = [...fc.features].sort(
    (a, b) => (b.properties.score ?? 0) - (a.properties.score ?? 0)
  );
  const top10 = ranked.slice(0, 10).map((f) => ({
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    p: f.properties.p,
    score: f.properties.score,
    dist_km: f.properties.dist_km,
  }));

  return NextResponse.json({ week, port, lam, top10, geojson: fc });
}
