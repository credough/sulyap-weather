const form = document.getElementById('searchForm');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const forecastGrid = document.getElementById('forecastGrid');
const locationInput = document.getElementById('location');
const autocompleteDropdown = document.getElementById('autocomplete');

let debounceTimer;
let selectedLocation = null;

// autocomplete functionality
locationInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    clearTimeout(debounceTimer);

    if (query.length < 2) {
        autocompleteDropdown.classList.remove('show');
        return;
    }

    debounceTimer = setTimeout(() => {
        fetchLocationSuggestions(query);
    }, 300);
});

// close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.form-group')) {
        autocompleteDropdown.classList.remove('show');
    }
});

async function fetchLocationSuggestions(query) {
    autocompleteDropdown.innerHTML = '<div class="autocomplete-loading">Searching...</div>';
    autocompleteDropdown.classList.add('show');

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            autocompleteDropdown.innerHTML = '<div class="autocomplete-empty">No locations found</div>';
            return;
        }

        displaySuggestions(data.results);
    } catch (err) {
        autocompleteDropdown.innerHTML = '<div class="autocomplete-empty">Error loading suggestions</div>';
    }
}

function displaySuggestions(results) {
    autocompleteDropdown.innerHTML = '';

    results.forEach(location => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';

        const details = [
            location.admin1,
            location.country
        ].filter(Boolean).join(', ');

        item.innerHTML = `
            <div class="autocomplete-item-name">${location.name}</div>
            <div class="autocomplete-item-details">${details}</div>
        `;

        item.addEventListener('click', () => {
            selectedLocation = location;
            locationInput.value = `${location.name}, ${location.country}`;
            autocompleteDropdown.classList.remove('show');
        });

        autocompleteDropdown.appendChild(item);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const location = locationInput.value;
    const activity = document.getElementById('activity').value;

    loading.style.display = 'block';
    error.innerHTML = '';
    results.classList.remove('show');
    autocompleteDropdown.classList.remove('show');

    try {
        const response = await fetch(`/api/sulyap?location=${encodeURIComponent(location)}&activity=${encodeURIComponent(activity)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }

        displayResults(data);
    } catch (err) {
        error.innerHTML = `<div class="error"> ${err.message}</div>`;
    } finally {
        loading.style.display = 'none';
    }
});

function displayResults(data) {
    document.getElementById('activityName').textContent = data.activity;
    document.getElementById('locationName').textContent = `${data.location.name}, ${data.location.country}`;

    const top = data.top_pick;
    document.getElementById('topDate').textContent = formatDate(top.date);
    document.getElementById('topTemp').textContent = `${Math.round(top.temp)}°C`;
    document.getElementById('topRain').textContent = `${top.rain}%`;
    document.getElementById('topWind').textContent = `${Math.round(top.wind)} km/h`;

    forecastGrid.innerHTML = '';
    data.forecast.forEach(day => {
        const card = createDayCard(day);
        forecastGrid.appendChild(card);
    });

    results.classList.add('show');

    // initialize Lucide icons
    lucide.createIcons();
}

function createDayCard(day) {
    const card = document.createElement('div');
    card.className = 'day-card';

    card.innerHTML = `
        <div class="day-header">
            <div class="day-date">${formatDate(day.date)}</div>
            <div class="badge ${getBadgeClass(day.badge)}">${getBadgeIcon(day.badge)}${getBadgeText(day.badge)}</div>
        </div>
        <div class="day-stats">
            <div class="stat">
                <span class="stat-label">
                    <i data-lucide="thermometer" class="stat-icon"></i>
                    Temperature
                </span>
                <span class="stat-value">${Math.round(day.temp)}°C</span>
            </div>
            <div class="stat">
                <span class="stat-label">
                    <i data-lucide="cloud-rain" class="stat-icon"></i>
                    Rain Chance
                </span>
                <span class="stat-value">${day.rain}%</span>
            </div>
            <div class="stat">
                <span class="stat-label">
                    <i data-lucide="wind" class="stat-icon"></i>
                    Wind Speed
                </span>
                <span class="stat-value">${Math.round(day.wind)} km/h</span>
            </div>
            <div class="score-bar">
                <div class="score-fill" style="width: ${day.score}%"></div>
            </div>
        </div>
    `;

    // initialize Lucide icons for this card
    setTimeout(() => lucide.createIcons(), 0);

    return card;
}

function getBadgeClass(badge) {
    if (badge.includes('Perfect')) return 'perfect';
    if (badge.includes('Good')) return 'good';
    return 'risky';
}

function getBadgeIcon(badge) {
    if (badge.includes('Perfect')) return '<i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>';
    if (badge.includes('Good')) return '<i data-lucide="alert-circle" style="width: 14px; height: 14px;"></i>';
    return '<i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i>';
}

function getBadgeText(badge) {
    if (badge.includes('Perfect')) return 'Perfect';
    if (badge.includes('Good')) return 'Good';
    return 'Risky';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// initialize Lucide icons on page load
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});
