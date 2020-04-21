<template>
  <div id="app">
    <Participants />
    <Chat :messages="messages" />
  </div>
</template>

<script>
import Chat from "./components/Chat";
import Participants from "./components/Participants";



export default {
  name: "App",

  data() {
    return {
      ws: null,
      messages: []
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
      this.addNewMessage(e.data);
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
</style>
