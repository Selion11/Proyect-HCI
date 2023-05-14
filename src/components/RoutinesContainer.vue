<template>
  <v-card-subtitle v-if="routines.length <= 0">Actualmente no hay ninguna rutina agregada. Para hacerlo, utilice el botón de "Agregar Rutina"</v-card-subtitle>
  <v-btn class="addRoutine" prepend-icon="mdi-plus" @click="showRoutine = true" >Agregar<br>Rutina</v-btn>
  <v-dialog v-model="showRoutine" max-width="600" >
    <v-card>
      <v-card-text>
        <v-card-title>Nueva Rutina</v-card-title>
        <v-text-field
          v-model="routineName"
          label="Nombre de la rutina"
        ></v-text-field>
        <v-select
          v-model="storeSelected"
          label="Seleccione la categoría del dispositivo"
          :items="devicesTypes"
          :item-title="item => item.name"
          :item-value="item => item.store"
        ></v-select>
        <v-select v-if="storeSelected.length > 0"
                  v-model="devicesSelected"
                  label="Seleccione los dispositivos"
                  :items="storeSelected"
                  :item-title="item => item.name"
                  :item-value="item => item"
                  multiple
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!isValidName()" color="primary" @click="createRoutine(routineName,devicesSelected,actionsSelected) && (showRoutine=false)">Crear</v-btn>
        <v-btn @click="showRoutine = false">Cancelar</v-btn>
        <v-btn :disabled="devicesSelected.length <= 0" @click="configureDevices()">Configurar dispositivos</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="setupDevices" width="700" height="auto">
    <v-card >
      <v-card-title>Seleccione las acciones a realizar</v-card-title>
      <v-container >
        <v-row >
          <v-col cols="4">
            <v-container v-for="device in devicesSelected" >
              <v-card-text >Dispositivo:{{device.name}}</v-card-text>
            </v-container>
          </v-col>
          <v-col cols="4" >
            <v-container  >
              <v-select v-for="(device,index) in devicesSelected" :key="index"
                        v-model="actionsSelected[`${index}`]"
                        label="Acción"
                        :items="getActions(device.type.id)"
              ></v-select>
            </v-container>
          </v-col>
          <v-col cols="4" >
            <v-container  >
              <v-btn  color="red">Eliminar dispositivo </v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-btn @click="setupDevices = false">Atrás</v-btn>
        <v-btn color="primary" @click="setupDevices = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container>
    <v-row>
      <v-col v-for="routine in routines" cols="4" >
        <v-card class="routineCard" >
          <v-card-text>
            <v-card-title >{{routine.name}}</v-card-title>
            <v-list>
              <v-list-subheader>Dispositivos</v-list-subheader>
              <v-list-item class="routineDevices" v-for="action in routine.actions">
                <template v-slot:prepend>
                  <v-icon  :icon="getIcon(action.device.type.id)"></v-icon>
                </template>
                <v-list-item-title>{{action.device.name}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="container">
            <v-btn width="200" height="50" rounded="rounded" class="startRoutine" @click="executeRoutine(routine.id)">Iniciar Rutina </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import {UseRoutineStore} from "@/store/routineStore.js"
import {useDeviceStore} from "@/store/deviceStore.js"
import {Routine, RoutineActions, RoutineMeta} from "@/api/routine";
import {computed, onMounted, ref} from "vue";


const routineStore = UseRoutineStore()
const routines = ref([])
const deviceStore = useDeviceStore()
const devices = ref([])

const showRoutine = ref(false)
const setupDevices = ref(false)

const routineName = ref('')
let storeSelected = ref([])
const devicesSelected = ref([])
const actionsSelected = ref([])
const actions = ref([])

const speakerActions = ["setVolume","play","stop","pause","resume","nextSong","previousSong","setGenre","getPlaylist"]
const faucetActions = ["open","close","dispense"]
const lampActions = ["turnOn","turnOff","setColor","setBrightness"]
const acActions = ["turnOn","turnOff","setTemperature","setMode","setVerticalSwing","setHorizontalSwing","setFanSpeed"]
const fridgeActions = ["setFreezerTemperature","setTemperature","setMode"]

const setGenre= ["clasica","country","dance","latina","pop","rock"]
const dispense= ["mililitros","centilitros","decilitros","litros"]
const acsetMode = ["ventilación","frio","calor"]
const setVerticalSwing = ["automatico","22","45","67","90"]
const setHorizontalSwing = ["automatico","-90","-45","0","45","90"]
const setFanSpeed = ["automatico","25","50","75","100"]
const fridgesetMode = ["normal","fiesta","vacaciones"]


const param = ref('')

const asyncSpeakers = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[0].id))
const asyncFaucet = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[1].id))
const asyncLamp = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[2].id))
const asyncAc = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[3].id))
const asyncFridge = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[4].id))

const isLoading = ref(true)
const devicesTypes = ref([
  {
    name: "Parlante",
    id: "c89b94e8581855bc",
    store: asyncSpeakers,
    actions: speakerActions,
    icon:"mdi-speaker"
  },
  {
    name: "Grifo",
    id: "dbrlsh7o5sn8ur4i",
    store: asyncFaucet,
    actions: faucetActions,
    icon:"mdi-faucet"
  },
  {
    name: "Lámpara",
    id: "go46xmbqeomjrsjr",
    store: asyncLamp,
    actions: lampActions,
    icon:"mdi-lamp"
  },
  {
    name: "Accondiconador de Aire",
    id: "li6cbv5sdlatti0j",
    store: asyncAc,
    actions: acActions,
    icon:"mdi-air-conditioner"
  },
  {
    name: "Heladera",
    id:"rnizejqr2di0okho",
    store: asyncFridge,
    actions: fridgeActions,
    icon:"mdi-fridge"
  }])

function configureDevices(){
  setupDevices.value = true

}
function getIcon(id){
  return devicesTypes.value.find((type) => type.id === id).icon
}
function isValidName(){
  return routineName.value.length >0
}

function getActions(typeId){
  return devicesTypes.value.find((type) => type.id === typeId ).actions
}

async function executeRoutine(id){
  try {
    await routineStore.execute(id)
    devices.value = await deviceStore.getAll()
  }catch (error) {
    console.log(error)
  }
}

async function createRoutine(routineName,devicesSelected,actionsSelected){

  const routineIDs = []
  const deviceActions = []
  let routineActions = []
  const routineMeta = new RoutineMeta()

  for (const device of devicesSelected) {
    routineIDs.push(device.id)
  }

  for (const action of actionsSelected) {
    deviceActions.push(action.toString())
  }

  for (let i = 0; i <routineIDs.length ; i++) {
    routineActions.push(new RoutineActions(routineIDs[i],deviceActions[i],[],routineMeta))
  }
  const _routine = new Routine(routineName,routineActions,routineMeta)

  try {
    await routineStore.add(_routine)
    routines.value = await routineStore.getAll()
  }catch (error) {
    console.error(error)
  }
}

onMounted(  async () => {
  try {
    devices.value = await deviceStore.getAll()
    routines.value = await routineStore.getAll()
    isLoading.value = false
  } catch(error){
    throw error
  }

  try{
    setInterval(refreshState, 1000)
  } catch(error){
    console.log(error)
  }
})

async function refreshState(){
  try{
    routines.value = await routineStore.getAll()
  } catch(error){
    throw error
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.startRoutine{
  background-color: #3c8aff;
  margin: 5px 15px 15px;
}
.routineCard{
  margin: 10px;
}
.addRoutine{
  background-color: #3c8aff;
  color: white;
  position: fixed;
  bottom: 16px;
  right: 16px;
}

</style>
