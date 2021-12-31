<template>
  <div id="nav">  
  <v-app-bar dense>
    <template >
        <v-tabs>
        <v-tab>Home </v-tab>
        <v-tab>Categorías </v-tab>
        <v-tab>Contact Us </v-tab>
        </v-tabs>
    </template>
  </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data(){}
}
</script>

<style>
#nav {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
