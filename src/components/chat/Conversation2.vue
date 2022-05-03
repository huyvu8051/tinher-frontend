<template>
  <v-responsive class="discussions">
    <div
      class="discussion"
      v-for="(item, index) in conversations"
      :key="index + Math.random()"
      @click="showConversation(item.conversationId)"
      :style="{
        'background-color': isRouted(item)
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
  </v-responsive>
</template>
<script>
import ChatService from "@/services/ChatService";

import MapperService from "@/services/MapperService";
import Moment from "moment";
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
    isRouted(item){
      
      if(item.conversationId == this.$route.params.conversationId){
        return "#dcdcdc"
      }
      return "#fafafa"
    },
    resizeWindowEventHandler(e) {
      console.log(this.$refs.convs.clientHeight);
      //this.hei = this.$refs.convs.clientHeight;
    },
    getHour(long) {
      return Moment(long).format("h:mm a");
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
      this.$router
        .push({
          name: "chat",
          params: {
            conversationId: convId,
          },
        })
        .catch((e) => e);
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
  width: 25%;
  position: absolute;
  bottom: 10px;
  top: 0px;
  overflow-x: hidden;
  overflow-y: auto;
  display: inline-block;
  border-right: solid 1px #e0e0e0;
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