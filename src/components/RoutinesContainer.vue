<template>
  <div v-if="!isLoading">
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
          <v-btn :disabled="!isValidName()" color="primary" @click="createRoutine(routineName,devicesSelected,actionsSelected,paramsSelected) && (showRoutine=false)">Crear</v-btn>
          <v-btn @click="showRoutine = false">Cancelar</v-btn>
          <v-btn :disabled="devicesSelected.length <= 0" @click="configureDevices()">Configurar dispositivos</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setupDevices" width="700" height="auto">
      <v-card >
        <v-card-title>Seleccione las acciones a realizar</v-card-title>
        <v-container v-for="(device,index) in devicesSelected" :key="index" >
          <v-row>
            <v-col cols="2" >
              <v-card-text >{{device.name}}</v-card-text>
            </v-col>
            <v-col cols="3" >
              <v-container  >
                <v-select
                          v-model="actionsSelected[`${index}`]"
                          label="Acción"
                          :items="getActions(device.type.id)"
                ></v-select>
              </v-container>
            </v-col>
            <v-col cols="5" v-if="needParams(actionsSelected[`${index}`])">
              <v-form v-if="actionsSelected[`${index}`] === 'setVolume'" @submit.prevent="rules()">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="paramsSelected[`${index}`]"
                      label="Volumen"
                      type="number"
                      hint="Inserte el volumen deseado"
                      :rules="[ ()=> paramsSelected[`${index}`] >= 0 && paramsSelected[`${index}`] <= 10 ? true : errorMessage]"
                      :error-message="errorMessage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setBrightness'" @submit.prevent="rules()">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="paramsSelected[`${index}`]"
                      label="Brillo"
                      type="number"
                      hint="Inserte el porcentaje de brillo deseado"
                      :rules="[ ()=> paramsSelected[`${index}`] >= 0 && paramsSelected[`${index}`] <= 100 ? true : errorMessage]"
                      :error-message="errorMessage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setTemperature' && device.type.id === 'li6cbv5sdlatti0j'" @submit.prevent="rules()">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="paramsSelected[`${index}`]"
                      label="Temperatura"
                      type="number"
                      hint="Inserte el temperatura deseada"
                      :rules="[ ()=> paramsSelected[`${index}`] >= 18 && paramsSelected[`${index}`] <= 38 ? true : errorMessage]"
                      :error-message="errorMessage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>

              <v-form v-if="(actionsSelected[`${index}`] === 'setTemperature')&& device.type.id === 'rnizejqr2di0okho'" @submit.prevent="rules()">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="paramsSelected[`${index}`]"
                      label="Temperatura"
                      type="number"
                      hint="Inserte el temperatura deseada"
                      :rules="[ ()=> paramsSelected[`${index}`] >= 2 && paramsSelected[`${index}`] <= 8 ? true : errorMessage]"
                      :error-message="errorMessage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setFreezerTemperature'" @submit.prevent="rules()">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="paramsSelected[`${index}`]"
                      label="Temperatura"
                      type="number"
                      hint="Inserte el temperatura deseada"
                      :rules="[ ()=> paramsSelected[`${index}`] >= (-8) && paramsSelected[`${index}`] <= (-20) ? true : errorMessage]"
                      :error-message="errorMessage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setGenre'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione el género"
                  :items="setGenre"
                ></v-select>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'dispense' && dispenseParams(index)">

                <v-text-field
                  v-model="cant"
                  label="Líquido"
                  type="number"
                  hint="Inserte el cantidad deseada"
                ></v-text-field>

                <v-select
                  v-model="unit"
                  label="Seleccione la unidad"
                  :items="dispense"
                ></v-select>
              </v-form>

              <v-form v-if="(actionsSelected[`${index}`] === 'setMode') && device.type.id === 'li6cbv5sdlatti0j'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione el modo"
                  :items="acsetMode"
                ></v-select>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setVerticalSwing'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione el modo de desplazamiento"
                  :items="setVerticalSwing"
                ></v-select>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setHorizontalSwing'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione el modo de desplazamiento"
                  :items="setHorizontalSwing"
                ></v-select>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setFanSpeed'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione la velocidad del ventilador"
                  :items="setFanSpeed"
                ></v-select>
              </v-form>

              <v-form v-if="(actionsSelected[`${index}`] === 'setMode') && device.type.id === 'rnizejqr2di0okho'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione la velocidad del ventilador"
                  :items="fridgesetMode"
                ></v-select>
              </v-form>
            </v-col>
            <v-col v-else-if="noParams(index)">
              <v-list-item title="Esta acción no recibe parámetros"></v-list-item>
            </v-col>
           <v-container>
             <v-col cols="2" >
               <v-btn
                 icon="mdi-delete"
                 variant="text"
                 color="error"
                 class="close"
                 @click="deleteDevice(device.name)">
               </v-btn>
             </v-col>
           </v-container>
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
                    <v-icon  :icon="getIcon(devices.filter((device) => action.device.id === device.id)[0].type.id)"></v-icon>
                  </template>
                  <v-list-item-title>{{devices.filter((device) => action.device.id === device.id)[0].name}}</v-list-item-title>
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
  </div>
