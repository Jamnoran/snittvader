<template>
    <div>
      <WeatherInput @get-weather="fetchWeather" />
      <WeatherDisplay :city="city" :weather="weather" />
      
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import WeatherInput from '~/components/WeatherInput.vue';
  import WeatherDisplay from '~/components/WeatherDisplay.vue';
  
  export default {
    components: {
      WeatherInput,
      WeatherDisplay
    },
    data() {
      return {
        city: '',
        weather: []
      }
    },
    methods: {
      async fetchWeather(cityName) {
        try {  
          const config = useRuntimeConfig();
          const apiKey = config.public.OPENCAGE_API_KEY;

          // Step 1: Get latitude and longitude from the city name
          const geoResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${apiKey}`);
          const { lat, lng } = geoResponse.data.results[0].geometry;
  
          this.city = `${cityName} (Lat: ${lat}, Lon: ${lng})`;
  
          // Step 2: Fetch weather data using the retrieved latitude and longitude
          const weatherResponse = await axios.get(`/api/weather?lat=${lat}&lon=${lng}`);
  
          this.weather = this.processWeatherData([weatherResponse.data]);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      },
      processWeatherData(weatherData) {
        const dailyForecasts = {};
  
        weatherData.forEach(data => {
          data.properties.timeseries.forEach(timeserie => {
            const date = timeserie.time.split('T')[0];
            if (!dailyForecasts[date]) {
              dailyForecasts[date] = [];
            }
            dailyForecasts[date].push(timeserie.data.instant.details.air_temperature);
          });
        });
  
        const medianWeather = Object.keys(dailyForecasts).map(date => {
          const temperatures = dailyForecasts[date];
          temperatures.sort((a, b) => a - b);
          const medianTemperature = temperatures.length % 2 === 0
            ? (temperatures[temperatures.length / 2 - 1] + temperatures[temperatures.length / 2]) / 2
            : temperatures[Math.floor(temperatures.length / 2)];
  
          return { date, temperature: medianTemperature };
        });
  
        return medianWeather;
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  