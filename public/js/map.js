// Initialize map when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Get listing data from page
  const rowElement = document.querySelector("[data-location]");
  const listingLocation = rowElement?.getAttribute("data-location") || "";
  const listingCountry = rowElement?.getAttribute("data-country") || "";
  const listingTitle = rowElement?.getAttribute("data-title") || "";

  // Check if map element exists
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Initialize map (center on India)
  const map = L.map("map").setView([20.5937, 78.9629], 5);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // If location exists, geocode and show on map
  if (listingLocation && listingCountry) {
    const searchQuery = `${listingLocation}, ${listingCountry}`;

    // Use Nominatim API to get coordinates
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}`,
      { signal: controller.signal }
    )
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timeoutId);
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          // Center map on location
          map.setView([lat, lon], 13);

          // Add marker with popup
          L.marker([lat, lon])
            .bindPopup(
              `<b>${listingTitle}</b><br>${listingLocation}, ${listingCountry}`
            )
            .openPopup()
            .addTo(map);
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.log("Geocoding timeout or error:", error.message);
      });
  }
});
