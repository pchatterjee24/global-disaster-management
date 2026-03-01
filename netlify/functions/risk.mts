import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const quakeRes = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  );

  const quakeData = await quakeRes.json();

  const magnitudes = quakeData.features.map((q: any) => q.properties.mag || 0);

  const avgMag =
    magnitudes.reduce((a: number, b: number) => a + b, 0) /
    magnitudes.length;

  const riskScore = Math.min(100, Math.round(avgMag * 15));

  return new Response(
    JSON.stringify({
      averageMagnitude: avgMag,
      riskScore
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};

export const config: Config = {
  path: "/api/risk"
};
