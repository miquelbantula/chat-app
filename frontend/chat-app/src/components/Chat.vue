<template>
  <div class="tab-content chat-container">
    <div v-for="(message, i) in messages" :key="i" class="message">
      <ChatMessage :message="message" />
    </div>

    <div class="new-message">
      <input type="text" placeholder="Message" autofocus v-model="newMessage" @keyup.enter="sendNewMessage" />
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/ChatMessage";

export default {
  name: "Chat",

  data() {
    return {
      newMessage: "",
    };
  },

  props: {
    messages: {
      type: Array
    }
  },

  components: {
    ChatMessage,
  },

  methods: {
    sendNewMessage() {
      this.$emit("messageSent", this.newMessage);
      this.newMessage = '';
    },
  }
};
</script>

<style lang="scss">
@import "../settings.scss";

.message {
  text-align: left;
  padding: .5rem 0;
  margin: .5rem 0;
  
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
