<template>
  <div>
    <v-btn @click="loginWithGoogle()">Google login</v-btn>
  </div>
</template>

<script>

import AuthService from "@/services/AuthenticationService";

export default {
  components: {
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
    loginWithGoogle() {
      this.$gAuth
        .signIn()
        .then((GoogleUser) => {
          // on success do something
          console.log("GoogleUser", GoogleUser);
          console.log("getId", GoogleUser.getId());
          console.log("basicprofile", GoogleUser.getBasicProfile().getName());
          console.log("getBasicProfile", GoogleUser.getBasicProfile());
          console.log("getAuthResponse", GoogleUser.getAuthResponse());
          var userInfo = {
            loginType: "google",
            google: {
              auth: GoogleUser.getAuthResponse(),
              user: {
                name: GoogleUser.getBasicProfile().getName(),
                email: GoogleUser.getBasicProfile().getEmail(),
                profileImage: GoogleUser.getBasicProfile().getImageUrl(),
              },
            },
          };
          AuthService.login({
            idToken: GoogleUser.getAuthResponse().id_token,
            lat: this.$store.state.geoLocation.lat,
            lon: this.$store.state.geoLocation.lon
          }).then((res) => {
            this.$store.commit("saveLoginData", res.data);

            this.$router.push({
              name: "setting.profile",
            });
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>

<style>
</style>