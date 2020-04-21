<template>
  <div id="app">
    <header>
      <p>Status Meeting Standup</p>

      <ul id="tabs" class="tabs">
        <li
          class="tab"
          :class="{ 'active' : activeTab === 'participants' }"
          @click="setActiveTab('participants')"
        >Participants ({{ participants.length }})</li>
        <li
          class="tab"
          :class="{ 'active' : activeTab === 'chat' }"
          @click="setActiveTab('chat')"
        >Chat</li>
      </ul>
    </header>

    <div id="wrapper">
      <div v-if="userIsLoggedIn">
        <!--<Participants />-->
        <Chat :messages="messages" @messageSent="sendMessage" />
      </div>

      <div v-else>
        <input type="text" v-model="userName" />
        <button @click="registerUser">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from "./components/Chat";
//import Participants from "./components/Participants";

import moment from "moment";

export default {
  name: "App",

  data() {
    return {
      ws: null,
      messages: [],
      userIsLoggedIn: false,
      userName: "",
      activeTab: "chat",
      participants: [],
    };
  },

  components: {
    Chat
    //Participants
  },

  methods: {
    createWebSocket() {
      const URL = "ws://localhost:3001";
      this.ws = new WebSocket(URL);
    },

    setActiveTab(t) {
      this.activeTab = t;
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
        userName: this.userName,
        timeStamp: moment(),
        message: `${this.userName} joined.`,
        type: "user-connection"
      };

      this.ws.send(JSON.stringify(message));
      this.addNewMessage(message);
      this.userIsLoggedIn = true;
    },
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
  },

  destroyed() {
    this.ws.onclose = () => {
      console.log("a client has disconnected");
    };
  }
};
</script>

<style lang="scss">
@import "./settings.scss";

body,
html {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

$border-radius: 0.4rem;

.text-gray {
  color: $gray;
}

// styling the markup
header {
  background: $light-gray;
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;

  p {
    margin: 0;
    padding: 1rem;
  }
}

.tabs {
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 0;
  margin: 0;

  .tab {
    display: flex;
    flex: 0 0 50%;
    justify-content: center;
    padding: 1rem 0;
    border: 1px solid transparent;
    border-bottom: 1px solid #e3e4e6;
    cursor: pointer;
  }

  .tab:first-child {
    border-top-right-radius: $border-radius;
  }

  .tab:last-child {
    border-top-left-radius: $border-radius;
  }

  .tab.active {
    background: white;
    border: 1px solid #e3e4e6;
    border-bottom: 1px solid transparent;
  }
}

#wrapper {
  position: relative;
  margin-top: 109px;
  padding: 1rem;
}

input {
  display: block;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: $border-radius;
}

.tab-content {
  padding: 1rem;
}
</style>
