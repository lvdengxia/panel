<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-06-11 17:55:10
 * @LastEditTime: 2021-06-15 18:28:49
 * @LastEditors: fjt
-->
<script>
export default {
  data() {
    return {
      loading: true,
      submitLoading: false,
      form: {
        ico_url: "",
        record_number_a: "",
        record_number_b: "",
      },
    };
  },
  render() {
    return (
      <div>
        <el-form label-width="200px" v-loading={this.loading}>
          <div class="le-card">
            <div class="le-head flex align-center">
              <span class="le-title-line"></span>
              <span class="le-title">favicon.ico上传</span>
            </div>
            <el-form-item label="ico上传">
              <div class="select-cover__120">
                <div class="select-cover__120-add">
                  <input
                    type="file"
                    onChange={this.handleFileChange}
                    class="le-file-input"
                    id="file-input"
                    accept="image/x-png"
                  ></input>
                  <i class="le-icon le-icon-add select-cover__120-icon"></i>
                  <span class="select-cover__120-text">上传二维码</span>
                </div>
                {(() => {
                  if (this.form.ico_url) {
                    return (
                      <div class="select-cover__120-edit">
                        <el-image
                          src={this.form.ico_url}
                          fit="cover"
                        ></el-image>
                        <div class="select-cover__120-tips">
                          <span
                            onClick={() => {
                              document.getElementById("file-input").click();
                            }}
                          >
                            替换
                          </span>{" "}
                          |
                          <span
                            onClick={() => {
                              this.form.ico_url = "";
                              console.log(
                                document.getElementById("file-input").value
                              );
                            }}
                          >
                            删除
                          </span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
              <div class="le-prompt-text">
                仅支持.ico格式文件，尺寸要求32*32像素
              </div>
            </el-form-item>
          </div>
          <div class="le-card">
            <div class="le-head flex align-center">
              <span class="le-title-line"></span>
              <span class="le-title">备案信息</span>
            </div>
            <div class="le-tip">
              应工信部的要求，请务必填写公安备案号和网站备案号，保存的备案信息，将展示在后台登录页面。
            </div>
            <el-form-item label="公安备案号">
              <el-input
                v-model={this.form.record_number_a}
                placeholder="请输入公安备案号"
              ></el-input>
            </el-form-item>
            <el-form-item label="网站备案号(ICP)">
              <el-input
                v-model={this.form.record_number_b}
                placeholder="请输入网站备案号"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="le-cardpin">
          <el-button
            type="primary"
            disabled={this.loading}
            loading={this.submitLoading}
            onClick={this.submit}
          >
            保存
          </el-button>
        </div>
      </div>
    );
  },
  methods: {
    submit: function () {
      this.submitLoading = true;
      this.$heshop
        .setting("post", {
          keyword: "web_setting",
          content: this.form,
        })
        .then(() => {
          this.submitLoading = false;
          this.$message.success("保存成功");
        })
        .catch((err) => {
          this.$message.error(err.data.message);
        });
    },
    handleFileChange: function (e) {
      let file = e.target.files[0];
      let formData = new FormData();
      let _this = this;
      formData.append("file", file, "favicon.ico");
      this.$heshop
        .file(formData, { behavior: "upload" })
        .then((e) => {
          _this.form.ico_url = e;
        })
        .catch((err) => {
          console.error("数据出出力", err);
        });
    },
    getDetail: function () {
      this.$heshop
        .search(
          "post",
          {
            include: "setting",
          },
          {
            keyword: "web_setting",
          }
        )
        .then((e) => {
          if (e) {
            this.form = e.content;
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.data.message);
        });
    },
  },
  mounted() {
    this.getDetail();
  },
};
</script>

<style lang="scss" scoped>
.le-card {
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
}
.le-head {
  margin-bottom: 24px;
}
.le-title-line {
  width: 4px;
  height: 16px;
  background: #623ceb;
  display: inline-block;
}

.le-title {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  opacity: 0.85;
  margin-left: 12px;
}
.le-tip {
  padding-left: 24px;
  height: 40px;
  line-height: 40px;
  background: #fff5d1;
  border-radius: 8px;
  margin-bottom: 25px;
}
.le-prompt-text {
  margin-top: 8px;
}
.le-file-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.select-cover__120-edit {
  position: absolute;
  top: 0;
  background: #fff;
}
</style>
