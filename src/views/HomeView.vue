<template>
  <div>
    <v-container>
    <RecentContainer/>
    </v-container>
  </div>

</template>


<script setup>
import RecentContainer from "@/components/RecentContainer.vue";

const drawer = ref(false)
import { ref } from 'vue'
const routineItems = ref([
                  {
                    title: 'Rutina 1',
                    text: 'Texto del elemento 1'
                  },
                  {
                    title: 'Rutina 2',
                    text: 'Texto del elemento 2'
                  },
                  {
                    title: 'Rutina 3',
                    text: 'Texto del elemento 3'
                  },
                  {
                    title: 'Rutina 4',
                    text: 'Texto del elemento 4'
                  },
                  {
                    title: 'Rutina 5',
                    text: 'Texto del elemento 5'
                  },
                  {
                    title: 'Rutina 6',
                    text: 'Texto del elemento 6'
                  },
                  {
                    title: 'Rutina 7',
                    text: 'Texto del elemento 7'
                  },
                  {
                    title: 'Rutina 8',
                    text: 'Texto del elemento 8'
                  }
                ])
const deviceItems = ref([
                  {
                    title: 'Dispositivos 1',
                    text: 'Texto del elemento 1'
                  },
                  {
                    title: 'Dispositivos 2',
                    text: 'Texto del elemento 2'
                  },
                  {
                    title: 'Dispositivos 3',
                    text: 'Texto del elemento 3'
                  },
                  {
                    title: 'Dispositivos 4',
                    text: 'Texto del elemento 4'
                  },
                  {
                    title: 'Dispositivos 5',
                    text: 'Texto del elemento 5'
                  },
                  {
                    title: 'Dispositivos 6',
                    text: 'Texto del elemento 6'
                  },
                  {
                    title: 'Dispositivos 7',
                    text: 'Texto del elemento 7'
                  },
                  {
                    title: 'Dispositivos 8',
                    text: 'Texto del elemento 8'
                  }
                ])
</script>

<style>
  h1 {
    padding-left: 10px;
  }


</style>
