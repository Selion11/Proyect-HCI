<template>
  <div>
    <v-row align="center" class="full-screen">
        <v-col cols="6" class="align-top">
          <v-card>
            <h1>Recent Devices</h1>
            <v-container>
              <v-row justify="center" align="center">
                <v-col v-for="(item, index) in deviceItems" :key="index" cols="auto">
                  <v-card>
                    <v-card-title>{{ item.title }}</v-card-title>
                    <v-card-text>{{ item.text }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="6" class="align-top">
          <v-card>
            <h1>Recent Routines</h1>
            <v-container>
              <v-row justify="center" align="center">
                <v-col v-for="(item, index) in routineItems" :key="index" cols="6">
                  <v-card>
                    <v-card-title>{{ item.title }}</v-card-title>
                    <v-card-text>{{ item.text }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
    </v-row>
  </div>

</template>


<script setup>
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
  .full-screen {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .align-top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 20px;
  }
  h1 {
    padding-left: 10px;
  }


</style>
