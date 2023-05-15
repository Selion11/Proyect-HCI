<script setup>
import {defineProps, ref, onMounted, computed, mergeProps, defineEmits} from 'vue'
import { useDeviceStore } from "@/store/deviceStore"

class SpeakerState {
  constructor(status, volume, genre, songStatus, meta){
    this.status = status
    this.volume = volume
    this.genre = genre
    // SongStatus - NOT Song!!
    this.song = songStatus
    this.meta = meta
  }
}

class Song {
  constructor(title, artist, album, duration, progress = 0){
    this.title = title
    this.artist = artist
    this.album = album
    this.duration = duration
    this.progress = progress
  }
}


const props = defineProps(['id'])
const emits = defineEmits(["to-snackbar"])
const editDia = ref(false)
const deviceStore = useDeviceStore()
const status = computed(() => speaker.value["state"].status)
const isStopped = computed( () => speaker.value["state"].status === "stopped")
const currentSong = computed( () => !isStopped.value ? speaker.value["state"].song.title : null)
const songProgress = computed( () => {
  if(!isStopped.value){
    return currentSongProgress.value*100 / turnMinutesToSeconds(speaker.value["state"].song.duration)
  } else{
    return 0
  }
})

const currentSongProgress = ref(0)

const newName = ref('')

const isLoading = ref(true)
const volume = computed( () => speaker.value["state"].volume)
const speaker = computed( () => deviceStore.devices.filter( (device) => device.id === props.id)[0])

const currentVolume = ref(0)
const currentGenre = ref('')
const currentPlaylist = ref([])

const expand = ref(false)

const VOLdialog = ref(false)
const GENdialog = ref(false)
const DELdialog = ref(false)
const PLdialog = ref(false)
const refreshInterval = ref(0)
const songProgressInterval = ref(0)
const speakerEvents = ref(null)
const getGenre = (genre) => {
  switch (genre) {
    case "classical": return "Clásica"
    case "latina": return "Latina"
    case "pop": return "Pop"
    case "rock": return "Rock"
    case "dance": return "Dance"
    case "country": return "Country"
  }
}

function turnMinutesToSeconds(time) {
  const parts = time.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

async function editDevice(){
  const editedDevice = {
    name: newName.value,
    meta: speaker.value["meta"]
  }
  try{
    const result = await deviceStore.modify(speaker.value["id"], editedDevice)
    if(result) {
      newName.value = ''
      editDia.value = false
      emits("to-snackbar", "Nombre modificado.")
    } else{
      emits("to-snackbar", "El nombre ingresado ya existe.")
    }
  } catch(error){
    if(error.code === 1){
      emits("to-snackbar", "No debe ingresar caracteres especiales!")
    }
    else{
      emits("to-snackbar", `Dispositivo ${newName.value} ya existe!`)
    }
  }
}

async function execute(actionName, params= []){
  const result = await deviceStore.execute(props.id, actionName, params)
  if(result){
    return result
  }
  return null
}

onMounted(async () => {
  try{
    speakerEvents.value = deviceStore.getDeviceEvents(props.id)
    speakerEvents.value.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      if(data.event === 'songChanged'){
        const songProgress = new Song(data.args["newSong"].title, data.args["newSong"].artist, data.args["newSong"].album, data.args["newSong"].duration)
        currentSongProgress.value = turnMinutesToSeconds(songProgress.progress)
        const speakerState = new SpeakerState(speaker.value["state"].status, currentVolume.value, speaker.value["state"].genre, songProgress,{})
        deviceStore.updateState(props.id, speakerState)
      }
    }
    currentVolume.value = volume.value
    currentGenre.value = getGenre(speaker.value["state"].genre)
    if(!isStopped.value){
      currentSongProgress.value = turnMinutesToSeconds(speaker.value["state"].song.progress)
    }
    refreshInterval.value = setInterval(refreshState, 7000)
    songProgressInterval.value = setInterval(refreshSongProgress, 1000)
    isLoading.value = false
  } catch(error) {
    console.log(error)
  }
})

function refreshSongProgress(){
  if(speaker.value["state"].status === 'playing'){
    currentSongProgress.value = currentSongProgress.value + 1
  }
}

