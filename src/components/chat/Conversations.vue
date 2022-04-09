<template>
  <v-responsive class="overflow-y-auto v-responsive-conver" max-height="800">
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-divider :key="index" />
        <v-list-item
          :key="item.conversationId"
          @click="showConversation(item.conversationId)"
        >
          <v-list-item-avatar>
            <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
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
  }),
  created() {
    this.loadConversations();
  },
  methods: {
    showConversation(convId) {
      this.$emit("openConver", convId);
    },
    loadConversations() {
      ChatService.getAllConversations().then((e) => {
        console.log("conversations:", e.data.conversations);
        this.items = e.data.conversations;
        this.scrollToTop();
      });
    },
     scrollToTop() {
      var container = document.querySelector(".v-responsive-conver");
      if (container != null) {
        var scrollHeight = 0;
        console.log(scrollHeight);

        setTimeout(() => {
          container.scrollTop = scrollHeight;
        }, 100);
      }
    },
  },
};
</script>