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
export default {
  components: {
    Conversations,
    ChatMessages,
  },
  data() {
    return {
      converId: "",
    };
  },
  created() {

  },
  beforeDestroy() {
  
  },
  methods: {
    openConver(convId) {
      this.converId = convId;
      this.$refs.chatMess.changeConversation(this.converId);
    },
 
  },
};
</script>

<style>
</style>