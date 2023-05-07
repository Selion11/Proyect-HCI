<template>

  <v-card class="mx-auto" max-width="368">
    <v-card-item>{{name}}</v-card-item>
    <v-card-text>
      <v-icon v-if="stat === 'OFF'" icon="mdi-lightbulb-outline" size="55" color="error" class="me-1 pb-1"></v-icon>
      <v-icon v-else-if="stat === 'ON'" icon="mdi-lightbulb" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Status: {{stat}}</v-list-item-subtitle>
      </v-list-item>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-col>
            <v-btn v-for="action in actions" id="acts" @click="stat = action.name">{{ action.name }}</v-btn></v-col>
        </div>

      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expand = !expand">
        {{ !expand ? 'All Actions' : 'Hide Actions' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps(['name','stat'])
const expand = ref(false)

const actions = ref( [
  {
    name: "ON",
    params: []
  },
  {
    name: "OFF",
    params: []
  },
  {
    name: "Set Color",
    params: [
      {
        name: "color",
        type: "string",
        description: "new RGB color",
        minValue: "000000",
        maxValue: "FFFFFF",
      }
    ],
  },
  {
    name: "Set Brightness",
    params: [
      {
        name: "brightness",
        type: "integer",
        description: "new brightness",
        minValue: 0,
        maxValue: 100,

      }
    ],
  }
])
</script>



<style scoped>
#acts{
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 7px;
}

</style>
