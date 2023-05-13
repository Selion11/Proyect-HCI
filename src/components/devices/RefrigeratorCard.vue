<template>
  <v-container v-if="!isLoading">
    <v-card class="mx-auto" max-width="368">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
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
                    ¿Seguro que desea borrar el refrigerador {{refrigerator.name}}?
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
            <span>Borrar Refrigerador</span>
          </v-tooltip>
        </template>
      </v-menu>
      <v-card-title/>
      <v-card-title>
        <v-row justify="center">
          {{ refrigerator.name }}
        </v-row>
      </v-card-title>
      <v-card-text class="centered">
      <v-icon icon="mdi-fridge" size="75" color="blue"/>
      </v-card-text>
      <div class="subtitle">
        <v-row>
          <v-col cols="12">
            <v-card-subtitle >Temperatura del Freezer: {{ currentFreezerTemp }}ºC </v-card-subtitle>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
          <v-card-subtitle >Temperatura de la Heladera: {{ currentFridgeTemp }}ºC </v-card-subtitle>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card-subtitle>Modo: {{ currentMode }} </v-card-subtitle>
          </v-col>
        </v-row>
        <v-card-title/>
      </div>
      <v-expand-transition>
        <div v-if="expand">
          <div class="py-2">
            <v-container>
              <v-row justify="center">
                <v-btn class="actions">Cambiar Temperatura
                  <v-dialog v-model="tempDialog" activator="parent" width="400px" height="auto">
                    <v-card>
                      <v-card-text >
                        <v-row justify="center">
                          <v-list-item-subtitle>Temperatura del freezer </v-list-item-subtitle>
                        </v-row>
                          <v-row justify="center">
                            <v-icon v-if="canDecFreezerTemp" icon="mdi-minus" @click="decreaseFreezerTemperature()"/>
                            <v-icon v-else disabled icon="mdi-minus"/>
                            <v-slider  min="-20" max="-8" thumb-label step="1" v-model="currentFreezerTemp"/>
                            <v-icon v-if="canIncFreezerTemp" icon="mdi-plus" @click="increaseFreezerTemperature()"/>
                            <v-icon v-else disabled icon="mdi-plus"/>
                          </v-row>
                          <v-row justify="center">
                            <v-list-item-subtitle>Temperatura de la heladera </v-list-item-subtitle>
                          </v-row>
                          <v-row justify="center">
                            <v-icon v-if="canDecFridgeTemp" icon="mdi-minus" @click="decreaseTemperature()"/>
                            <v-icon v-else disabled icon="mdi-minus"/>
                            <v-slider max="8" thumb-label min="2" step="1" v-model="currentFridgeTemp"/>
                            <v-icon v-if="canIncFridgeTemp" icon="mdi-plus" @click="increaseTemperature()"/>
                            <v-icon v-else disabled icon="mdi-plus"/>
                          </v-row>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-btn>
              </v-row>
              <v-row justify="center">
                <v-btn class="actions">
                  Cambio de modo
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item v-show="currentMode !== 'Por Defecto'" title="Por Defecto" @click="setMode('default')"/>
                      <v-list-item v-show="currentMode !== 'Vacaciones'" title="Vacaciones" @click="setMode('vacation')" />
                      <v-list-item v-show="currentMode !== 'Fiesta'" title="Fiesta" @click="setMode('party')" />
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
        <v-row justify="center">
          <v-btn block  prepend-icon="mdi-pencil" class="actions">
            Editar <br> Refrigerador
            <v-dialog v-model="editDia" activator="parent">
              <v-card>
                <v-card-title class="centered">Cambie el nombre de su refrigerador</v-card-title>
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
        <v-col cols="6">
          <v-btn v-if="!expand" @click="expand = !expand" block class="action">Más<br>Acciones</v-btn>
          <v-btn v-else @click="expand = !expand" block class="action">Ocultar<br>Acciones</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script setup>
import {ref, onMounted, defineEmits, computed, mergeProps} from 'vue'
import { useDeviceStore } from "@/store/deviceStore"


