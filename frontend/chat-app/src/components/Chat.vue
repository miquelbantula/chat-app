<template>
  <div>
    {{ messages }}
  </div>
</template>

<script>
export default {
  name: "Chat",

  props: {
    messages: {
      type: Array,
    }
  }
};
</script>

<style scoped lang="scss">
</style>
