const C = {
  API_KEY: "28345a5ba877304c56881ef46b90e7fb",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  LANG: "ka",
  UNITS: "metric",
};

const E = {
  burgerBtn: null,
  mobileNav: null,
  citySearch: null,
  searchBtn: null,
  refreshCitiesBtn: null,
  currentCity: null,
  currentDate: null,
  currentTemp: null,
  weatherIcon: null,
  weatherDesc: null,
  highTemp: null,
  lowTemp: null,
  motivationText: null,
  hourlyData: null,
  weeklyData: null,
  citiesData: null,
  humidity: null,
  windSpeed: null,
  uvIndex: null,
  rainChance: null,
};

const ICONS = {
  Clear: { i: "fas fa-sun", c: "#f1c40f", t: "მზიანი" },
  Clouds: { i: "fas fa-cloud", c: "#bdc3c7", t: "ღრუბლიანი" },
  Rain: { i: "fas fa-cloud-rain", c: "#3498db", t: "წვიმიანი" },
  Drizzle: { i: "fas fa-cloud-rain", c: "#3498db", t: "მსხვილი წვიმა" },
  Thunderstorm: { i: "fas fa-bolt", c: "#f1c40f", t: "ჭექა-ქუხილი" },
  Snow: { i: "fas fa-snowflake", c: "#8bb8c4", t: "თოვლიანი" },
  Mist: { i: "fas fa-smog", c: "#95a5a6", t: "ნისლიანი" },
  Fog: { i: "fas fa-smog", c: "#95a5a6", t: "ნისლიანი" },
};

const MSGS = [
  "You totally got this.",
  "You are extraordinary.",
  "You look amazing today.",
  "Today will be awesome!",
  "Keep shining bright!",
];

const CITIES = [
  "Batumi",
  "Kutaisi",
  "Rustavi",
  "Gori",
  "Zugdidi",
  "Kutaisi",
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Berlin",
  "Moscow",
  "Rome",
  "Madrid",
  "Beijing",
  "Istanbul",
  "Dubai",
  "Sydney",
];

const DAYS = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];

document.addEventListener("DOMContentLoaded", init);

function init() {
  initElements();
  updateCurrentDate();
  initBurgerMenu();
  initSearch();
  initButtons();
  initStickyHeader();
  initNavLinks();
  fetchWeatherData("Tbilisi");
}

function initElements() {
  E.burgerBtn = id("burger-btn");
  E.mobileNav = id("mobile-nav");
  E.citySearch = id("city-search");
  E.searchBtn = id("search-btn");
  E.refreshCitiesBtn = id("refresh-cities-btn");
  E.currentCity = id("current-city");
  E.currentDate = id("current-date");
  E.currentTemp = id("current-temp");
  E.weatherIcon = id("weather-icon");
  E.weatherDesc = id("weather-description");
  E.highTemp = id("high-temp");
  E.lowTemp = id("low-temp");
  E.motivationText = id("motivation-text");
  E.hourlyData = id("hourly-data");
  E.weeklyData = id("weekly-data");
  E.citiesData = id("cities-data");
  E.humidity = id("humidity");
  E.windSpeed = id("wind-speed");
  E.uvIndex = id("uv-index");
  E.rainChance = id("rain-chance");
}

function id(el) {
  return document.getElementById(el);
}

