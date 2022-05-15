<template>
  <h-flex-layout>
    <SettingGroup title="Upload images">
      <ManageProfileImage :images="userSetting.images" />
    </SettingGroup>
    <SettingGroup title="Edit About">
      <v-textarea
        name="input-7-1"
        label="About"
        v-model="userSetting.about"
        hint="Tell some think about you"
      >
      </v-textarea>
    </SettingGroup>

    <SettingGroup :title="'Select passions ' + userSetting.passions">
      <!-- <p>passion {{ userSetting.passions }}</p> -->
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
    </SettingGroup>

    <SettingGroup title="Your gender">
      <v-select v-model="userSetting.gender" :items="genders" label="Gender">
      </v-select>
    </SettingGroup>

    <SettingGroup
      :title="'Distance preference: ' + userSetting.distancePreference + ' km'"
    >
      <v-slider
        v-model="userSetting.distancePreference"
        hint="Distance preference"
        :max="161"
        :min="5"
      />
    </SettingGroup>

    <SettingGroup
      :title="
        ' Age preference: from ' +
        userSetting.agePreference[0] +
        ' to ' +
        userSetting.agePreference[1] +
        ' year old'
      "
    >
      <p></p>
      <v-range-slider
        v-model="userSetting.agePreference"
        hint="Age preference"
        :max="100"
        :min="18"
      ></v-range-slider>
    </SettingGroup>

    <SettingGroup :title="'Looking for ' + userSetting.lookingFor">
      <v-checkbox
        v-for="(item, index) in genders"
        :key="index"
        v-model="userSetting.lookingFor"
        :label="item"
        :value="item"
      >
      </v-checkbox>
    </SettingGroup>
    <SettingGroup :title="'Your date of birth: ' + userSetting.dateOfBirth">
      <v-date-picker
        v-model="userSetting.dateOfBirth"
        class="mt-4"
        min="1800-01-01"
        :max="maxDate()"
        width="auto"
        @input="show"
      ></v-date-picker>
    </SettingGroup>

    <!-- cc -->

    <v-btn @click="backToSlide" color="warning">back to slide</v-btn>
    <v-btn @click="save" color="primary">submit</v-btn>
  </h-flex-layout>
</template>
<script>
import SettingService from "@/services/SettingService";

import ManageProfileImage from "@/components/setting/ManageProfileImage";
import SettingGroup from "@/components/setting/SettingGroup";
import UploadImage from "@/components/UploadImage";
export default {
  components: {
    UploadImage,
    ManageProfileImage,
    SettingGroup,
  },
  data: () => ({
    date: "",
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
    userSetting: {
      agePreference: [],
    },
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
    maxDate() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear() - 18;

      console.log(yyyy + "-" + mm + "-" + dd);

      return yyyy + "-" + mm + "-" + dd;
    },
    show(e) {
      console.log(e, this.userSetting);
    },

    save() {
      console.log(this.userSetting);
      this.userSetting.lat = this.$store.state.geoLocation.lat;
      this.userSetting.lon = this.$store.state.geoLocation.lon;
      SettingService.save(this.userSetting)
        .then((e) => {
          console.log(e);
          this.$success("Save setting success");
        })
        .catch((e) => {
          console.log(e);
          this.$error("Save setting error");
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