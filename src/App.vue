<script setup>
import { useRoute, RouterView } from 'vue-router'
import TheNavigation from './components/TheNavigation.vue'

</script>

<template>
    <div id="#app">
        <TheNavigation />
        <RouterView v-slot="{ Component }">
            <transition name="slide" mode="out-in">
                <component :is="Component" :key="$route.path" />
            </transition>
        </RouterView>
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.slide-enter-active,
.slide-leave-leave {
    transition: opacity 1s, transform 1s;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-30%);
}

.input {
    border: 1px solid lightseagreen;
    padding: 10px;
    margin-bottom: 20px;
}
.btn {
    background-color: lightseagreen;
    color: white;
    padding: 10px;
}
</style>
