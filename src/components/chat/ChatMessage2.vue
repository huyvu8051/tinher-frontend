<template>
  <section class="chat">
      <div class="header-chat">
        <i class="icon fa fa-user-o" aria-hidden="true"></i>
        <p class="name">Megan Leib</p>
        <i class="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
      </div>
      <div class="messages-chat">
        <div class="message">
          <div
            class="photo"
            style="
              background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);
            "
          >
            <div class="online"></div>
          </div>
          <p class="text">Hi, how are you ?</p>
        </div>
        <div class="message text-only">
          <p class="text">
            What are you doing tonight ? Want to go take a drink ?
          </p>
        </div>
        <p class="time">14h58</p>
        <div class="message text-only">
          <div class="response">
            <p class="text">Hey Megan ! It's been a while 😃</p>
          </div>
        </div>
        <div class="message text-only">
          <div class="response">
            <p class="text">When can we meet ?</p>
          </div>
        </div>
        <p class="response-time time">15h04</p>
        <div class="message">
          <div
            class="photo"
            style="
              background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);
            "
          >
            <div class="online"></div>
          </div>
          <p class="text">9 pm at the bar if possible 😳</p>
        </div>
        <p class="time">15h09</p>
      </div>

      <v-text-field
        class="footer-chat"
        append-outer-icon="mdi-send"
        clear-icon="mdi-close-circle"
        clearable
        label="Message"
        type="text"
      />
    </section>
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
  box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.chat .header-chat .icon {
  margin-left: 30px;
  color: #515151;
  font-size: 14pt;
}

.chat .header-chat .name {
  margin: 0 0 0 20px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-size: 13pt;
  color: #515151;
}

.chat .header-chat .right {
  position: absolute;
  right: 40px;
}

.chat .messages-chat {
  padding: 25px 35px;
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
  width: calc(65% - 66px);
  height: 80px;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  background-color: transparent;
  border-top: 2px solid #eee;
}

.chat .footer-chat .icon {
  margin-left: 30px;
  color: #c0c0c0;
  font-size: 14pt;
}

.chat .footer-chat .send {
  color: #fff;
  background-color: #4f6ebd;
  position: absolute;
  right: 50px;
  padding: 12px 12px 12px 12px;
  border-radius: 50px;
  font-size: 14pt;
}

.chat .footer-chat .name {
  margin: 0 0 0 20px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-size: 13pt;
  color: #515151;
}

.chat .footer-chat .right {
  position: absolute;
  right: 40px;
}



.clickable {
  cursor: pointer;
}
</style>