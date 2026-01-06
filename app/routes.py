from flask import Blueprint, render_template, request
from app.utils import get_weather_data, calculate_score

main_bp = Blueprint('main', __name__)

# Home page: input form
@main_bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        location = request.form.get('location')
        activity = request.form.get('activity')
        date_range = request.form.get('date_range')  # e.g., next 2 weeks

        # Fetch weather data from API
        weather_data = get_weather_data(location, date_range)

        # Calculate scores for each day
        scores = calculate_score(weather_data, activity)

        # Determine top pick
        top_pick = max(scores, key=lambda x: x['score'])

        return render_template('results.html', scores=scores, top_pick=top_pick)

    return render_template('index.html')


# Comparison page: 16-day side-by-side view
@main_bp.route('/comparison', methods=['GET'])
def comparison():
    location = request.args.get('location')
    weather_data = get_weather_data(location, '16_days')
    return render_template('comparison.html', weather_data=weather_data)
