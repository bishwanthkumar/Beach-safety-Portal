import axios from 'axios';

export async function getMarine(lat, lng) {
  const url = 'https://marine-api.open-meteo.com/v1/marine';
  const { data } = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lng,
      current: 'wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction,sea_level_height_msl,sea_surface_temperature',
      forecast_days: 2,
      timezone: 'auto',
      cell_selection: 'sea'
    },
    timeout: 9000
  });
  const c = data.current || {};
  return {
    waveHeight: c.wave_height,
    waveDirection: c.wave_direction,
    wavePeriod: c.wave_period,
    currentVelocity: c.ocean_current_velocity,
    currentDirection: c.ocean_current_direction,
    seaLevel: c.sea_level_height_msl,
    seaSurfaceTemperature: c.sea_surface_temperature,
    time: c.time,
    timezone: data.timezone,
    source: 'Open-Meteo Marine'
  };
}
