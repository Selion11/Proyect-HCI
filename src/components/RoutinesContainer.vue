<template>
  <div>
    <v-btn prepend-icon="mdi-plus" @click="showRoutine = true">Agregar Rutina</v-btn>
    <v-dialog v-model="showRoutine" max-width="600">
      <v-card>
        <v-card-title>
          Nueva Rutina
        </v-card-title>
        <v-card-text>
          <label>Nombre de la rutina:</label>
          <input type="text" v-model="routineName">
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveRoutine">Guardar</v-btn>
          <v-btn @click="showRoutine = false">Cancelar</v-btn>
          <v-btn @click="showDevicesCategories = true">Elegir Dispositivos</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDevicesCategories" max-width="600">
      <v-card>
        <v-card-title>
          Seleccione la categoría del dispositivo
        </v-card-title>
        <v-card-text v-for="device in devicesTypes">
          <v-btn @click="saveDeviceCategory(device.id)">{{device.name}}</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showDevicesCategories = false">Atrás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDevices" max-width="600">
      <v-card>
        <v-card-title>
          Seleccione los dispositivos
        </v-card-title>
        <v-card-text v-for="device in selectedDeviceStore">
          <v-btn>{{device.name}}</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveDevices()">OK</v-btn>
          <v-btn @click="showDevices = false">Atrás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import {UseRoutineStore} from "@/store/routineStore.js"
import {useDeviceStore} from "@/store/deviceStore.js"
import {Routine, RoutineActions, RoutineMeta} from "@/api/routine";
import {computed, onMounted, ref} from "vue";

const routineStore = UseRoutineStore()
const deviceStore = useDeviceStore()

const routine = ref(null)

const showRoutine = ref(false)
const showDevices = ref(false)
const showDevicesCategories = ref(false)

const deviceSelected = ref(0)
const routineName = ref('')
const devices = ref([])
let selectedDeviceStore = ref([])

const asyncSpeakers = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[0].id))
const asyncFaucet = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[1].id))
const asyncLamp = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[2].id))
const asyncAc = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[3].id))
const asyncFridge = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[4].id))

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


function saveRoutine() {

}
function saveDeviceCategory(id){
  showDevices.value = true
  deviceSelected.value = id
  selectedDeviceStore = devicesTypes.value.find(device => device.id === deviceSelected.value)?.store
}
function saveDevices(){
  showDevices.value = false
}

async function createRoutine(){
  const routineMeta = new RoutineMeta()
  const routineActions = [new RoutineActions("bde2749c3ee923a7","turnOn",[],routineMeta)]
  const _routine = new Routine("WakeUp",routineActions,routineMeta)
  try {
    routine.value = await routineStore.add(_routine)
  }catch (e) {

  }
}

onMounted(async ()=>{
  try {
    devices.value = await deviceStore.getAll()
  }catch (error){
    throw error
  }
})

</script>

<style scoped>

</style>
