<style scoped>

</style>

<template>

  <!--<p><RouterLink to="/">Home</RouterLink> | <RouterLink to="/about">About</RouterLink></p> -->
    <TheNavigation/>
  <RouterView/>
</template>

<script setup>
  import {RouterView,RouterLink} from "vue-router";
  import TheNavigation from "@/components/TheNavigation.vue"
</script>
