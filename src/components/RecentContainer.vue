<script setup>
import FaucetCard from "@/components/devices/FaucetCard.vue";
import {useDeviceStore} from "@/store/deviceStore";
import {computed} from "vue";
import SpeakerCard from "@/components/devices/SpeakerCard.vue";
import LampCard from "@/components/devices/LampCard.vue";
import ACCard from "@/components/devices/ACCard.vue";
const devStore = useDeviceStore()
const recents = computed(() => devStore.mostRecentDevices)
</script>

<template>
  <v-row justify="start">
    <v-col cols="6">
      <v-card class="spacing" height="400px" >
        <v-card-title class="centered">Recent Devices</v-card-title>
          <v-carousel progress="primary" hide-delimiters show-arrows="hover" v-for="dev in recents">
              <v-carousel-item v-if="dev.type.id.toString() === 'dbrlsh7o5sn8ur4i'" cover>
                <FaucetCard :id="dev.id"/>
              </v-carousel-item>
              <v-carousel-item v-else-if="dev.type.name === 'speaker'" cover>
                <SpeakerCard :id="dev.id"/>
              </v-carousel-item>
              <v-carousel-item v-else-if="dev.type.name === 'lamp'" cover>
                <LampCard :id="dev.id"/>
              </v-carousel-item>
            <v-carousel-item v-else-if="dev.type.name === 'ac'" cover>
              <ACCard :id="dev.id"/>
            </v-carousel-item>
            <v-carousel-item v-else>
              <SpeakerCard :id="dev.id" />
            </v-carousel-item>
          </v-carousel>
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
