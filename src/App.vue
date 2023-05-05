<template>
  <v-card>
    <v-tabs
      color="deep-purple-accent-4"
      align-tabs="center"
      center-active
      v-model="selectedTab"
    >
      <RouterLink to="/">
        <v-tab :key="1">Página Principal</v-tab>
      </RouterLink>
      <RouterLink to="/devices">
        <v-tab :key="2">Dispositivos</v-tab>
      </RouterLink>
      <RouterLink to="/routines">
        <v-tab :key="3">Rutinas</v-tab>
      </RouterLink>
    </v-tabs>

    <RouterView v-slot="{ Component }">
      <v-window>
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
  import {RouterView, RouterLink, useRouter, useRoute} from 'vue-router'
  import { computed, ref, watchEffect } from 'vue'

  const selectedTabKey = "selectedTab"

  const selectedTab = ref(parseInt(localStorage.getItem(selectedTabKey)) || 0 )
  const tabs = ref(["Tab 1", "Tab 2", "Tab 3"])

  watchEffect(() => { localStorage.setItem(selectedTabKey, selectedTab.value.toString()) })
</script>
<style>

</style>
