<template>
  <v-app>
    <Navigation />
    <Header />
    <v-main>
      <router-view :socket="socket" />
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

import MapperService from "@/services/MapperService";
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
    this.socket.off("seen");
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

      socket.on("message", (message, users) => {
        console.log("receiveMessage");
        MapperService.mapChatMessageToDisplayedUser([message], users);

        this.$eventBus.$emit("loadConversations");
        this.$eventBus.$emit("receiveNewMessage", message);

        console.log(
          this.$route.params.conversationId === message.conversationId
        );

        if (this.$route.params.conversationId !== message.conversationId) {
          this.$success(
            "New message from " +
              message.displayedUser.fullName +
              ": " +
              message.text
          );
        }
      });

      socket.on("seen", (cm) => {
        this.$eventBus.$emit("seen", cm);
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
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  background-color: #FFFFFF;
  overflow: hidden;
}
</style>
