<template>
  <div v-if="userData != null">
    <v-carousel v-model="model" hide-delimiters @change="handleChange">
      <v-carousel-item v-for="(image, i) in userData.images" :key="i">
        <v-img height="100%" :src="image.url" />
      </v-carousel-item>
    </v-carousel>
    <div class="info-container">
      <div class="short-info">
        <span class="fullname"> {{ userData.fullName }} </span>
        <span class="age">{{ getAge(userData.dateOfBirth) }}</span>
        <br />
        <span class="short-description">
          {{ userData.about }}
        </span>
        <div class="short-description">
          <v-chip class="my-2 mr-2" outlined color="black">
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
    </div>
    <div
      v-for="(item, index) in userData.images"
      :key="item.id"
      v-show="index == userData.current"
      class="pic"
      :style="{
        'background-image': `url(` + item.url + `)`,
      }"
    />
  </div>
</template>
<script>
import GeoService from "@/services/GeoService";
export default {
  props: {},
  data: () => ({
    model: 0,
    offsetX: 0,
    offsetY: 0,
    userData: null,
  }),
  created() {
    this.$eventBus.$on("showUserPage", (user) => {
        this.userData = user;
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("showUserPage");
  },
  methods: {
    handleChange(e) {
      console.log(e);
    },
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
.info-container {
  display: table;
  color: rgb(20, 20, 20);
  top: 0px;
  text-align: left;
  content: "";
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