<template >
  <div>
    <div class="delimiters">
      <button
        class="bullet"
        v-bind:class="{ active: index == userData.current }"
        v-for="(item, index) in userData.images"
        :key="item.id"
      >
        {{ index }}
      </button>
    </div>
    <div class="info-container" @mousedown="mousedown" @mouseup="mouseup">
      <div style="height: 200px"></div>
      <div class="short-info">
        <span class="fullname"> {{ userData.fullName }} </span>
        <span class="age">{{ getAge(userData.dateOfBirth) }}</span>
        <br />
        <span class="short-description">
          {{ userData.about }}
        </span>
        <div class="short-description">
          <v-chip class="my-2 mr-2" outlined color="white">
            <v-icon left> mdi-map-marker-distance </v-icon>
            {{ getDistance(userData.lat, userData.lon) + " km" }}
            {{ isBoosted(userData.boostTime) }}
          </v-chip>
        </div>
        <div class="short-description">
          <v-chip class="my-2 mr-2" color="red">
            <v-icon left> {{ genderIcon(userData.gender) }} </v-icon>
            {{ userData.gender }}
          </v-chip>
        </div>

        <div class="short-description passions">
          <v-chip
            class="my-2 mr-2"
            color="cyan"
            text-color="white"
            v-for="(item, index) in userData.passions"
            :key="item + userData.id + index"
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
      v-for="(item, index) in userData.images"
      :key="item.id"
      v-show="index == userData.current"
      class="pic"
      @mousedown="mousedown"
      @mouseup="mouseup"
      :style="{
        'background-image': `url(` + item.url + `)`,
      }"
    />
  </div>
</template>

<script>
import GeoService from "@/services/GeoService";
export default {
  props: {
    userData: {
      type: Object,
    },
  },
  data() {
    return {
      offsetX: 0,
      offsetY: 0,
    };
  },
  created() {},
  updated() {
    console.log(this.userData);
  },
  methods: {
    genderIcon(gender) {
      return gender === "MALE" ? "mdi-gender-male" : "mdi-gender-female";
    },
    isBoosted(long) {
      var now = new Date().getTime();
      if (now < long) {
        return "Boosted";
      }

      return "";
    },
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
          if (this.userData.current < this.userData.images.length - 1) {
            console.log("right");
            this.userData.current++;
          }
        } else {
          if (this.userData.current > 0) {
            console.log("left");
            this.userData.current--;
          }
        }

        //this.queue[0].images[this.current].isShow = true;

        console.log("Show image ", this.userData.current);
      }
    },
    getAge(dob) {
      var today = new Date();
      return today.getFullYear() - new Date(dob).getFullYear();
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

<style scoped>
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
.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.active {
  background-color: rgb(255, 255, 255);
}

.info-container {
  display: table;
  color: white;
  bottom: 0px;
  position: absolute;
  text-align: left;
  content: "";
  background: linear-gradient(
    to bottom,
    transparent 20%,
    rgba(0, 0, 0, 0.664) 100%
  );
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