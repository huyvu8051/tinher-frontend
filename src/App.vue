<template>
  <v-app>
    <FlexLayout>
      <router-view />
    </FlexLayout>
    <Nofication />
  </v-app>
  <!-- <img src="./assets/logo.png"> -->
</template>

<script>
import Nofication from "@/components/global/Nofication";
import FlexLayout from "@/components/global/FlexLayout";
export default {
  name: "App",
  components: {
    Nofication,
    FlexLayout,
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
