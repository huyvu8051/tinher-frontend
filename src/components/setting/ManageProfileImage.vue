<template>
  <div>
    <draggable
      handle=".handle"
      class="row"
      :list="images"
      @change="onUnpublishedChange"
    >
      <v-col
        class="handle"
        cols="4"
        v-for="(item, index) in images"
        :key="index"
      >
        <v-card>
          <h-image-wrapper :src="item.url" height="450px">
            <v-btn
              color="red"
              dark
              right
              absolute
              fab
              x-small
              style="top: 5px; right: 5px"
              @click="deleteItem(index)"
            >
              <v-icon> delete </v-icon>
            </v-btn>
          </h-image-wrapper>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-img height="450px">
            <v-btn
              color="red"
              dark
              fab
              x-small
              @click="openUploadForm()"
              :style="{ top: '50%', left: '50%', transform: 'translate(-50%)' }"
            >
              <v-icon> add </v-icon>
            </v-btn>
          </v-img>
        </v-card>
      </v-col>
    </draggable>

    <UploadImage @input="addNewImage" ref="uploadImage" />
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage";
import draggable from "vuedraggable";
export default {
  components: {
    UploadImage,
    draggable,
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  updated() {
    console.log(this.images);
  },
  data() {
    return {};
  },
  methods: {
    openUploadForm(){
      this.$refs.uploadImage.openUploadForm();
    },
    onUnpublishedChange(e) {
      //console.log(e, this.images);
    },
    deleteItem(index) {
      this.images.splice(index, 1);
    },
    addNewImage(link) {
      this.images.push({
        alt: null,
        url: link,
      });
    },
  },
};
</script>

<style>
</style>