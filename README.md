**Sulyap-weather** uses a Flask-based backend that fetches real-time weather forecasts and evaluates them based on user-selected activities such as Beach, Hiking, or Wedding.

The backend is designed as a REST-style API that returns structured JSON data, making it easy to connect with any frontend (HTML/JS, React, mobile apps, etc.).

---

## Project Architecture
```js
Sulyap-weather/
│
├── app/
│   ├── __init__.py      # Flask app factory
│   ├── routes.py        # API routes
│   ├── utils.py         # Weather, geocoding, and scoring logic
│   ├── static/          # Frontend assets
│   └── templates/       # HTML templates
│
├── config.py            # App configuration
├── run.py               # App entry point
├── requirements.txt     # Python dependencies
└── README.md
```

This structure follows Flask industry conventions, separating routing logic from business logic.

---

## How the Backend Works?

### **User Input**
- Location (e.g., Boracay, Mt. Pulag)
- Activity type (Beach, Hiking, Wedding)

### **Geocoding**
- The backend converts the location name into latitude and longitude using Open-Meteo’s Geocoding API.

### **Weather Forecast**
- A 16-day weather forecast is fetched using the Open-Meteo Forecast API.
- Data includes:
Max temperature
Rain probability
Wind speed

### **Scoring Engine**
- Each day is assigned a score (0–100) based on the selected activity.
Example (Beach):
+40 if temperature > 28°C
−50 if rain probability > 20%
−20 if wind speed > 15 km/h

### **Result Selection**
- The day with the highest score is marked as the Top Pick.
Each day is also tagged with a badge:
🟢 Perfect (90–100)
🟡 Good (70–89)
🔴 Risky (<70)

### **Response**
- The backend returns a JSON response containing:
Location details
Activity
Top Pick day
Full 16-day forecast with scores and badges

---

## API Endpoint
GET 
```js
/api/sulyap
```
Query Parameters
location (required) – location name
activity (optional) – Beach | Hiking | Wedding (default: Beach)

Example:
```js
/api/sulyap?location=Boracay&activity=Beach

```

Example Response
```js
{
  "location": {
    "name": "Boracay",
    "lat": 11.967,
    "lon": 121.924
  },
  "activity": "Beach",
  "top_pick": {
    "date": "2026-01-10",
    "score": 95,
    "badge": "🟢 Perfect"
  },
  "forecast": [
    {
      "date": "2026-01-09",
      "temp": 29,
      "rain": 10,
      "wind": 12,
      "score": 88,
      "badge": "🟡 Good"
    }
  ]
}

```
---

## Design Decisions
### **No Database**
- The app focuses on real-time weather evaluation.
### **Separation of concerns**
- routes.py handles HTTP requests
- utils.py handles logic and API calls

### **API-first design**
- Frontend and backend are loosely coupled.

### **Scalable**
- Easy to add new activities, scoring rules, or UI layers.