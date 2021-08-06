<template>
    <el-form ref="form" :model="value" label-width="160px" class="he-add-logistic">
        <el-form-item label="搬运模板">
            <el-button
                type="primary" plain
                class="he-class__button"
                title="添加模板">
                添加模板
            </el-button>
            <el-button
                type="primary" plain
                class="he-class__button"
                module="goods"
                v-popup.chooseTransport="transport"
                title="选择模板">
                选择模板
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "addTransport",
        props: {
            value: Object
        },
        data() {
            return {
                transport:{

                }
            }
        },
        // computed: {
        //     temp: {
        //         get: function () {
        //             return this.value.transport;
        //         },
        //         set: function (val) {
        //             this.value.transport = val;
        //         },
        //     }
        // }
    }
</script>

<style scoped>
    .he-margin-right {
        margin-right: 8px;
    }

    .he-tips {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        opacity: 0.45;
    }

    .he-delivery {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        opacity: 0.85;
    }

    .le-line-btn {
        width: 1px;
        height: 15px;
        display: inline-block;
        background-color: #5e00ff;
        margin: 0 10px;
    }

    .he-btn {
        margin-left: 15px;
    }

    .he-btn .el-button {
        padding: 0;
    }

    .le-label__require:before {
        content: "*";
        color: red;
    }
</style>