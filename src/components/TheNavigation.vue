<template>
  <div id="nav">
    <p class="logo">Travel App</p>
    <ul class="nav-links">
      <li class="links">
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li v-for="destination in destinations" :key="destination.id" class="links">
        <RouterLink :to="{
          name: 'destination',
          params: {slug: destination.slug}
        }">{{destination.name}}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>

import {RouterLink} from "vue-router";
import store from '@/stores/destinations';
import {ref} from "vue";

const destinations = ref(store.destinations)
</script>

<style scoped>
#nav {
  display: flex;
}

#nav a{
  color: blueviolet;
}
.nav-links{
  display: flex;
}
.links{
  padding-right: 20px;
  list-style: none;
}
.links:hover{
  text-decoration: underline;
}
.logo{
  font-size: 20px;
  color: darkgreen;
  font-weight: bold;
}
</style>
