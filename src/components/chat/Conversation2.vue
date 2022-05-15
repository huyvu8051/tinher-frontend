<template>
  <v-responsive class="discussions">
    <div
      class="discussion"
      v-for="(item, index) in conversations"
      :key="index + Math.random()"
      @click="showConversation(item)"
      :style="{
        'background-color': isRouted(item),
      }"
    >
      <div
        class="photo"
        :style="{ backgroundImage: 'url(' + item.displayedUser.avatar + ')' }"
      >
        <div class="online"></div>
      </div>
      <div class="desc-contact" :class="{ isntSeen: item.isNotSeen }">
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
  </v-responsive>
</template>
<script>
import ChatService from "@/services/ChatService";

import MapperService from "@/services/MapperService";
import Moment from "moment";
export default {
  data: () => ({
    conversations: [],
    users: [],
  }),
  created() {
    this.loadConversations();

    this.$eventBus.$on("loadConversations", () => {
      this.loadConversations();
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
    isRouted(item) {
      if (item.conversationId == this.$route.params.conversationId) {
        return "#dcdcdc";
      }
      return "#fafafa";
    },

    getHour(long) {
      return Moment(long).format("h:mm a");
    },
    isNotSeen(conversation) {
      var seener = conversation.lastMessage.seeners.find(
        (e) => e.username === this.$store.state.loginData.username
      );
      if (seener) {
        return false;
      }
      return true;
    },
    showConversation(conv) {
      var conver = this.conversations.find(
        (e) => e.conversationId == conv.conversationId
      );
      conver.isNotSeen = false;


      this.$router
        .push({
          name: "chat",
          params: {
            conversationId: conv.conversationId,
          },
        })
        .catch((e) => e);
    },
    loadConversations() {
      ChatService.getAllConversations().then((res) => {
        //console.log("conversations res", res.data);

        var lastMessages = res.data.lastMessages;

        var users = res.data.users;

        this.users = users;

        var conversations = res.data.conversations;
        MapperService.mapChatMessageToDisplayedUser(lastMessages, users);
        MapperService.mapConversationToDisplayedUser(conversations, users);
        MapperService.mapConversationToLastMessage(conversations, lastMessages);

        conversations.forEach((e) => {
          e.isNotSeen = this.isNotSeen(e);
        });

        this.conversations = conversations.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime
        );
        console.log(this.conversations);
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
  width: inherit;
  height: inherit;
  bottom: 10px;
  top: 0px;
  overflow-x: hidden;
  overflow-y: scroll;
  display: inline-block;
}

.discussions .discussion {
  width: inherit;
  height: 90px;
  background-color: #fafafa;
  border-bottom: solid 1px #e0e0e0;

  display: flex;
  align-items: center;
  cursor: pointer;
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
  width: 70%;
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
  font-family: "Open Sans", sans-serif;
  font-size: 11px;
  padding: 3px 8px;
  margin-right: 5px;
  color: #bbb;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 15px;
  text-align: center;
}

.clickable {
  cursor: pointer;
}
</style>