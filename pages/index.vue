<template>
  <div>
    <WeatherInput @get-weather="fetchWeather" />
    <WeatherDisplay :city="city" :weather="weather" :isLoading="isLoading" />
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
      weather: [],
      isLoading: false
    }
  },
  methods: {
    async fetchWeather(cityName) {
      this.isLoading = true;
      try {  
        const config = useRuntimeConfig();
        const apiKey = config.public.OPENCAGE_API_KEY;

        // Step 1: Get latitude and longitude from the city name
        const geoResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${apiKey}`);
        const { lat, lng } = geoResponse.data.results[0].geometry;

        this.city = `${cityName} (Lat: ${lat}, Lon: ${lng})`;

        // Step 2: Fetch weather data from the existing source
        const yrNoWeatherResponse = await axios.get(`/api/weather?lat=${lat}&lon=${lng}`);

        // Step 3: Fetch weather data from SMHI
        const smhiWeatherResponse = await axios.get(`/api/smhiWeather?lat=${lat}&lon=${lng}`);

        // Process and merge weather data
        this.weather = this.processWeatherData([yrNoWeatherResponse.data, smhiWeatherResponse.data]);

      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    processWeatherData(weatherDataArray) {
      const dailyForecasts = {};
      const currentHour = new Date().getHours();

      weatherDataArray.forEach(data => {
        if (data.properties) {
          data.properties.timeseries.forEach(timeserie => {
            const [date, time] = timeserie.time.split('T');
            const hour = parseInt(time.split(':')[0]);

            if (!dailyForecasts[date]) {
              dailyForecasts[date] = { temperatures: [], timeseries: [] };
            }
            dailyForecasts[date].temperatures.push(timeserie.data.instant.details.air_temperature);
            dailyForecasts[date].timeseries.push({ time: hour, temperature: timeserie.data.instant.details.air_temperature });

            const conditions = [];
            if (timeserie.data.next_12_hours) {
              conditions.push(timeserie.data.next_12_hours.summary.symbol_code);
            }
            if (timeserie.data.next_6_hours) {
              conditions.push(timeserie.data.next_6_hours.summary.symbol_code);
            }
            if (timeserie.data.next_1_hours) {
              conditions.push(timeserie.data.next_1_hours.summary.symbol_code);
            }

            if (conditions.length > 0) {
              const conditionCounts = conditions.reduce((acc, condition) => {
                acc[condition] = (acc[condition] || 0) + 1;
                return acc;
              }, {});

              const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => 
                conditionCounts[a] > conditionCounts[b] ? a : b
              );

              dailyForecasts[date].condition = mostFrequentCondition;
            }
          });
        }

        if (data.timeSeries) {
          data.timeSeries.forEach(timeserie => {
            const [date, time] = timeserie.validTime.split('T');
            const hour = parseInt(time.split(':')[0]);
            const tempParam = timeserie.parameters.find(param => param.name === 't');
            if (tempParam) {
              if (!dailyForecasts[date]) {
                dailyForecasts[date] = { temperatures: [], timeseries: [] };
              }
              dailyForecasts[date].temperatures.push(tempParam.values[0]);
              dailyForecasts[date].timeseries.push({ time: hour, temperature: tempParam.values[0] });
            }
          });
        }
      });

      const dailyWeather = Object.keys(dailyForecasts).map(date => {
        const temperatures = dailyForecasts[date].temperatures;
        const highestTemperature = Math.max(...temperatures);
        const lowestTemperature = Math.min(...temperatures);

        const closestToCurrentHour = dailyForecasts[date].timeseries.reduce((prev, curr) => 
          Math.abs(curr.time - currentHour) < Math.abs(prev.time - currentHour) ? curr : prev
        );

        return {
          date,
          highestTemperature,
          lowestTemperature,
          closestToCurrentHour: closestToCurrentHour.temperature,
          condition: dailyForecasts[date].condition || 'unknown',
          windSpeed: dailyForecasts[date].windSpeed || 0, // Add wind speed if available
          humidity: dailyForecasts[date].humidity || 0 // Add humidity if available
        };
      });

      return dailyWeather;
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
