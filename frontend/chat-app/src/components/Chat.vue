<template>
  <div>
    {{ messages }}
    <input type="text" v-model="newMessage" />
    <button @click="sendNewMessage">Send</button>
  </div>
</template>

<script>
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
    }
  }
};
</script>

<style scoped lang="scss">
</style>
