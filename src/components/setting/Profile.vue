<template>
  <v-form ref="form">
    <ManageProfileImage :images="userSetting.images" />
    <v-textarea
      name="input-7-1"
      label="About"
      v-model="userSetting.about"
      hint="Tell some think about you"
    >
    </v-textarea>

    <p>passion {{ userSetting.passions }}</p>
    <div class="passions">
      <v-checkbox
        class="passion-checkbox"
        v-for="(item, index) in passions"
        :key="index"
        v-model="userSetting.passions"
        :label="item"
        :value="item"
      >
      </v-checkbox>
    </div>

    <p>{{ userSetting.gender }}</p>

    <v-select
      v-model="userSetting.gender"
      :items="genders"
      label="Gender"
    ></v-select>

    <p>{{ userSetting.distancePreference }}</p>

    <v-slider
      v-model="userSetting.distancePreference"
      hint="Distance preference"
      :max="161"
      :min="0"
    ></v-slider>

    <p>{{ userSetting.agePreference }}</p>
    <v-range-slider
      v-model="userSetting.agePreference"
      hint="Age preference"
      :max="100"
      :min="18"
    ></v-range-slider>

    <p>Looking for {{ userSetting.lookingFor }}</p>
    <div>
      <v-checkbox
        v-for="(item, index) in genders"
        :key="index"
        v-model="userSetting.lookingFor"
        :label="item"
        :value="item"
      >
      </v-checkbox>
    </div>

    <v-text-field
      v-model="userSetting.yearOfBirth"
      type="number"
      label="Year of birth"
      append-outer-icon="add"
      @click:append-outer="increment"
      prepend-icon="remove"
      @click:prepend="decrement"
    ></v-text-field>

    <!-- cc -->

    <v-btn @click="backToSlide">back to slide</v-btn>
    <v-btn @click="save">submit</v-btn>
  </v-form>
</template>
<script>
import SettingService from "@/services/SettingService";

import ManageProfileImage from "@/components/setting/ManageProfileImage";
import UploadImage from "@/components/UploadImage";
export default {
  components: {
    UploadImage,
    ManageProfileImage,
  },
  data: () => ({
    about: "",
    passions: [],
    selectedPassion: [],
    genders: [],
    selectedGender: null,
    agePreference: [20, 24],
    lookingFor: [],
    images: [
     /* "https://i.ibb.co/n8pd74P/277363698-302867688656780-4234363800179639193-n.jpg",
      "https://i.ibb.co/0CBk0ZB/277097823-302762431943013-4196997419560558980-n.jpg",
      "https://i.ibb.co/WVbPpxD/277349336-2160720654077479-5453383725139124940-n.jpg",
      "https://i.ibb.co/CHtj7rd/277103649-133227935933331-3069637674950538478-n.jpg",
      "https://i.ibb.co/30m1MJK/277370931-653715525863211-7232555358844041402-n.jpg",
      "https://i.ibb.co/tLk8bk5/277461786-139278638626236-3033352952824009429-n.jpg",*/
    ],
    distancePreference: 20,
    userSetting: {},
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
  }),
  created() {
    SettingService.getAllSettingConfig().then((e) => {
      this.passions = e.data.sysPassions;
      this.genders = e.data.sysGenders;
      console.log(e.data);
      this.userSetting = e.data.userSetting;
    });
  },

  methods: {
    increment() {
      this.userSetting.yearOfBirth =
        parseInt(this.userSetting.yearOfBirth, 10) + 1;
    },
    decrement() {
      this.userSetting.yearOfBirth =
        parseInt(this.userSetting.yearOfBirth, 10) - 1;
    },
    save() {
      console.log(this.userSetting);
      this.userSetting.lat = this.$store.state.geoLocation.lat;
      this.userSetting.lon = this.$store.state.geoLocation.lon;
      SettingService.save(this.userSetting)
        .then(e=>{
          console.log(e)
          this.$success("Save setting success")
        })
        .catch(e=>{
          console.log(e)
          this.$error("Save setting error")
        });
    },
    allowedDates: (val) => parseInt(val.split("-")[2], 10) % 2 === 0,
    backToSlide() {
      this.$router.push({
        name: "slide",
      });
    },
  },
};
</script>

<style scoped>
.passions {
  display: block;
}
.passion-checkbox {
  display: inline-block;
  margin-right: 20px;
}
</style>