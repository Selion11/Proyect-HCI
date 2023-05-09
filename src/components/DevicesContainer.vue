<template>
  <v-container v-for="device in idS">
    <h2>{{ device.name }}</h2>
    <v-container v-for="item in getAllByType('c89b94e8581855bc')">
      <SpeakerCard :id="item.id"/>
    </v-container>
    <v-container>
      <v-btn prepend-icon="mdi-plus" dark color="primary" @click="elemCreate(device.id,device.name)">
        Add</v-btn>
    </v-container>
  </v-container>


</template>

<script setup>
  import { ref } from 'vue'
  import { useDeviceStore } from "@/store/deviceStore";
  import SpeakerCard from "./devices/SpeakerCard.vue"

  const devStore = useDeviceStore()

  const nums = ref(0)
  const result = ref(null)

  async function getAllByType(deviceId){
    try{
      return await devStore.getAllByType(deviceId)
    } catch(error){
      console.error(error)
    }
  }

  // EVERY function that uses the store MUST be async, and the method of the
  //store must use the 'await' directive, and use a try-catch block to catch any error
  //the api throws
  async function elemCreate (typeId,typeName){
    try {
      const device = await devStore.add({
        type: {
          id: typeId
        },
        name: 'New ' + typeName + 'sae',
        meta: {}
      })
      nums.value += 1
      return device
    } catch(error){
      console.error(error)
    }
  }
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

