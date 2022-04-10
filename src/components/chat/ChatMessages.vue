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
      max-height="800"
      v-scroll.self="onScroll"
    >
      <v-row v-for="item in messages" :key="item.id">
        <!-- start other chat message -->

        <v-col cols="2" v-if="item.authorId !== $store.state.loginData.username">
          <v-container fill-height>
            <v-layout align-center justify-center>
              <v-avatar>
                <img src="https://i.pravatar.cc/64" />
              </v-avatar>
            </v-layout>
          </v-container>
        </v-col>
        <v-col cols="9" v-if="item.authorId !== $store.state.loginData.username">
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
        <v-col cols="1" v-if="item.authorId !== $store.state.loginData.username">
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
    reverse: true,
    message: "",
    messages: [],
    conversation: null,
    currMessagePage: 1,
  }),
  created() {
    if (this.converId != "") {
      ChatService.getAllChatMessage(this.converId).then(console.log);
    }
  },
  methods: {
    loadChatMessageByConvId(convId, page) {
      console.log(this.$store.state.loginData.userId);
      this.converId = convId;
      ChatService.getAllChatMessage(convId, page).then((e) => {
        console.log(e.data);
        this.messages = e.data.chatMessages.reverse();
        this.conversation = e.data.conversation;
        this.scrollToEnd();
      });
    },
    sendMessage() {
      ChatService.sendMessage({
        conversationId: this.converId,
        chatMessage: this.message,
      })
        .then((e) => {
          //this.loadChatMessageByConvId(this.converId);
        })
        .catch(console.log);

      this.messages.push({
        author: this.$store.state.loginData.fullName,
        authorId: this.$store.state.loginData.username,
        conversationId: this.converId,
        sentAt: new Date().getTime(),
        text: this.message,
      });
      this.message = "";
      this.scrollToEnd();
    },
    scrollToEnd() {
      var container = document.querySelector(".v-responsive-chatMess");
      if (container != null) {
        var scrollHeight = container.scrollHeight;
        console.log(scrollHeight);

        setTimeout(() => {
          container.scrollTop = scrollHeight;
        }, 100);
      }
    },
    onScroll(e) {
      if (e.target.scrollTop == 0) {
        var container = document.querySelector(".v-responsive-chatMess");
        var scrollHeightOld = 0;
        if (container != null) {
          scrollHeightOld = container.scrollHeight;
          console.log(scrollHeightOld);
        }

        console.log("get next page");
        ChatService.getAllChatMessage(
          this.converId,
          ++this.currMessagePage
        ).then((e) => {
          console.log(e.data);
          this.messages = e.data.chatMessages.reverse();
          this.conversation = e.data.conversation;

          setTimeout(() => {
            var containerNew = document.querySelector(".v-responsive-chatMess");
            var scrollHeightNew = containerNew.scrollHeight;
            console.log(scrollHeightNew);
            console.log(scrollHeightNew - scrollHeightOld);
            container.scrollTop = scrollHeightNew - scrollHeightOld;
          }, 100);
        });
      }
    },
  },
};
</script>