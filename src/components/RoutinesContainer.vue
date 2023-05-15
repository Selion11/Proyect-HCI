<template>
  <div v-if="!isLoading">
    <v-card-subtitle v-if="routines.length <= 0" class="text-center">Actualmente no hay ninguna rutina agregada. Para hacerlo, utilice el botón de "Agregar Rutina"</v-card-subtitle>
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
          />
          <v-select v-if="storeSelected.length > 0"
                    v-model="devicesSelected"
                    label="Seleccione los dispositivos"
                    :items="storeSelected"
                    :item-title="item => item.name"
                    :item-value="item => item"
                    multiple
          />
          <v-card-text v-else class="text-center text-grey-darken-1">Seleccione una categoria en la que posea dispositivos</v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!isValidName() || actionsSelected.length < 1 || devicesSelected.length < 1" color="primary" @click="createRoutine(routineName,devicesSelected,actionsSelected,paramsSelected) && (showRoutine=false)">Crear</v-btn>
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
            <v-container></v-container>
              <v-col cols="2" >
                <v-card-text >{{device.name}}</v-card-text>
              </v-col>
              <v-col cols="5" >
              <v-container  >
                <v-select
                v-model="actionsSelected[`${index}`]"
                label="Acción"
                :items="getActions(device.type.id)"
                ></v-select>
              </v-container>
            </v-col>
              <v-col cols="4" v-if="needParams(actionsSelected[`${index}`])">
              <v-form v-if="actionsSelected[`${index}`] === 'setVolume'">
                <v-card-text >
                  <v-row>
                    <v-slider max="10" thumb-label min="0" step="1" v-model="paramsSelected[`${index}`]"/>
                  </v-row>
                  Volumen: {{paramsSelected[`${index}`]}}
                </v-card-text>
              </v-form>
              <v-form v-if="actionsSelected[`${index}`] === 'setBrightness'">
                <v-card-text >
                  <v-row>
                    <v-slider max="100" thumb-label min="0" step="1" v-model="paramsSelected[`${index}`]"/>
                  </v-row>
                  Brillo: {{paramsSelected[`${index}`]}}%
                </v-card-text>
              </v-form>
              <v-form v-if="actionsSelected[`${index}`] === 'setColor'">
                <v-form   width="auto" height="auto">
                  <v-card v-if="showColor">
                    <v-card-title/>
                    <v-card-title/>
                    <v-card-text>
                      <v-row justify="center">
                        <v-list-item >
                          <v-color-picker v-model="paramsSelected[`${index}`]" hide-inputs></v-color-picker>
                        </v-list-item>
                      </v-row>
                      <v-divider/>
                      <v-list-item>
                        <v-row justify="center">
                          <v-col cols="12">
                            <v-btn class ="actions" block @click=getColor(index)>Aceptar</v-btn>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item v-if="selectedColor">
                        <v-row justify="center">
                          <v-col cols="12">
                            <div>Color seleccionado: {{ selectedColor }}</div>
                          </v-col>
                        </v-row>
                      </v-list-item>
                    </v-card-text>
                    </v-card>
                </v-form>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setTemperature' && device.type.id === 'li6cbv5sdlatti0j'" @submit.prevent="rules()">
                <v-card-text >
                  <v-row>
                    <v-slider max="38" thumb-label min="18" step="1" v-model="paramsSelected[`${index}`]"/>
                  </v-row>
                  Temperatura: {{paramsSelected[`${index}`]}}°C
                </v-card-text>
              </v-form>

              <v-form v-if="(actionsSelected[`${index}`] === 'setTemperature')&& device.type.id === 'rnizejqr2di0okho'" >
                <v-card-text >
                  <v-row>
                    <v-slider max="8" thumb-label min="2" step="1" v-model="paramsSelected[`${index}`]"/>
                  </v-row>
                  Temperatura: {{paramsSelected[`${index}`]}}°C
                </v-card-text>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setFreezerTemperature'" >
                <v-card-text >
                  <v-row>
                    <v-slider max="-8" thumb-label min="-20" step="1" v-model="paramsSelected[`${index}`]"/>
                  </v-row>
                  Temperatura: {{paramsSelected[`${index}`]}}°C
                </v-card-text>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'setGenre'">
                <v-select
                  v-model="paramsSelected[`${index}`]"
                  label="Seleccione el género"
                  :items="setGenre"
                ></v-select>
              </v-form>

              <v-form v-if="actionsSelected[`${index}`] === 'dispense' && dispenseParams(index)">
                <v-card-text>
                  <v-row>
                    <v-slider max="100" thumb-label min="1" step="1" v-model="cant"/>
                  </v-row>
                  Cantidad: {{cant}}
                </v-card-text>
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
                <v-list-item> Esta acción no <br> recibe parámetros</v-list-item>
              </v-col>
              <v-col cols="1">
               <v-btn
                 icon="mdi-delete"
                 variant="text"
                 color="error"
                 class="close"
                 @click="deleteDevice(device.name)">
               </v-btn>
              </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn @click="(setupDevices = false) && (actionsSelected = []) && (paramsSelected = []) && (unit = '')">Atrás</v-btn>
          <v-btn v-if="actionsSelected.length === devicesSelected.length && areAllSet()" color="primary" @click="setupDevices = false">OK</v-btn>
          <v-btn v-else color="primary" disabled class="text-grey-darken-1" >OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid>
      <v-row>
        <v-col v-for="routine in routines" cols="4" >
          <RoutineCard :id="routine.id"></RoutineCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { UseRoutineStore } from "@/store/routineStore.js"
