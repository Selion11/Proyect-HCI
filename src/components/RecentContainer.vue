<script setup>
import FaucetCard from "@/components/devices/FaucetCard.vue";
import {useDeviceStore} from "@/store/deviceStore";
import {computed, ref} from "vue";
import SpeakerCard from "@/components/devices/SpeakerCard.vue";
import LampCard from "@/components/devices/LampCard.vue";
import ACCard from "@/components/devices/ACCard.vue";
const devStore = useDeviceStore()
const devices = computed( () => devStore.devices)
const mostRecentDevices = computed(() => devStore.mostRecentDevices)

const devicesTypes = ref({
  speaker: {
    id: "c89b94e8581855bc"
  },
  faucet: {
    id: "dbrlsh7o5sn8ur4i"
  },
  lamp: {
    id: "go46xmbqeomjrsjr"
  },
  ac: {
    id: "li6cbv5sdlatti0j"
  },
  refrigerator: {
    id: "rnizejqr2di0okho"
  }})
</script>

<template>
  <v-row justify="start">
    <v-col cols="6">
      <v-card class="overflow-auto spacing" height="400px">
        <v-card-title class="centered">Recent Devices</v-card-title>
          <v-list  progress="primary" hide-delimiters show-arrows="hover" v-for="deviceID in mostRecentDevices.reverse()">
              <v-list-item v-if="devices.filter((device) => device.id === deviceID)[0].type.id === devicesTypes.faucet.id" cover>
                <FaucetCard :id="deviceID"/>
              </v-list-item>
              <v-list-item v-else-if="devices.filter((device) => device.id === deviceID)[0].type.id === devicesTypes.speaker.id" cover>
                <SpeakerCard :id="deviceID"/>
              </v-list-item>
              <v-list-item v-else-if="devices.filter((device) => device.id === deviceID)[0].type.id === devicesTypes.lamp.id" cover>
                <LampCard :id="deviceID"/>
              </v-list-item>
            <v-list-item v-else-if="devices.filter((device) => device.id === deviceID)[0].type.id === devicesTypes.ac.id" cover>
              <ACCard :id="deviceID"/>
            </v-list-item>
            <v-list-item v-else>
              <SpeakerCard :id="deviceID" />
            </v-list-item>
          </v-list>
      </v-card>
      <v-row justify="center">
        <RouterLink to="/devices">
          <v-btn variant="outlined" color="info" class="centered">
            Ver todos los dispositivos!
          </v-btn>
        </RouterLink>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>
.spacing{
  margin-bottom: 20px;
  justify-content: center;
}

.centered{
  text-align: center;
}

</style>
