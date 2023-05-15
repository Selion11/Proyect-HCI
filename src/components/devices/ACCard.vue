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

.close{
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 0;
}


</style>
<template>
  <v-container v-if="!isLoading">
  <v-card  class="mx-auto" max-width="368">
    <v-menu>
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              class="close"
              justify="end"
              v-bind="mergeProps(menu, tooltip)"
              @click="DELdialog = true"
            />
            <v-dialog v-model="DELdialog" width="auto" height="auto">
              <v-card>
                <v-card-title/>
                <v-card-title>
                  ¿Seguro que desea borrar el aire acondicionado {{ac.name}}?
                </v-card-title>
                <v-card-actions>
                  <v-row justify="center">
                    <v-btn variant="text" @click="DELdialog = false">No</v-btn>
                    <v-btn color="red" variant="text" @click="removeDevice()">Sí</v-btn>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <span>Borrar Aire Acondicionado</span>
        </v-tooltip>
      </template>
    </v-menu>
    <v-card-title/>
    <v-card-title>
      <v-row justify="center">
        {{ ac.name }}
      </v-row>
    </v-card-title>
    <v-card-title/>
    <v-card-text class="centered">
      <v-icon v-if="!isOn" icon="mdi-air-conditioner" size="75" color="error"/>
      <v-icon v-else icon="mdi-air-conditioner" size="75" color="info" />
    </v-card-text>

    <div class="subtitle">
      <v-row justify="center">
        <v-list-item-subtitle>Estado: {{ status }}</v-list-item-subtitle>
      </v-row>
      <v-row v-if="isOn" justify="center">
        <v-list-item-subtitle v-if="isOn">Modo: {{ mode }}</v-list-item-subtitle>
      </v-row>
      <v-card-title/>
      <v-card-title/>
      <v-row justify="center">
          <v-icon class="actions" v-if="canDecreaseTemp && isOn" width="flex" block @click="decreaseTemperature()" icon="mdi-minus"/>
          <v-icon class="actions" v-else disabled block icon="mdi-minus"/>
                 {{currentTemperature}}ºC
          <v-icon class="actions" v-if="isOn && canIncreaseTemp" @click="increaseTemperature()" icon="mdi-plus"/>
          <v-icon class="actions" v-else disabled icon="mdi-plus"/>
      </v-row>
      <v-row class="switch" justify="start">
        <v-col cols="3">
          <v-switch v-model="isOn" width="flex"  @click="turnOnOff()"/>
        </v-col>
      </v-row>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-container>
          <v-row justify="center">
            <v-btn class="actions" >
              Cambiar Modo
              <v-menu activator="parent">
                <v-list>
                  <v-list-item id="set-mode-heat" title="Modo Calor" v-if="mode !== 'Calor'" @click="setMode('heat')"/>
                  <v-list-item id="set-mode-cool" title="Modo Frio" v-if="mode !== 'Frio'" @click="setMode('cool')"/>
                  <v-list-item id="set-mode-fan" title="Modo Ventilador" v-if="mode !== 'Ventilador'" @click="setMode('fan')"/>
                </v-list>
              </v-menu>
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn class="actions">
              Rotación Vertical: {{ vSwing }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item title="Automático"  v-if="mode !== 'Automático'" @click="setVerticalSwing('auto')"/>
                  <v-list-item id="set-v-swing-22" title="22º" v-if="mode !== '22º'" @click="setVerticalSwing('22')"/>
                  <v-list-item id="set-v-swing-45" title="45º" v-if="mode !== '45º'" @click="setVerticalSwing('45')"/>
                  <v-list-item id="set-v-swing-67" title="67º" v-if="mode !== '67º'" @click="setVerticalSwing('67')"/>
                  <v-list-item id="set-v-swing-90" title="90º" v-if="mode !== '90º'" @click="setVerticalSwing('90')"/>
                </v-list>
              </v-menu>
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn class="actions" >
              Rotación Horizontal: {{ hSwing }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item id="set-h-swing-auto" title="Automático" v-if="mode !== 'Automático'" @click="setHorizontalSwing('auto')"/>
                  <v-list-item id="set-h-swing-22" title="-90º" v-if="mode !== '-90º'" @click="setHorizontalSwing('-90')"/>
                  <v-list-item id="set-h-swing-45" title="-45º" v-if="mode !== '-45º'" @click="setHorizontalSwing('-45')"/>
                  <v-list-item id="set-h-swing-67" title="0º" v-if="mode !== '0º'" @click="setHorizontalSwing('0')"/>
                  <v-list-item id="set-h-swing-90" title="45º" v-if="mode !== '45º'" @click="setHorizontalSwing('45')"/>
                  <v-list-item id="set-h-swing-22" title="90º" v-if="mode !== '90º'" @click="setHorizontalSwing('90')"/>
                </v-list>
              </v-menu>
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn  class="actions">
              Velocidad: {{ fanSpeed }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item title="Automático" v-if="mode !== 'Automático'" @click="setFanSpeed('auto')"/>
                  <v-list-item title="25km/h" v-if="mode !== '25km/h'" @click="setFanSpeed('25')"/>
                  <v-list-item title="50km/h" v-if="mode !== '50km/h'" @click="setFanSpeed('50')"/>
                  <v-list-item title="75km/h" v-if="mode !== '75km/h'" @click="setFanSpeed('75')"/>
                  <v-list-item title="100km/h" v-if="mode !== '100km/h'" @click="setFanSpeed('100')"/>
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
          <v-btn block prepend-icon="mdi-pencil" class="actions">
            Editar Aire <br> Acondicionado
            <v-dialog v-model="editDia" activator="parent">
              <v-card>
                <v-card-title class="centered">Cambie el nombre de su aire acondicionado</v-card-title>
                <v-card-text>
                  <v-text-field v-model="newName" type="text" placeholder="Nuevo nombre" variant="outlined"/>
                </v-card-text>
                <v-card-actions>
                  <v-col cols="6">
                    <v-btn block v-if="newName !== ''" prepend-icon="mdi-content-save-outline" @click="editDevice()">Cambiar nombre</v-btn>
                    <v-btn block v-else disabled prepend-icon="mdi-content-save-outline">Cambiar nombre</v-btn>
                  </v-col>
                  <v-col cols="6">
                  <v-btn block prepend-icon="mdi-close" @click="editDia = false">Cerrar</v-btn>
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-btn v-if="isOn && !expand" @click="expand = !expand" block class="actions">
            Más <br> Acciones
          </v-btn>
          <v-btn v-else-if="isOn && expand" @click="expand = !expand" block class="actions">
            Ocultar <br> Acciones
          </v-btn>
          <v-btn v-else disabled  block class="actions">
            Más <br> Acciones
          </v-btn>
        </v-row>
      </v-col>
    </v-card-actions>
  </v-card>
  </v-container>
</template>

<script setup>
import {ref, onMounted, computed, defineEmits, mergeProps} from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(["id"])
const emits = defineEmits(["to-snackbar"])
const ac = computed( () => deviceStore.devices.filter( (device) => device.id === props.id)[0])
const deviceStore = useDeviceStore()


const isOn = ref(false)
const newName = ref('')
const isLoading = ref(true)
const expand = ref(false)
const DELdialog = ref(false)
const editDia = ref(false)
const refreshInterval = ref(0)
const canIncreaseTemp = computed( () => currentTemperature.value < 38)
const canDecreaseTemp = computed( () => currentTemperature.value > 18)
const status = computed( () => isOn.value ? "Encendido" : "Apagado")
const currentTemperature = ref(0)
const mode = computed( () => {
  switch(ac.value["state"].mode){
    case "cool": return "Frio"
    case "heat": return "Calor"
    case "fan": return "Ventilador"
  }
})
const vSwing = computed( () => {
  switch(ac.value["state"].verticalSwing){
    case "auto": return "Automático"
    default: return `${ac.value["state"].verticalSwing}º`
  }
})
const hSwing = computed( () => {
  switch(ac.value["state"].horizontalSwing){
    case "auto": return "Automático"
    default: return `${ac.value["state"].horizontalSwing}º`
  }
})
const fanSpeed = computed ( () => {
  switch(ac.value["state"].fanSpeed){
    case "auto": return "Automático"
    default: return `${ac.value["state"].fanSpeed}%`
  }
})

async function turnOnOff(){
  if(isOn.value){
    await refreshState()
    await execute("turnOff")
    isOn.value = false
    expand.value = false
  } else {
    await execute("turnOn")
    isOn.value = true
  }
}

async function setMode(mode){
  try {
    await execute("setMode", [mode])
  } catch(error){
    console.error(error)
  }
}
async function decreaseTemperature(){
  if(currentTemperature.value > 18){
    currentTemperature.value = currentTemperature.value - 1
  }
}

async function increaseTemperature(){
  if(currentTemperature.value < 38) {
    currentTemperature.value = currentTemperature.value + 1
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
  if(!result){
    console.error(result)
  }
}

async function removeDevice(){
  try{
    isLoading.value = true
    const returnMessage =  `El dispositivo ${lamp.value["name"]} ha sido eliminado correctamente`
    const result = await deviceStore.remove(props.id)
    if(!result){
      isLoading.value = false
    } else{
      clearInterval(refreshInterval.value)
      emits('to-snackbar', returnMessage)
    }
  } catch(error){
    emits("to-snackbar", "Ocurrió un error intentado eliminar el dispositivo")
  }
}

async function editDevice(){
  const editedDevice = {
    name: newName.value,
    meta: ac.value["meta"]
  }
  try{
    const result = await deviceStore.modify(ac.value["id"], editedDevice)
    if(result) {
      newName.value = ''
      editDia.value = false
      emits("to-snackbar", "Nombre modificado.")
    } else{
      emits("to-snackbar", "El nombre ingresado ya existe.")
    }
  } catch(error){
    if(error.code === 1){
      emits("to-snackbar", "No debe ingresar caracteres especiales!")
    }
    else{
      emits("to-snackbar", `Dispositivo ${newName.value} ya existe!`)
    }
  }
}

onMounted( async () => {
  try{
    isOn.value = ac.value["state"].status === 'on'
    currentTemperature.value = ac.value["state"].temperature
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
  try{
    refreshInterval.value = setInterval(refreshState, 5000)
  } catch(error){
    console.log(error)
  }
})
async function refreshState(){
  if(isOn.value && currentTemperature.value !== ac.value["state"].temperature){
    await execute("setTemperature", [currentTemperature.value])
  }
}
</script>

