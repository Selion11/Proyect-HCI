<template>
  <div>
    <v-container>
      <h1>Rutinas</h1>
      <RoutinesContainer/>
    </v-container>
  </div>
</template>

<script>
import RoutinesContainer from "@/components/RoutinesContainer.vue";
export default {
  name: "RoutinesView",
  components: {RoutinesContainer}
}
</script>
