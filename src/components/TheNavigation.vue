<template>
  <div id="nav">
    <p class="logo">Travel App</p>
    <ul class="nav-links">
      <li class="links">
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li v-for="destination in destinations"
          :key="destination.name"
          class="links"
      >
        <RouterLink
          :to="{
                              name: 'destinationdetails',
                              params: { slug: destination.slug },
                            }"
        >
          {{ destination.name }}
        </RouterLink>
      </li>
      <li class="links">
        <RouterLink to="/user">Dashboard</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store/destinations'

const destinations = ref(store.destinations)
</script>

<style scoped>
#nav {
  display: flex;
}

#nav a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
}

#nav a.router-link-exact-active {
  color: #ab26ab;
}

.nav-links {
  display: flex;
}

.links {
  padding-right: 20px;
  list-style: none;
}

.links:hover {
  text-decoration: underline;
}

.logo {
  font-size: 20px;
  color: purple;
  font-weight: bold;
}
</style>
