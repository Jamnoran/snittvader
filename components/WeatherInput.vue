<template>
  <v-container class="weather-input-container">
    <v-row justify="center">
      <v-col cols="4">
        <v-text-field
          v-model="city"
          label="Enter city name"
          @keyup.enter="submitCity"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-btn @click="submitCity" color="primary" small>Get Weather</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      city: ''
    }
  },
  methods: {
    submitCity() {
      this.$emit('get-weather', this.city);
    }
  }
}
</script>

<style scoped>
.weather-input-container {
  display: flex;
  justify-content: center;
  height: 100vh;
}
.v-text-field {
  margin-right: 10px;
}
</style>

