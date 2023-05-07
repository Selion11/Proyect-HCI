<template>
  <v-container v-for="device in idS">
    <h1>{{device.name}}</h1>

    <div v-for="item in devStore.getAllByType(device.id)">
      <ACCard v-if="device.id === 'li6cbv5sdlatti0j'" :name="item.name" :stat="item.state"/>
      <GrifoCard v-else-if="device.id === 'dbrlsh7o5sn8ur4i'" :name="item.name" :stat="item.state"/>
      <LampCard v-else-if="device.id === 'go46xmbqeomjrsjr'" :name="item.name" :stat="item.state"/>
      <FridgeCard v-else-if="device.id === 'rnizejqr2di0okho'" :name="item.name" :stat="item.state"/>
      <GrifoCard v-else-if="device.id === 'dbrlsh7o5sn8ur4i'" :name="item.name" :stat="item.state"/>
      <SpeakerCard v-else :name="item.name" :stat="item.state"/>
    </div>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import {useDeviceStore} from "@/store/deviceStore";
  import ACCard from './devices/ACCard.vue'
  import FridgeCard from "./devices/FridgeCard.vue"
  import GrifoCard from "./devices/GrifoCard.vue"
  import LampCard from "./devices/LampCard.vue"
  import SpeakerCard from "./devices/SpeakerCard.vue"
  const devStore = useDeviceStore()
  const idS = ref([
    {
      name: "Speaker",
      id: "c89b94e8581855bc"
    },
    {
      name: "Faucet",
      id: "dbrlsh7o5sn8ur4i"
    },
    {
      name: "Lamp",
      id: "go46xmbqeomjrsjr"
    },
    {
      name: "Ac",
      id: "li6cbv5sdlatti0j"
    },
    {
      name: "Fridge",
      id: "rnizejqr2di0okho"
    }


  ])
  const items = ref([
    {
      title: 'Dispositivos 1',
      text: 'Texto del elemento 1'
    },
    {
      title: 'Dispositivos 2',
      text: 'Texto del elemento 2'
    },
    {
      title: 'Dispositivos 3',
      text: 'Texto del elemento 3'
    },
    {
      title: 'Dispositivos 4',
      text: 'Texto del elemento 4'
    },
    {
      title: 'Dispositivos 5',
      text: 'Texto del elemento 5'
    },
    {
      title: 'Dispositivos 6',
      text: 'Texto del elemento 6'
    },
    {
      title: 'Dispositivos 7',
      text: 'Texto del elemento 7'
    },
    {
      title: 'Dispositivos 8',
      text: 'Texto del elemento 8'
    },
    {
      title: 'Dispositivos 9',
      text: 'Texto del elemento 9'
    }
  ])
</script>

<style scoped>

</style>

