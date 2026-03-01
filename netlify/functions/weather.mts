import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const res = await fetch(
    "https://api.weather.gov/alerts/active"
  );

  const data = await res.json();

  const alerts = data.features.map((a: any) => ({
    event: a.properties.event,
    area: a.properties.areaDesc,
    severity: a.properties.severity
  }));

  return new Response(JSON.stringify(alerts.slice(0, 20)), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config: Config = {
  path: "/api/weather"
};
