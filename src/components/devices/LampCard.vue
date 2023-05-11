<template>
  <v-container>
  <v-card class="mx-auto" max-width="368" v-if="!isLoading">
    <v-card-title>
      <v-row justify="center">
        {{ lamp.name }}
      </v-row>
      <v-row justify="end">
        <v-btn icon="mdi-delete" variant="text" color="error"/>
      </v-row>
    </v-card-title>
    <v-card-text class="centered">
      <v-row justify="center">
        <v-icon icon="mdi-lightbulb" v-if="isOn" size="75" color="warning" />
      <v-icon icon="mdi-lightbulb-outline" v-else size="75" color="error" />
      </v-row>
    </v-card-text>



    <div class="subtitle">
      <v-row justify="center">
          <v-list-item density="compact">
            <v-list-item-subtitle>Status: {{ isOn? 'ON' : 'OFF'}}</v-list-item-subtitle>
          </v-list-item>
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
              Color
              <v-dialog v-model="colorDia" width="450px" height="500px" activator="parent">
                <v-card>
                  <v-card-text>
                  <v-row justify="center">
                  <v-list-item>
                    <v-color-picker v-model="color" hide-inputs></v-color-picker>
                  </v-list-item>
                  </v-row>
                    <v-divider/>
                  <v-list-item>
                    <v-row justify="center">
                      <v-col cols="12">
                      <v-btn class ="actions" block @click="colorDia = false" prepend-icon="mdi-close">Close</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn class="actions">
              Brillo
              <v-dialog activator="parent" v-model="brightDia" width="300px" height="500px">
                <v-card>
                  <v-card-text>
                    <v-row justify="center">
                        <v-icon icon="mdi-minus" @click="()=>{brightness+1}"/>
                        <v-slider max="100" min="0" step="1" v-model="brightness"/>
                        <v-icon icon="mdi-plus" @click="()=>{brightness-1}"/>
                    </v-row>
                    Brillo: {{brightness}}
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
          <v-btn block prepend-icon="mdi-pencil" class="action">
            Edit Device
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-btn  @click="expand = !expand" block class="actions">
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

const props = defineProps(["id"])
const lamp = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)
const isOn = ref(false)
const colorDia = ref(false)
const color = ref('#ff00ff')
const brightDia = ref(false)
const brightness = ref(0)

async function execute(action){
  let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
  if(result){
    lamp.value = await deviceStore.get(props.id)
  } else {
    console.error(result)
  }
}

onMounted( async () => {
  try{
    lamp.value = await deviceStore.get(props.id)
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
  lamp.value = await deviceStore.get(props.id)
}

const actions = ref( [
  {
    name: "ON",
    realName: "turnOn",
    params: []
  },
  {
    name: "OFF",
    realName: "turnOff",
    params: []
  },
  {
    name: "Set Color",
    params: [
      {
        name: "color",
        type: "string",
        description: "new RGB color",
        minValue: "000000",
        maxValue: "FFFFFF",
      }
    ],
  },
  {
    name: "Set Brightness",
    params: [
      {
        name: "brightness",
        type: "integer",
        description: "new brightness",
        minValue: 0,
        maxValue: 100,

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
