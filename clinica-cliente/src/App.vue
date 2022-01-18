<template>
    <v-app>
        <app-navigation></app-navigation>
        <v-content transition="slide-x-transition">
            <router-view :key="$route.fullPath"></router-view>
        </v-content>
    </v-app>
</template>

<script>
import AppNavigation from '@/components/NavigatorApp';
export default {
  name: 'App',
  components: {
    AppNavigation
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
