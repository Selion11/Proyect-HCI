<template>
  <span class="go-back">
    <button @click="goBack" class="btn">Go Back</button>
  </span>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function goBack() {
    return router.go(-1);
}
</script>

<style scoped>
.go-back {
    display: flex;
    cursor: pointer;
}
button {
    border: 0;
}
</style>