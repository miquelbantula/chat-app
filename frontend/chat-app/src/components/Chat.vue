<template>
  <div id="chat-container" class="tab-content chat-container">
    <div v-for="(message, i) in messages" :key="i" class="message">
      <ChatMessage :message="message" :userName="userName" @newMessage="scrollChatToBottom" />
    </div>

    <div class="new-message">
      <input
        type="text"
        placeholder="Message"
        autofocus
        v-model="newMessage"
        @keyup.enter="sendNewMessage"
      />
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/ChatMessage";

export default {
  name: "Chat",

  data() {
    return {
      newMessage: ""
    };
  },

  props: {
    messages: {
      type: Array
    },
    userName: {
      type: String
    }
  },

  components: {
    ChatMessage
  },

  methods: {
    sendNewMessage() {
      this.$emit("messageSent", this.newMessage);
      this.newMessage = "";
      // we make sure the DOM has updated
      this.$nextTick(() => {
        this.scrollChatToBottom();
      });
    },

    scrollChatToBottom() {
      let el = document.getElementById("app");
      window.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }
};
</script>

<style lang="scss">
@import "../settings.scss";

#chat-container {
  width: 100%;
  overflow-y: scroll;
}

.message {
  text-align: left;
  padding: 0.5rem 0;
  margin: 0.5rem 0;

  .userName {
    font-weight: bold;
  }

  .timeStamp {
    color: $gray;
    font-weight: 500;
    margin-left: 1rem;
  }
}

.new-message {
  position: fixed;
  bottom: 0;
  left: 0;
  width: calc(100% - 2rem);
  padding: 1rem;

  input {
    display: block;
    width: calc(100% - 1.5rem);
  }
}

.chat-container {
  margin-bottom: 74px;
}
</style>
