<template>
  <v-container v-for="device in devicesTypes" :key="device.id">
    <h2>{{ device.name }}</h2>
    <div v-if="!isLoading">
      <v-container v-if="device.name === 'Speaker'" v-for="item in asyncSpeakers" :key="item.id">
        <SpeakerCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name === 'Ac'" v-for="item in asyncAc">
        <ACCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name === 'Faucet'" v-for="item in asyncFaucet">
        <FaucetCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name === 'Lamp'" v-for="item in asyncLamp">
        <LampCard :id="item.id"/>
      </v-container>
      <v-container v-if="device.name === 'Fridge'" v-for="item in asyncFridge">
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
  import { ref, computed, onMounted } from 'vue'
  import { useDeviceStore } from "@/store/deviceStore";
  import { Device } from "@/api/device"
  import SpeakerCard from "@/components/devices/SpeakerCard.vue"
  import ACCard from "@/components/devices/ACCard.vue"
  import FaucetCard from "@/components/devices/FaucetCard.vue"
  import LampCard from "@/components/devices/LampCard.vue"
  import FridgeCard from "@/components/devices/FridgeCard.vue"

  const devStore = useDeviceStore()
  async function getAllByType(deviceId){
    try{
      return await devStore.getAllByType(deviceId)
    } catch(error){
      console.error(error)
    }
  }

  const devices = ref([])

  const asyncSpeakers = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[0].id))
  const asyncFaucet = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[1].id))
  const asyncLamp = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[2].id))
  const asyncAc = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[3].id))
  const asyncFridge = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[4].id))

  const isLoading = ref(true)

  const devicesTypes = ref([
    {
      name: "Speaker",
      id: "c89b94e8581855bc",
      store: asyncSpeakers
    },
    {
      name: "Faucet",
      id: "dbrlsh7o5sn8ur4i",
      store: asyncFaucet
    },
    {
      name: "Lamp",
      id: "go46xmbqeomjrsjr",
      store: asyncLamp
    },
    {
      name: "Ac",
      id: "li6cbv5sdlatti0j",
      store: asyncAc
    },
    {
      name: "Fridge",
      id:"rnizejqr2di0okho",
      store: asyncFridge
    }])

  onMounted(  async () => {
    try {
      devices.value = await devStore.getAll()
      isLoading.value = false
    } catch(error){
      throw error
    }
  })

  async function elemCreate (typeId,typeName){
    try {
      await devStore.add({
        type: {
          id: typeId
        },
        name: 'New ' + typeName + 'Chinga',
        meta: {}
      })
      devices.value = await devStore.getAll()
    } catch(error){
      console.error(error)
    }
  }
</script>

<style scoped>

</style>

