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
                    ¿Seguro que desea borrar el grifo {{faucet.name}}?
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
            <span>Borrar Grifo</span>
          </v-tooltip>
        </template>
      </v-menu>
      <v-card-title/>
      <v-card-title>
        <v-row justify="center">
          {{ faucet.name }}
        </v-row>
      </v-card-title>
      <v-card-text class="centered">
        <v-icon v-if="!isOn" icon="mdi-water-outline" size="75" color="info"/>
        <v-icon v-else icon="mdi-water" size="75" color="info" />
      </v-card-text>
      <div class="subtitle">
        <v-row justify="center">
          <v-card-subtitle v-if="isDispensing && isOn"> Dispensando {{ quantity }}{{unit}}</v-card-subtitle>
          <v-card-subtitle v-else-if="isOn">Dispensando...</v-card-subtitle>
          <v-card-subtitle v-else>Apagado</v-card-subtitle>
        </v-row>
        <v-row class="actions" justify="start">
          <v-btn v-if="!isOn" width="flex" class="actions" @click="turnOnOff()">Encender</v-btn>
          <v-btn v-else width="flex" class="actions" @click="turnOnOff()">Apagar</v-btn>
          <div class="text-center">
            <v-btn
              v-if="!isOn"
              color="indigo"
              v-bind="props"
              @click="dispenseMenu = true"
              class="actions"
            >
              Dispensar
              <v-menu
                :close-on-content-click="false"
                location="end"
                activator="parent"
              >
                <v-card min-width="50">
                  <v-list>
                    <v-list-item>
                      <v-responsive
                        class="mx-auto"
                        max-width="344"
                      >
                        <v-form @submit.prevent="rules()">
                          <v-text-field
                            v-model="text"
                            :rules="[ ()=> text >= 0 && text <= 100 ? true : errorMessage]"
                            :error-message="errorMessage"
                            label="Cantidad"
                            type="number"
                            hint="Inserte la cantidad de liquido"
                            class="actions"
                          ></v-text-field>
                          <v-card-title/>
                          <v-row justify="center">
                            <v-btn
                              color="blue"
                              class="actions"
                            >
                              {{ unit ? unit : "Unidades" }}
                              <v-menu v-model="unitAct" activator="parent" :close-on-content-click="false">
                                <v-list :close-on-content-click="true" >
                                  <v-list-item justify="center" title="ml" @click="(unit = 'ml') && (unitAct = false)"/>
                                  <v-list-item justify="center" title="cl" @click="(unit = 'cl') && (unitAct = false)"/>
                                  <v-list-item justify="center" title="dl" @click="(unit = 'dl' )&& (unitAct = false)"/>
                                  <v-list-item justify="center" title="l" @click=" (unit = 'l') && (unitAct = false)"/>
                                  <v-list-item justify="center" title="dal" @click=" (unit = 'dal') && (unitAct = false)"/>
                                  <v-list-item justify="center" title="hl" @click="(unit = 'hl') && (unitAct = false)"/>
                                  <v-list-item justify="center" title="kl" @click="(unit = 'kl') && (unitAct = false)"/>
                                </v-list>
                              </v-menu>
                            </v-btn>
                            <v-btn
                              :disabled="rules()"
                              block
                              color="success"
                              variant="text"
                              class="action"
                              @click="dispense() && (dispenseMenu = false)"
                            >
                              Aceptar
                            </v-btn>
                          </v-row>
                        </v-form>
                      </v-responsive>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-btn>
            <v-btn v-else disabled class="actions" color="indigo" v-bind="props">Dispensar</v-btn>
          </div>
        </v-row>
      </div>

      <v-card-actions>
        <v-row justify="center">
          <v-btn block  prepend-icon="mdi-pencil" class="actions">
            Editar Grifo
            <v-dialog v-model="editDia" activator="parent">
              <v-card>
                <v-card-title class="centered">Cambie el nombre de su grifo</v-card-title>
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
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
//:error-messages="errorMessage"
import {ref, onMounted, mergeProps, computed, defineEmits} from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

class FaucetState {
  constructor(status){
    this.status = status
  }
}

const props = defineProps(["id"])
const emits = defineEmits(["to-snackbar"])
const faucet = computed( () => deviceStore.devices.filter((device) => device.id === props.id)[0])
const deviceStore = useDeviceStore()
const faucetEvents = ref(null)

const newName = ref('')
const isLoading = ref(true)
const unitAct = ref(false)
const isOn = computed( () => faucet.value["state"].status !== 'closed')
const isDispensing = ref(false)
const text = ref("0")
const unit = ref('')
const quantity = ref(0)
const dispenseMenu = ref(false)
const DELdialog = ref(false)
const editDia = ref(false)
const errorMessage = computed( () => !isNaN(Number(text.value)) && text.value > 0 ? "" : !isNaN(Number(text.value)) && text.value <= 0 ? 'Debe ingresar un número mayor a cero' : 'Debe ingresar un numero')
function numberRule(){
  return !isNaN(Number(text.value)) && text.value > 0 && text.value <= 100
}
async function dispense(){
  try{
    await execute("dispense", [Number(text.value), unit.value])
    quantity.value = Number(text.value)
    text.value = ""
    dispenseMenu.value = false
    isDispensing.value = true
  } catch(error){
    console.log(error)
  }
}
function rules(){
  return !numberRule() || text.value === '' || unit.value === ''
}

async function editDevice(){
  const editedDevice = {
    name: newName.value,
    meta: faucet.value["meta"]
  }
  try{
    const result = await deviceStore.modify(faucet.value["id"], editedDevice)
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

async function execute(actionName, params= []){
  let result = await deviceStore.execute(props.id, actionName, params)
  if(!result){
    console.error(result)
  }
}

onMounted( async () => {
  try{
    faucetEvents.value = deviceStore.getDeviceEvents(props.id)
    faucetEvents.value.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      if(data.event === 'statusChanged'){
        deviceStore.updateState(props.id, data.args.newStatus)
      }
    }
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
})

async function turnOnOff(){
  try{
    if(isOn.value){
      await execute("close")
      isDispensing.value = false
      unit.value = ''
      text.value = '0'
    } else{
      await execute("open")
      isDispensing.value = false
    }
  } catch(error){
    console.log(error)
  }
}

async function removeDevice(){
  try{
    isLoading.value = true
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

</style>
