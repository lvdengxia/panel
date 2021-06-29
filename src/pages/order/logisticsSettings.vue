<template>
  <el-form label-width="120px" class="le-card">
    <el-form-item label="物流查询来源"> 快宝开放平台 </el-form-item>
    <el-form-item label="用户ID">
      <el-input v-model="app_id"></el-input>
    </el-form-item>
    <el-form-item label="API key">
      <el-input v-model="app_key"></el-input>
      <a
        target="_blank"
        href="https://open.kuaidihelp.com/register?channel=leadshop"
        class="le-router"
        >快宝开放平台接口申请</a
      >
    </el-form-item>
    <div class="le-cardpin">
      <el-button @click="submit" type="primary">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "logisticsSettings",
  data() {
    return {
      app_id: "",
      app_key: ""
    };
  },
  methods: {
    submit: function () {
      let _this = this;
      this.$heshop
        .setting("post", {
          keyword: "kb_express_setting",
          content: {
            app_id: this.app_id,
            app_key: this.app_key,
          },
        })
        .then(() => {
          if (_this.app_id) {
            _this.$message.success("保存成功");
          } else {
            _this.$message.success("请设置物流配置");
          }
        })
        .catch(() => {
          _this.$message.error("保存失败");
        });
    },
    search: function () {
      let _this = this;
      this.$heshop
        .search(
          "post",
          { include: "setting" },
          {
            keyword: "kb_express_setting",
          }
        )
        .then(function (res) {
          _this.app_id = res.content.app_id;
          _this.app_key = res.content.app_key;
        });
    },
  },
  mounted() {
    this.search();
  },
};
</script>

<style scoped>
.le-card {
  background-color: #ffffff;
  padding: 24px;
}

.le-router {
  display: block;
  color: #623ceb;
}
</style>