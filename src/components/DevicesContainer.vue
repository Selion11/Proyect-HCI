<template>

  <v-container v-for="device in devicesTypes" :key="device.id">
    <h2>{{ device.name }}</h2>
    <div v-if="!isLoading">
      <v-container v-if="device.name === 'Speaker'">
        <v-row >
          <v-col cols="3" v-for="item in asyncSpeakers" :key="item.id">
            <SpeakerCard :id="item.id"/>
          </v-col>
        </v-row>
        <v-container>
          <v-btn prepend-icon="mdi-plus" dark color="primary" >
            Add
            <v-dialog v-model="dialogSpeaker" activator="parent" width="800" height="800">
              <v-card>
                <v-card-text>
                  <v-text-field
                    type="text"
                    placeholder="Text"
                    v-model="text"
                    label="Device Name"/>
                  {{text}}
                  {{device.id}}
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="dialogSpeaker = false" prepend-icon="mdi-close">Close</v-btn>
                  <v-btn @click="elemCreate(device.id,text) && (dialogSpeaker = false)" prepend-icon="mdi-content-save-outline">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-container>
      </v-container>
      <v-container v-if="device.name === 'Ac'">
        <v-row >
          <v-col cols="3"  v-for="item in asyncAc" :key="item.id">
            <ACCard :id="item.id"/>
          </v-col>
        </v-row>
        <v-container>
          <v-btn prepend-icon="mdi-plus" dark color="primary" >
            Add
            <v-dialog v-model="dialogAc" activator="parent" width="800" height="800">
              <v-card>
                <v-card-text>
                  <v-text-field
                    type="text"
                    placeholder="Text"
                    v-model="text"
                    label="Device Name"/>
                  {{text}}
                  {{device.id}}
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="dialogAc = false" prepend-icon="mdi-close">Close</v-btn>
                  <v-btn @click="elemCreate(device.id,text)" prepend-icon="mdi-content-save-outline">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-container>
      </v-container>
      <v-container v-if="device.name === 'Faucet'">
        <v-row >
          <v-col cols="3"  v-for="item in asyncFaucet" :key="item.id">
            <FaucetCard :id="item.id"/>
          </v-col>
        </v-row>
        <v-container>
          <v-btn prepend-icon="mdi-plus" dark color="primary" >
            Add
            <v-dialog v-model="dialogFaucet" activator="parent" width="800" height="800">
              <v-card>
                <v-card-text>
                  <v-text-field
                    type="text"
                    placeholder="Text"
                    v-model="text"
                    label="Device Name"/>
                  {{text}}
                  {{device.id}}
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="dialogFaucet = false" prepend-icon="mdi-close">Close</v-btn>
                  <v-btn @click="elemCreate(device.id,text)" prepend-icon="mdi-content-save-outline">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-container>
      </v-container>
      <v-container v-if="device.name === 'Lamp'" >
        <v-row >
          <v-col cols="3"  v-for="item in asyncLamp" :key="item.id">
            <LampCard :id="item.id"/>
          </v-col>
        </v-row>
        <v-container>
          <v-btn prepend-icon="mdi-plus" dark color="primary" >
            Add
            <v-dialog v-model="dialogLamp" activator="parent" width="800" height="800">
              <v-card>
                <v-card-text>
                  <v-text-field
                    type="text"
                    placeholder="Text"
                    v-model="text"
                    label="Device Name"/>
                  {{text}}
                  {{device.id}}
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="dialogLamp = false" prepend-icon="mdi-close">Close</v-btn>
                  <v-btn @click="elemCreate(device.id,text)" prepend-icon="mdi-content-save-outline">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-container>
      </v-container>
      <v-container v-if="device.name === 'Fridge'" >
        <v-row >
          <v-col cols="3"  v-for="item in asyncFridge" :key="item.id">
            <FridgeCard :id="item.id"/>
          </v-col>
        </v-row>
        <v-container>
          <v-btn prepend-icon="mdi-plus" dark color="primary" >
            Add
            <v-dialog v-model="dialogFridge" activator="parent" width="800" height="800">
              <v-card>
                <v-card-text>
                  <v-text-field
                    type="text"
                    placeholder="Text"
                    v-model="text"
                    label="Device Name"/>
                  {{text}}
                  {{device.id}}
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="dialogFridge = false" prepend-icon="mdi-close">Close</v-btn>
                  <v-btn @click="elemCreate(device.id,text)" prepend-icon="mdi-content-save-outline">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-container>
      </v-container>
    </div>
    </v-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useDeviceStore } from "@/store/deviceStore"
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
  const dialogSpeaker = ref(false)
  const dialogFaucet = ref(false)
  const dialogAc = ref(false)
  const dialogLamp = ref(false)
  const dialogFridge = ref(false)

  const text = ref()

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
        name: typeName,
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

