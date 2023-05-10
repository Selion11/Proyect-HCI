<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"
import { Device } from "@/api/device"

const props = defineProps(['id'])

const devStore = useDeviceStore()

const play = ref(false)
async function get(deviceId){
  try{
    return await devStore.get(deviceId)
  } catch(error){
    throw error
  }
}
const isLoading = ref(false)
const volume = ref(50)
const speaker = ref(null)

const expand = ref(false)

const dialog = ref(false)

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
    ],
    icon: "mdi-volume-high"
  },
  {
    name: "Play",
    params: [],
    icon: "mdi-play"
  },
  {
    name: "Stop",
    params: [],
    icon: "mdi-stop"
  },
  {
    name: "Pause",
    params: [],
    icon: "mdi-pause"
  },
  {
    name: "Resume",
    params: [],
    icon: "mdi-play"
  },
  {
    name: "Next Song",
    params: [],
    icon: "mdi-skip-next"
  },
  {
    name: "Previous Song",
    params: [],
    icon: "mdi-skip-previous"
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
    ],
    icon: "mdi-music-note"
  },
  {
    name: 'Get Playlist',
    params: [],
    icon: "mdi-playlist-music"
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
      <v-list-item class="status" density="compact" prepend-icon="mdi-battery" >
        OFF
      </v-list-item>
      <v-row class="music">
         <v-btn class="mbtn" prepend-icon="mdi-skip-previous">Previous</v-btn>
          <v-btn @click="play = !play" max-width="30px">
            <v-icon v-if="play === false" icon="mdi-play"/>
            <v-icon v-else icon="mdi-pause"/>
          </v-btn>
       <v-btn class="mbtn" prepend-icon="mdi-skip-next">Next</v-btn>
      </v-row>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-container>
            <v-btn class="actions" prepend-icon="mdi-stop">Stop</v-btn>
            <v-btn class="actions" prepend-icon="mdi-play">Resume</v-btn>
            <v-btn class="actions" prepend-icon="mdi-music-note">Set Genre</v-btn>
            <v-btn class="actions" prepend-icon="mdi-playlist-music">Get Playlist</v-btn>
            <v-btn class="actions" prepend-icon="mdi-volume-high">
              Set Volume
              <v-dialog v-model="dialog" activator="parent" width="300px" height="auto">
                <v-card>
                  <v-card-text >
                    <v-row>
                    <v-icon icon="mdi-plus" @click="volume = volume+1"/>
                    <v-slider max="100" min="0" step="1" v-model="volume"></v-slider>
                      <v-icon icon="mdi-minus" @click="volume = volume-1"/>
                    </v-row>
                    Volume: {{volume}}
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-btn>
          </v-container>
        </div>

      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn block @click="expand = !expand">
        {{ !expand ? 'All Actions' : 'Hide Actions' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<style scoped>
.actions {
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 4px;
}
.mbtn{
  margin-right: 4px;
  margin-left: 4px;
}
.music{
  margin: 7px 5px;
}
.status{
  margin-bottom: 4px;
}
v-card-title {
  text-align: center;
}

</style>
