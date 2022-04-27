<template>
  <v-app>
    <v-main>
      <h-flex-layout>
        <router-view />
      </h-flex-layout>
    </v-main>

    <Nofication />
  </v-app>
  <!-- <img src="./assets/logo.png"> -->
</template>

<script>
import Nofication from "@/components/global/Nofication";
import FlexLayout from "@/components/global/FlexLayout";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

import GeoService from "@/services/GeoService";
export default {
  name: "App",
  components: {
    Nofication,
    FlexLayout,
    Navigation,
    Header,
  },
  created() {
    GeoService.getLocation();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
