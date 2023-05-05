<template>
  <v-container>
    <h1>Generic Device 1</h1>
    <DevicesContainer/>
  </v-container>
  <v-container>
    <h1>Generic Device 2</h1>
    <DevicesContainer/>
  </v-container>
  <v-container>
    <h1>Generic Device 3</h1>
    <DevicesContainer/>
  </v-container>
</template>

<script>
import DevicesContainer from "@/components/DevicesContainer.vue";
import RoutinesContainer from "@/components/RoutinesContainer.vue";
export default {
  name: "DevicesView",
  components: {RoutinesContainer, DevicesContainer}
}
</script>

<style scoped>

</style>
