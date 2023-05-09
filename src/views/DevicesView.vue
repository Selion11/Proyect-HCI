<template>
  <div>
    <v-container id="dispositivos">
      <h1>Dispositivos</h1>
      <DevicesContainer/>
    </v-container>
    <v-divider/>

  </div>
</template>

<script setup>
import DevicesContainer from "@/components/DevicesContainer.vue"
</script>


<style scoped>
h1 {
  text-align: center;
}
</style>
