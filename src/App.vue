<style scoped>

</style>

<template>
  <div>
      <h2>Socks</h2>
      <p>Stock: tenemos {{stock}}</p>



  </div>
</template>

<script setup>
  import {ref} from 'vue'
  const stock = ref(5);
</script>
