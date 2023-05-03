<script setup>
import { ref } from 'vue'
import store from "@/store/destinations"

const destinations = ref(store.destinations)

function getImageUrl(name) {
    return new URL(`../assets/${name}`, import.meta.url).href
}
</script>

<template>
    <div class="home">
        <h1>All Destinations</h1>
        <div class="destinations">
            <div v-for="destination in destinations" :key="destination.name">
                <router-link
                        :to="{
            name: 'destinationdetails',
            params: { slug: destination.slug },
          }"
                >
                    <h2>{{ destination.name }}</h2>
                </router-link>
                <figure>
                    <router-link
                            :to="{
              name: 'destinationdetails',
              params: { slug: destination.slug },
            }"
                    >
                        <img
                                :src="getImageUrl(destination.image)"
                                :alt="destination.name"
                        />
                    </router-link>
                </figure>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home {
    max-width: 1400px;
    margin: 0 auto;
}

img {
    max-width: 200px;
}
.destinations {
    display: flex;
    justify-content: space-between;
}

a {
    color: lightseagreen;
    text-decoration: none;
}

a.hover,
a.visited {
    text-decoration: underline;
}
</style>
