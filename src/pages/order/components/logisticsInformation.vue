<template>
    <div>
        <template v-if="value.freight.type ===1">
            <div class="le-header flex align-center">
                <span class="le-header--label">物流公司:</span>
                <span class="le-header--value">{{value.freight.logistics_company}}</span>
                <span class="le-header--label">快递单号:</span>
                <span class="le-header--value">{{value.freight.freight_sn}}</span>
                <span @click="copyTrackingNumber" class="le-header--copy">复制</span>
                <input id="copy-tracking-number" :value="value.freight.freight_sn">
            </div>
            <div class="le-body" v-loading="loading">
                <div style="padding:20px;" v-if="state !== 0" class="le-desc">{{message}}</div>
                <logistics-step :list="list" v-if="state === 0"></logistics-step>
            </div>
        </template>
        <template v-else-if="value.freight.type ===3">
            <el-form label-width="210px" class="le-matter">
                <el-form-item label="发货方式：">
                    <span  class="le-text">沪上帮司机自配送</span>
                </el-form-item>
                <el-form-item label="物流状态">
                    <span v-if="value.freight.drive_name===1" class="le-text">等待司机师傅接单</span>
                    <span v-else-if="value.freight.drive_name===2" class="le-text">司机确认接单</span>
                    <span v-else-if="value.freight.drive_name===3" class="le-text">确认装货完成</span>
                    <span v-else-if="value.freight.drive_name===4" class="le-text">用户确认收货</span>
                    <span v-else class="le-text">未知</span>
                </el-form-item>
            </el-form>
        </template>
        <template v-else-if="value.freight.type ===4">
            <el-form label-width="210px" class="le-matter">
                <el-form-item label="第三方物流司机师傅：">
                    <span  class="le-text">{{value.freight.drive_name}}</span>
                </el-form-item>
                <el-form-item label="司机师傅联系方式：">
                    <span  class="le-text">{{value.freight.drive_mobile}}</span>
                </el-form-item>
            </el-form>
        </template>
        <el-form label-width="110px" class="le-matter" v-else>
            <el-form-item label="发货方式：">
                <span  class="le-text">无需物流</span>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import logisticsStep from "./logisticsStep";

export default {
    name: "logisticsInformation",
    components: {
        logisticsStep
    },
    props: {
        value: {
            type: Object
        }
    },
    data() {
        return {
            list: [],
            loading: false,
            state: 1,
            message:""
        }
    },
    methods: {
        getExpress: function () {
            let _this = this;
            this.loading = true;
            this.$heshop.express('post', {
                no: this.value.freight.freight_sn,
                mobile: this.value.buyer.mobile,
                name: this.value.freight.logistics_company,
                code: this.value.freight.code
            }).then(function (res) {
                console.log(res);
                _this.state = res.state;
                if (parseInt(res.state) !== 0) {
                    _this.message = res.message
                } else {
                    _this.list = res.list;
                }
                _this.loading = false;
            }).catch(function (err) {
                _this.loading = false;
                if (err.status === 403) {
                    _this.$message.error(err.data.message);
                }
            })
        },
        affirm(e) {
            let {handleClose} = e;
            handleClose();
        },
        copyTrackingNumber: function() {
            let input = document.getElementById("copy-tracking-number");
            input.select();
            document.execCommand("copy");
            this.$message.success('复制成功');
        },
    },
    mounted() {
        if (this.value.freight.type ===1) {
            this.getExpress();
        }
    }
}
</script>
<style scoped lang="scss">
.le-header {
    width: 660px;
    height: 40px;
    background: #F3F5F7;
    .le-header--label {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #8C8C8C;
        margin-right: 12px;
        margin-left: 24px;
    }
    .le-header-value {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #262626;
    }
    .le-header--copy {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #623CEB;
        opacity: 0.85;
        padding: 0 14px;
        margin: 0 10px;
        cursor: pointer;
    }
}

.le-body {
    width: 660px;
    height: 260px;
    margin-top: 4px;
    border: 1px solid #DCDFE6;
}

/deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
}
.le-desc {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
}
.le-time-line {
    width: 658px;
    padding-left: 40px;
    padding-top: 24px;

    .le-time-item {
        position: relative;
        border-left: 1px solid #E5E5E5;
        min-height: 50px;
        padding-bottom: 23px;
        .le-item-content {
            margin-left: 20px;
            position: absolute;
            top: -3px;
        }

        .le-datetime {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #8C8C8C;
            line-height: 18px;
            margin-top: 11px;
        }
    }
    .le-time-item:last-child {
        border-left: none;
    }

    .le-dot {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        position: absolute;
        left: -5px;
    }
    .le-dot--default {
        background: #DCDFE6;
    }
    .le-dot--first {
        background-color: #623CEB;
    }
}
#copy-tracking-number {
    background-color: #ffffff;
    border: none;
    opacity: 0;
    position: absolute;
    z-index: -10;
}
</style>
