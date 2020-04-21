<template>
  <div id="app">
    <input type="text" v-model="userName" />
    <button @click="registerUser">Ok</button>
    <Participants />
    <Chat :messages="messages" @messageSent="sendMessage" />
  </div>
</template>

<script>
import Chat from "./components/Chat";
import Participants from "./components/Participants";

import moment from "moment";

export default {
  name: "App",

  data() {
    return {
      ws: null,
      messages: [],
      userName: ""
    };
  },

  components: {
    Chat,
    Participants
  },

  methods: {
    createWebSocket() {
      const URL = "ws://localhost:3001";
      this.ws = new WebSocket(URL);
    },

    addNewMessage(m) {
      this.messages = [m, ...this.messages];
    },

    sendMessage(m) {
      let message = {
        userName: this.userName,
        timeStamp: moment(),
        message: m
      };
      this.ws.send(JSON.stringify(message));
      this.addNewMessage(message);
    },

    registerUser() {
      let message = {
        userName: 'Meetingbot',
        timeStamp: moment(),
        message: `${this.userName} joined`,
        type: "user-connection"
      };

      this.ws.send(JSON.stringify(message));
      this.addNewMessage(message);
    }
  },

  mounted() {
    this.createWebSocket();
    this.ws.onopen = () => {
      // connection opened
      console.log("a client has connected");
    };

    this.ws.onmessage = e => {
      // got a new message
      console.log("got message ", e);
      this.addNewMessage(JSON.parse(e.data));
    };

    this.ws.onclose = () => {
      console.log("a client has disconnected");
      // create a WebSocket
      this.createWebSocket();
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

$secondary: #545454;

.text-secondary {
  color: $secondary;
}
</style>
