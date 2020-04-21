<template>
  <div class="tab-content chat-container">
    <div v-for="(message, i) in messages" :key="i" class="message">
      <span class="userName">{{ message.userName }}</span>
      <span class="timeStamp">{{ getDate(message.timeStamp) }}</span>

      <p class="message" :class="{'text-gray': message.type === 'user-connection'}">{{ message.message }}</p>
    </div>

    <div class="new-message">
      <input type="text" placeholder="Message" autofocus v-model="newMessage" @keyup.enter="sendNewMessage" />
    </div>
  </div>
</template>

<script>
import moment from "moment";

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
    }
  },

  methods: {
    sendNewMessage() {
      this.$emit("messageSent", this.newMessage);
      this.newMessage = '';
    },

    getDate(d) {
      return moment(d).format("HH:MM");
    }
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
