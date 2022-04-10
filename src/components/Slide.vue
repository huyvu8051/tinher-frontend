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
        <div class="delimiters">
          <button
            class="bullet"
            v-bind:class="{ active: index == scope.data.current }"
            v-for="(item, index) in scope.data.images"
            :key="item.id"
          >
            {{ index }}
          </button>
        </div>
        <div class="info-container">
          <div class="short-info">
            <span class="fullname"> {{ scope.data.fullName }} </span>
            <span class="age">{{ getAge(scope.data.yearOfBirth) }}</span> <br />
            <span class="short-description">
              {{ scope.data.about }}
            </span>
            <div class="short-description">
              {{
                getDistance(scope.data.location.lat, scope.data.location.lon) +
                " km"
              }}
            </div>
            <div class="short-description">
              {{ scope.data.gender }}
            </div>

            <div class="short-description">
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                v-for="(item, index) in scope.data.passions"
                :key="item + scope.data.id + index"
              >
                {{ item }}
              </v-chip>
            </div>
          </div>
          <button @click="showMoreInfo">
            <span class="material-icons-outlined"> info </span>
          </button>
          <div class="more-info"></div>
        </div>
        <div
          v-for="(item, index) in scope.data.images"
          :key="item.id"
          v-show="index == scope.data.current"
          class="pic"
          @mousedown="mousedown"
          @mouseup="mouseup"
          :style="{
            'background-image': `url(` + item.url + `)`,
          }"
        />
      </template>

      <img class="rewind-pointer" slot="rewind" src="@/assets/rewind-txt.png" />
    </Tinder>
    <div class="btns">
      <img src="@/assets/rewind.png" @click="decide('rewind')" />
      <img src="@/assets/nope.png" @click="decide('nope')" />
      <img src="@/assets/super-like.png" @click="decide('super')" />
      <img src="@/assets/like.png" @click="decide('like')" />
      <img src="@/assets/help.png" @click="decide('help')" />
    </div>
  </div>
</template>

<script>
import Tinder from "vue-tinder";
import source from "@/components/bing";

import GeoService from "@/services/GeoService";

import MatchService from "@/services/MatchService";

export default {
  name: "App",
  components: { Tinder },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    offsetX: 0,
    offsetY: 0,
  }),
  created() {
    this.mock();
  },
  methods: {
    showMoreInfo(e) {
      console.log("showMoreInfo");
    },
    mousedown(e) {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    mouseup(e) {
      //console.log("mouseup", e);

      if (this.offsetX === e.offsetX && this.offsetY === e.offsetY) {
        if (e.offsetX > e.srcElement.offsetWidth / 2) {
          if (this.queue[0].current < this.queue[0].images.length - 1) {
            console.log("right");
            this.queue[0].current++;
          }
        } else {
          if (this.queue[0].current > 0) {
            console.log("left");
            this.queue[0].current--;
          }
        }

        //this.queue[0].images[this.current].isShow = true;

        console.log("Show image ", this.queue[0].current);
      }
    },

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
        case "super":
          console.log("super", e.item.fullName);
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
      } else {
        this.$refs.tinder.decide(choice);
      }
    },
    getAge(yob) {
      var today = new Date();
      return today.getFullYear() - yob;
    },
    getDistance(lat, lon) {
      var currLat = this.$store.state.geoLocation.lat;
      var currLon = this.$store.state.geoLocation.lon;
      var dis = GeoService.distance(lat, lon, currLat, currLon);

      return Math.round(dis);
    },
  },
};
</script>

<style>
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

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
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
.delimiters {
  position: absolute;

  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  display: flex;

  top: 5px;
}
.bullet {
  font-size: 0cm;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.207);
  border: none;
  border-radius: 2px;

  vertical-align: middle;
  margin-left: 2px;
  margin-right: 2px;
  display: inline-block;
  cursor: pointer;

  margin: 2px;
  height: 4px;
}

.active {
  background-color: rgb(255, 255, 255);
}

.info-container {
  display: table;
  color: white;
  bottom: 20px;
  position: absolute;
  text-align: left;
}

.short-info {
  padding: 10px;
  display: table-cell;
  width: 90%;
}

.more-info {
  width: fit-content;
}

.fullname {
  font-weight: bold;
  font-size: 32px;
}
.short-description {
  font-size: 17px;
}
.age {
  font-size: 23px;
}
.more-info-btn {
  cursor: pointer;
}
</style>
