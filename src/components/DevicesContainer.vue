<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col v-for="(item, index) in items" :key="index" cols="auto">
        <v-card>
          <v-card-title>{{ item.title }}</v-card-title>
          <v-card-text>{{ item.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DevicesContainer",
  data() {
    return {
      items: [
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
        },
        {
          title: 'Dispositivos 9',
          text: 'Texto del elemento 9'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
