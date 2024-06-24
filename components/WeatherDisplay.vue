<template>
    <div v-if="weather.length">
      <h2>Weather for {{ city }}</h2>
      <div v-for="day in weather" :key="day.date">
        <p>{{ day.date }}: {{ day.temperature }}°C</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { WeatherDay } from '~/types/weather';
  
  export default defineComponent({
    props: {
      city: {
        type: String,
        required: true
      },
      weather: {
        type: Array as PropType<WeatherDay[]>,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  