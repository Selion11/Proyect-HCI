<template>
  <v-card>

    <v-toolbar color="light-blue-darken-1">

        <RouterLink to="/">
          <v-icon size="57" class="links" color="white" icon="mdi-home-automation"/>
        </RouterLink>
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
    <div class="fill-height">
    <RouterView v-slot="{ Component }">
      <v-window>
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
    </div>
  </v-card>
</template>

<script setup>
  import { RouterView, RouterLink } from 'vue-router'
  import { ref } from 'vue'

  const getTab = () => {
    switch(window.location.pathname){
      case '/': return 1
      case '/devices': return 2
      case '/routines': return 3
    }
  }

  const selectedTab = ref(getTab())

</script>

<style scoped>
  .links {
    text-decoration: none;
    color: inherit;
  }
</style>
