<template>
  <div v-if="conversation != null">
    <div>
      <v-list-item>
        <v-list-item-avatar>
          <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
        </v-list-item-avatar>
        <v-list-item-content class="text-left align-self-start">
          <v-list-item-title v-html="conversation.conversationName">
          </v-list-item-title>
          <v-list-item-subtitle
            v-html="
              conversation.lastMessage.author +
              ': ' +
              conversation.lastMessage.text
            "
          >
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </div>
    <v-responsive
      class="overflow-y-auto v-responsive-chatMess"
      height="800px"
      v-scroll.self="onScroll"
    >
      <v-row v-for="(item, key) in messages" :key="key">
        <!-- start other chat message -->

        <v-col
          cols="2"
          v-if="item.authorId !== $store.state.loginData.username"
        >
          <v-container fill-height>
            <v-layout align-center justify-center>
              <v-avatar>
                <v-img :src="item.avatarUrl" />
              </v-avatar>
            </v-layout>
          </v-container>
        </v-col>
        <v-col
          cols="9"
          v-if="item.authorId !== $store.state.loginData.username"
        >
          <v-container fill-height>
            <v-layout align-center>
              <v-card class="elevation-2" color="green" dark>
                <v-card-text class="text-left align-self-start">
                  {{ item.text }}
                </v-card-text>
              </v-card>
            </v-layout>
          </v-container>
        </v-col>
        <v-col
          cols="1"
          v-if="item.authorId !== $store.state.loginData.username"
        >
        </v-col>

        <!-- end other chat message -->

        <!-- start my chat message -->

        <v-col cols="4" v-if="item.authorId == $store.state.loginData.username">
        </v-col>
        <v-col cols="8" v-if="item.authorId == $store.state.loginData.username">
          <v-container fill-height>
            <v-layout align-end justify-end>
              <v-card class="elevation-2" color="blue" dark>
                <v-card-text class="text-left align-self-start">
                  {{ item.text }}
                </v-card-text>
              </v-card>
            </v-layout>
          </v-container>
        </v-col>

        <!-- end my chat message -->
      </v-row>
    </v-responsive>
    <v-text-field
      v-model="message"
      append-outer-icon="mdi-send"
      clear-icon="mdi-close-circle"
      clearable
      label="Message"
      type="text"
      @click:append-outer="sendMessage"
      v-on:keyup.enter.exact="sendMessage"
    ></v-text-field>
  </div>
</template>
<script>
import ChatService from "@/services/ChatService";
export default {
  data: () => ({
    converId: "",
    message: "",
    messages: [],
    conversation: null,
    currScrollHeigh: 0,
    avatars: [],
    pageSize: 8
  }),

  updated() {
    var container = document.querySelector(".v-responsive-chatMess");

    if (container != null) {
      container.scrollTop = container.scrollHeight - this.currScrollHeigh;
    }
  },
  created() {
    if (this.converId != "") {
      ChatService.getAllChatMessage(this.converId);
    }
  },
  methods: {
   
    changeConversation(converId) {
      this.converId = converId;
      this.message = "";
      this.messages = [];
      this.conversation = null;
      (this.currMessagePage = 1), (this.currScrollHeigh = 0);
      this.avatars = [];
      this.loadChatMessageByConvId(this.converId, 1);
    },
    receiveNewMessage(msg) {
      var e = this.messages.find((e) => e.sentAt === msg.sentAt);

      if (e == null) {
        var userAva = this.avatars.find((f) => f.userid == msg.authorId);

        if (userAva != null) {
          msg.avatarUrl = userAva.avatarUrl;
        } else {
          msg.avatarUrl = "https://i.pravatar.cc/64";
        }
        this.currScrollHeigh = 0;
        this.messages.push(msg);
      }
    },
    async loadChatMessageByConvId(convId, page) {
      this.converId = convId;
      var response = await ChatService.getAllChatMessage(convId, page, this.pageSize);

      this.avatars = response.data.avatarUrls;

      var mappedAvatar = response.data.chatMessages.map((e) => {
        var userAva = this.avatars.find((f) => f.userid == e.authorId);

        if (userAva != null) {
          e.avatarUrl = userAva.avatarUrl;
        } else {
          e.avatarUrl = "https://i.pravatar.cc/64";
        }

        return e;
      });

      mappedAvatar.forEach((element) => {
        this.messages.unshift(element);
      });

      this.conversation = response.data.conversation;
    },
    sendMessage() {
      var now = new Date().getTime();

      ChatService.sendMessage({
        conversationId: this.converId,
        chatMessage: this.message,
        sentAt: now,
      })
        .then((e) => {
          //this.loadChatMessageByConvId(this.converId);
        })
        .catch(console.log);

      this.messages.push({
        author: this.$store.state.loginData.fullName,
        authorId: this.$store.state.loginData.username,
        conversationId: this.converId,
        sentAt: now,
        text: this.message,
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

        this.loadChatMessageByConvId(this.converId, this.getNextPage());

        console.log("get next page");
      }
    },
    getNextPage(){
      var currPage = Math.round(this.messages.length / this.pageSize);
      return currPage + 1;
    }
  },
};
</script>