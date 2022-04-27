<template>
  <v-card :loading="loading" class="mx-auto my-12" max-width="374">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      :src="require(`@/assets/dating-icon.png`)"
      contain
    ></v-img>

    <v-card-title><v-spacer>Tinher</v-spacer></v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <v-spacer
        ><v-btn color="primary" @click="loginWithGoogle()"
          >Login with Google Account</v-btn
        ></v-spacer
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthService from "@/services/AuthenticationService";

export default {
  components: {},
  data() {
    return {
      loading: false,
      selection: 1,
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
            lon: this.$store.state.geoLocation.lon,
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