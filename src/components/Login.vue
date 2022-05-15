<template>
  <h-flex-layout>
    <v-container>
      <v-row align-content="center" justify="center">
        <v-col cols="12" sm="10">
          <v-card class="elevation-6">
            <v-window>
              <v-window-item>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card-text class="">
                      <v-card-title class="justify-center">
                        <v-img
                          :src="require(`@/assets/dating-icon.png`)"
                          max-width="200"
                        />
                      </v-card-title>
                      <h1 class="text-center my-5">Login</h1>
                      <v-row
                        align-content="center"
                        justify="center"
                        class="mt-5"
                      >
                        <v-btn
                          color="#FE4A6B"
                          dark
                          @click="loginWithGoogle()"
                          id="btnLogin"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="30"
                            height="30"
                            viewBox="0 0 48 48"
                            style="fill: #000000"
                          >
                            <path
                              fill="#FFC107"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            ></path>
                            <path
                              fill="#FF3D00"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            ></path>
                            <path
                              fill="#4CAF50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            ></path>
                            <path
                              fill="#1976D2"
                              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            ></path>
                          </svg>

                          Login with Google
                        </v-btn>
                      </v-row>
                    </v-card-text>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                    style="background: #fe4a6b"
                    class="rounded-bl-xl login__banner"
                  >
                    <div style="text-align: center; padding: 200px 0">
                      <v-card-text class="white--text">
                        <h1 class="text-center">Tinher</h1>
                        <br />
                        <h3 class="text-center">Dating app</h3>
                      </v-card-text>
                    </div>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </h-flex-layout>
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

<style scoped>
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
@media screen and (max-width: 975px) {
  .login__banner {
    display: none;
  }
}
</style>