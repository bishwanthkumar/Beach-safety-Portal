import axios from 'axios';

export async function getWeather(lat, lng) {
  const url = 'https://api.open-meteo.com/v1/forecast';
  const { data } = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lng,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,uv_index,wind_speed_10m',
      forecast_days: 1,
      timezone: 'auto'
    },
    timeout: 9000
  });

  const c = data.current || {};
  return {
    temperature: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    apparentTemperature: c.apparent_temperature,
    precipitation: c.precipitation,
    weatherCode: c.weather_code,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    cloudCover: c.cloud_cover,
    time: c.time,
    timezone: data.timezone,
    source: 'Open-Meteo'
  };
}

export function weatherLabel(code) {
  const map = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Dense drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
    81: 'Rain showers', 82: 'Heavy rain showers', 95: 'Thunderstorm',
    96: 'Thunderstorm + hail', 99: 'Thunderstorm + hail'
  };
  return map[code] || 'Variable conditions';
}
