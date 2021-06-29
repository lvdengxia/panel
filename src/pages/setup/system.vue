<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-06-11 17:16:34
 * @LastEditTime: 2021-06-15 10:16:04
 * @LastEditors: fjt
-->

<script>
import cloudStorage from "./components/system/cloudStorage.vue";
import uploadLimitExceeded from "./components/system/uploadLimitExceeded.vue";
import siteInformation from "./components/system/siteInformation.vue";

export default {
  components: {
    cloudStorage,
    uploadLimitExceeded,
    siteInformation,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  render() {
    return (
      <div>
        <el-tabs class="le-tabs" v-model={this.activeName}>
          <el-tab-pane label="站点信息" name="first">
            <site-information></site-information>
          </el-tab-pane>
          <el-tab-pane lazy label="云存储" name="second">
            <cloud-storage></cloud-storage>
          </el-tab-pane>
          <el-tab-pane lazy label="上传超限" name="third">
            <upload-limit-exceeded></upload-limit-exceeded>
          </el-tab-pane>
        </el-tabs>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
::v-deep .le-tabs {
  .el-tabs__content {
    background: none;
    padding: 40px 0 0 0;
  }
  .el-tabs__header {
    .el-tabs__nav-scroll {
      background: #fff;
      padding-left: 44px;
      border-radius: 16px;
      .el-tabs__item {
        height: 64px;
        line-height: 64px;
      }
    }
  }
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
</style>
