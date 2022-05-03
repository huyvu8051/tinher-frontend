<template>
  <v-app>
    <Navigation />
    <Header />
    <v-main>
      <h-flex-layout>
        <router-view :socket="socket" />
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

import io from "socket.io-client";

export default {
  name: "App",
  components: {
    Nofication,
    FlexLayout,
    Navigation,
    Header,
  },
  data() {
    return {
      socket: {},
    };
  },
  created() {
    GeoService.getLocation();
    this.socket = this.connectSocket();
  },
  beforeDestroy() {
    this.socket.off("connected");
    this.socket.off("registerSuccess");
    this.socket.off("receiveMessage");
  },
  methods: {
    connectSocket() {
      var socket = io.connect("http://localhost:8082");
      socket
        .on("connected", () => null)
        .emit("clientConnectRequest", {
          token: "bearer " + this.$store.state.loginData.jwt,
        })
        .on("registerSuccess", (data) => {
          console.log("connect success!", data);
        });

      socket.on("receiveMessage", (message) => {
        this.$eventBus.$emit("loadConversations");
        this.$eventBus.$emit("receiveNewMessage", message);
      });

      socket.on("seenMessage", () => {
        this.$eventBus.$emit("loadConversations");
      });

      return socket;
    },
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
