<template>
  <v-container v-if="!isLoading">
  <v-card class="mx-auto" max-width="368">
    <v-card-title>
      <v-row justify="center">
        {{ faucet.name }}
      </v-row>
      <v-row justify="end">
        <v-btn icon="mdi-delete" variant="text" color="error"/>
      </v-row>
    </v-card-title>
    <v-card-text class="centered">
      <v-icon v-if="!isOn" icon="mdi-water-outline" size="75" color="info"/>
      <v-icon v-else icon="mdi-water" size="75" color="info" />
    </v-card-text>
    <div class="subtitle">
      <v-row justify="center">
        <v-card-subtitle v-if="isOn"> Unidades: {{unit}}</v-card-subtitle>
        <v-card-subtitle v-else>Apagado</v-card-subtitle>
      </v-row>
      <v-row class="switch" justify="start">
        <v-col cols="3">
          <v-switch v-model="isOn" width="flex"  @click="isOn = !isOn"/>
        </v-col>
      </v-row>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-row justify="center">
            <v-btn class="actions">
            Dispensar
            <v-dialog activator="parent" v-model="disDia" width="500px" height="auto">
              <v-card>
                <v-card-text>
                  <v-row justify="center">
                      <v-col cols="12">
                        <v-text-field hint="Min:0 ~ Max:100" type="text" placeholder="Text" v-model="text" label="Cantidad a dispensar" variant="outlined"/>
                      </v-col>
                    </v-row>
                  <v-row justify="center">
                    <v-col cols="12">
                      <v-btn block class="actions" @click="disDia = false">
                        OK
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn  class="actions">
              Unidad
              <v-menu activator="parent">
                <v-list>
                  <v-list-item title="ml" @click="unit = 'ml'"/>
                  <v-list-item title="cl" @click="unit = 'cl'"/>
                  <v-list-item title="dl" @click="unit = 'dl'"/>
                  <v-list-item title="l" @click="unit = 'l'"/>
                  <v-list-item title="dal" @click="unit = 'dal'"/>
                  <v-list-item title="hl" @click="unit = 'hl'"/>
                  <v-list-item title="kl" @click="unit = 'kl'"/>
                </v-list>
              </v-menu>
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
            Edit Device
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-btn v-if="isOn" @click="expand = !expand" block class="actions">
          {{ !expand ? 'All Actions' : 'Hide Actions' }}
        </v-btn>
        <v-btn disabled v-else>
          All Actions
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(["id"])
const faucet = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)
const isOn = ref(false)
const text = ref()
const unit = ref()

async function execute(action){
  let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
  if(result){
    faucet.value = await deviceStore.get(props.id)
  } else {
    console.error(result)
  }
}

onMounted( async () => {
  try{
    faucet.value = await deviceStore.get(props.id)
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
  try{
    setInterval(refreshState, 1000)
  } catch(error){
    console.log(error)
  }
})

async function refreshState(){
  faucet.value = await deviceStore.get(props.id)
}

const disDia = ref(false)
const actions = ref([
    {
      name: "Open",
      params: []
    },
    {
      name: "Close",
      params: []
    },
    {
      name: "Dispense",
      params: [
        {
          name: "quantity",
          type: "number",
          description: "quantity",
          minValue: 1,
          maxValue: 100
        },
        {
          name: "unit",
          type: "string",
          description: "unit",
          supportedValues: [
            "ml",
            "cl",
            "dl",
            "l",
            "dal",
            "hl",
            "kl"
          ]
        }
      ],
    }
])
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
.switch{
  margin-left: 7px;
}
</style>
