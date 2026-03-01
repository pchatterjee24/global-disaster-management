const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const infoDiv = document.getElementById("info");

// Clear info safely
infoDiv.innerHTML = "";

/* =============================
   EARTHQUAKES
============================= */
async function loadEarthquakes() {
  const response = await fetch('/api/disasters');
  const data = await response.json();

  data.forEach(d => {
    L.circleMarker([d.lat, d.lng], {
      radius: Math.max(4, d.mag * 2),
      color: "red"
    })
      .addTo(map)
      .bindPopup(`🌎 Magnitude: ${d.mag}<br>📍 ${d.place}`);
  });
}

/* =============================
   RISK INDEX
============================= */
async function loadRisk() {
  const res = await fetch("/api/risk");
  const data = await res.json();

  const riskSection = document.createElement("div");
  riskSection.innerHTML = `
    <h2>🌍 Global Risk Index</h2>
    <p><strong>Average Magnitude:</strong> ${data.averageMagnitude.toFixed(2)}</p>
    <p><strong>Risk Score:</strong> ${data.riskScore}/100</p>
  `;

  infoDiv.appendChild(riskSection);
}

/* =============================
   WEATHER ALERTS
============================= */
async function loadWeather() {
  const res = await fetch("/api/weather");
  const data = await res.json();

  const weatherSection = document.createElement("div");
  weatherSection.innerHTML = `<h2>🌪 Active Weather Alerts</h2>`;

  if (!data || data.length === 0) {
    weatherSection.innerHTML += "<p>No active alerts available.</p>";
  } else {
    data.slice(0, 10).forEach(alert => {
      const alertDiv = document.createElement("div");
      alertDiv.style.background = "#222";
      alertDiv.style.padding = "8px";
      alertDiv.style.margin = "6px 0";
      alertDiv.style.borderRadius = "5px";

      alertDiv.innerHTML = `
        <strong>${alert.event}</strong><br>
        Severity: ${alert.severity}
      `;

      weatherSection.appendChild(alertDiv);
    });
  }

  infoDiv.appendChild(weatherSection);
}

/* =============================
   INIT
============================= */
loadEarthquakes();
loadRisk();
loadWeather();
