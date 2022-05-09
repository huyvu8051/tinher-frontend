<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list nav dense>
      <v-list-item-group
        v-model="group"
        active-class="deep-purple--text text--accent-4"
      >
        <v-list-item :to="{ name: 'slide' }">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{
            name: 'chat',
            params: {
              conversationId: '#',
            },
          }"
        >
          <v-list-item-icon>
            <v-icon>mdi-chat</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Message</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'setting.profile' }">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon>logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
  }),
  created() {
    this.$eventBus.$on("drawer", () => {
      this.drawer = !this.drawer;
    });
  },methods:{
    logout(){
      this.$store.commit("logout");
      this.$router.push({
        name: "login"
      })
    }
  }
};
</script>

<style>
</style>