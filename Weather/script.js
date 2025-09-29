const API_KEY = "c92ec5c0eb48b7696587715a6087417c"; // Replace with your own
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

// UI elements
const locationEl = document.getElementById("location");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const extraEl = document.getElementById("extra");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const detailsEl = document.getElementById("extraDetails");

const sunRadio = document.getElementById("sun");
const cloudRadio = document.getElementById("cloud");
const rainRadio = document.getElementById("rain");
const snowRadio = document.getElementById("snow");

function formatDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Convert UNIX time + timezone offset to hh:mm
function formatLocalTime(unixSeconds, tzOffset) {
  // tzOffset is seconds offset from UTC provided by API
  const localMs = (unixSeconds + tzOffset) * 1000;
  return new Date(localMs).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateScene(condition) {
  const c = condition.toLowerCase();
  if (c.includes("snow")) snowRadio.checked = true;
  else if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder"))
    rainRadio.checked = true;
  else if (c.includes("cloud")) cloudRadio.checked = true;
  else sunRadio.checked = true;
}

async function fetchWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    // Basic info
    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    dateEl.textContent = formatDate(new Date());
    tempEl.textContent = Math.round(data.main.temp);
    descEl.textContent = data.weather[0].description;
    extraEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // convert m/s to km/h

    // 👉 Extra details overlay
    const sunrise = formatLocalTime(data.sys.sunrise, data.timezone);
    const sunset = formatLocalTime(data.sys.sunset, data.timezone);
    detailsEl.innerHTML = `
        Feels Like: ${Math.round(data.main.feels_like)}°C<br>
        Pressure: ${data.main.pressure} hPa<br>
        Sunrise: ${sunrise}<br>
        Sunset: ${sunset}
      `;

    updateScene(data.weather[0].main);
  } catch (err) {
    alert(err.message);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
  cityInput.value = "";
});

// Load default city
fetchWeather("Mumbai");
