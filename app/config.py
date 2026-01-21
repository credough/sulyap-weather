import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecret')
    OPEN_METEO_API = os.environ.get('OPEN_METEO_API', 'your_open_meteo_key')
    MAPBOX_TOKEN = os.environ.get('MAPBOX_TOKEN', 'your_mapbox_token')
