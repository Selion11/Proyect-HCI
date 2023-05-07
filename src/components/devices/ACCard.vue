<template>
  <v-card class="mx-auto" max-width="368">
    <v-card-item>{{name}}</v-card-item>
    <v-card-text>
      <v-icon icon="mdi-air-conditioner" size="55" color="error" class="me-1 pb-1"></v-icon>
    </v-card-text>



    <div class="subtitle">
      <v-list-item density="compact">
        <v-list-item-subtitle>Location: {{area}}</v-list-item-subtitle>
        <v-list-item-subtitle>Status: {{stat}}</v-list-item-subtitle>
      </v-list-item>
    </div>


    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-btn v-for="action in actions" id="acts" @click="stat = action.name">{{ action.name }}</v-btn>
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
    name: "AIRE ACONDICIONADO",
    area: "Kitchen",
    stat: "OFF",
    expand: false,
    actions: [{
      name: "ON"
    },
      {
        name: "OFF"
      }
    ]
  }),
}
</script>



<style scoped>
#acts{
  margin-right: 7px;
  margin-left: 7px;
}

</style>
