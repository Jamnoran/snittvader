<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <footer>
      <p>&copy; 2024 Weather Application</p>
    </footer>
  </div>
</template>

<script>
export default {
  // You can add global data, methods, or lifecycle hooks here if needed
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

header {
  background: #35495e;
  padding: 20px;
  color: white;
}

footer {
  background: #35495e;
  padding: 10px;
  color: white;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
