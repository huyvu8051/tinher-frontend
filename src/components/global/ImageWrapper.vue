<template >
  <v-img
    :lazy-src="require(`@/assets/dating-icon.png`)"
    :src="url"
    :height="height"
    :width="width"
    :contain="contain"
    class="ma-0 rounded"
    v-on:error="url = require(`@/assets/dating-icon.png`)"
  >
    <slot />
  </v-img>
</template>

<script>
export default {
  props: {
    src: String,
    height: {
      type: String,
      default: "auto",
    },
    width: {
      type: String,
      default: "auto",
    },

    contain: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      url: "",
    };
  },
  computed: {},
  watch: {
    src(val) {
      this.url = val;
      // console.log(this.url);
    },
  },
  created() {
    this.url = this.src;
  },
};
</script>

<style>
</style>