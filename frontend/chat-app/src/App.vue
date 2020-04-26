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
        <Chat :messages="messages" @messageSent="sendMessage" @editMessage="editMessage" />
      </div>

      <div v-else>
        <label>Enter a user name</label>
        <input type="text" v-model="userName" :class="{ 'invalid' : invalidUserName }" />
        <button @click="registerUser">Ok</button>
        <p v-if="invalidUserName">The user name already exists. Please pick another one.</p>
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
      invalidUserName: false,
      userName: "",
      activeTab: "chat",
      participants: []
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
      this.messages.push(m);
    },

    sendMessage(m) {
      let message = {
        userName: this.userName,
        timeStamp: moment(),
        id: Date.now(),
        type: "message",
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
    },

    editMessage(mId, newMsg) {
      let message = {
        type: "edit",
        userName: this.userName,
        id: mId,
        newMessage: newMsg,
      }
      this.ws.send(JSON.stringify(message));
    },

    editExistingMessage(mId, newMessage) {
      console.log('edit existing message called');
      let match = this.messages.find(msg => msg.id === mId);
      console.log('found a match: ', match);
      if (match) {
        match.message = newMessage;
        match.status = 'editted';
      }
      return;
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
      let message = JSON.parse(e.data);
      console.log('message type', message.type);

      switch (message.type) {
        case 'error':
          this.invalidUserName = true;
          break;
        
        case 'user-connection':
          this.userIsLoggedIn = true;
          this.addNewMessage(message);
          this.participants = message.users;
          break;
        
        case 'editted':
          console.log('message', message);
          this.editExistingMessage(message.id, message.message);
          break;
        
        default:
          this.addNewMessage(message);
      }
      
      /*if (message.type === "error") {
        this.invalidUserName = true;
      } else {
        console.log('message.type', message.type);
        this.userIsLoggedIn = true;
        if (message.type === "activeUsers") {
          this.participants = message.users;
        } else {
          
          this.addNewMessage(message);
        }
      }*/
    };

    this.ws.onclose = () => {
      console.log("a client has disconnected");

      let message = {
        userName: this.userName,
        timeStamp: moment(),
        message: `${this.userName} left.`,
        type: "user-disconnection"
      };

      this.ws.send(JSON.stringify(message));
      this.addNewMessage(message);
      // create a WebSocket
      this.createWebSocket();
    };
  },

  beforeDestroy() {
    console.log("destroyed", this.userName);
    this.ws.onclose = () => {
      console.log("a client has disconnected");
      let message = {
        userName: this.userName,
        timeStamp: moment(),
        message: `${this.userName} left.`,
        type: "user-disconnection"
      };

      this.ws.send(JSON.stringify(message));
      this.addNewMessage(message);
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

// margins
.ml-1 { margin-left: .5rem }
.mr-1 { margin-right: .5rem }
.mt-1 { margin-top: .5rem }

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
  min-height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: $border-radius;
}

input.invalid {
  border: 1px solid red;
}

button {
  display: inline-block;
  background: $dark;
  cursor: pointer;
  color: white;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  line-height: 1.5;
  border-radius: $border-radius;
  transition: .15s ease-in-out;
}

.tab-content {
  padding: 1rem;
}
</style>
