def get_coordinates(location):
    """Get latitude and longitude for a location using Open-Meteo geocoding API."""
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1"
    data = fetch_json(url)
    if 'results' in data and data['results']:
        lat = data['results'][0]['latitude']
        lon = data['results'][0]['longitude']
        return lat, lon
    else:
        return None, None

def get_weather_by_location(location):
    """Get weather report for a location name using Open-Meteo APIs."""
    lat, lon = get_coordinates(location)
    if lat is None or lon is None:
        return f"Could not find coordinates for '{location}'."
    return get_open_meteo_weather(lat, lon)
def get_open_meteo_weather(latitude, longitude):
    """Fetch current weather data using Open-Meteo API for given coordinates."""
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
    data = fetch_json(url)
    if 'current_weather' in data:
        weather = data['current_weather']
        temp = weather.get('temperature')
        windspeed = weather.get('windspeed')
        return f"Temperature: {temp}°C, Windspeed: {windspeed} km/h"
    else:
        return "Weather data not available."


import requests

def fetch_json(url):
    """Fetch JSON data from the specified URL using requests."""
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def get_weather_report(city, api_key):
    """Fetch current weather data for a city using OpenWeatherMap API."""
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    weather = data['weather'][0]['description']
    temp = data['main']['temp']
    return f"Weather in {city}: {weather}, Temperature: {temp}°C"

# Test when running directly
if __name__ == "__main__":
    location = input("Enter a location for weather report (e.g., 'India', 'London', 'Mumbai'): ")
    print(f"Weather report for {location}:")
    print(get_weather_by_location(location))