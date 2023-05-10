<template>
  <v-card v-if="!isLoading" class="mx-auto" max-width="368">
    <v-card-item>{{device.name}}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-air-conditioner" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Status:</v-list-item-subtitle>
        <v-list>Estado: {{device.state.status === 'on' ? "Encendido" : "Apagado"}}</v-list>
        <v-list>Temperatura: {{ `${device.state.temperature}ºC`}}</v-list>
        <v-list>Modo: {{mode}}</v-list>
        <v-list>VSwing: {{vSwing}}</v-list>
        <v-list>HSwing: {{hSwing}}</v-list>
        <v-list>Fan Speed: {{fanSpeed}}</v-list>
      </v-list-item>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-row class="py-2">
            <v-btn  id="switch" @click="turnOnOff()">{{ isOn ? "Apagar" : "Encender" }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="increase-temp" @click="">{{ '-' }}</v-btn>
            <v-card-text align="center">Temperatura</v-card-text>
            <v-btn  id="decrease-temp" @click="">{{ '+' }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-mode" @click="">{{ 'Cambiar Modo' }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-vswing" @click="">{{ 'Rotación Vertical' }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-hswing" @click="">{{ 'Rotación Horizontal' }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-fan-speed" @click="">{{ 'Velocidad' }}</v-btn>
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
import { ref, onMounted, computed } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"
import { Device } from "@/api/device"
import { ACState } from "@/api/ac"

const props = defineProps(["id"])
const device = ref( null)
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const isOn = computed( () => device.value.state.status === 'on')
const temperature = computed( () =>  device.value.state.temperature)
const mode = computed( () => {
  switch(device.value.state.mode){
    case "cool": return "Frio"
    case "heat": return "Calor"
    case "fan": return "Ventilador"
  }
})
const vSwing = computed( () => {
  switch(device.value.state.verticalSwing){
    case "auto": return "Automático"
    default: return `${device.value.state.verticalSwing}º`
  }
})
const hSwing = computed( () => {
  switch(device.value.state.horizontalSwing){
    case "auto": return "Automático"
    default: return `${device.value.state.horizontalSwing}º`
  }
})
const fanSpeed = computed ( () => {
  switch(device.value.state.fanSpeed){
    case "auto": return "Automático"
    default: return `${device.state.fanSpeed}km/h`
  }
})
const expand = ref(false)

async function turnOnOff(){
  let result
  if(isOn.value){
    await execute("turnOff", [])
  } else {
    await execute("turnOn", [])
  }
}

async function execute(actionName, params){
  try{
    // Acá tenés que armar el objeto en función la action que estás mandando, ya se manda bien

    let result = await deviceStore.execute(props.id, actionName, {params: params})
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
    setInterval(refreshState, 1000)
  } catch(error) {
    console.log(error)
  }
})
async function refreshState(){
  device.value = await deviceStore.get(props.id)
}

const actions = ref( {
  on: {
    name: "ON",
    params: [],
  },
  off: {
    name: "OFF",
    params: []
  },
  setTemperature: {
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
  setMode: {
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
  setVerticalSwing: {
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
  setHorizontalSwing: {
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
  setFanSpeed: {
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
})
</script>

<style scoped>
#acts{
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 7px;
}

</style>
