<template>
  <v-responsive class="overflow-y-auto v-responsive-conver" height="600">
    <v-list two-line>
      <template v-for="(item, index) in conversations">
        <v-divider :key="index" />
        <v-list-item
          :key="item.conversationId"
          @click="showConversation(item.conversationId)"
          :to="{
            name: 'chat',
            params: {
              conversationId: item.conversationId,
            },
          }"
        >
          <v-list-item-avatar>
            <v-img :src="item.displayedUser.avatar" />
          </v-list-item-avatar>
          <v-list-item-content class="text-left align-self-start">
            <v-list-item-title v-html="item.displayedUser.fullName">
            </v-list-item-title>
            <v-list-item-subtitle
              :class="{ isntSeen: isNotSeen(item) }"
              v-html="
                item.lastMessage.displayedUser.fullName +
                ': ' +
                item.lastMessage.text
              "
            >
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-responsive>
</template>
<script>
import ChatService from "@/services/ChatService";

import MapperService from "@/services/MapperService";

export default {
  data: () => ({
    conversations: [],
    avatars: [],
  }),
  created() {
    this.loadConversations();
    this.$eventBus.$on("loadConversations", () => {
      this.loadConversations();
      console.log("loadConversations");
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("loadConversations");
  },
  updated() {
    var container = document.querySelector(".v-responsive-conver");
    if (container != null) {
      var scrollHeight = 0;
      container.scrollTop = scrollHeight;
    }
  },
  methods: {
    isNotSeen(item) {
      if (
        this.$store.state.loginData.username ==
        item.lastMessage.displayedUser.username
      ) {
        return false;
      }
      return true;
    },
    showConversation(convId) {
      this.$emit("openConver", convId);
    },
    loadConversations() {
      ChatService.getAllConversations().then((res) => {
        //console.log("conversations res", res.data);

        var lastMessages = res.data.lastMessages;

        var users = res.data.users;

        var conversations = res.data.conversations;
        MapperService.mapChatMessageToDisplayedUser(lastMessages, users);
        MapperService.mapConversationToDisplayedUser(conversations, users);
        MapperService.mapConversationToLastMessage(conversations, lastMessages);

        this.conversations = conversations.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime
        );
      });
    },
  },
};
</script>

<style scoped>
.isntSeen {
  font-weight: bold;
}
</style>