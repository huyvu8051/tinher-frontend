<template>
  <section class="chat" v-if="conversation != null">
    <!-- HEADER -->
    <div class="header-chat">
      <v-avatar class="ml-6">
        <img :src="conversation.displayedUser.avatar" alt="John" />
      </v-avatar>

      <p class="name">{{ conversation.displayedUser.fullName }}</p>
      <i class="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
    </div>

    <!-- CM -->

    <v-responsive
      class="v-responsive-chatMess messages-chat"
      v-scroll.self="onScroll"
    >
      <div class="message" v-for="(item, key) in messages" :key="key">
        <p v-if="!isOwnMessage(item)" class="text">{{ item.text }}</p>
        <div v-else class="response">
          <p class="text">{{ item.text }}</p>
        </div>
      </div>

      <!-- <p class="time">14h58</p> -->

      <p class="response-time time">{{ isPartnerSeen }}</p>
    </v-responsive>

    <!-- Text field -->

    <v-text-field
      class="footer-chat"
      v-model="message"
      append-outer-icon="mdi-send"
      clear-icon="mdi-close-circle"
      clearable
      label="Message"
      type="text"
      @click:append-outer="sendMessage"
      v-on:keyup.enter.exact="sendMessage"
    />
  </section>
</template>


<script>
import ChatService from "@/services/ChatService";
import MapperService from "@/services/MapperService";

import CMHeader from "@/components/chat/CMHeader";

import Moment from "moment";
export default {
  components: {
    CMHeader,
  },
  data: () => ({
    message: "",
    messages: [],
    conversation: null,
    currScrollHeigh: 0,
    pageSize: 14,
  }),

  watch: {
    $route(to, from) {
      this.conversation = null;
      this.messages = [];
      this.message = "";
      this.currScrollHeigh = 0;
      if (this.conversation) {
        this.$eventBus.$emit("showUserPage", this.conversation.displayedUser);
      } else {
        this.$eventBus.$emit("showUserPage", null);
      }
      this.loadChatMessageByConvId(1);
    },
  },

  updated() {
    var container = document.querySelector(".v-responsive-chatMess");

    if (container != null) {
      container.scrollTop = container.scrollHeight - this.currScrollHeigh;
    }
  },
  created() {
    this.$eventBus.$emit("showUserPage", this.conversation);
    this.loadChatMessageByConvId(1);

    this.$eventBus.$on("seen", (cm) => {
      this.messages = this.messages.map((e) => {
        if (
          e.key.conversationId === cm.key.conversationId &&
          e.key.lastMessageTime === cm.key.lastMessageTime
        ) {
          return cm;
        }

        return e;
      });
    });
  },
  computed: {
    isPartnerSeen() {
      var seener = this.messages
        .at(-1)
        .seeners.find(
          (e) => e.username === this.conversation.displayedUser.username
        );

      if (seener && this.isOwnMessage(this.messages.at(-1))) {
        return "seen at " + this.getHour(seener.seenAt);
      }

      return "";
    },
  },
  beforeDestroy() {
    this.$eventBus.$off("seen");
  },
  methods: {
    getHour(long) {
      return Moment(long).format("h:mm a");
    },

    isOwnMessage(item) {
      return item.authorId === this.$store.state.loginData.username;
    },
    receiveNewMessage(msg) {
      if (msg.key.conversationId !== this.$route.params.conversationId) {
        return;
      }

      var e = this.messages.find(
        (e) => e.key.lastMessageTime === msg.key.lastMessageTime
      );

      if (e === null || e === undefined) {
        MapperService.mapChatMessageToDisplayedUser([msg], this.users);
        this.currScrollHeigh = 0;
        this.messages.push(msg);
      }
    },
    async loadChatMessageByConvId(page) {
      var converId = this.$route.params.conversationId;
      if (converId === "#") {
        return;
      }

      var response = await ChatService.getAllChatMessage(
        converId,
        page,
        this.pageSize
      );

      this.users = response.data.users;

      this.conversation = response.data.conversation;

      MapperService.mapConversationToDisplayedUser(
        [this.conversation],
        this.users
      );

      var messages = response.data.chatMessages;

      MapperService.mapChatMessageToDisplayedUser(messages, this.users);
      this.$eventBus.$emit("showUserPage", this.conversation.displayedUser);
      messages.forEach((element) => {
        this.messages.unshift(element);
      });

      // console.log(this.messages);
    },
    sendMessage() {
      var text = this.message.trim();

      if (text == "") return;

      var now = new Date().getTime();

      ChatService.sendMessage({
        conversationId: this.$route.params.conversationId,
        chatMessage: text,
        sentAt: now,
      })
        .then((e) => {
          //this.loadChatMessageByConvId(this.converId);
        })
        .catch(console.log);

      this.messages.push({
        author: this.$store.state.loginData.fullName,
        authorId: this.$store.state.loginData.username,
        key: {
          conversationId: this.$route.params.conversationId,
          lastMessageTime: now,
        },
        text: this.message,
        seeners: [
          {
            username: this.$store.state.loginData.username,
            seenAt: now,
          },
        ],
      });
      this.message = "";
      this.currScrollHeigh = 0;
    },

    onScroll(e) {
      if (e.target.scrollTop == 0) {
        var container = document.querySelector(".v-responsive-chatMess");

        if (container != null) {
          this.currScrollHeigh = container.scrollHeight;
        }
        this.loadChatMessageByConvId(this.getNextPage());
      }
    },
    getNextPage() {
      var currPage = Math.round(this.messages.length / this.pageSize);
      return currPage + 1;
    },
  },
};
</script>

<style lang="css" scoped>
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

.chat {
  width: calc(100%);
}

.header-chat {
  background-color: #fff;
  height: 90px;
  /* box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.1); */
  display: flex;
  align-items: center;
  border-bottom: solid 1px #e0e0e0;
}

.chat .header-chat .icon {
  margin-left: 30px;
  color: #515151;
  font-size: 14pt;
}

.chat .header-chat .name {
  margin: 0 0 0 20px;
  /* text-transform: uppercase; */
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  font-size: 13pt;
  color: #515151;
}

.chat .header-chat .right {
  position: absolute;
  right: 40px;
}

.chat .messages-chat {
  /* position: absolute; */
  top: 0px;
  bottom: 0px;
  width: inherit;
  height: calc(100vh - 250px);
/* 
  background-color: green; */

  overflow-x: hidden;
  overflow-y: scroll;
}

.chat .messages-chat .message {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.chat .messages-chat .message .photo {
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

.chat .messages-chat .text {
  margin: 0 35px;
  background-color: #f6f6f6;
  padding: 15px;
  border-radius: 12px;
}

.text-only {
  margin-left: 45px;
}

.time {
  font-size: 10px;
  color: lightgrey;
  margin-bottom: 10px;
  margin-left: 85px;
}

.response-time {
  float: right;
  margin-right: 40px !important;
}

.response {
  float: right;
  margin-right: 0px !important;
  margin-left: auto; /* flexbox alignment rule */
}

.response .text {
  background-color: #e3effd !important;
}

.footer-chat {
  padding: 10px;
  width: 100%;
  height: 80px;
  /* background-color: orange; */
  border-top: 2px solid #eee;
}

.clickable {
  cursor: pointer;
}
</style>