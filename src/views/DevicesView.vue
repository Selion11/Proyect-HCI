<template>
  <div>
    <v-container id="dispositivos" class="fill-height-custom">
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
.fill-height-custom {
  height: 100vh;
}
</style>
