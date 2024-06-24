<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-text-field
        v-model="city"
        label="Stad"
        @keyup.enter="submitCity"
        variant="outlined"
        dense
      ></v-text-field>
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col cols="4">
      <v-btn @click="submitCity" color="primary" small>Sök</v-btn>
    </v-col>
  </v-row>
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

