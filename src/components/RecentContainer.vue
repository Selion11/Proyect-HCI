<script setup>
import FaucetCard from "@/components/devices/FaucetCard.vue";
</script>

<template>
  <v-row justify="start">
    <v-col cols="6">
      <v-card height="400px" >
        <v-card-title>Recent Devices</v-card-title>
          <v-carousel
            progress="primary"
            hide-delimiters show-arrows="hover">
              <v-carousel-item cover>
                <FaucetCard :id="'30f9776999d1f417'"/>
              </v-carousel-item>

              <v-carousel-item
      cover
    >  <FaucetCard :id="'30f9776999d1f417'"/> </v-carousel-item>

              <v-carousel-item
      cover
    >  <FaucetCard :id="'30f9776999d1f417'"/> </v-carousel-item>
          </v-carousel>


      </v-card>

      <v-btn href="/devices">
        Ver todos los dispositivos!
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
