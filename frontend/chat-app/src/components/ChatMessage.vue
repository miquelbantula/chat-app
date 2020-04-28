<template>
  <div>
    <div>
      <div class="message-header">
        <span
          class="userName"
        >{{ message.type === 'user-connection' ? 'Meetingbot' : message.userName }}</span>
        <span class="timeStamp">{{ getDate(message.timeStamp) }}</span>
      </div>

      <div class="message" :class="{'text-gray': message.type === 'user-connection'}">
        <div v-if="editMode" class="edit-mode">
          {{ editMessage }}
          <input class="edit-input" type="text" v-model="editMessage" />
          <div class="mt-1">
            <button @click="editMode = false" class="mr-1">Cancel</button>
            <button @click="sendEditMessage(message.id)">Save</button>
          </div>
        </div>
        <span v-else>
          {{ message.message }}
          <span
            v-if="message.status === 'editted'"
            class="text-gray ml-1"
          >(editted)</span>
          <button v-if="hasOptions" class="edit-icon" @click="editMode = true">Edit</button>
          <button v-if="hasOptions" class="edit-icon" @click="sendRemoveMessage(message.id)">Delete</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    message: Object
  },

  data() {
    return {
      editMode: false,
      editMessage: ""
    };
  },

  computed: {
    originalMsgOrEdit: {
      get() {
        return this.message.message;
      },
      set(val) {
        this.editMessage = val;
      }
    },

    hasOptions() {
        return (this.message.type !== 'user-connection' && this.message.status !== 'deleted');
    }
  },

  methods: {
    getDate(d) {
      return moment(d).format("HH:mm");
    },

    sendEditMessage(id) {
      let msg = this.editMessage;
      this.$parent.$emit("editMessage", id, msg);
      this.editMode = false;
      this.editMessage = "";
    },

    sendRemoveMessage(id) {
        this.$parent.$emit('removeMessage', id);
    }
  }
};
</script>

<style scoped lang="scss">
@import "./../settings.scss";

.message-header {
    padding: 0 1rem;
}

.message {
  border-radius: $border-radius;
  transition: 0.2s ease-in-out;
  padding: 1rem;
  min-height: calc(62px - 2rem);
  display: flex;
  align-items: center;

  .edit-mode {
    width: 100%;

    .edit-input {
      width: calc(100% - 2rem);
    }
  }
}
.message:hover {
  background: $light-gray;
}

.edit-icon {
  display: none;
  margin-left: 1rem;
}

.message:hover {
  .edit-icon {
    display: inline-block;
  }
}
</style>