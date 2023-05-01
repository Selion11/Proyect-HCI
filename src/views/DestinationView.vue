<template>
  <div>
    <section class="destination">
      <h1>{{destination.name}}</h1>
      <div class ="destination-details">
        <img :src="getImgURL(destination.image)"
             :alt="destination.name"/>
        <p>{{destination.description}}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import store from '@/stores/destinations'
import {computed, defineProps} from 'vue'

const props = defineProps(['slug'])

const destination = computed(() => {
  return store.destinations.find(
    (d) => d.slug === props.slug
  )
})
function getImgURL(image){
  return new URL(`../assets/${image}`, import.meta.url).href
}
</script>

<style scoped>
img{
  max-width: 600px;
  height: auto;
  width: 100px;
  max-height: 400px;
}
.destination-details{
  display: flex;
  justify-content: space-between;
}
p{
  margin: 0 40px;
  font-size: 20px;
  text-align: left;
}
</style>
