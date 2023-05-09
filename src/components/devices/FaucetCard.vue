<template>

  <v-card class="mx-auto" max-width="368" v-if="!isLoading">
    <v-card-item>{{device.name}}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-water" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-btn v-for="action in actions" id="acts" :@click="execute(action)">{{ action.name }}</v-btn>
        </div>

      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expand.value = !expand">
        {{ !expand ? 'All Actions' : 'Hide Actions' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(["id"])
const device = ref({})
const deviceStore = useDeviceStore()
const isLoading = ref(true)
const expand = ref(false)

async function execute(action){
  try{
    // Acá tenés que armar el objeto en función la action que estás mandando, ya se manda bien
    const actionParam = action.param

    let result = await deviceStore.execute(props.id, action.realName, {params: actionParam})
    if(result){
      device.value = await deviceStore.get(props.id)
    } else {
      console.error(result)
    }
  } catch(error){
    console.log(error)
  }
}

onMounted( async () => {
  try{
    device.value = await deviceStore.get(props.id)
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
})


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
</style>
