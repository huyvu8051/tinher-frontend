<template>
  <v-row>
    <v-col cols="4">
      <Conversations @openConver="openConver" ref="convers" />
    </v-col>
    <v-col cols="8">
      <ChatMessages :converId="converId" ref="chatMess" />
    </v-col>
  </v-row>
</template>

<script>
import Conversations from "@/components/chat/Conversations";
import ChatMessages from "@/components/chat/ChatMessages";
import io from "socket.io-client";
export default {
  components: {
    Conversations,
    ChatMessages,
  },
  data() {
    return {
      converId: "",
      socket: {},
    };
  },
  created() {
    this.socket = this.connectSocket();
  },
  beforeDestroy() {
      this.socket.off("connected")
      this.socket.off("registerSuccess")
      this.socket.off("receiveMessage")
  },
  methods: {
    openConver(convId) {
      console.log(convId);
      this.converId = convId;
      this.$refs.chatMess.loadChatMessageByConvId(convId, 1);
    },
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

        socket.on("receiveMessage",()=>{
             this.$refs.chatMess.loadChatMessageByConvId(this.converId , 1);
             this.$refs.convers.loadConversations();
        })

      return socket;
    },
  },
};
</script>

<style>
</style>