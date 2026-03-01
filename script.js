const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

async function loadEarthquakes() {
  const response = await fetch('/api/disasters');
  const data = await response.json();

  data.forEach(d => {
    L.circleMarker([d.lat, d.lng], {
      radius: d.mag * 2,
      color: "red"
    })
      .addTo(map)
      .bindPopup(`🌎 Magnitude: ${d.mag}<br>📍 ${d.place}`);
  });
}

async function loadRisk() {
  const res = await fetch("/api/risk");
  const data = await res.json();

  document.getElementById("info").innerHTML += `
    <div style="margin-top:10px;">
      <h2>🌍 Global Risk Index</h2>
      <p><strong>Average Magnitude:</strong> ${data.averageMagnitude.toFixed(2)}</p>
      <p><strong>Risk Score:</strong> ${data.riskScore}/100</p>
    </div>
  `;
}

async function loadWeather() {
  const res = await fetch("/api/weather");
  const data = await res.json();

  let weatherHTML = `
    <div style="margin-top:15px;">
      <h2>🌪 Active Weather Alerts</h2>
  `;

  data.slice(0, 10).forEach(alert => {
    weatherHTML += `
      <div style="background:#f4f4f4;padding:8px;margin:5px;border-radius:5px;">
        <strong>${alert.event}</strong><br>
        Severity: ${alert.severity}
      </div>
    `;
  });

  weatherHTML += `</div>`;

  document.getElementById("info").innerHTML += weatherHTML;
}

loadEarthquakes();
loadRisk();
loadWeather();
