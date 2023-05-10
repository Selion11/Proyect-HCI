<template>
  <v-card v-if="!isLoading" class="mx-auto" max-width="368">
    <v-card-item>{{device.name}}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-air-conditioner" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Status: {{device.status.temperature}}</v-list-item-subtitle>
      </v-list-item>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-row>
          <v-btn v-for="action in actions" id="acts" @click="stat = action.name">{{ action.name }}</v-btn>
          </v-row>
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
const device = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)

async function execute(action){
  try{
    // Acá tenés que armar el objeto en función la action que estás mandando, ya se manda bien
    const actionParam = action.param

    let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
    if(result){
      device.value = await deviceStore.get(props.id)
    } else {
      console.error(result)
    }
  } catch(error){
    console.log(error)
  }
}

onMounted( async () => {
  try{
    device.value = await deviceStore.get(props.id)
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
})


const actions = ref( [
  {
    name: "ON",
    params: [],
  },
  {
    name: "OFF",
    params: []
  },
  {
    name: "Set Temperature",
    params: [
      {
        name: "temperature",
        type: "number",
        description: "temperature in centigrades",
        minValue: 18,
        maxValue: 38
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
          "cool",
          "heat",
          "fan"
        ]
      }
    ]
  },
  {
    name: "Set Vertical Swing",
    params: [
      {
        "name": "verticalSwing",
        "type": "string",
        "description": "vertical swing",
        "supportedValues": [
          "auto",
          "22",
          "45",
          "67",
          "90"
        ]
      }
    ]
  },
  {
    name: "Set Horizontal Swing",
    params: [
      {
        name: "horizontalSwing",
        type: "string",
        description: "horizontal swing",
        supportedValues: [
          "auto",
          "-90",
          "-45",
          "0",
          "45",
          "90"
        ],
      }
    ]
  },
  {
    name: "Set Fan Speed",
    params: [
      {
        name: "fanSpeed",
        type: "string",
        description: "fan speed",
        supportedValues: [
          "auto",
          "25",
          "50",
          "75",
          "100"
        ]
      }
    ]
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
