const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

async function loadDisasters() {
  const response = await fetch('/api/disasters');
  const data = await response.json();

  data.forEach(d => {
    L.marker([d.lat, d.lng])
      .addTo(map)
      .bindPopup(`Magnitude: ${d.mag}<br>Location: ${d.place}`);
  });
}

loadDisasters();
