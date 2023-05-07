<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col v-for="(item, index) in items" :key="index" cols="6">
        <v-card>
          <v-card-title>{{ item.title }}</v-card-title>
          <v-card-text>{{ item.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const items = ref( [
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
  },
  {
    title: 'Rutina 9',
    text: 'Texto del elemento 9'
  },
  {
    title: 'Rutina 10',
    text: 'Texto del elemento 1'
  },
  {
    title: 'Rutina 11',
    text: 'Texto del elemento 2'
  },
  {
    title: 'Rutina 12',
    text: 'Texto del elemento 3'
  },
  {
    title: 'Rutina 13',
    text: 'Texto del elemento 4'
  },
  {
    title: 'Rutina 14',
    text: 'Texto del elemento 5'
  },
  {
    title: 'Rutina 15',
    text: 'Texto del elemento 6'
  },
  {
    title: 'Rutina 16',
    text: 'Texto del elemento 7'
  },
  {
    title: 'Rutina 17',
    text: 'Texto del elemento 8'
  },
  {
    title: 'Rutina 18',
    text: 'Texto del elemento 9'
  }
])
</script>

<style scoped>

</style>
