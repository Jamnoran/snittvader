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

      weatherDataArray.forEach(data => {
        // Process data from the yr.no weather source
        if (data.properties) {
          data.properties.timeseries.forEach(timeserie => {
            const date = timeserie.time.split('T')[0];
            if (!dailyForecasts[date]) {
              dailyForecasts[date] = { temperatures: [], conditions: [] };
            }
            dailyForecasts[date].temperatures.push(timeserie.data.instant.details.air_temperature);

            // Collect weather conditions
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
              // Determine the most frequent condition
              const conditionCounts = conditions.reduce((acc, condition) => {
                acc[condition] = (acc[condition] || 0) + 1;
                return acc;
              }, {});

              const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => 
                conditionCounts[a] > conditionCounts[b] ? a : b
              );

              dailyForecasts[date].conditions.push(mostFrequentCondition);
            }
          });
        }

        // Process data from SMHI
        if (data.timeSeries) {
          data.timeSeries.forEach(timeserie => {
            const date = timeserie.validTime.split('T')[0];
            const tempParam = timeserie.parameters.find(param => param.name === 't');
            if (tempParam) {
              if (!dailyForecasts[date]) {
                dailyForecasts[date] = { temperatures: [], conditions: [] };
              }
              dailyForecasts[date].temperatures.push(tempParam.values[0]);
            }
          });
        }
      });

      const medianWeather = Object.keys(dailyForecasts).map(date => {
        const temperatures = dailyForecasts[date].temperatures;
        temperatures.sort((a, b) => a - b);
        const medianTemperature = temperatures.length % 2 === 0
          ? (temperatures[temperatures.length / 2 - 1] + temperatures[temperatures.length / 2]) / 2
          : temperatures[Math.floor(temperatures.length / 2)];

        const conditions = dailyForecasts[date].conditions;
        const conditionCounts = conditions.reduce((acc, condition) => {
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        }, {});

        const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => 
          conditionCounts[a] > conditionCounts[b] ? a : b
        , conditions[0]);

        return { date, temperature: medianTemperature, condition: mostFrequentCondition };
      });
      return medianWeather;
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
