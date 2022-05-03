<template>
  <v-row>
    <v-col cols="3">
      <Conversation2 @openConver="openConver" ref="convers" />
    </v-col>
    <v-col cols="9">
      <ChatMessage2 :converId="converId" ref="chatMess" />
    </v-col>
  </v-row>
</template>

<script>
import Conversation2 from "@/components/chat/Conversation2";
import ChatMessage2 from "@/components/chat/ChatMessage2";
export default {
  components: {
    Conversation2,
    ChatMessage2,
  },
  data() {
    return {
      converId: "",
    };
  },
  created(){
    this.$eventBus.$on("receiveNewMessage", (msg) => {
      this.$refs.chatMess.receiveNewMessage(msg);
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("receiveNewMessage");
  },
  methods: {
    openConver(convId) {
      this.converId = convId;
      this.$refs.chatMess.changeConversation(this.converId);
    },
  },
};
</script>

<style lang="css" scoped>

</style>