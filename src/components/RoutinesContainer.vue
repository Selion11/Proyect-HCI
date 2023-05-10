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
          <v-btn @click="saveDevice(device.id)">{{device.name}}</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" >OK</v-btn>
          <v-btn @click="showDevicesCategories = false">Atrás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDevices" max-width="600">
      <v-card>
        <v-card-title>
          Seleccione los dispositivos
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" @click="saveDevices">OK</v-btn>
          <v-btn @click="showDevicesCategories = false">Atrás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import {UseRoutineStore} from "@/store/routineStore.js"
import {useDeviceStore} from "@/store/deviceStore.js"
import {Routine, RoutineActions, RoutineMeta} from "@/api/routine";
import {ref} from "vue";

const routineStore = UseRoutineStore()
const deviceStore = useDeviceStore()

const routine = ref(null);



const showRoutine = ref(false)
const showDevices = ref(false)
const showDevicesCategories = ref(false)

const deviceSelected = ref(0)
let devices = ref([])


const routineName = ref('')
const devicesSelected = ref([])


function saveDevice(id){
  showDevices.value = true
  deviceSelected.value = id
  devices = deviceStore.getAllByType(id)
}


function saveRoutine() {

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



const devicesTypes = ref([
  {
    name: "Parlante",
    id: "c89b94e8581855bc",
  },
  {
    name: "Grifo",
    id: "dbrlsh7o5sn8ur4i"
  },
  {
    name: "Lámpara",
    id: "go46xmbqeomjrsjr",
  },
  {
    name: "Accondiconador de aire",
    id: "li6cbv5sdlatti0j",
  },
  {
    name: "Heladera",
    id:"rnizejqr2di0okho",
  }])
</script>


<style scoped>

</style>
