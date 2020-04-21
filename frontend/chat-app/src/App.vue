<template>
  <div id="app">
    <Participants />
    <Chat />
  </div>
</template>

<script>
import Chat from "./components/Chat";
import Participants from "./components/Participants";

export default {
  name: "App",
  components: {
    Chat,
    Participants,
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
