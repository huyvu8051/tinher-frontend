<template>
  <GoogleLogin
    :params="params"
    :onSuccess="onSuccess"
    :renderParams="renderParams"
    :onFailure="onFailure"
  ></GoogleLogin>
</template>

<script>
import GoogleLogin from "vue-google-login";

import AuthService from "@/services/AuthenticationService";

export default {
  components: {
    GoogleLogin,
  },
  data() {
    return {
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id:
          "735007599200-u6q67j2t8999cflp03b0jovvatal4mbh.apps.googleusercontent.com",
      },
      // only needed if you want to render the button with the google ui
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true,
      },
    };
  },
  methods: {
    onSuccess(e) {
      AuthService.login({
        idToken: e.getAuthResponse().id_token,
      }).then((res) => {
        this.$store.commit("saveLoginData", res.data);

        this.$router.push({
          name: "setting.profile"
        })
      });
    },
    onFailure(e) {
      this.$error("login false: " + e);
    },
  },
};
</script>

<style>
</style>