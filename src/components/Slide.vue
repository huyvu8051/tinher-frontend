<template>
  <div id="app">
    <Tinder
      ref="tinder"
      key-name="id"
      :queue.sync="queue"
      :offset-y="10"
      @submit="onSubmit"
      :max="4"
    >
      <template slot-scope="scope">
        <div class="delimiters">
          <button
            class="bullet"
            v-bind:class="{ active: item.isShow }"
            v-for="(item, index) in scope.data.list"
            :key="item.id"
          >
            {{ index }}
          </button>
        </div>
        <div class="info-container">
          <div class="short-info">
            <span class="fullname"> Rowan Nikolaus </span>
            <span class="age">20</span> <br />
            <span class="short-description">
              chusng ta cua hien tai, heo kho di nhung ki niem xua kia, ngay
              mai, nguoi luyen luu theo nhung giac mo tung co, lieu co ta
            </span>
          </div>
          <button @click="showMoreInfo">
            <span class="material-icons-outlined"> info </span>
          </button>
          <div class="more-info"></div>
        </div>

        <div
          v-for="item in scope.data.list"
          :key="item.id"
          v-show="item.isShow"
          class="pic"
          @mousedown="mousedown"
          @mouseup="mouseup"
          :style="{
            'background-image': `url(https://cn.bing.com//th?id=OHR.${item.id}_UHD.jpg&pid=hp&w=720&h=1280&rs=1&c=4&r=0)`,
          }"
        />
      </template>chusng ta cua hien tai, heo kho di nhung ki niem xua kia, ngay mai, nguoi luyen luu theo nhung giac mo tung co, lieu co tasuper-txt.png" />
      <img class="rewind-pointer" slot="rewind" src="@/assets/rewind-txt.png" />
    </Tinder>
    <div class="btns">
      <img src="@/assets/rewind.png" @click="decide('rewind')" />
      <img src="@/assets/nope.png" @click="decide('nope')" />
      <img src="@/assets/super-like.png" @click="decide('super')" />
      <img src="@/assets/like.png" @click="decide('like')" />
      <img src="@/assets/help.png" @click="decide('help')" />
    </div>
  </div>
</template>

<script>
import Tinder from "vue-tinder";
import source from "@/components/bing";

export default {
  name: "App",
  components: { Tinder },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    current: 0,
    offsetX: 0,
    offsetY: 0,
  }),
  created() {
    this.mock();
  },
  methods: {
    showMoreInfo(e) {
      console.log("con");
    },
    mousedown(e) {
        this.$success("login success: ");
      //console.log("mousedown", e);

      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    mouseup(e) {
      //console.log("mouseup", e);

      if (this.offsetX === e.offsetX && this.offsetY === e.offsetY) {
        this.queue[0].list[this.current].isShow = false;

        if (e.offsetX > e.srcElement.offsetWidth / 2) {
          if (this.current < this.queue[0].list.length - 1) {
            console.log("right");
            this.current++;
          }
        } else {
          if (this.current > 0) {
            console.log("left");
            this.current--;
          }
        }

        this.queue[0].list[this.current].isShow = true;
      }
    },

    mock(count = 5, append = true) {
      const list = [];
      for (let i = 0; i < count; i++) {
        var rand = Math.floor(Math.random() * 7 + 1);
        const list2 = [];
        for (let j = 0; j < rand; j++) {
          var isShow = j == 0 ? true : false;
          list2.push({ id: source[this.offset], isShow: isShow });
          this.offset++;
        }

        list.push({
          list: list2,
          id: Math.random(),
        });
      }
      if (append) {
        this.queue = this.queue.concat(list);
      } else {
        this.queue.unshift(...list);
      }
    },
    onSubmit({ item }) {
      this.current = 0;
      if (this.queue.length < 3) {
        this.mock();
      }
      this.history.push(item);
    },
    async decide(choice) {
      if (choice === "rewind") {
        if (this.history.length) {
          this.$refs.tinder.rewind([this.history.pop()]);
        }
      } else if (choice === "help") {
        window.open("https://shanlh.github.io/vue-tinder");
      } else {
        this.$refs.tinder.decide(choice);
      }
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
}

body {
  margin: 0;
  background-color: #20262e;
  overflow: hidden;
}

#app .vue-tinder {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 23px;
  margin: auto;
  width: calc(100% - 20px);
  height: calc(100% - 23px - 65px - 47px - 16px);
  min-width: 300px;
  max-width: 355px;
}

.nope-pointer,
.like-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  width: 64px;
  height: 64px;
}

.nope-pointer {
  right: 10px;
}

.like-pointer {
  left: 10px;
}

.super-pointer {
  position: absolute;
  z-index: 1;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: auto;
  width: 112px;
  height: 78px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 10px;
  width: 112px;
  height: 78px;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.pic2 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 355px;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
  width: 53px;
}

.btns img:nth-child(2n) {
  width: 65px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}
.delimiters {
  position: absolute;

  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  display: flex;

  top: 5px;
}
.bullet {
  font-size: 0cm;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.207);
  border: none;
  border-radius: 2px;

  vertical-align: middle;
  margin-left: 2px;
  margin-right: 2px;
  display: inline-block;
  cursor: pointer;

  margin: 2px;
  height: 4px;
}

.active {
  background-color: rgb(255, 255, 255);
}

.info-container {
  display: table;
  color: white;
  bottom: 20px;
  position: absolute;
  text-align: left;
}

.short-info {
  padding: 10px;
  display: table-cell;
  width: 90%;
}

.more-info {
  width: fit-content;
}

.fullname {
  font-weight: bold;
  font-size: 32px;
}
.short-description {
  font-size: 17px;
}
.age {
  font-size: 23px;
}
.more-info-btn {
  cursor: pointer;
}
</style>
