<template>
  <div>
    <ul class="participants">
      <li v-for="(participant, i) in participants" :key="i">{{ participant }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "participants",
  props: {
    participants: Array
  }
};
</script>

<style scoped lang="scss">
@import "../settings.scss";

.participants {
    width: 100%;
    list-style: none;
    text-align: left;
    padding-left: 0;
    text-transform: capitalize;

    li {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid $light-gray;
    }
}
</style>

