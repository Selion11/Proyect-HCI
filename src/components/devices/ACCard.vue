<style scoped>
.actions{
  margin-right: 8px;
  margin-left: 7px;
  margin-bottom: 7px;
}
.centered{
  text-align: center;
}
.switch{
  margin-left: 7px;
}

</style>
<template>
  <v-container v-if="!isLoading">
  <v-card  class="mx-auto" max-width="368">
    <v-card-title>
      <v-row justify="center">
        {{ ac.name }}
      </v-row>
      <v-row justify="end">
        <v-btn icon="mdi-delete" variant="text" color="error"/>
      </v-row>
    </v-card-title>
    <v-card-text class="centered">
      <v-icon v-if="!isOn" icon="mdi-air-conditioner" size="75" color="error"/>
      <v-icon v-else icon="mdi-air-conditioner" size="75" color="info" />
    </v-card-text>



    <div class="subtitle">
      <v-row justify="center">
        <v-list-item-subtitle>Status: {{  isOn ? temperature + "ºC" : "Apagado" }}</v-list-item-subtitle>
      </v-row>
          <v-row justify="center">
            <v-col cols="6" v-if="isOn">
            <v-btn width="flex" block @click="decreaseTemperature()" append-icon="mdi-minus"/>
            </v-col>
            <v-col cols="6" v-else>
              <v-btn width="flex" block disabled append-icon="mdi-minus"/>
            </v-col>
            <v-col cols="6" v-if="isOn">
            <v-btn width="flex" block  @click="increaseTemperature()" append-icon="mdi-plus"/>
            </v-col>
            <v-col cols="6" v-else>
              <v-btn width="flex" block disabled append-icon="mdi-plus"/>
            </v-col>
          </v-row>
          <v-row class="switch" justify="start">
            <v-col cols="3">
            <v-switch v-model="isOn" width="flex"  @click="turnOnOff"/>
            </v-col>
          </v-row>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-container>
          <v-row>
            <v-btn class="actions" >
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
            <v-btn class="actions"  id="set-v-swing">
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
            <v-btn class="actions" >
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
            <v-btn  class="actions" @click="">
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
          </v-container>
        </div>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-col cols="6">
        <v-row>
          <v-btn block prepend-icon="mdi-pencil" class="action">
            Edit Device
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-btn  @click="expand = !expand" block class="action">
          {{ !expand ? 'All Actions' : 'Hide Actions' }}
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

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
  if(isOn.value){
    await execute("turnOff")
  } else {
    await execute("turnOn")
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
async function execute(actionName, params= []){
  let result = await deviceStore.execute(props.id, actionName, params)
  if(result){
    ac.value = await deviceStore.get(props.id)
  } else {
    console.error(result)
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

