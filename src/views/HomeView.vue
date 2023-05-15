<template>
  <div>
    <v-container class="fill-height-custom">
    <RecentContainer/>
    </v-container>
  </div>

</template>


<script setup>
import RecentContainer from "@/components/RecentContainer.vue";
</script>

<style scoped>
  h1 {
    padding-left: 10px;
  }
  .fill-height-custom {
    height: 100vh;
  }

</style>