function updateCurrentDate() {
  if (E.currentDate) {
    E.currentDate.textContent = new Date().toLocaleDateString("ka-GE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

function initBurgerMenu() {
  if (E.burgerBtn && E.mobileNav) {
    E.burgerBtn.addEventListener("click", () =>
      E.mobileNav.classList.toggle("active"),
    );
  }
}

function initNavLinks() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      if (E.mobileNav.classList.contains("active"))
        E.mobileNav.classList.remove("active");
      const target = id(link.getAttribute("href").substring(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initSearch() {
  if (E.searchBtn && E.citySearch) {
    E.searchBtn.addEventListener("click", handleSearch);
    E.citySearch.addEventListener(
      "keypress",
      (e) => e.key === "Enter" && handleSearch(),
    );
  }
}

function initButtons() {
  if (E.refreshCitiesBtn) {
    E.refreshCitiesBtn.addEventListener("click", async () => {
      E.refreshCitiesBtn.classList.add("loading");
      await loadOtherCities();
      E.refreshCitiesBtn.classList.remove("loading");
    });
  }
}

function initStickyHeader() {
  const header = document.getElementById("main-header");
  if (!header) return;

  console.log("Sticky header ფუნქცია მუშაობს!");

  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;

    console.log("Scroll Y:", scrollY, "კლასი sticky:", scrollY >= 100);

    if (scrollY >= 100) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });
}

async function fetchWeatherData(city) {
  showLoading();
  try {
    const [current, forecast] = await Promise.all([
      fetchAPI(
        `${C.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${C.UNITS}&appid=${C.API_KEY}&lang=${C.LANG}`,
      ),
      fetchAPI(
        `${C.BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${C.UNITS}&appid=${C.API_KEY}&lang=${C.LANG}`,
      ),
    ]);
    updateCurrentWeather(current, forecast);
    updateForecastData(forecast);
  } catch {
    showError();
  }
}

async function fetchAPI(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API Error");
  return await res.json();
}

function showLoading() {
  E.currentCity.textContent =
    E.weatherDesc.textContent =
    E.motivationText.textContent =
      "იტვირთება...";
  E.currentTemp.textContent = "...";
  if (E.hourlyData)
    E.hourlyData.innerHTML = '<div class="loading">იტვირთება...</div>';
  if (E.weeklyData)
    E.weeklyData.innerHTML = '<div class="loading">იტვირთება...</div>';
}

function showError() {
  E.currentCity.textContent = "შეცდომა";
  E.currentTemp.textContent = "--";
  E.weatherDesc.textContent = "მონაცემები ვერ მოიძებნა";
}

function updateCurrentWeather(data, forecast) {
  const w = data.weather[0];
  const m = data.main;

  E.currentCity.textContent = data.name;
  E.currentTemp.textContent = Math.round(m.temp);
  E.weatherDesc.textContent = w.description;
  E.highTemp.textContent = `${Math.round(m.temp_max)}°`;
  E.lowTemp.textContent = `${Math.round(m.temp_min)}°`;

  updateIcon(w.main);

  E.humidity.textContent = `${m.humidity}%`;
  E.windSpeed.textContent = Math.round(data.wind.speed * 3.6);
  E.uvIndex.textContent = Math.min(10, Math.max(1, Math.round(m.temp / 3)));
  E.rainChance.textContent = `${forecast?.list?.[0]?.pop ? Math.round(forecast.list[0].pop * 100) : 0}%`;

  E.motivationText.textContent = MSGS[Math.floor(Math.random() * MSGS.length)];
}

function updateIcon(condition) {
  const icon = ICONS[condition] || ICONS.Clouds;
  E.weatherIcon.className = icon.i;
  E.weatherIcon.style.color = icon.c;
}

function updateForecastData(data) {
  updateHourly(data);
  updateWeekly(data);
}

function updateHourly(data) {
  if (!E.hourlyData || !data.list) return;

  const hours = data.list
    .slice(0, 6)
    .map((f) => {
      const t = new Date(f.dt * 1000);
      const h = t.getHours().toString().padStart(2, "0") + ":00";
      const icon = ICONS[f.weather[0].main] || ICONS.Clouds;
      const rain = f.pop ? Math.round(f.pop * 100) : 0;

      return `
      <div class="hour-card">
        <h4>${h}</h4>
        <i class="${icon.i}" style="color: ${icon.c}"></i>
        <p class="hour-temp">${Math.round(f.main.temp)}°</p>
        ${rain > 0 ? `<p class="hour-rain">${rain}%</p>` : ""}
      </div>
    `;
    })
    .join("");

  E.hourlyData.innerHTML = hours;
}

function updateWeekly(data) {
  if (!E.weeklyData || !data.list) return;

  const days = groupByDay(data.list);
  const today = new Date().toISOString().split("T")[0];
  delete days[today];

  const forecast = Object.keys(days)
    .sort()
    .slice(0, 5)
    .map((dayKey) => {
      const d = days[dayKey];
      const icon = ICONS[getMostCommon(d.conditions)] || ICONS.Clouds;

      return `
      <div class="forecast-card">
        <h4>${DAYS[d.date.getDay()]}</h4>
        <i class="${icon.i}" style="color: ${icon.c}"></i>
        <div class="temp-range">
          <span class="high">${Math.round(Math.max(...d.temps))}°</span>
          <span class="low">${Math.round(Math.min(...d.temps))}°</span>
        </div>
        <p>${icon.t}</p>
      </div>
    `;
    })
    .join("");

  E.weeklyData.innerHTML = forecast;
}

function groupByDay(list) {
  const days = {};
  list.forEach((f) => {
    const d = new Date(f.dt * 1000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!days[key]) days[key] = { temps: [], conditions: [], date: d };
    days[key].temps.push(f.main.temp);
    days[key].conditions.push(f.weather[0].main);
  });
  return days;
}

function getMostCommon(arr) {
  const counts = {};
  let max = 0,
    result = "Clouds";
  arr.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > max) {
      max = counts[item];
      result = item;
    }
  });
  return result;
}

async function loadOtherCities() {
  if (!E.citiesData) return;

  E.citiesData.innerHTML = '<div class="loading">იტვირთება...</div>';

  try {
    const results = await Promise.all(
      CITIES.map((city) =>
        fetchAPI(
          `${C.BASE_URL}/weather?q=${city}&units=${C.UNITS}&appid=${C.API_KEY}&lang=${C.LANG}`,
        ).catch(() => null),
      ),
    );

    E.citiesData.innerHTML = "";
    results.forEach((data, i) => {
      if (!data) {
        createStaticCard(CITIES[i]);
        return;
      }

      const card = document.createElement("div");
      card.className = "city-card";
      const icon = ICONS[data.weather[0].main] || ICONS.Clouds;

      card.innerHTML = `
        <div class="city-info">
          <h4>${data.name}</h4>
          <p>${Math.round(data.main.temp)}°C</p>
        </div>
        <div class="city-icon">
          <i class="${icon.i}" style="color: ${icon.c}"></i>
        </div>
      `;

      card.addEventListener("click", () => {
        fetchWeatherData(data.name);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      E.citiesData.appendChild(card);
    });
  } catch {
    E.citiesData.innerHTML = "";
    CITIES.forEach(createStaticCard);
  }
}

function createStaticCard(city) {
  const card = document.createElement("div");
  card.className = "city-card";
  const temp = 15 + Math.round(Math.random() * 10);

  card.innerHTML = `
    <div class="city-info">
      <h4>${city}</h4>
      <p>${temp}°C</p>
    </div>
    <div class="city-icon">
      <i class="fas fa-sun" style="color: #f1c40f"></i>
    </div>
  `;

  card.addEventListener("click", () => {
    fetchWeatherData(city);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (E.citiesData) E.citiesData.appendChild(card);
}

function handleSearch() {
  const city = E.citySearch.value.trim();
  if (city) {
    fetchWeatherData(city);
    E.citySearch.value = "";
  }
}
