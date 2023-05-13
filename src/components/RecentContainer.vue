<script setup>
import FaucetCard from "@/components/devices/FaucetCard.vue";
</script>

<template>
  <v-row justify="start">
    <v-col cols="6">
      <v-card class="spacing" height="400px" >
        <v-card-title class="centered">Recent Devices</v-card-title>
          <v-carousel
            progress="primary"
            hide-delimiters show-arrows="hover">
              <v-carousel-item cover>

              </v-carousel-item>

              <v-carousel-item
      cover
    >

              <v-carousel-item
      cover
    >  </v-carousel-item>
          </v-carousel>


      </v-card>
      <v-row justify="center">
      <v-btn variant="outlined" color="info" class="centered" href="/devices">
        Ver todos los dispositivos!
      </v-btn>
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
