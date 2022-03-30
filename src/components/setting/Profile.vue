<template>
  <v-form ref="form">
    <UploadImage :value="imageLink" />
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

import UploadImage from "@/components/UploadImage";
export default {
  components: {
    UploadImage,
  },
  data: () => ({
    about: "",
    passions: [],
    selectedPassion: [],
    genders: [],
    selectedGender: null,
    agePreference: [20, 24],
    lookingFor: [],
    imageLink:""
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