<template>
  <div>
    <v-container class="fill-height-custom">
      <h1>Rutinas</h1>
      <RoutinesContainer/>
    </v-container>
  </div>
</template>

<script setup>
import RoutinesContainer from "@/components/RoutinesContainer.vue";
</script>

<style scoped>
h1 {
  text-align: center;
}
.fill-height-custom {
  height: 90vh;
}
</style>
