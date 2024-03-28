<template>
  <!-- 展开收起 -->
  <div class="elementCollapse">
    <div class="collapseHeader">
      <el-collapse-transition>
        <div v-show="show" class="collapseHeaderBox">
          <slot name="top"></slot>
        </div>
      </el-collapse-transition>
      <div class="collapseBtn" @click="show = !show">{{show?"收起":"展开"}} </div>
    </div>
    <div class="collapseBox">
      <div class="collapseBoxMain">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AA",
  data() {
    return {
      show: true,
    }
  },
  mounted() { },
  methods: {}
}
</script>

<style lang='css' scoped>
.elementCollapse {
  width: 98%;
  height: 100%;
  margin: 0 auto;
  padding-top: 0.1rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.collapseBtn {
  width: 100%;
  height: 2vh;
  line-height: 2vh;
  text-align: center;
  font-size: 0.16rem;
  color: #000;
  background-color: aqua;
  cursor: pointer;
}
.collapseHeaderBox {
  height: calc(100% - 2vh);
}
.collapseHeader {
  background-color: rgb(201, 204, 18);
}

.collapseBox {
  margin-top: 1vh;
  flex: 1;
}
.collapseBoxMain {
  width: 100%;
  height: calc(100% - 1vh);
  background-color: rgb(102, 204, 18);
}
</style>
