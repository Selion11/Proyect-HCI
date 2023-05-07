<template>

  <v-card class="mx-auto" max-width="368">
    <v-card-item>{{name}}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-water" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-btn v-for="action in actions" id="acts" :@click="stat = action.name">{{ action.name }}</v-btn>
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
const name = ref("Roger Waters")
const expand = ref(false)
const actions = ref([{
    name: "TEMP UP"
  },
    {
      name: "TEMP DOWN"
    }
])
</script>

<style scoped>
#acts{
  margin-right: 7px;
  margin-left: 7px;
}
</style>
