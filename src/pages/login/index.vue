<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-05-28 16:49:33
 * @LastEditTime: 2021-06-16 17:48:07
 * @LastEditors: fjt
-->
<template>
    <div class="le-login">
        <div class="le-login__content">
            <div class="le-content__body">
                <div class="le-body__icon"></div>
                <div class="le-body__form">
                    <div class="le-form__item">
                        <div class="le-label">手机号</div>
                        <el-input v-model="postData.mobile" autocomplete="off" class="le-value"></el-input>
                    </div>
                    <div class="le-form__item">
                        <div class="le-label">密码</div>
                        <el-input v-model="postData.password" autocomplete="off" type="password" class="le-value" @keydown.enter.native="submitForm"></el-input>
                    </div>
                    <el-button :loading="loading" class="le-login-submit" :disabled="disabled" @click="submitForm()">登录</el-button>
                </div>
            </div>
        </div>
        <div class="le-record flex align-center" v-if="record_number_a || record_number_b">
            <img class="le-publick-security" src="../../assets/images/public-security.png" mode="" />
            <a class="le-a" href="http://www.beian.gov.cn/portal/registerSystemInfo?spm=5176.19720258.J_9220772140.112.8dc02c4amhFjAg" type="__blank">{{ record_number_a }}</a>
            <a class="le-a" href="https://beian.miit.gov.cn/?spm=5176.19720258.J_9220772140.113.8dc02c4amhFjAg#/Integrated/index">{{ record_number_b }}</a>
        </div>
    </div>
</template>
<script type="text/javascript">
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("setting");

export default {
    data() {
        return {
            postData: {
                mobile: "",
                password: "",
            },
            loading: false,
            record_number_a: "",
            record_number_b: "",
        };
    },
    computed: {
        disabled: function() {
            return !(this.postData.mobile && this.postData.password);
        },
    },
    mounted() {
        this.getRecord();
    },
    methods: {
        ...mapActions(["getSettingInfo"]),
        submitForm() {
            if (this.disabled) return;
            this.loading = true;
            this.$heshop.login("post", this.postData).then((data) => {
                    this.loading = false;
                    this.$store.commit("apply/login", data);
                    this.getSettingInfo();
                    setTimeout(() => {
                        this.$router.push({ path: `/panel/index` }).catch((error) => {
                            console.error("路由跳转错误", error);
                        });
                    }, 1000);
                }).catch((err) => {
                    this.loading = false;
                    if (err.data && err.data.message) {
                        this.$message.error(err.data.message);
                    } else {
                        this.$message.error("系统出错");
                    }
                });
        },
        getRecord: function() {
            this.$heshop
                .setting(
                    "put", {
                        include: "setting",
                    }, {
                        keyword: "web_setting",
                    }
                )
                .then((res) => {
                    console.log(res);
                    this.record_number_b = res.record_number_b;
                    this.record_number_a = res.record_number_a;
                });
        },
    },
};
</script>
<style lang="less" scoped>
@import "./login.less";
</style>