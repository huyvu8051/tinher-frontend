<template>
  <v-file-input
    name="image"
    accept="image/*"
    label="Upload image"
    @change="uploadFile"
    show-size
    outlined
    :prepend-icon="icon"
  />
</template>

<script>
import axios from "axios";


export default {
  props: {
    value: String,
  },
  data() {
    return {
      uploadStatusIcon: ["mdi-camera", "cloud_upload", "check_circle_outline"],
      icon: "",
    };
  },
  created() {
    this.icon = "mdi-camera";
  },

  methods: {
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    // =========================
    uploadFile(file) {
      if (file === null || file === undefined) return;

      let body = new FormData();

      body.set("key", "f63d425203fb86deccd1c71333abdd2d");
      body.append("image", file);

      this.icon = "cloud_upload";

      axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload",
        data: body,
      })
        .then((response) => {
          this.icon = "check_circle_outline";
          console.log(response.data.data.display_url);
          this.$emit("input", response.data.data.display_url);
        })
        .catch((error) => {
          this.icon = "error";
          console.error(error);
        });

    
    },
  },
};
</script>

<style>
</style>