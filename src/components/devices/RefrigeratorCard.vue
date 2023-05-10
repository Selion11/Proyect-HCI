<template>

  <v-card v-if="!isLoading" class="mx-auto" max-width="368">
    <v-card-item>{{ refrigerator.name }}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-fridge" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Current temp: {{ refrigerator.state.temperature }}</v-list-item-subtitle>

      </v-list-item>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-btn v-for="action in actions" id="actions" @click="execute(action)">{{ action.name }}</v-btn>
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
import { Device } from "@/api/device"

const props = defineProps(["id"])
const refrigerator = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)

async function execute(action){
  try{
    // Acá tenés que armar el objeto en función la action que estás mandando, ya se manda bien
    const actionParam = action.param

    let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
    if(result){
      refrigerator.value = await deviceStore.get(props.id)
    } else {
      console.error(result)
    }
  } catch(error){
    console.log(error)
  }
}

onMounted( async () => {
  try{
    refrigerator.value = await deviceStore.get(props.id)
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
  refrigerator.value = await deviceStore.get(props.id)
}
const actions = ref([
  {
    name: "Set Freezer Temperature",
    params: [
      {
        name: "temperature",
        type: "number",
        description: "temperature in centigrades",
        minValue: -20,
        maxValue: -8,
      }
    ]
  },
  {
    name: "Set Temperature",
    "params": [
      {
        name: "temperature",
        type: "number",
        description: "temperature in centigrades",
        minValue: 2,
        maxValue: 8
      }
    ]
  },
  {
    name: "Set Mode",
    params: [
      {
        name: "mode",
        type: "string",
        description: "mode",
        supportedValues: [
          "default",
          "vacation",
          "party"
        ]
      }
    ]
  }
])

</script>



<style scoped>
#actions{
  margin-right: 7px;
  margin-left: 7px;
}

</style>
