<template>
  <v-card-subtitle v-if="devices.length <= 0" class="text-center">Actualmente no hay ningún dispositivo agregado. Para hacerlo, utilice el botón de "Agregar Dispositivo"</v-card-subtitle>
  <v-container v-else fluid v-for="device in devicesTypes" :key="device.id">
    <div v-if="devices.filter((dev) => dev.type.id === device.id).length > 0">
      <h2>{{ device.frontName }}</h2>
      <div v-if="!isLoading">
        <v-container v-if="device.name === 'Speaker'">
          <v-row >
            <v-col cols="auto" v-for="item in asyncSpeakers" :key="item.id">
              <SpeakerCard @to-snackbar="toSnackbar" :id="item.id"/>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="device.name === 'Ac'">
          <v-row >
            <v-col cols="auto"  v-for="item in asyncAc" :key="item.id">
              <ACCard @to-snackbar="toSnackbar" :id="item.id"/>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="device.name === 'Faucet'">
          <v-row >
            <v-col cols="auto"  v-for="item in asyncFaucet" :key="item.id">
              <FaucetCard @to-snackbar="toSnackbar" :id="item.id"/>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="device.name === 'Lamp'" >
          <v-row >
            <v-col cols="auto"  v-for="item in asyncLamp" :key="item.id">
              <LampCard @to-snackbar="toSnackbar" :id="item.id"/>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="device.name === 'Fridge'" >
          <v-row >
            <v-col cols="auto"  v-for="item in asyncRefrigerator" :key="item.id">
              <RefrigeratorCard :id="item.id"/>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </v-container>
  <v-container>
    <v-btn id="add-btn" class="addDevice" prepend-icon="mdi-plus">
      Añadir<br>Dispositivo
      <v-dialog v-model="popUp" activator="parent" width="800" height="800">
        <v-card>
          <v-card-text>
            <v-text-field
              type="text"
              v-model="text"
              label="Nombre Del Dispositivo"
              hint="Ingrese solo letras, espacios y números (A-Z, a-z, 0-9)"
              variant="outlined"
            />
            <v-container class="actions">
              <v-row v-for="dev in devicesTypes" class="actions" justify="center">
                  <v-btn rounded="lg" variant="outlined" color="blue"
                           class="actions"
                           @click="elemCreate(dev.id,text) && (snackBar = true)">
                      Crear {{dev.singular}}
                  </v-btn>
              </v-row>
            </v-container>
          </v-card-text>
            <v-card-actions>
              <v-btn @click="(popUp = false) && (text = '')" block  prepend-icon="mdi-close">Close</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
    <v-snackbar
      v-model="snackBar"
      multi-line
      :timeout="2000"
    >
      {{ snackBarTxt }}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackBar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>

</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useDeviceStore } from "@/store/deviceStore"
  import SpeakerCard from "@/components/devices/SpeakerCard.vue"
  import ACCard from "@/components/devices/ACCard.vue"
  import FaucetCard from "@/components/devices/FaucetCard.vue"
  import LampCard from "@/components/devices/LampCard.vue"
  import RefrigeratorCard from "@/components/devices/RefrigeratorCard.vue"

  const snackBarTxt = ref('')
  const snackBar = ref(false)
  const devStore = useDeviceStore()

  const popUp = ref(false)
  const text = ref()
  const devices = computed( () => devStore.devices )
  const asyncSpeakers = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[0].id))
  const asyncFaucet = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[1].id))
  const asyncLamp = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[2].id))
  const asyncAc = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[3].id))
  const asyncRefrigerator = computed(() => devices.value.filter((device) => device["type"].id === devicesTypes.value[4].id))

  const isLoading = ref(true)

  const devicesTypes = ref([
    {
      frontName: "Parlantes",
      singular:"Parlante" ,
      name: "Speaker",
      id: "c89b94e8581855bc",
      store: asyncSpeakers
    },
    {
      frontName: "Grifos",
      singular:"Grifo" ,
      name: "Faucet",
      id: "dbrlsh7o5sn8ur4i",
      store: asyncFaucet
    },
    {
      frontName: "Lámparas",
      singular:"Lámpara" ,
      name: "Lamp",
      id: "go46xmbqeomjrsjr",
      store: asyncLamp
    },
    {
      frontName: "Aires Acondicionados",
      singular: "Aire Acondicionado",
      name: "Ac",
      id: "li6cbv5sdlatti0j",
      store: asyncAc
    },
    {
      frontName: "Heladeras",
      singular: "Heladera",
      name: "Fridge",
      id:"rnizejqr2di0okho",
      store: asyncRefrigerator
    }])

  onMounted(  async () => {
    try {
      await devStore.getAll()
      await devStore.getAll()
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
      await devStore.getAll()
    } catch(error){
      console.error(error)
    }
  }

  async function elemCreate (typeId,typeName) {
    if (typeName === undefined || typeName === '') {
      toSnackbar("Por favor ingrese un nombre para el dispositivo")
      snackBar.value = true
    } else {
      try {
        const result = await devStore.add({
          type: {
            id: typeId
          },
          name: typeName,
          meta: {}
        })
        toSnackbar(`Dispositivo ${result.name} añadido correctamente.`)
        snackBar.value = true
        popUp.value = false
        text.value = ''
      } catch (error){
        if (error.code === 1) {
          if(text.value.length < 3){
            toSnackbar("El nombre ingresado debe tener al menos 3 letras")
          } else {
            toSnackbar("No debe ingresar caracteres especiales")
          }
        } else {
          toSnackbar("Dispositivo " + typeName + " ya existe!")
        }
        snackBar.value = true
      }
    }
  }
  function toSnackbar(message){
    snackBarTxt.value = message
    snackBar.value = true
  }
</script>

<style scoped>

.addDevice{
  background-color: #3c8aff;
  color: white;
  position: fixed;
  bottom: 16px;
  right: 16px;
}

.actions {
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 4px;
}

#add-btn {
  align-self: end;
  bottom: 20px;
  right: 20px;
  transition: transform 0.3s;
}
</style>