async function refreshState(){
  try{
    if(speaker.value["state"].volume !== currentVolume.value) {
      await execute("setVolume", [currentVolume.value])
    }
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

async function getPlaylist(){
  PLdialog.value = false
  try{
    currentPlaylist.value = await execute("getPlaylist")
    PLdialog.value = true
  } catch(error){
    console.log(error)
  }
}

async function stop(){
  try{
    await execute("stop")
    currentSongProgress.value = 0
  } catch(error){
    console.log(error)
  }
}

async function nextSong(){
  try{
    await execute("nextSong")
    await execute("play")
    await execute("resume")
    currentSongProgress.value = 0
  } catch(error){
    console.log(error)
  }
}

async function previousSong(){
  try{
    await execute("previousSong")
    await execute("play")
    await execute("resume")
    currentSongProgress.value = 0
  } catch(error){
    console.log(error)
  }
}

async function volumeUp(){
  if(volume.value < 10){
    currentVolume.value = currentVolume.value + 1
  }
}

async function volumeDown(){
  if(volume.value > 0){
    currentVolume.value = currentVolume.value - 1
  }
}

async function removeDevice(){
  try{
    isLoading.value = true
    const returnMessage =  `El dispositivo ${speaker.value["name"]} ha sido eliminado correctamente`
    const result = await deviceStore.remove(props.id)
    if(!result){
      isLoading.value = false
    } else{
      clearInterval(refreshInterval.value)
      clearInterval(songProgressInterval.value)
      emits('to-snackbar', returnMessage)
    }
  } catch(error){
    console.error(error)
  }
}

async function setGenre(genre){
  try{
    await execute("setGenre", [genre])
    await stop()
    const result = await deviceStore.get(props.id)
    currentGenre.value =  getGenre(result["state"].genre)
    GENdialog.value = false
    emits('to-snackbar', `El género ha sido cambiado a ${currentGenre.value}`)
  } catch(error){
    console.log(error)
  }
}
</script>

<template>
<v-container v-if="!isLoading" class="scaled">
  <v-card class="mx-auto" max-width="350">
    <v-menu>
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              class="close"
              v-bind="mergeProps(menu, tooltip)"
              @click="DELdialog = true"
            />
            <v-dialog v-model="DELdialog" width="auto" height="auto">
              <v-card>
                <v-card-title/>
                <v-card-title>
                  ¿Seguro que desea borrar el parlante {{speaker.name}}?
                </v-card-title>
                <v-card-actions>
                  <v-row justify="center">
                    <v-btn variant="text" @click="DELdialog = false">No</v-btn>
                    <v-btn color="red" variant="text" @click="removeDevice()">Sí</v-btn>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <span>Borrar Parlante</span>
        </v-tooltip>
      </template>
    </v-menu>
    <v-card-title/>
    <v-card-title>
      <v-row justify="center" class="text-capitalize">
        {{ speaker.name }}
      </v-row>
    </v-card-title>
    <v-card-text class="centered">
      <v-icon icon="mdi-speaker" size="75" color="blue" />
    </v-card-text>
    <div class="subtitle">
      <v-row justify="center" v-show="status !== 'stopped'">
        <v-card-text class="centered">{{ currentSong }}</v-card-text>
        <v-progress-linear rounded v-model="songProgress" class="music-bar"/>
      </v-row>
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
            <v-row justify="center" v-show="!isStopped">
              <v-btn class="actions"  prepend-icon="mdi-stop" @click="stop()">Detener</v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-music-note">
                Cambiar Género
                <v-dialog v-model="GENdialog" activator="parent" width="auto" height="auto">
                  <v-card>
                    <v-icon icon="mdi-close" color="grey" class="close" @click="GENdialog = false"/>
                    <v-card-title/>
                    <v-card-title justify="center">
                      Seleccione el género de música para el parlante {{speaker.name}}
                    </v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-row columns="2" justify="center" class="actions">
                          <v-list-item>
                            <v-btn variant="outlined" color="blue" class="actions" @click="setGenre('classical')">
                             Clásica
                            </v-btn>
                            <v-btn variant="outlined" color="blue" class="actions" @click="setGenre('country')">
                              Country
                            </v-btn>
                            <v-btn variant="outlined" color="blue" class="actions" @click="setGenre('dance')">
                              Dance
                            </v-btn>
                          </v-list-item>
                        </v-row>
                        <v-row columns="2" justify="center" class="actions">
                          <v-list-item>
                            <v-btn variant="outlined" color="blue" class="actions" @click="setGenre('latina')">
                              Latina
                            </v-btn>
                            <v-btn variant="outlined" color="blue" class="actions" @click="setGenre('pop')">
                              Pop
                            </v-btn>
                            <v-btn variant="outlined" color="blue" class="actions" @click="setGenre('rock')">
                              Rock
                            </v-btn>
                          </v-list-item>
                        </v-row>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-playlist-music" @click="getPlaylist()">
                Obtener Playlist
                <v-dialog v-model="PLdialog" activator="parent" width="auto" height="auto">
                  <v-card class="mx-auto">
                    <v-icon icon="mdi-close" color="grey" class="close" @click="PLdialog = false"/>
                    <v-card-title class="centered">
                      Playlist del género {{ currentGenre }}
                    </v-card-title>
                    <v-container width="100%">
                    <v-col v-for="song in currentPlaylist" :key="song.title" cols="auto" width="80%">
                        <v-card class="song" height="100%">
                          <v-card-title class="centered">
                            <v-icon icon="mdi-music-note"/>
                            {{song.title}}
                          </v-card-title>
                          <v-card-subtitle>
                            <v-icon icon="mdi-account"/>
                            {{song.artist}}
                          </v-card-subtitle>
                          <v-card-text>
                            <v-icon icon="mdi-album"/>
                            {{song.album}}
                            <br>
                            <v-icon icon="mdi-waveform"/>
                            {{song.duration}}
                          </v-card-text>
                        </v-card>
                    </v-col>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-btn>

            </v-row>
            <v-row justify="center">
              <v-btn class="actions" prepend-icon="mdi-volume-high">
                Cambiar Volumen
                <v-dialog v-model="VOLdialog" activator="parent" width="300px" height="auto">
                  <v-card>
                    <v-icon icon="mdi-close" color="grey" class="close" @click="VOLdialog = false"/>
                    <v-card-title/>
                    <v-card-title/>
                    <v-card-text >
                      <v-row>
                        <v-icon icon="mdi-minus" @click="volumeDown()"/>
                        <v-slider max="10" thumb-label min="0" step="1" v-model="currentVolume"/>
                        <v-icon icon="mdi-plus" @click="volumeUp()"/>
                      </v-row>
                      Volumen: {{currentVolume}}
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
      <v-btn block  prepend-icon="mdi-pencil" class="actions">
        Editar <br> Parlante
        <v-dialog v-model="editDia" activator="parent">
          <v-card>
            <v-card-title class="centered">Cambie el nombre de su parlante</v-card-title>
            <v-card-text>
              <v-text-field v-model="newName" type="text" placeholder="Nuevo nombre" variant="outlined"/>
            </v-card-text>
            <v-card-actions>
              <v-col cols="6">
                <v-btn block v-if="newName !== ''" prepend-icon="mdi-content-save-outline" @click="editDevice()">Cambiar nombre</v-btn>
                <v-btn block v-else disabled prepend-icon="mdi-content-save-outline">Cambiar nombre</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block prepend-icon="mdi-close" @click="editDia = false">Cerrar</v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-btn v-if="!expand" @click="expand = !expand" block class="actions">
            Más <br> Acciones
          </v-btn>
          <v-btn v-else-if="expand" @click="expand = !expand" block class="actions">
            Ocultar <br> Acciones
          </v-btn>
        </v-row>
      </v-col>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<style scoped>
.centered{
  text-align: center;
}

.music-bar{
  margin-right: 48px;
  margin-left: 2px;
  margin-bottom: 12px;
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


v-card-title {
  text-align: center;
}

.close{
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 0;
}

.song{
  text-align: center;
  margin-bottom: 6px;
  margin-top: 6px;
}

</style>
