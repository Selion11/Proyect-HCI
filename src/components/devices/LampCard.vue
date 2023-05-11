<template>

  <v-card class="mx-auto" max-width="368" v-if="!isLoading">
    <v-card-item>{{ lamp.name }}</v-card-item>
    <v-card-text>
      <v-icon v-if="lamp.state.status === 'OFF'" icon="mdi-lightbulb-outline" size="55" color="error" class="me-1 pb-1"></v-icon>
      <v-icon v-else-if="lamp.state.status === 'ON'" icon="mdi-lightbulb" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Status: {{ lamp.state.status }}</v-list-item-subtitle>
      </v-list-item>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-col>
            <v-btn v-for="action in actions" id="acts" @click="execute(action)">{{ action.name }}</v-btn></v-col>
        </div>

      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expand = !expand">
        {{ !expand ? 'All Actions' : 'Hide Actions' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(["id"])
const lamp = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)

async function execute(action){
  let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
  if(result){
    lamp.value = await deviceStore.get(props.id)
  } else {
    console.error(result)
  }
}

onMounted( async () => {
  try{
    lamp.value = await deviceStore.get(props.id)
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
  try{
    setInterval(refreshState, 1000)
  } catch(error){
    console.log(error)
  }
})

async function refreshState(){
  lamp.value = await deviceStore.get(props.id)
}

const actions = ref( [
  {
    name: "ON",
    realName: "turnOn",
    params: []
  },
  {
    name: "OFF",
    realName: "turnOff",
    params: []
  },
  {
    name: "Set Color",
    params: [
      {
        name: "color",
        type: "string",
        description: "new RGB color",
        minValue: "000000",
        maxValue: "FFFFFF",
      }
    ],
  },
  {
    name: "Set Brightness",
    params: [
      {
        name: "brightness",
        type: "integer",
        description: "new brightness",
        minValue: 0,
        maxValue: 100,

      }
    ],
  }
])
</script>



<style scoped>
#acts{
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 7px;
}


</style>
