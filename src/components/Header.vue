<template>
  <v-app-bar app flat class="app-bar">
    <v-app-bar-nav-icon @click="drawer"></v-app-bar-nav-icon>
    <router-link :to="{ name: 'slide' }">
      <v-img
        class="mx-2 background-color:white"
        :src="require(`@/assets/dating-icon.png`)"
        max-height="40"
        max-width="40"
        
      >
      </v-img>
    </router-link>
    <v-spacer></v-spacer>

   
  </v-app-bar>
</template>

<script>
export default {

  methods: {
    drawer() {
      this.$eventBus.$emit("drawer");
    },
  },
};
</script>

<style></style>