<template>
  <div class="top-popover">
    <div class="top-div">
      <p class="titlep">
        <slot name="reference"></slot>
      </p>
      <div class="popover-div">
        <slot name="popover"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="less">
.top-popover {
  .el-radio-button__inner {
    border: 0px;
    background-color: transparent;
    border-radius: 3px;
    font-size: 14px;
    color: #666;
  }
  .el-input__inner {
    background: #f0f3fa;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-left: 0px;
    border-radius: 3px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 3px;
  }
}
</style>
<style scoped lang="less">
.top-popover {
  .top-div {
    height: 36px;
    position: relative;
    cursor: pointer;
    z-index: 1000;

    &:hover {
      .popover-div {
        display: block;
      }
    }
    .titlep {
      color: #3399ff;
      font-weight: 600;
      line-height: 36px;
      text-align: center;
    }

    .popover-div {
      padding: 20px;
      position: absolute;
      width: 700px;
      z-index: 99;
      background-color: #f2f5fc;
      
      border: 1px solid #3399ff;
      //border-left: 0px;
      line-height: 40px;
      display: block;
    }
  }
}
</style>