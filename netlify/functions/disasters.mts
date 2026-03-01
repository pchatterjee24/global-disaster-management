import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const response = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  );

  const data = await response.json();

  const earthquakes = data.features.map((q: any) => ({
    mag: q.properties.mag,
    place: q.properties.place,
    lat: q.geometry.coordinates[1],
    lng: q.geometry.coordinates[0]
  }));

  return new Response(JSON.stringify(earthquakes), {
    headers: { "Content-Type": "application/json" }
  });
};
