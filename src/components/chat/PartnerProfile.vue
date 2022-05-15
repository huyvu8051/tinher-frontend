<template>
  <v-carousel v-model="model" hide-delimiters @change="handleChange">
    <v-carousel-item v-for="(image, i) in userData.images" :key="i">
      <v-img height="100%" :src="image.url" />
    </v-carousel-item>
  </v-carousel>
</template>
<script>
export default {
  props: {
    userData: {
      type: Object,
    },
  },
  data: () => ({
    model: 0,
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
  }),
  methods: {
    handleChange(e) {

        console.log(e);
    },
  },
};
</script>