<template>
  <v-container fluid>
    <v-row v-for="(weatherDay, index) in weather" :key="index" class="mb-4">
      <v-col>
        <WeatherCard :city="city" :weatherDay="weatherDay" :isLoading="isLoading" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { WeatherDay } from '~/types/weather';
import WeatherCard from '~/components/WeatherCard.vue';

export default defineComponent({
  components: {
    WeatherCard
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
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