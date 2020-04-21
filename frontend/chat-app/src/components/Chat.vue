<template>
  <div>
    <div v-for="(message, i) in messages" :key="i">
      <span>{{ message.userName }}</span>
      <span>{{ getDate(message.timeStamp) }}</span>

      <p :class="{'text-secondary': message.type === 'user-connection'}">{{ message.message }}</p>
    </div>

    <input type="text" v-model="newMessage" />
    <button @click="sendNewMessage">Send</button>
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
    },

    getDate(d) {
      return moment(d).format("HH:MM");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
