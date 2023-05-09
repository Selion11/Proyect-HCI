<template>
  <v-container v-for="device in idS">
    <h2>{{ device.name }}</h2>
    <div v-if="isLoading">
      <v-container v-if="device.name ==='Speaker'" v-for="item in asyncSpeakers">
        <SpeakerCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name ==='Ac'" v-for="item in asyncAc">
        <ACCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name ==='Faucet'" v-for="item in asyncFaucet">
        <GrifoCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name ==='Lamp'" v-for="item in asyncLamp">
        <LampCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name==='Fridge'" v-for="item in asyncFridge">
        <FridgeCard :id="item.id"/>
      </v-container>

    </div>
    <v-container>
      <v-btn prepend-icon="mdi-plus" dark color="primary" @click="elemCreate(device.id,device.name)">
        Add</v-btn>
    </v-container>
  </v-container>


</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useDeviceStore } from "@/store/deviceStore";
  import {SpeakerCard,ACCard,FridgeCard,GrifoCard,LampCard} from "@/components/devices"
  const devStore = useDeviceStore()
  async function getAllByType(deviceId){
    try{
      return await devStore.getAllByType(deviceId)
    } catch(error){
      console.error(error)
    }
  }
  const asyncSpeakers = ref(null)
  const asyncFaucet = ref(null)
  const asyncLamp = ref (null)
  const asyncAc = ref(null)
  const asyncFridge = ref(null)
  const isLoading = ref(true)
  onMounted( async () => {
    try {
      asyncSpeakers.value = await getAllByType("c89b94e8581855bc")
      asyncFaucet.value = await getAllByType("dbrlsh7o5sn8ur4i")
      asyncLamp.value = await getAllByType("go46xmbqeomjrsjr")
      asyncAc.value = await getAllByType("li6cbv5sdlatti0j")
      asyncFridge.value = await getAllByType("rnizejqr2di0okho")
      isLoading.value = true
    } catch(error){
      throw error
    }
  })

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

