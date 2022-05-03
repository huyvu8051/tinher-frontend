<template>
  <section class="discussions">
    <div class="discussion search">
      <v-text-field outlined append-icon="search"></v-text-field>
    </div>
    <div
      class="discussion message-active"
      v-for="(item, index) in conversations"
      :key="index"
      @click="showConversation(item.conversationId)"
      :to="{
        name: 'chat',
        params: {
          conversationId: item.conversationId,
        },
      }"
    >
      <div
        class="photo"
        :style="{ backgroundImage: 'url(' + item.displayedUser.avatar + ')' }"
      >
        <div class="online"></div>
      </div>
      <div class="desc-contact">
        <p class="name">{{ item.displayedUser.fullName }}</p>
        <p class="message">
          {{
            item.lastMessage.displayedUser.fullName +
            ": " +
            item.lastMessage.text
          }}
        </p>
      </div>
      <div class="timer">{{ getHour(item.lastMessageTime) }}</div>
    </div>
  </section>
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
  computed: {},
  methods: {
    getHour(long) {
      return "11h20";
    },
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




<style lang="css" scoped>
.isntSeen {
  font-weight: bold;
}

/* === CONVERSATIONS === */

.discussions {
  width: 100%;
  height: auto;
  box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background-color: #87a3ec;
  display: inline-block;
}

.discussions .discussion {
  width: 100%;
  height: 90px;
  background-color: #fafafa;
  border-bottom: solid 1px #e0e0e0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.discussions .search {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0e0e0;
}

.discussions .message-active {
  width: 98.5%;
  height: 90px;
  background-color: #fff;
  border-bottom: solid 1px #e0e0e0;
}

.discussions .discussion .photo {
  margin-left: 20px;
  display: block;
  width: 45px;
  height: 45px;
  background: #e6e7ed;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.online {
  position: relative;
  top: 30px;
  left: 35px;
  width: 13px;
  height: 13px;
  background-color: #8bc34a;
  border-radius: 13px;
  border: 3px solid #fafafa;
}

.desc-contact {
  height: 43px;
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.discussions .discussion .name {
  margin: 0 0 0 20px;
  font-family: "Montserrat", sans-serif;
  font-size: 11pt;
  color: #515151;
}

.discussions .discussion .message {
  margin: 6px 0 0 20px;
  font-family: "Montserrat", sans-serif;
  font-size: 9pt;
  color: #515151;
}

.timer {
  margin-left: 15%;
  font-family: "Open Sans", sans-serif;
  font-size: 11px;
  padding: 3px 8px;
  color: #bbb;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 15px;
}

.clickable {
  cursor: pointer;
}
</style>