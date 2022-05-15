<template>
  <div id="app">
    <Tinder
      ref="tinder"
      key-name="id"
      :queue.sync="queue"
      :offset-y="5"
      @submit="onSubmit"
      :max="3"
    >
      <template slot-scope="scope">
        <UserPage :userData="scope.data" class="test"  />
      </template>
      <img class="like-pointer" slot="like" src="@/assets/like-txt.png" />
      <img class="nope-pointer" slot="nope" src="@/assets/nope-txt.png" />
      <img class="super-pointer" slot="super" src="@/assets/super-txt.png" />
      <img class="rewind-pointer" slot="rewind" src="@/assets/rewind-txt.png" />
    </Tinder>
    <div class="btns">
      <img src="@/assets/rewind.png" @click="decide('rewind')" />
      <img src="@/assets/nope.png" @click="decide('nope')" />
      <img src="@/assets/like.png" @click="decide('like')" />
      <img src="@/assets/help.png" @click="decide('boost')" />
    </div>
  </div>
</template>

<script>
import Tinder from "vue-tinder";
import UserPage from "@/components/UserPage";


import MatchService from "@/services/MatchService";

export default {
  name: "App",
  components: { Tinder, UserPage },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
  }),
  created() {
    this.mock();
  },
  methods: {
   

    mock(count = 5, append = true) {
      console.log("mock");
      MatchService.findAllSuitablePerson({
        lat: this.$store.state.geoLocation.lat,
        lon: this.$store.state.geoLocation.lon,
      }).then((res) => {
        var list = res.data.list.map((x) => {
          x.current = 0;
          x.id = Math.random();
          return x;
        });

        if (append) {
          this.queue = this.queue.concat(list);
        } else {
          this.queue.unshift(...list);
        }

        console.log(this.queue);
      });
    },
    onSubmit(e) {
      console.log(e);

      if (this.queue.length < 3) {
        this.mock();
      }
      this.history.push(e.item);

      switch (e.type) {
        case "like":
          console.log("like", e.item.fullName);
          MatchService.likePartner({
            partnerId: e.item.username,
          });
          break;

        case "nope":
          console.log("nope", e.item.fullName);
          break;
        case "boost":
          console.log("boost", e.item.fullName);
          break;

        default:
          break;
      }
    },

    async decide(choice) {
      console.log("choice", choice);
      if (choice === "rewind") {
        if (this.history.length) {
          this.$refs.tinder.rewind([this.history.pop()]);
        }
      } else if (choice === "help") {
        window.open("https://shanlh.github.io/vue-tinder");
      } else if (choice === "boost") {
        console.log("boost");
        MatchService.boost().then((e) => {
          this.$swal({
            icon: "success",
            title: "Yay!",
            text: "Your profile is boosting, everyone will see you on top in your area!",
            timer: 3000,
          });
        });
      } else {
        this.$refs.tinder.decide(choice);
      }
    },
   
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  margin: 0;
  background-color: #20262e;
  overflow: hidden;
}

#app .vue-tinder {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 23px;
  margin: auto;
  width: calc(100% - 20px);
  height: calc(100% - 23px - 65px - 47px - 16px);
  min-width: 300px;
  max-width: 355px;
}

.nope-pointer,
.like-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  width: 64px;
  height: 64px;
}

.nope-pointer {
  right: 10px;
}

.like-pointer {
  left: 10px;
}

.super-pointer {
  position: absolute;
  z-index: 1;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: auto;
  width: 112px;
  height: 78px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 10px;
  width: 112px;
  height: 78px;
}



.pic2 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 355px;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
  width: 53px;
}

.btns img:nth-child(2n) {
  width: 65px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}
.test {
  height: inherit;
}
</style>
