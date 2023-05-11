<template>
  <v-container v-if="!isLoading">
    <v-card class="mx-auto" max-width="368">
      <v-card-title>
        <v-row justify="center">
          {{ refrigerator.name }}
        </v-row>
        <v-row justify="end">
          <v-btn icon="mdi-delete" variant="text" color="error"/>
        </v-row>
      </v-card-title>
      <v-card-text class="centered">
      <v-icon icon="mdi-fridge" size="75" color="blue"/>
      </v-card-text>

    <div class="subtitle">
      <v-row>
        <v-col cols="12">
        <v-card-subtitle >Current temp: {{ refrigerator.state.temperature }} </v-card-subtitle>
        </v-col>
      </v-row>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-container>
            <v-row justify="center">
              <v-btn class="actions">Set Temperature
                <v-dialog v-model="tempDialog" activator="parent" width="400px" height="auto">
                  <v-card>
                    <v-card-text >
                      <v-row justify="center">
                        <v-list-item-subtitle>Temperatura del freezer </v-list-item-subtitle>
                      </v-row>
                      <v-row justify="center">
                        <v-icon icon="mdi-minus" @click="dummyF - 1"/>
                        <v-slider min="-20" max="-8" thumb-label step="1" v-model="dummyF"/>
                        <v-icon icon="mdi-plus" @click="dummyF + 1"/>
                      </v-row>
                      <v-row justify="center">
                        <v-list-item-subtitle>Temperatura de la heladera </v-list-item-subtitle>
                      </v-row>
                        <v-row justify="center">
                        <v-icon icon="mdi-minus" @click="dummyHela - 1"/>
                        <v-slider max="8" thumb-label min="2" step="1" v-model="dummyHela"/>
                        <v-icon icon="mdi-plus" @click="dummyHela + 1"/>
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
                    <v-list-item title="Default" @click=""/>
                    <v-list-item title="Vacation" @click="" />
                    <v-list-item title="Party" @click="" />
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
      <v-col cols="6">
        <v-row>
          <v-btn block prepend-icon="mdi-pencil" class="action">
            Edit Device
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-btn  @click="expand = !expand" block class="action">
          {{ !expand ? 'All Actions' : 'Hide Actions' }}
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"
const dummyF = ref(-4)
const dummyHela = ref(-2)
const props = defineProps(["id"])
const refrigerator = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)
const tempDialog = ref(false)

async function execute(action){
  let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
  if(result){
    refrigerator.value = await deviceStore.get(props.id)
  } else {
    console.error(result)
  }
}

onMounted( async () => {
  try{
    refrigerator.value = await deviceStore.get(props.id)
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
  refrigerator.value = await deviceStore.get(props.id)
}
const actions = ref([
  {
    name: "Set Freezer Temperature",
    params: [
      {
        name: "temperature",
        type: "number",
        description: "temperature in centigrades",
        minValue: -20,
        maxValue: -8,
      }
    ]
  },
  {
    name: "Set Temperature",
    params: [
      {
        name: "temperature",
        type: "number",
        description: "temperature in centigrades",
        minValue: 2,
        maxValue: 8
      }
    ]
  },
  {
    name: "Set Mode",
    params: [
      {
        name: "mode",
        type: "string",
        description: "mode",
        supportedValues: [
          "default",
          "vacation",
          "party"
        ]
      }
    ]
  }
])

</script>



<style scoped>
.actions{
  margin-right: 8px;
  margin-left: 7px;
  margin-bottom: 7px;
}

.centered{
  text-align: center;
}

</style>
