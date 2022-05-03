<template>
  <div v-if="conversation != null">
    <CMHeader :conversation="conversation" />

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
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar>
                    <v-img
                      :src="item.displayedUser.avatar"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </v-avatar>
                </template>
                <span>{{ item.displayedUser.fullName }}</span>
              </v-tooltip>
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
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-card-text
                      v-bind="attrs"
                      v-on="on"
                      class="text-left align-self-start"
                    >
                      {{ item.text }}
                    </v-card-text>
                  </template>
                  <span
                    >sent at
                    {{ new Date(item.lastMessageTime).toLocaleString() }}</span
                  >
                </v-tooltip>
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
import MapperService from "@/services/MapperService";

import CMHeader from "@/components/chat/CMHeader";
export default {
  components: {
    CMHeader,
  },
  data: () => ({
    converId: "",
    message: "",
    messages: [],
    conversation: null,
    currScrollHeigh: 0,
    users: [],
    pageSize: 8,
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

    this.$eventBus.$on("receiveNewMessage", (msg) => {
      
      this.receiveNewMessage(msg);
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("receiveNewMessage");
  
  },
  methods: {
    changeConversation(converId) {
      this.converId = converId;
      this.message = "";
      this.messages = [];
      this.conversation = null;
      (this.currMessagePage = 1), (this.currScrollHeigh = 0);
      this.users = [];
      this.loadChatMessageByConvId(this.converId, 1);
    },
    receiveNewMessage(msg) {
      var e = this.messages.find((e) => e.lastMessageTime === msg.lastMessageTime);
      
      if (e === null || e === undefined) {

        MapperService.mapChatMessageToDisplayedUser([msg], this.users);
        this.currScrollHeigh = 0;
        this.messages.push(msg);
      }
    },
    async loadChatMessageByConvId(convId, page) {
      this.converId = convId;
      var response = await ChatService.getAllChatMessage(
        convId,
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

      messages.forEach((element) => {
        this.messages.unshift(element);
      });
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
    getNextPage() {
      var currPage = Math.round(this.messages.length / this.pageSize);
      return currPage + 1;
    },
  },
};
</script>