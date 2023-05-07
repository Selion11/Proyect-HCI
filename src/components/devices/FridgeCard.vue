<template>

  <v-card class="mx-auto" max-width="368">
    <v-card-item>{{name}}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-fridge" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Current temp: {{temp}}</v-list-item-subtitle>

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
</template>
<script>
export default{
  data: () => ({
    name: "Fridgy Refrigerator",
    temp: "08 C",
    expand: false,
    actions: [{
      name: "TEMP UP"
    },
      {
        name: "TEMP DOWN"
      }
    ]
  }),
}
</script>



<style scoped>
#actions{
  margin-right: 7px;
  margin-left: 7px;
}

</style>
