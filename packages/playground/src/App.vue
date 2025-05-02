<script setup>
const count = ref(0)
</script>

<template>
  <main class="container">
    <h1>Welcome to Vite + Vue 3!</h1>
    <p>Edit <code>App.vue</code> to get started.</p>
    <button @click="count++">Count is: {{ count }}</button>
  </main>
</template>

<style scoped>
.container {
  text-align: center;
  margin-top: 50px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
