<template>
  <v-file-input
    name="image"
    accept="image/*"
    label="Upload image"
    @change="uploadFile"
    show-size
    outlined
  />
</template>

<script>
import axios from "axios";
export default {
  props: {
    value: String,
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

      axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload",
        data: body,
      })
        .then((response) => {
          console.log(response.data.display_url)
          this.$emit("input", response.data.data.display_url);
        })
        .catch((error) => console.error(error));
    },
  },
};
</script>

<style>
</style>