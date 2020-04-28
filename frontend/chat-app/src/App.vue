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
      <div v-if="userIsLoggedIn" class="flex-content">
        <Participants
          id="participants"
          v-show="activeTab === 'participants'"
          :participants="participants"
        />
        <Chat
          v-if="activeTab === 'chat'"
          :messages="messages"
          @messageSent="sendMessage"
          @editMessage="editMessage"
          @removeMessage="removeMessage"
        />
      </div>

      <div v-else class="modal">
        <div class="modal-inner">
          <label class="mb-1">Enter a user name</label>
          <input
            type="text"
            v-model="userName"
            class="mt-1 mb-1"
            :class="{ 'invalid' : invalidUserName }"
          />
          <p
            v-if="invalidUserName"
            class="mt-1"
          >The user name already exists. Please pick another one.</p>
          <button @click="registerUser" class="mt-1 mb-1">Ok</button>
        </div>
      </div>
    </div>
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
      userIsLoggedIn: false,
      invalidUserName: false,
      userName: "",
      activeTab: "chat",
      participants: []
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
        id: Date.now(),
        userName: this.userName,
        timeStamp: moment(),
        type: "user-connection"
      };

      this.ws.send(JSON.stringify(message));
    },

    editMessage(mId, newMsg) {
      let message = {
        type: "edit",
        userName: this.userName,
        id: mId,
        newMessage: newMsg
      };
      this.ws.send(JSON.stringify(message));
    },

    removeMessage(mId) {
      let message = {
        type: "remove",
        id: mId
      };
      this.ws.send(JSON.stringify(message));
    },

    editExistingMessage(mId, newMessage) {
      let match = this.messages.find(msg => msg.id === mId);
      if (match) {
        match.message = newMessage;
        match.status = "editted";
      }
      return;
    },

    deleteExistingMessage(mId) {
      let match = this.messages.find(msg => msg.id === mId);
      console.log("dound a match: ", match);
      if (match) {
        match.status = "deleted";
        match.message = "message deleted";
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
      console.log("message type", message.type);

      switch (message.type) {
        case "error":
          this.invalidUserName = true;
          break;

        case "user-connection":
          this.userIsLoggedIn = true;
          this.addNewMessage(message);
          this.participants = message.users;
          break;

        case "editted":
          this.editExistingMessage(message.id, message.message);
          break;

        case "deleted":
          this.deleteExistingMessage(message.id);
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
    };
  },

  beforeDestroy() {
    let message = {
      userName: this.userName,
      timeStamp: moment(),
      type: "user-disconnection"
    };

    this.ws.send(JSON.stringify(message));
    this.addNewMessage(message);
    // create a WebSocket
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
.ml-1 {
  margin-left: 0.5rem;
}
.mr-1 {
  margin-right: 0.5rem;
}
.mt-1 {
  margin-top: 0.5rem;
}

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

@media screen and (min-width: 720px) {
  #wrapper {
    margin-top: 54px !important;
  }

  .tabs {
    display: none;
  }
  .flex-content {
    display: flex;
    flex-wrap: wrap;
  }

  #participants {
    display: flex !important;
    position: fixed;
    width: 220px;
    flex-basis: 0;
    flex-grow: 1;
    max-width: 220px;
    border-right: 1px solid $light-gray;
    height: 100vh;
  }
  .chat-container {
    display: block !important;
    margin-left: 220px;

    .new-message {
      margin-left: 220px;
      width: calc(100% - 2rem - 220px);
    }
  }
}

#wrapper {
  position: relative;
  margin-top: 109px;
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
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  border-radius: $border-radius;
  transition: 0.15s ease-in-out;
}

.tab-content {
  padding: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba($dark, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;

  .modal-inner {
    background: white;
    padding: 2rem 4rem;
    border-radius: $border-radius;

    p {
      max-width: 200px;
      font-size: 0.8rem;
      color: red;
    }
  }
}
</style>
