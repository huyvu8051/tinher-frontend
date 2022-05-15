<template>
  <v-card class="mx-auto my-12 rounded-lg" id="setting-card">
    <v-card-title>
      <h3>{{ title }}</h3>
    </v-card-title >

      <v-divider class="mx-4"></v-divider>

    <v-card-text> <slot /> </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style scoped>
#setting-card{
    background-color: rgb(238, 237, 237);
}
</style>