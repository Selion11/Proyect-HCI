<script setup>
import { defineProps, ref, onMounted, computed } from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

const props = defineProps(['id'])

const deviceStore = useDeviceStore()

const status = computed(() => speaker.value.state.status)

const isLoading = ref(true)
const volume = computed( () => speaker.value.state.volume)
const speaker = ref({})

const currentVolume = ref(0)

const expand = ref(false)

const VOLdialog = ref(false)
const GENdialiog = ref(false)

async function execute(actionName, params= []){
  let result = await deviceStore.execute(props.id, actionName, params)
  if(result){
    speaker.value = await deviceStore.get(props.id)
  }
}

onMounted(async () => {
  try{
    speaker.value = await deviceStore.get(props.id)
    currentVolume.value = volume.value
    isLoading.value = false
  } catch(error){
    throw error
  }
  try{
    setInterval(refreshState, 1000)
  } catch(error){
    throw error
  }
})
async function refreshState(){
  try{
    await execute("setVolume", [currentVolume.value])
    speaker.value = await deviceStore.get(props.id)
  } catch(error){
    console.log(error)
  }
}
async function playPause(){
  if(status.value === "playing"){
    try{
      await execute("pause")
    } catch(error){
      console.log(error)
    }
  } else{
    if(status.value === "stopped"){
      try{
        await execute("play")
      } catch(error){
        console.log(error)
      }
    } else{
      try{
        await execute("resume")
      } catch(error){
        console.log(error)
      }
    }
  }
}

async function stop(){
  try{
    await execute("stop")
  } catch(error){
    console.log(error)
  }
}

async function nextSong(){
  try{
    await execute("nextSong")
    await execute("play")
    await execute("resume")
  } catch(error){
    console.log(error)
  }
}

async function previousSong(){
  try{
    await execute("previousSong")
    await execute("play")
    await execute("resume")
  } catch(error){
    console.log(error)
  }
}

async function volumeUp(){
  if(volume.value < 10){
    currentVolume.value = currentVolume.value + 1
  } else{
    // Handle error
  }
}

async function volumeDown(){
  if(volume.value > 0){
    currentVolume.value = currentVolume.value - 1
  } else{
    // Handle error
  }
}

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


</script>

<template>
<v-container v-if="!isLoading">
  <v-card class="mx-auto" max-width="368">
      <v-card-title>
        <v-row justify="center">
        {{ speaker.name }}
        </v-row>
        <v-row justify="end">
          <v-btn icon="mdi-delete" variant="text" color="error"/>
        </v-row>
      </v-card-title>
    <v-card-text class="centered">
      <v-icon icon="mdi-speaker" size="75" color="blue" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-row class="music" justify="center">
         <v-btn width="flex" class="mbtn" prepend-icon="mdi-skip-previous" @click="previousSong()"/>
          <v-btn width="flex" @click="playPause()" max-width="30px">
            <v-icon v-if="status !== 'playing'" icon="mdi-play"/>
            <v-icon v-else icon="mdi-pause"/>
          </v-btn>
       <v-btn width="flex" class="mbtn" prepend-icon="mdi-skip-next" @click="nextSong()"/>
      </v-row>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-container>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-stop" @click="stop()">Stop</v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-music-note">
                Set Genre
                <v-dialog v-model="GENdialiog" activator="parent" width="auto" height="auto">
                  <v-card>
                    <v-card-title>
                      Elegi el genero de musica para el speaker {{speaker.name}}
                    </v-card-title>
                    <v-card-text>
                      <v-list></v-list>
                      <v-list-item>
                        <v-btn variant="outlined" color="blue">
                         Classical
                        </v-btn>
                      </v-list-item>
                      <v-list-item>
                        <v-btn variant="outlined" color="blue">
                          Country
                        </v-btn>
                      </v-list-item>
                      <v-list-item>
                        <v-btn variant="outlined" color="blue">
                          Dance
                        </v-btn>
                      </v-list-item>
                      <v-list-item>
                        <v-btn variant="outlined" color="blue">
                          Latina
                        </v-btn>
                      </v-list-item>
                      <v-list-item>
                        <v-btn variant="outlined" color="blue">
                          Pop
                        </v-btn>
                      </v-list-item>
                      <v-list-item>
                        <v-btn variant="outlined" color="blue">
                          Rock
                        </v-btn>
                      </v-list-item>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-playlist-music">Get Playlist</v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-volume-high">
                Set Volume
                <v-dialog v-model="VOLdialog" activator="parent" width="300px" height="auto">
                  <v-card>
                    <v-card-text >
                      <v-row>
                        <v-icon icon="mdi-minus" @click="volumeDown()"/>
                        <v-slider max="10" thumb-label min="0" step="1" v-model="currentVolume"/>
                        <v-icon icon="mdi-plus" @click="volumeUp()"/>
                      </v-row>
                      Volume: {{currentVolume}}
                    </v-card-text>
                  </v-card>
                </v-dialog>
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

<style scoped>
.centered{
  text-align: center;
}


.actions {
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 4px;
}
.mbtn {
  margin-right: 4px;
  margin-left: 4px;
}
.music{
  margin: 7px 5px;
}
.actions{
}

.actions{
  margin-left: 8px;
}

v-card-title {
  text-align: center;
}

</style>
