<template>
  <v-card>
    <v-tabs
      class="my-tabs"
      color="deep-purple-accent-4"
      align-tabs="center"
    >
      <RouterLink to="/">
        <v-tab :value="1">Página Principal</v-tab>
      </RouterLink>
      <RouterLink to="/devices">
        <v-tab :value="2">Dispositivos</v-tab>
      </RouterLink>
      <RouterLink to="/routines">
        <v-tab :value="3">Rutinas</v-tab>
      </RouterLink>
    </v-tabs>

    <RouterView v-slot="{ Component }">
      <v-window class="my-window">
        <v-window-item
          v-for="n in 3"
          :key="n"
          :value="n"
        >
            <transition>
              <component :is="Component" />
            </transition>
        </v-window-item>
      </v-window>
    </RouterView>
  </v-card>
</template>

<script setup>
  import { RouterView, RouterLink } from 'vue-router'
</script>

<style>

</style>
