<template>
  <v-card v-if="!isLoading" class="mx-auto" max-width="368">
    <v-card-item>{{ ac.name }}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-air-conditioner" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Status:</v-list-item-subtitle>
        <v-list>Estado: {{status}}</v-list>
        <v-list>Temperatura: {{ `${temperature}ºC`}}</v-list>
        <v-list>Modo: {{mode}}</v-list>
        <v-list>Oscilación Vertical: {{vSwing}}</v-list>
        <v-list>Oscilación Horizontal: {{hSwing}}</v-list>
        <v-list>Velocidad del Ventilador: {{fanSpeed}}</v-list>
      </v-list-item>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-row class="py-2">
            <v-btn  id="switch" @click="turnOnOff()">{{ isOn ? "Apagar" : "Encender" }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="decrease-temp" @click="decreaseTemperature()">{{ '-' }}</v-btn>
            <v-card-text align="center">Temperatura</v-card-text>
            <v-btn  id="increase-temp" @click="increaseTemperature()">{{ '+' }}</v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-mode">
              {{ 'Cambiar Modo' }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item id="set-mode-heat" v-if="mode !== 'Calor'" @click="setMode('heat')">
                    <v-list-item-title>{{ `Modo Calor` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-mode-cool" v-if="mode !== 'Frio'" @click="setMode('cool')">
                    <v-list-item-title>{{ `Modo Frio` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-mode-fan" v-if="mode !== 'Ventilador'" @click="setMode('fan')">
                    <v-list-item-title>{{ `Modo Ventilador` }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-v-swing">
              {{ 'Rotación Vertical' }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item id="set-v-swing-auto" v-if="mode !== 'Automático'" @click="setVerticalSwing('auto')">
                    <v-list-item-title>{{ `Automático` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-v-swing-22" v-if="mode !== '22º'" @click="setVerticalSwing('22')">
                    <v-list-item-title>{{ `22º` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-v-swing-45" v-if="mode !== '45º'" @click="setVerticalSwing('45')">
                    <v-list-item-title>{{ `45º` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-v-swing-67" v-if="mode !== '67º'" @click="setVerticalSwing('67')">
                    <v-list-item-title>{{ `67º` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-v-swing-90" v-if="mode !== '90º'" @click="setVerticalSwing('90')">
                    <v-list-item-title>{{ `90º` }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-h-swing">
              {{ 'Rotación Horizontal' }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item id="set-h-swing-auto" v-if="mode !== 'Automático'" @click="setHorizontalSwing('auto')">
                    <v-list-item-title>{{ `Automático` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-h-swing-22" v-if="mode !== '22º'" @click="setHorizontalSwing('22')">
                    <v-list-item-title>{{ `22º` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-h-swing-45" v-if="mode !== '45º'" @click="setHorizontalSwing('45')">
                    <v-list-item-title>{{ `45º` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-h-swing-67" v-if="mode !== '67º'" @click="setHorizontalSwing('67')">
                    <v-list-item-title>{{ `67º` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-h-swing-90" v-if="mode !== '90º'" @click="setHorizontalSwing('90')">
                    <v-list-item-title>{{ `90º` }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-row>
          <v-row>
            <v-btn  id="set-fan-speed" @click="">
              {{ 'Velocidad' }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item id="set-fan-speed-auto" v-if="mode !== 'Automático'" @click="setFanSpeed('auto')">
                    <v-list-item-title>{{ `Automático` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-fan-speed-25" v-if="mode !== '25km/h'" @click="setFanSpeed('25')">
                    <v-list-item-title>{{ `25km/h` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-fan-speed-50" v-if="mode !== '50km/h'" @click="setFanSpeed('50')">
                    <v-list-item-title>{{ `50km/h` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-fan-speed-75" v-if="mode !== '75km/h'" @click="setFanSpeed('75')">
                    <v-list-item-title>{{ `75km/h` }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item id="set-fan-speed-100" v-if="mode !== '100km/h'" @click="setFanSpeed('100')">
                    <v-list-item-title>{{ `100km/h` }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
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
const ac = ref( {})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const status = computed( () => ac.value.state.status === 'on' ? "Encendido" : "Apagado")
const isOn = computed( () => ac.value.state.status === 'on')
const temperature = computed( () =>  ac.value.state.temperature)
const mode = computed( () => {
  switch(typeof(ac.value.state.mode) === 'object' ? ac.value.state.mode.mode : ac.value.state.mode){
    case "cool": return "Frio"
    case "heat": return "Calor"
    case "fan": return "Ventilador"
  }
})
const vSwing = computed( () => {
  switch(ac.value.state.verticalSwing){
    case "auto": return "Automático"
    default: return `${ac.value.state.verticalSwing}º`
  }
})
const hSwing = computed( () => {
  switch(ac.value.state.horizontalSwing){
    case "auto": return "Automático"
    default: return `${ac.value.state.horizontalSwing}º`
  }
})
const fanSpeed = computed ( () => {
  switch(ac.value.state.fanSpeed){
    case "auto": return "Automático"
    default: return `${ac.value.state.fanSpeed}km/h`
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

async function setMode(mode){
  try {
    await execute("setMode", [mode])
  } catch(error){
    // Handle error
  }
}
async function decreaseTemperature(){
  if(temperature.value > 18){
    try{
      await execute("setTemperature", [temperature.value - 1])
    } catch(error){
      console.error(error)
    }
  } else{
    // Handle error
  }
}

async function increaseTemperature(){
  if(temperature.value < 38){
    try{
      await execute("setTemperature", [temperature.value + 1])
    } catch(error){
      console.error(error)
    }
  } else{
    // Handle error
  }
}

async function setVerticalSwing(mode){
  try{
    await execute("setVerticalSwing", [mode])
  } catch(error){
    console.error(error)
  }
}

async function setHorizontalSwing(mode){
  try{
    await execute("setHorizontalSwing", [mode])
  } catch(error){
    console.error(error)
  }
}

async function setFanSpeed(speed){
  try{
    await execute("setFanSpeed", [speed])
  } catch(error){
    console.error(error)
  }
}
async function execute(actionName, params){
  try{
    // Acá tenés que armar el objeto en función la action que estás mandando, ya se manda bien

    let result = await deviceStore.execute(props.id, actionName, params)
    if(result){
      ac.value = await deviceStore.get(props.id)
    } else {
      console.error(result)
    }
  } catch(error){
    console.log(error)
  }
}

onMounted( async () => {
  try{
    ac.value = await deviceStore.get(props.id)
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
  ac.value = await deviceStore.get(props.id)
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
