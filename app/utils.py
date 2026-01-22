import requests

def get_coordinates(location_name):
    """
    Convert a location name into latitude & longitude
    using Open-Meteo Geocoding API.
    """
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": location_name,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "results" not in data or not data["results"]:
        return None

    result = data["results"][0]

    return {
        "name": result["name"],
        "country": result.get("country"),
        "lat": result["latitude"],
        "lon": result["longitude"]
    }

def get_weather_forecast(lat, lon):
    """
    Fetch 16-day daily forecast from Open-Meteo.
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": [
            "temperature_2m_max",
            "precipitation_probability_max",
            "windspeed_10m_max"
        ],
        "forecast_days": 16,
        "timezone": "auto"
    }

    response = requests.get(url, params=params)
    return response.json()

def score_day(temp, rain, wind, activity):
    temp = temp if temp is not None else 0
    rain = rain if rain is not None else 0
    wind = wind if wind is not None else 0
    score = 50  # base score

    if activity == "Beach":
        if temp >= 28:
            score += 40
        if rain >= 20:
            score -= 50
        if wind >= 15:
            score -= 20

    elif activity == "Hiking":
        if 18 <= temp <= 26:
            score += 40
        if rain >= 30:
            score -= 40
        if wind >= 20:
            score -= 20

    elif activity == "Wedding":
        if rain == 0:
            score += 50
        if wind >= 10:
            score -= 30

    return max(0, min(100, score))


def score_badge(score):
    if score >= 90:
        return "🟢 Perfect"
    elif score >= 70:
        return "🟡 Good"
    return "🔴 Risky"
