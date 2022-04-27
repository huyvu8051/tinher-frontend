<template>
  <v-responsive class="overflow-y-auto v-responsive-conver" height="600">
    <v-list two-line>
      <template v-for="(item, index) in items">
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
            <v-img :src="item.avatarUrl" />
          </v-list-item-avatar>
          <v-list-item-content class="text-left align-self-start">
            <v-list-item-title v-html="item.conversationName">
            </v-list-item-title>
            <v-list-item-subtitle
              v-html="item.lastMessage.author + ': ' + item.lastMessage.text"
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
export default {
  data: () => ({
    items: [],
    avatars: [],
  }),
  created() {
    this.loadConversations();
  },
  updated() {
    var container = document.querySelector(".v-responsive-conver");
    if (container != null) {
      var scrollHeight = 0;
      container.scrollTop = scrollHeight;
    }
  },
  methods: {
    showConversation(convId) {
      this.$emit("openConver", convId);
    },
    loadConversations() {
      ChatService.getAllConversations().then((res) => {
        // console.log("conversations:", e.data.conversations);
        var convers = res.data.conversations;
        this.avatars = res.data.avatarUrls;

        var mappedAvatar = convers.map((e) => {
          var userAva = this.avatars.find((f) => f.userid == e.partnerId);

          if (userAva != null) {
            e.avatarUrl = userAva.avatarUrl;
          } else {
            e.avatarUrl = "https://i.pravatar.cc/64";
          }

          return e;
        });

        mappedAvatar.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        //console.log(mappedAvatar);

        this.items = mappedAvatar;
      });
    },
  },
};
</script>