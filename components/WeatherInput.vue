<template>

    <v-row justify="center">
      <v-col sm="4">
        <v-text-field
          v-model="city"
          label="Sök Stad"
          @keyup.enter="submitCity"
          variant="outlined"
          dense
          style="width: calc(100% );"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-n3">
      <v-col sm="4">
        <v-btn @click="submitCity" color="primary" small block>Sök</v-btn>
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

