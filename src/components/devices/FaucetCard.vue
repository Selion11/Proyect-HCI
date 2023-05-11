<template>

  <v-card class="mx-auto" max-width="368" v-if="!isLoading">
    <v-card-item>{{ faucet.name }}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-water" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-row justify="center">
            <v-btn class="actions" id="acts" :@click="execute(action)">{{ Abrir }}</v-btn>
          </v-row>

        </div>

      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expand = !expand">
        {{ !expand ? 'All Actions' : 'Hide Actions' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"
import { Device } from "@/api/device"

const props = defineProps(["id"])
const faucet = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)

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
#acts{
  margin-right: 7px;
  margin-left: 7px;
}

.actions {
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 4px;
}

</style>
