<template>
    <div>
      <input v-model="city" placeholder="Enter city name" @keyup.enter="submitCity" />
      <button @click="submitCity">Get Weather</button>
    </div>
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
  input {
    margin-right: 10px;
  }
  </style>
  