const props = defineProps(["id"])
const emits = defineEmits(["to-snackbar"])
const refrigerator = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const intervalId = ref(0)

const currentFridgeTemp = ref(0)
const currentFreezerTemp = ref(0)
const currentMode = computed( () => {
  switch(refrigerator.value["state"].mode){
    case "default": return "Por Defecto"
    case "vacation": return "Vacaciones"
    case "party": return "Fiesta"
  }
})
const editDia = ref(false)

const canIncFreezerTemp = computed( () => currentFreezerTemp.value < -8)
const canDecFreezerTemp = computed( () => currentFreezerTemp.value > -20)
const canIncFridgeTemp = computed( () => currentFridgeTemp.value < 8)
const canDecFridgeTemp = computed( () => currentFridgeTemp.value > 2)

const expand = ref(false)
const tempDialog = ref(false)
const DELdialog = ref(false)
const newName = ref('')

async function execute(actionName, params= []){
  let result = await deviceStore.execute(props.id, actionName, params)
  if(result){
    refrigerator.value = await deviceStore.get(props.id)
  } else {
    console.error(result)
  }
}

async function removeDevice(){
  try{
    isLoading.value = true
    clearInterval(intervalId.value)
    const result = await deviceStore.remove(props.id)
    if(!result){
      isLoading.value = false
    }
  } catch(error){
    console.error(error)
  }
}

async function setMode(mode){
  try{
    await execute("setMode", [mode])
    await refreshState()
  } catch(error){
    console.error(error)
  }
}

async function setTemperature(){
  if(currentFridgeTemp.value !== refrigerator.value["state"].temperature ){
    try{
      await execute("setTemperature", [currentFridgeTemp.value])
    } catch(error){
      console.error(error)
    }
  }
}

function increaseTemperature(){
  if(currentFridgeTemp.value < 8 ){
    currentFridgeTemp.value = currentFridgeTemp.value + 1
  }
}

function decreaseTemperature(){
  if(currentFridgeTemp.value > 2 ){
    currentFridgeTemp.value = currentFridgeTemp.value - 1
  }
}

async function setFreezerTemperature(){
  if(currentFreezerTemp.value !== refrigerator.value["state"].freezerTemperature ){
    try{
      await execute("setFreezerTemperature", [currentFreezerTemp.value])
    } catch(error){
      console.error(error)
    }
  }
}

function increaseFreezerTemperature(){
  if(currentFreezerTemp.value < -8 ){
    currentFreezerTemp.value = currentFreezerTemp.value + 1
  }
}

function decreaseFreezerTemperature(){
  if(currentFreezerTemp.value > -20 ){
    currentFreezerTemp.value = currentFreezerTemp.value - 1
  }
}

async function editDevice(){
  const editedDevice = {
    name: newName.value,
    meta: refrigerator.value["meta"]
  }
  const deviceId = refrigerator.value["id"].toString()
  try{
    const result = await deviceStore.modify(deviceId, editedDevice)
    if(result) {
      newName.value = ''
      editDia.value = false
      emits("to-snackbar", "Nombre modificado.")
    } else{
      emits("to-snackbar", "El nombre ingresado ya existe.")
    }
  } catch(error){
    emits("to-snackbar", "El nombre ingresado ya existe.")
  }
}

onMounted( async () => {
  try{
    refrigerator.value = await deviceStore.get(props.id)
    currentFridgeTemp.value = refrigerator.value["state"].temperature
    currentFreezerTemp.value = refrigerator.value["state"].freezerTemperature
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
  try{
    intervalId.value = setInterval(refreshState, 1000)
  } catch(error){
    console.log(error)
  }
})

async function refreshState(){
  await setFreezerTemperature()
  await setTemperature()
  refrigerator.value = await deviceStore.get(props.id)
}
</script>



<style scoped>
.actions{
  margin-right: 8px;
  margin-left: 7px;
  margin-bottom: 7px;
}

.close{
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 0;
}

.centered{
  text-align: center;
}

</style>
