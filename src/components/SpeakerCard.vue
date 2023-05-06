<script setup>
export default{
  data: () => ({
    name: "Speaker 1",
    expand: false,
    actions: [
      {
        name: "Turn On"
      },
      {
        name: "Turn Off"
      }
    ]
  }),
}

</script>

<template>
<v-container>
  <v-card class="mx-auto" max-width="368">
    <v-card-item title="Speaker"/>
    <v-card-text>
      <v-icon icon="mdi-speaker" size="75" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact" prepend-icon="mdi-battery" >
        <v-list-item-subtitle>50%</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-btn v-for="action in actions" id="actions">{{ action.name }}</v-btn>
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
</v-container>
</template>

<style scoped>
#actions{
  margin-right: 7px;
  margin-left: 7px;
}

</style>
