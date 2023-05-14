<template>
  <v-card>
    <v-toolbar color="light-blue-darken-1">
      <v-tabs
        color="orange-lighten-2"
        align-tabs="center"
        center-active
        v-model="selectedTab"
        class="mx-auto"
      >
        <RouterLink to="/" class="links">
          <v-tab :key="1" :value="1">
            Página Principal
          </v-tab>
        </RouterLink>
        <RouterLink to="/devices" class="links">
          <v-tab :key="2" :value="2">
            Dispositivos
          </v-tab>
        </RouterLink>
        <RouterLink to="/routines" class="links">
          <v-tab :key="3" :value="3">
            Rutinas
          </v-tab>
        </RouterLink>
      </v-tabs>
    </v-toolbar>
    <RouterView v-slot="{ Component }">
      <v-window >
        <v-window-item
          v-for="n in 3"
          :key="n"
          :value="n"
        >
          <v-fade-transition>
            <component :is="Component"/>
          </v-fade-transition>
        </v-window-item>
      </v-window>
    </RouterView>
  </v-card>
</template>

<script setup>
  import { RouterView, RouterLink } from 'vue-router'
  import { ref, watchEffect, onMounted } from 'vue'

  // Logic to link the tab selected to its corresponding path (preserves state after reload)
  const selectedTabKey = ref("selectedTab")
  const selectedTab = ref(0)
  watchEffect(() => { localStorage.setItem(selectedTabKey.value, selectedTab.value.toString()) })

  onMounted( () => {
    selectedTab.value = parseInt(localStorage.getItem(selectedTabKey.value)) || 0
  })

</script>

<style scoped>
  .links {
    text-decoration: none;
    color: inherit;
  }
</style>
