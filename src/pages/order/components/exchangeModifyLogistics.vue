<template>
  <el-form
    :model="form"
    label-width="125px"
    :rules="rules"
    ref="ruleForm"
    class="he-matter"
  >
    <el-form-item label="发货信息">
      <div class="he-delivery-information">
        {{ value.item.buyer.name }} {{ value.item.buyer.mobile }}<br />
        {{ value.item.buyer.address }}
      </div>
    </el-form-item>
    <el-form-item label="发货方式">
      <el-radio-group v-model="form.type">
        <el-radio :label="1">自己联系快递</el-radio>
        <el-radio :label="2">无需物流</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="form.type === 1">
      <el-form-item label="物流公司" prop="logistics_company">
        <el-autocomplete
          v-model="form.logistics_company"
          :fetch-suggestions="querySearchAsync"
          placeholder="请选择或输入物流公司"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="快递单号" prop="freight_sn">
        <el-input
          maxlength="20"
          placeholder="请输入快递单号"
          onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
          v-model="form.freight_sn"
        ></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
export default {
  name: "modifyLogistics",
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        type: 1,
        logistics_company: "",
        code: "unknown",
        freight_sn: "",
        order_sn: "",
      },
      rules: {
        freight_sn: [
          { required: true, message: "请输入快递单号", trigger: "blur" },
        ],
        logistics_company: [
          { required: true, message: "请输入物流公司名称", trigger: "change" },
        ],
      },
      express: [],
      loading: false,
      timeout: null,
    };
  },
  methods: {
    affirm(e) {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$heshop
            .orderafter(
              "put",
              { id: this.value.item.id, behavior: "exchangefreight" },
              { merchant_freight_info: this.form }
            )
            .then(() => {
              this.value.item.merchant_freight_info.freight_sn =
                this.form.freight_sn;
              this.value.item.merchant_freight_info.logistics_company =
                this.form.logistics_company;
              this.value.item.merchant_freight_info.type = this.form.type;
              this.value.item.merchant_freight_info.code = this.form.code;
              this.$message.success("修改物流成功");
              let { handleClose } = e;
              handleClose();
            })
            .catch((err) => {
              if (err.data[0]) {
                err.data.forEach((v) => {
                  this.$message.error(v.message);
                });
              } else {
                this.$message.error(err.data.message);
              }
            });
        } else {
          return false;
        }
      });
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.express;
      let results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.form.code = item.label;
    },
  },
  watch: {
    "value.item": {
      handler(newVal) {
        console.log();
        this.form.order_sn = newVal.order_sn;
        if (!newVal.merchant_freight_info) return;
        let { logistics_company, type, freight_sn, code } =
          newVal.merchant_freight_info;
        this.form.freight_sn = freight_sn;
        this.form.logistics_company = logistics_company;
        this.form.type = type;
        this.form.code = code;
      },
      immediate: true,
    },
  },
  mounted() {
    let _this = this;
    this.$heshop
      .search(
        "post",
        {
          include: "setting",
        },
        {
          keyword: "expressjson",
        }
      )
      .then(function (response) {
        _this.express = response.map((item) => {
          return { value: item.name, label: item.code };
        });
      });
  },
};
</script>
<style scoped lang="scss">
.he-delivery-information {
  width: 269px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
  opacity: 0.85;
  padding-top: 6px;
}
</style>
