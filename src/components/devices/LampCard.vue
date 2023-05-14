<template>
  <v-container>
    <v-card class="mx-auto" max-width="300" v-if="!isLoading">
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
                    ¿Seguro que desea borrar la lámpara {{lamp.name}}?
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
            <span>Borrar Lámpara</span>
          </v-tooltip>
        </template>
      </v-menu>
      <v-card-title/>
      <v-card-title>
        <v-row justify="center">
          {{ lamp.name }}
        </v-row>
      </v-card-title>
      <v-card-title/>
      <v-card-title/>
      <v-card-text class="centered">
        <v-row justify="center">
          <v-icon icon="mdi-lightbulb" v-if="isOn" size="75" :style="`color: ${currentColor}`" />
        <v-icon icon="mdi-lightbulb-outline" v-else size="75" :style="`color: ${currentColor}`"/>
        </v-row>
      </v-card-text>

      <div class="subtitle">
        <v-row justify="center">
          <v-list-item density="compact" justify="center">
            <v-list-item-subtitle>Estado: {{ isOn? 'Encendido' : 'Apagado'}}</v-list-item-subtitle>
          </v-list-item>
        </v-row>
        <v-row justify="center">
          <v-list-item density="compact" justify="center">
            <v-list-item-subtitle v-show="isOn">Brillo: {{ currentBrightness}}%</v-list-item-subtitle>
          </v-list-item>
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
            <v-row justify="center" class="actions">
              <v-btn class="actions">
                Color
                <v-dialog v-model="colorDia" width="450px" height="500px" activator="parent">
                  <v-card>
                    <v-icon icon="mdi-close" color="grey" class="close" @click="colorDia = false"/>
                    <v-card-title/>
                    <v-card-title/>
                    <v-card-text>
                    <v-row justify="center">
                    <v-list-item>
                      <v-color-picker v-model="currentColor" hide-inputs></v-color-picker>
                    </v-list-item>
                    </v-row>
                      <v-divider/>
                    <v-list-item>
                      <v-row justify="center">
                        <v-col cols="12">
                        <v-btn class ="actions" block @click="colorDia = false">Aceptar</v-btn>
                        </v-col>
                      </v-row>
                    </v-list-item>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-row>
            <v-row justify="center" class="actions">
              <v-btn class="actions">
                Brillo
                <v-dialog activator="parent" v-model="brightDia" width="300px" height="500px">
                  <v-card>
                    <v-icon icon="mdi-close" color="grey" class="close" @click="brightDia = false"/>
                    <v-card-title/>
                    <v-card-title/>
                    <v-card-text>
                      <v-row justify="center">
                          <v-icon icon="mdi-minus" @click="setBrightnessDown()"/>
                          <v-slider max="100" min="0" step="1" v-model="currentBrightness"/>
                          <v-icon icon="mdi-plus" @click="setBrightnessUp()"/>
                      </v-row>
                      Brillo: {{currentBrightness}}%
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-row>
          </div>

        </div>
      </v-expand-transition>
      <v-divider></v-divider>

      <v-card-actions>
        <v-col cols="6">
          <v-row>
            <v-btn block prepend-icon="mdi-pencil" class="actions">
              Editar <br> Lámpara
              <v-dialog v-model="editDia" activator="parent">
                <v-card>
                  <v-card-title class="centered">Cambie el nombre de su lámpara</v-card-title>
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
import {ref, onMounted, mergeProps, defineEmits, computed } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(["id"])
const emits = defineEmits(["to-snackbar"])

const DELdialog = ref(null)

const lamp = computed( () => deviceStore.devices.filter( (device) => device.id === props.id)[0])

const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)
const isOn = ref(false)
const colorDia = ref(false)
const currentColor = ref('')
const brightDia = ref(false)
const currentBrightness = ref(0)
const refreshInterval = ref(0)
const editDia = ref(false)
const newName = ref('')


async function execute(actionName, params = []){
  let result = await deviceStore.execute(props.id, actionName, params)
  if(result){
    await deviceStore.get(props.id)
  } else {
    console.error(result)
  }
}

async function editDevice(){
  const editedDevice = {
    name: newName.value,
    meta: lamp.value["meta"]
  }
  try{
    const result = await deviceStore.modify(lamp.value["id"], editedDevice)
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

async function turnOnOff(){
  if(isOn.value){
    try{
      if(expand.value){
        expand.value = false
      }
      await execute("turnOff")
    } catch(error){
      console.log(error)
    }
  } else{
    try{
      await execute("turnOn")
    } catch(error){
      console.log(error)
    }
  }
}

async function setColor(){
  try{
    if(currentColor.value.toUpperCase().substring(1) !== lamp.value["state"].color.toUpperCase()) {
      await execute("setColor", [currentColor.value.toUpperCase().substring(1)])
    }
  } catch(error){
    console.log(error)
  }
}

async function setBrightness(){
  try{
    if(currentBrightness.value !== lamp.value["state"].brightness) {
      await execute("setBrightness", [currentBrightness.value])
    }
  } catch(error){
    console.log(error)
  }
}

async function setBrightnessUp(){
  if(currentBrightness.value < 100){
    currentBrightness.value = currentBrightness.value + 1
  }
}

async function setBrightnessDown(){
  if(currentBrightness.value > 0){
    currentBrightness.value = currentBrightness.value - 1
  }
}

onMounted( async () => {
  try{
    await deviceStore.get(props.id)
    isOn.value = lamp.value["state"].status === 'on'
    currentBrightness.value = lamp.value["state"].brightness
    currentColor.value = '#' + lamp.value["state"].color.toLowerCase()
    isLoading.value = false
    refreshInterval.value = setInterval(refreshState, 5000)
  } catch(error) {
    console.log(error)
  }
})

async function refreshState(){
  try{
    await setColor()
    await setBrightness()
  } catch(error){
    console.log(error)
  }
}

async function removeDevice(){
  try{
    isLoading.value = true
    clearInterval(refreshInterval.value)
    const result = await deviceStore.remove(props.id)
    if(!result){
      isLoading.value = false
    }
  } catch(error){
    console.error(error)
  }
}
</script>

<style scoped>
.actions {
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 4px;
}
.centered{
  text-align: center;
}

.close{
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 0;
}

.switch{
  margin-left: 7px;
}

</style>
