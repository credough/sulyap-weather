import requests

def get_weather_data(location, date_range):
    """
    Fetch weather forecast from Open-Meteo API.
    """
    # Example: simple fetch using Open-Meteo
    url = f"https://api.open-meteo.com/v1/forecast?latitude={location['lat']}&longitude={location['lon']}&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max&timezone=auto"
    response = requests.get(url)
    data = response.json()
    return data


def calculate_score(weather_data, activity):
    """
    Assign a score 0-100 per day based on activity type.
    """
    scores = []

    for day in weather_data['daily']['time']:
        temp = weather_data['daily']['temperature_2m_max'][day]
        rain = weather_data['daily']['precipitation_sum'][day]
        wind = weather_data['daily']['windspeed_10m_max'][day]

        score = 50  # Base score

        if activity == 'Beach':
            if temp > 28:
                score += 40
            if rain > 20:
                score -= 50
            if wind > 15:
                score -= 20
        elif activity == 'Hiking':
            if temp < 30 and rain < 20:
                score += 40
            if wind > 15:
                score -= 20
        elif activity == 'Wedding':
            if rain == 0:
                score += 50
            if wind > 10:
                score -= 30

        score = max(0, min(100, score))
        scores.append({'date': day, 'score': score, 'temp': temp, 'rain': rain, 'wind': wind})

    return scores
