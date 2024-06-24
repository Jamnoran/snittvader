<template>
  <v-row >
    <v-col>
     <WeatherCard :city="city" :weather="weather" :isLoading="isLoading" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { WeatherDay } from '~/types/weather';

export default defineComponent({
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

