<script setup>
import { computed, defineProps, ref } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(['id'])

const devStore = useDeviceStore()
async function get(deviceId){
  try{
    const device = await devStore.get(deviceId)
    console.log(device)
    return device
  } catch(error){
    throw error
  }
}

const speaker = computed(async () => {
  try{
    const result = await get(props.id)
    console.log(result)
    return result
  } catch(error){
    return error
  }
}).value

const expand = ref(false)

const actions = ref([
  {
    name: "Set Volume",
    params: [
      {
        name: "volume",
        type: "number",
        description: "volume level",
        minValue: 0,
        maxValue: 10
      }
    ]
  },
  {
    name: "Play",
    params: []
  },
  {
    name: "Stop",
    params: []
  },
  {
    name: "Pause",
    params: []
  },
  {
    name: "Resume",
    params: []
  },
  {
    name: "Next Song",
    params: []
  },
  {
    name: "Previous Song",
    params: []
  },
  {
    name: "Set Genre",
    params: [
      {
        name: "genre",
        type: "string",
        description: "music genre",
        supportedValues: [
          "classical",
          "country",
          "dance",
          "latina",
          "pop",
          "rock"
        ]
      }
    ]
  },
  {
    name: 'Get Playlist',
    params: []
  }
])
</script>

<template>
<v-container>
  <v-card class="mx-auto" max-width="368">
    <v-card-title>
      {{ speaker }}
    </v-card-title>
    <v-card-text>
      <v-icon icon="mdi-speaker" size="75" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact" prepend-icon="mdi-battery" >
        OFF
      </v-list-item>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-btn v-for="action in actions" id="actions">{{ action.name }}</v-btn>
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
</v-container>
</template>

<style scoped>
#actions {
  margin-right: 7px;
  margin-left: 7px;
}
v-card-title {
  text-align: center;
}

</style>
