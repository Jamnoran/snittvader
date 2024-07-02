// Yr.no
import { defineEventHandler, getQuery, setResponseStatus, setResponseHeader } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const { lat, lon } = getQuery(event);

  if (!lat || !lon) {
    setResponseStatus(event, 400);
    return 'Latitude and Longitude are required';
  }

  const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

  try {
    console.log(`Fetching Yr.no weather data from URL: ${apiUrl}`);
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Snittväder/1.0 (lindahl.eric@gmail.com)'
      }
    });
    setResponseStatus(event, 200);
    setResponseHeader(event, 'Content-Type', 'application/json');
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    setResponseStatus(event, 500);
    return { error: 'Error fetching weather data' };
  }
});
