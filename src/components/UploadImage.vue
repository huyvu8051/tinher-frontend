<template>
  <v-file-input
    name="image"
    accept="image/*"
    label="Upload image"
    @change="uploadFile"
    show-size
    outlined
  >
  </v-file-input>
</template>

<script>
import Api from "@/services/Api";

export default {
  props: {
    value: String,
  },
  methods: {
    // =========================
    uploadFile(file) {
      if (file === null || file === undefined) return;
      console.log(file);
      var formData = new FormData();
      formData.append("file", file);

      Api().post("https://api.imgbb.com/1/upload", {
        key: "a006f7589a173f443a4e5a84cd5aafd7",
        image: file,
      }).then(console.log);

      //   HostManageService.upload(formData)
      //     .then((response) => {
      //       //console.log(response.data);
      //       this.$emit("input", response.data);
      //     })
      //     .catch(console.log);
    },
  },
};
</script>

<style>
</style>