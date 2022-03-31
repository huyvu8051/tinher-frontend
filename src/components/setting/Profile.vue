<template>
  <v-form ref="form">
    <ManageProfileImage :images="images" />
    <v-textarea
      name="input-7-1"
      label="About"
      :value="about"
      hint="Tell some think about you"
    >
    </v-textarea>

    <p>passion {{ selectedPassion }}</p>
    <div class="passions">
      <v-checkbox
        class="passion-checkbox"
        v-for="(item, index) in passions"
        :key="index"
        v-model="selectedPassion"
        :label="item"
        :value="item"
      >
      </v-checkbox>
    </div>

    <p>{{ selectedGender }}</p>

    <v-select :items="genders" label="Gender"></v-select>

    <p>{{ distancePreference }}</p>

    <v-slider
      v-model="distancePreference"
      hint="Distance preference"
      :max="161"
      :min="0"
    ></v-slider>

    <p>{{ agePreference }}</p>
    <v-range-slider
      v-model="agePreference"
      hint="Age preference"
      :max="100"
      :min="18"
    ></v-range-slider>

    <p>Looking for {{ lookingFor }}</p>
    <div>
      <v-checkbox
        v-for="(item, index) in genders"
        :key="index"
        v-model="lookingFor"
        :label="item"
        :value="item"
      >
      </v-checkbox>
    </div>

    <!-- cc -->
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
      "https://i.ibb.co/n8pd74P/277363698-302867688656780-4234363800179639193-n.jpg",
      "https://i.ibb.co/0CBk0ZB/277097823-302762431943013-4196997419560558980-n.jpg",
      "https://i.ibb.co/WVbPpxD/277349336-2160720654077479-5453383725139124940-n.jpg",
      "https://i.ibb.co/CHtj7rd/277103649-133227935933331-3069637674950538478-n.jpg",
      "https://i.ibb.co/30m1MJK/277370931-653715525863211-7232555358844041402-n.jpg",
      "https://i.ibb.co/tLk8bk5/277461786-139278638626236-3033352952824009429-n.jpg",
    ],
    distancePreference: 20,
  }),
  created() {
    SettingService.getAllSettingConfig().then((e) => {
      this.passions = e.data.passions;
      this.genders = e.data.genders;
    });
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
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