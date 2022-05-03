<template>
  <!-- <div align="center"> -->
  <div>
    <v-avatar> <v-img :src="conversation.displayedUser.avatar" /> </v-avatar>
    {{ conversation.displayedUser.fullName }}
  </div>
</template>

<script>
export default {
    props:{
        conversation: Object
    }
};
</script>

<style>
</style>