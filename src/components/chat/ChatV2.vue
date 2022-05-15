<template>
  <v-row class="chat-row">
    <v-col cols="3" class="px-0 conver-col">
      <Conversation2 @openConver="openConver" ref="convers" />
    </v-col>
    <v-col cols="6" class="px-0 cm-col">
      <ChatMessage2 :converId="converId" ref="chatMess" />
    </v-col>

    <v-col cols="3" class="px-0 up-col">
      <PartnerProfile class="test" />
    </v-col>
  </v-row>
</template>

<script>
import Conversation2 from "@/components/chat/Conversation2";
import ChatMessage2 from "@/components/chat/ChatMessage2";

import PartnerProfile from "@/components/chat/PartnerProfile";
export default {
  components: {
    Conversation2,
    ChatMessage2,
    PartnerProfile,
  },
  data() {
    return {
      converId: "",
    };
  },
  created() {
    this.$eventBus.$on("receiveNewMessage", (msg) => {
      this.$refs.chatMess.receiveNewMessage(msg);
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("receiveNewMessage");
  },
  methods: {
    openConver(convId) {
      this.converId = convId;
      // this.$refs.chatMess.changeConversation(this.converId);
    },
  },
};
</script>

<style lang="css" scoped>
.test {
}

.conver-col {
  border-right: solid 1px #e0e0e0;

  height: calc(100vh - 64px);

  /* background-color: red; */
}

.cm-col {
  border-right: solid 1px #e0e0e0;
  height: calc(100vh - 64px);
  /* background-color: blue; */
}
.up-col {
  height: calc(100vh - 64px);
  /* background-color: rgb(255, 0, 119); */
}
.chat-row {
}
</style>