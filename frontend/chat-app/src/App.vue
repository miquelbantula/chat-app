<template>
  <div id="app">
    <Participants />
    <Chat :messages="messages" />
  </div>
</template>

<script>
import Chat from "./components/Chat";
import Participants from "./components/Participants";

const URL = 'ws://localhost:3001';
const ws = new WebSocket(URL);

export default {
  name: "App",

  data() {
    return {
      messages: [],
    }
  },

  components: {
    Chat,
    Participants,
  },

  methods: {
    addNewMessage(m) {
      this.messages = [m, ...this.messages];
    }
  },

  mounted() {
    ws.onopen = () => {
      // connection opened
      console.log('a client has connected')
    }

    ws.onmessage = e => {
      // got a new message
      console.log('got message ', e);
      this.addNewMessage(e.data);
    }
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
