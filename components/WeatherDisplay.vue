<template>
  <v-container v-if="weather.length">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Weather for {{ city }}
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="day in weather" :key="day.date">
                <v-list-item-title>{{ day.date }}: {{ day.temperature }}°C</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

