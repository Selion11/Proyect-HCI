<script setup>
import { computed, defineProps, ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(['id'])

const devStore = useDeviceStore()
async function get(deviceId){
  try{
    return await devStore.get(deviceId)
  } catch(error){
    throw error
  }
}
const isLoading = ref(false)

const speaker = ref(null)

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

onMounted(async () => {
  try{
    speaker.value = await get(props.id)
    isLoading.value = true
  } catch(error){
    throw error
  }
})

</script>

<template>
<v-container>
  <v-card class="mx-auto" max-width="368">
    <div v-if="isLoading">
      <v-card-title>
        {{ speaker.name }}
      </v-card-title>
    </div>
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
