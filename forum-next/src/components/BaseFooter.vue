<template>
  <div class="footer_wrap">
    <div class="my-container inner">
      <div class="info">
        Copyright&nbsp;&copy;&nbsp;2021&nbsp; | by Tonyang
        <el-popover placement="top-start" width="200" trigger="hover">
          <div class="dep_wrap">
            <div class="dep_item">
              <img src="@/assets/vue.png" />
              <span>Vue.js</span>
            </div>
            <div class="dep_item">
              <img src="@/assets/axios.png" />
              <span>Axios.js</span>
            </div>
            <div class="dep_item">
              <img src="@/assets/moment.png" />
              <span>Moment.js</span>
            </div>
            <div class="dep_item">
              <img src="@/assets/element.png" />
              <span>Element-ui</span>
            </div>
            <div class="dep_item">
              <img src="@/assets/sass.png" />
              <span>Sass</span>
            </div>
          </div>
          <template #reference>
            <div class="dependency">技术依赖</div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer_wrap {
  height: $footer-height;
  background: #fff;
  .inner {
    height: $footer-height;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .info {
      font-size: 18px;
      font-weight: bold;
      color: #666;
      text-align: center;
    }
    .dependency {
      cursor: pointer;
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #d9ecff;
      display: inline-block;
      border-radius: 5px;
      font-size: 12px;
      width: 65px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      margin-left: 15px;
    }
  }
}
.dep_wrap {
  .dep_item {
    display: flex;
    align-items: center;
    padding: 5px 0;
    img {
      display: inline-block;
      height: 25px;
      margin-right: 10px;
    }
  }
}
</style>
