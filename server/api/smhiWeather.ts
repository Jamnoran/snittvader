import { defineEventHandler, getQuery, setResponseStatus, setResponseHeader } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const { lat, lon } = getQuery(event);

  if (!lat || !lon) {
    setResponseStatus(event, 400);
    return 'Latitude and Longitude are required';
  }

  // Round latitude and longitude to 3 decimal places
  const roundedLat = parseFloat(lat).toFixed(3);
  const roundedLon = parseFloat(lon).toFixed(3);

  const apiUrl = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${roundedLon}/lat/${roundedLat}/data.json`;

  try {
    console.log(`Fetching SMHI weather data from URL: ${apiUrl}`);
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Snittväder/1.0 (lindahl.eric@gmail.com)'
      }
    });
    setResponseStatus(event, 200);
    setResponseHeader(event, 'Content-Type', 'application/json');
    return response.data;
  } catch (error) {
    console.error('Error fetching SMHI weather data:', error);
    setResponseStatus(event, 500);
    return { error: 'Error fetching SMHI weather data' };
  }
});
