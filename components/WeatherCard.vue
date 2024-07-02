<template>
    <v-row justify="center" v-if="isLoading" >
      <v-col sm="4">
        <v-skeleton-loader type="card" class="mx-auto"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="weather.length && !isLoading">
      <v-col sm="4" class="custom-padding-xs">
 
        <v-card
          
          
        >
          <v-card-item :title="city.toUpperCase()">
            <template v-slot:subtitle>
              
            </template>
          </v-card-item>
    
          <v-card-text class="py-0">
            <v-row align="center" no-gutters>
              <v-col
                class="text-h5 text-md-h3"
                cols="6"
              >
                {{ weather[0].temperature }}&deg;C
              </v-col>
    
              <v-col class="text-right" cols="6">
                <v-icon
                  color="info"
                  icon="mdi-weather-partly-cloudy"
                  size="48"
                  md-size="88"
                ></v-icon>
              </v-col>
            </v-row>
          </v-card-text>
    
          <div class="d-flex py-3 justify-space-between">
            <v-list-item
              density="compact"
              prepend-icon="mdi-weather-windy"
            >
              <v-list-item-subtitle>123 km/h</v-list-item-subtitle>
            </v-list-item>
    
            <v-list-item
              density="compact"
              prepend-icon="mdi-weather-pouring"
            >
              <v-list-item-subtitle>4%</v-list-item-subtitle>
            </v-list-item>
          </div>
    
          <v-expand-transition>
            <div v-if="expand">
              <div class="py-2">
                <v-slider
                  v-model="time"
                  :max="6"
                  :step="1"
                  :ticks="labels"
                  class="mx-4"
                  color="primary"
                  density="compact"
                  show-ticks="always"
                  thumb-size="10"
                  hide-details
                ></v-slider>
              </div>
    
              <v-list class="bg-transparent text-left">
                <v-list-item
                  v-for="item in weather"
                  :key="item.date"
                  append-icon="mdi-white-balance-sunny"
                  :subtitle="item.temperature + '°'"
                  :title="item.date"
                >
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
    
          <v-divider></v-divider>
    
          <v-card-actions>
            <v-btn
              :text="!expand ? 'Visa Mer' : 'Visa Mindre'"
              @click="expand = !expand"
            ></v-btn>
          </v-card-actions>
        </v-card>
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
  },
  data() {
    return {
      labels: { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WED', 4: 'TH', 5: 'FR', 6: 'SA' },
      expand: false,
      time: 0,
    };
  }
});
</script>

<style scoped>


@media (max-width: 600px) {
  .custom-padding-xs {
    padding: 16px; /* Equivalent to pa-4 */
  }
}
</style>
