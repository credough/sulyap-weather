from flask import Blueprint, request, jsonify, render_template
from .utils import (
    get_coordinates,
    get_weather_forecast,
    score_day,
    score_badge
)


main = Blueprint("main", __name__)

@main.route("/api/sulyap")
def sulyap_weather():
    location = request.args.get("location")
    activity = request.args.get("activity", "Beach")

    if not location:
        return jsonify({"error": "Location is required"}), 400

    coords = get_coordinates(location)
    if not coords:
        return jsonify({"error": "Location not found"}), 404

    weather = get_weather_forecast(coords["lat"], coords["lon"])
    daily = weather["daily"]

    forecast = []
    top_pick = None

    for i, date in enumerate(daily["time"]):
        temp = daily["temperature_2m_max"][i]
        rain = daily["precipitation_probability_max"][i]
        wind = daily["windspeed_10m_max"][i]

        score = score_day(temp, rain, wind, activity)

        day = {
            "date": date,
            "temp": temp,
            "rain": rain,
            "wind": wind,
            "score": score,
            "badge": score_badge(score)
        }

        forecast.append(day)

        if not top_pick or score > top_pick["score"]:
            top_pick = day

    return jsonify({
        "location": coords,
        "activity": activity,
        "top_pick": top_pick,
        "forecast": forecast
    })

@main.route("/")
def index():
    return render_template("index.html")