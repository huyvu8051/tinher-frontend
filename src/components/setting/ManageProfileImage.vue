<template>
  <div>
    <v-row>
      <draggable :list="images" @change="onUnpublishedChange">
        <v-col
          cols="4"
          v-for="(item, index) in images"
          :key="index"
          class="imgg"
        >
          <v-card max-width="250px" >
            <h-image-wrapper :src="item.url" height="400px" />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="red"
                dark
                fab
                small
                depressed
                @click="deleteItem(index)"
              >
                <v-icon> clear </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </draggable>
    </v-row>
    <UploadImage @input="addNewImage" />
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
      default: () => [
      /*  "https://i.ibb.co/n8pd74P/277363698-302867688656780-4234363800179639193-n.jpg",
        "https://i.ibb.co/0CBk0ZB/277097823-302762431943013-4196997419560558980-n.jpg",
        "https://i.ibb.co/WVbPpxD/277349336-2160720654077479-5453383725139124940-n.jpg",
        "https://i.ibb.co/CHtj7rd/277103649-133227935933331-3069637674950538478-n.jpg",
        "https://i.ibb.co/30m1MJK/277370931-653715525863211-7232555358844041402-n.jpg",
        "https://i.ibb.co/tLk8bk5/277461786-139278638626236-3033352952824009429-n.jpg",  */
      ],
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onUnpublishedChange(e) {
      //console.log(e, this.images);
    },
    deleteItem(index) {
      this.images.splice(index, 1);
    },
    addNewImage(link) {
      this.images.push(link);
    },
  },
};
</script>

<style>
.imgg {
  display: inline-block;
}
</style>