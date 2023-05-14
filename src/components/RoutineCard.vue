<template>
  <v-card class="routineCard">
    <v-menu>
      <template #activator="{ props: menu }">
        <v-tooltip location="top">
          <template #activator="{ props: tooltip }">
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              class="close"
              v-bind="mergeProps(menu, tooltip)"
              @click="DELdialog = true"
            />
            <v-dialog v-model="DELdialog" width="auto" height="auto">
              <v-card>
                <v-card-title/>
                <v-card-title>
                  ¿Seguro que desea borrar la rutina {{routine.name}}?
                </v-card-title>
                <v-card-actions>
                  <v-row justify="center">
                    <v-btn variant="text" @click="DELdialog = false">No</v-btn>
                    <v-btn color="red" variant="text" @click="routineStore.remove(routine.id) && (DELdialog = false)">Sí</v-btn>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <span>Borrar Rutina</span>
        </v-tooltip>
      </template>
    </v-menu>
    <v-card-title/>

    <v-row>
      <v-col cols="6">
        <v-card-title >{{ routine.name }}</v-card-title>
      </v-col>
    </v-row>
    <v-card-text>
      <v-list>
        <v-list-subheader>Dispositivos</v-list-subheader>
        <v-list-item class="routineDevices" v-for="action in routine.actions" :key="action.device.id">
          <template #prepend>
            <v-icon :icon="getIcon(devices.filter((device) => action.device.id === device.id)[0].type.id)" />
          </template>
          <v-list-item-title>{{ devices.filter((device) => action.device.id === device.id)[0].name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="container">
      <v-btn width="200" height="50" variant="outlined" rounded="rounded" class="startRoutine" @click="executeRoutine(routine.id)">Iniciar Rutina </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>

import {computed, mergeProps, ref,defineProps} from "vue";
import {UseRoutineStore} from "@/store/routineStore";
import {useDeviceStore} from "@/store/deviceStore";

const props = defineProps(["id"])

const routine = computed( () => routineStore.routines.filter( (routine) => routine.id === props.id)[0])

function getIcon(id){
  return devicesTypes.value.find((type) => type.id === id).icon
}
const routineStore = UseRoutineStore()
const deviceStore = useDeviceStore()
const devices = computed( () => deviceStore.devices)

const snackBarTxt = ref('')
const snackBar = ref(false)

const DELdialog = ref(false)

const devicesTypes = ref([
  {
    name: "Parlante",
    id: "c89b94e8581855bc",
    icon:"mdi-speaker"
  },
  {
    name: "Grifo",
    id: "dbrlsh7o5sn8ur4i",
    icon:"mdi-faucet"
  },
  {
    name: "Lámpara",
    id: "go46xmbqeomjrsjr",
    icon:"mdi-lamp"
  },
  {
    name: "Accondiconador de Aire",
    id: "li6cbv5sdlatti0j",
    icon:"mdi-air-conditioner"
  },
  {
    name: "Heladera",
    id:"rnizejqr2di0okho",
    icon:"mdi-fridge"
  }])

async function executeRoutine(id){
  snackBar.value = true
  snackBarTxt.value = "Ejecutando rutina"
  try {
    await routineStore.execute(id)
    await deviceStore.getAll()
  }catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: flex-end;
  align-items: center;}
.startRoutine{
  background-color: #3c8aff;
  color: white;
  margin: 5px 15px 15px;
}
.routineCard{
  margin: 10px;
}
</style>