</template>

<script setup>
import { UseRoutineStore } from "@/store/routineStore.js"
import { useDeviceStore } from "@/store/deviceStore.js"
import { Routine, RoutineActions, RoutineMeta } from "@/api/routine";
import {computed, onMounted, ref, toRaw} from "vue";


const routineStore = UseRoutineStore()
const routines = computed( () => routineStore.routines)
const deviceStore = useDeviceStore()
const devices = computed( () => deviceStore.devices)

const showRoutine = ref(false)
const setupDevices = ref(false)

const routineName = ref('')
let storeSelected = ref([])
const devicesSelected = ref([])
const actionsSelected = ref([])

const speakerActions = ["setVolume","play","stop","pause","resume","nextSong","previousSong","setGenre","getPlaylist"]
const faucetActions = ["open","close","dispense"]
const lampActions = ["turnOn","turnOff","setColor","setBrightness"]
const acActions = ["turnOn","turnOff","setTemperature","setMode","setVerticalSwing","setHorizontalSwing","setFanSpeed"]
const fridgeActions = ["setFreezerTemperature","setTemperature","setMode"]

const setGenre= ["clasica","country","dance","latina","pop","rock"]
const dispense= ["ml","cl","dl","l","dal","hl","kl"]
const acsetMode = ["ventilación","frio","calor"]
const setVerticalSwing = ["automatico","22","45","67","90"]
const setHorizontalSwing = ["automatico","-90","-45","0","45","90"]
const setFanSpeed = ["automatico","25","50","75","100"]
const fridgesetMode = ["normal","fiesta","vacaciones"]

const errorMessage = computed( () => !isNaN(Number(text.value)) && text.value > 0 ? "" : !isNaN(Number(text.value)) && text.value <= 0 ? 'Debe ingresar un número mayor a cero' : 'Debe ingresar un numero')
const unit = ref('')
const cant = ref('')
let paramsSelected = ref([])

const asyncSpeakers = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[0].id))
const asyncFaucet = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[1].id))
const asyncLamp = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[2].id))
const asyncAc = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[3].id))
const asyncFridge = computed(() => devices.value.filter((device) => device.type.id === devicesTypes.value[4].id))
const text = ref("")
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
function needParams(action){
  return !(action === 'play' || action === 'stop' || action === 'pause' || action === 'resume' || action === 'nextSong' || action === 'previousSong' || action === 'getPlaylist'
    || action === 'open' || action === 'close' || action === 'turnOn' || action === 'turnOff');
}
function getIcon(id){
  return devicesTypes.value.find((type) => type.id === id).icon
}
function isValidName(){
  return routineName.value.length >0
}

function noParams(index){
  paramsSelected.value[index] = "noparams"
  return true
}
function dispenseParams(index){
  paramsSelected.value[index] = "dispense"
  return true
}

function rules(){
  return !numberRule() || text.value === ''
}

function deleteDevice(name) {
  const index = devicesSelected.value.findIndex(device => device.name === name);
  devicesSelected.value.splice(index, 1);
  if (devicesSelected.value.length === 0){
    setupDevices.value = false
  }
}

function numberRule(){
  return !isNaN(Number(text.value)) && text.value > 0 && text.value <= 100
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
async function createRoutine(routineName,devicesSelected,actionsSelected,paramsSelected){

  const routineIDs = []
  const deviceActions = []
  let routineActions = []
  const paramestros = []
  const routineMeta = new RoutineMeta()

  for (const device of devicesSelected) {
    routineIDs.push(device.id)
  }

  for (const action of actionsSelected) {
    deviceActions.push(action.toString())
  }

  for (let param of paramsSelected) {
    if (param === "dispense"){
      paramestros.push([cant.value.toString(),unit.value.toString()])
    }
    else if (param === "noparams"){
      paramestros.push([])
    }
    else {
      paramestros.push([param])
    }
  }

  for (let i = 0; i <routineIDs.length ; i++) {
    routineActions.push(new RoutineActions(routineIDs[i],deviceActions[i],paramestros[i],routineMeta))
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
    await deviceStore.getAll()
    await routineStore.getAll()
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