import { useDeviceStore } from "@/store/deviceStore.js"
import { Routine, RoutineActions, RoutineMeta } from "@/api/routine";
import {computed, onMounted, ref} from "vue";
import RoutineCard from "@/components/RoutineCard.vue";

const routineStore = UseRoutineStore()
const routines = ref( () => routineStore.routines)
const deviceStore = useDeviceStore()
const devices = computed( () => deviceStore.devices)

const showRoutine = ref(false)
const setupDevices = ref(false)

const selectedColor= ref(null)

const showColor = ref(true)
const routineName = ref('')
let storeSelected = ref([])
const devicesSelected = ref([])
const actionsSelected = ref([])

const speakerActions = ["setVolume","play","stop","pause","resume","nextSong","previousSong","setGenre","getPlaylist"]
const faucetActions = ["open","close","dispense"]
const lampActions = ["turnOn","turnOff","setColor","setBrightness"]
const acActions = ["turnOn","turnOff","setTemperature","setMode","setVerticalSwing","setHorizontalSwing","setFanSpeed"]
const fridgeActions = ["setFreezerTemperature","setTemperature","setMode"]

const speakerActions1 = ["setear volumen","play","detener","pausar","resume","canción siguiente ","cancion previa","setear género","obtener lista de reproducción"]
const faucetActions1 = ["abrir","cerrar","dispensar"]
const lampActions1 = ["encender","apagar","setear color","setear brillo"]
const acActions1 = ["encender","apagar","setear temperatura","setear modod","setear aspas verticales","setear aspas horizontales","setear velocidad del ventilador"]
const fridgeActions1 = ["setear temperetura del freezer","setear temperatura","setear modo"]

const setGenre= ["clasica","country","dance","latina","pop","rock"]
const dispense= ["ml","cl","dl","l","dal","hl","kl"]
const acsetMode = ["ventilación","frio","calor"]
const setVerticalSwing = ["automatico","22","45","67","90"]
const setHorizontalSwing = ["automatico","-90","-45","0","45","90"]
const setFanSpeed = ["automatico","25","50","75","100"]
const fridgesetMode = ["normal","fiesta","vacaciones"]

const unit = ref('')
const cant = ref(1)
const paramsSelected = ref([])

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
    name: "Aire Acondicionado",
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

function areAllSet(){
  for(let i=0; i<actionsSelected.value.length ;i++){
    if(!needParams(actionsSelected.value[i]) && paramsSelected.value[i] !== "noparams"){
      return false
    } else if( actionsSelected.value[i] == 'dispense' && unit.value === ''){
      return false
    }
  }
  return true
}

function configureDevices(){
  setupDevices.value = true

}
function needParams(action){
  return !(action === 'play' || action === 'stop' || action === 'pause' || action === 'resume' || action === 'nextSong' || action === 'previousSong' || action === 'getPlaylist'
    || action === 'open' || action === 'close' || action === 'turnOn' || action === 'turnOff')
}

function getColor(index){
  selectedColor.value = paramsSelected[index]
  showColor.value = false
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
})
</script>

<style scoped>
.addRoutine{
  background-color: #3c8aff;
  color: white;
  position: fixed;
  bottom: 16px;
  right: 16px;
}

.delete{
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 0;
}
.actions {
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 4px;
}

</style>
