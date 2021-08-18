<template>
    <div class="le-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="javascript:history.back()">搬运模板</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                {{$route.query.id ? '编辑搬运模板' : '新增搬运模板'}}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="le-card"
                 :model="form"
                 :rules="rules"
                 ref="form"
                 v-loading="loading"
                 label-width="164px">

            <el-steps :active="active" finish-status="success">
                <el-step title="正常楼梯"></el-step>
                <el-step title="正常电梯"></el-step>
                <el-step title="商务楼梯"></el-step>
                <el-step title="复式电梯"></el-step>
                <el-step title="正常别墅"></el-step>
                <el-step title="阁楼别墅"></el-step>
                <el-step title="地下车库-正常电梯"></el-step>
                <el-step title="地下车库-复式电梯"></el-step>
                <el-step title="地下车库-正常别墅"></el-step>
                <el-step title="地下车库-阁楼别墅"></el-step>
            </el-steps>

            <div class="box">
                <el-form-item label="搬运模板名称" prop="temp_name">
                    <el-input
                            maxlength="15"
                            show-word-limit
                            v-model="form.temp_name"
                            class="le-input--500"
                            placeholder="请输入搬运模板名称(例如：商品名称-楼梯类型)"
                    />
                </el-form-item>
                <el-form-item label="搬运内容" prop="temp_details" class="le-content">
                    <div class="le-parameter" v-for="(item,index) in form.temp_details" :key="index">
                        <el-form-item label="楼层" label-width="82px" :key="index + '_name'">
                            <el-input
                                    v-model="item.level"
                                    class="le-input--240"
                                    placeholder="请输入楼层">
                                <template slot="append">层</template>
                            </el-input>
                            <div class="le-prompt-text">示例：-1楼；-2楼；-3楼</div>
                        </el-form-item>
                        <el-form-item label="费用" label-width="82px" :key="index + '_value'">
                            <el-input
                                    v-model="item.money"
                                    class="le-input--240"
                                    placeholder="请输入费用">
                                <template slot="append">元</template>
                            </el-input>
                            <div class="le-prompt-text">示例：5；10；20</div>
                        </el-form-item>
                        <div v-if="index > 0" class="le-deletion le-icon le-icon-cha2" @click="deletionParameter(index)"></div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button @click="pushParameter" plain>
                        添加搬运
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="le-cardpin">
            <el-button
                    type="primary"
                    :disabled="disabled"
                    :loading="loading && !disabled"
                    @click="submit">
                {{active >= 6 ? "保存" : "保存并下一步"}}
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "transportTemplateEdit",
        data() {
            return {
                form: {
                    temp_name: '',
                    temp_details: [
                        {
                            level: '',
                            money: ''
                        }
                    ]
                },
                rules: {
                    temp_name: [
                        {
                            required: true,
                            message: '搬运模板名称不能为空'
                        }
                    ],
                    temp_details: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                for (let i = 0; i < value.length; i++) {
                                    if (!value[i].money || !value[i].level) {
                                        callback('搬运楼层或费用不能为空');
                                    }
                                }
                                callback();
                            }
                        }
                    ]
                },
                loading: false,
                disabled: false,
                is_close: false,
                active:0
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.disabled = true;
                this.getDetail(this.$route.query.id);
            }
        },
        methods: {
            pushParameter() {
                this.form.temp_details.push({
                    level: '',
                    money: ''
                });
            },
            deletionParameter(index) {
                if (this.form.temp_details.length <= 1) return;
                this.$delete(this.form.temp_details, index);
            },
            submit() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        let method = undefined;
                        if (this.form.id) {
                            method = 'post';
                        } else {
                            method = 'post';
                        }
                        let data = this.$heshop.utils.deepClone(this.form);
                        console.log(data);
                        this.$heshop
                            .temp(method, data)
                            .then(res => {
                                this.$message.success('保存成功');
                                this.loading = false;
                                this.form =  {
                                    temp_name: '',
                                        temp_details: [
                                        {
                                            level: '',
                                            money: ''
                                        }
                                    ]
                                };
                                this.active++;
                                if (this.active >= 6) {
                                    this.$router.push({
                                        path: '/goods/transportTemplate'
                                    });
                                }
                            })
                            .catch(err => {
                                if (err.data[0]) {
                                    this.$message.error(err.data[0].message);
                                } else {
                                    this.$message.error(err.data.message);
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            getDetail(id) {
                this.$heshop
                    .temp('get', {temp_id:id})
                    .then(res => {
                        this.form.temp_name = res.res[0].temp_name;
                        this.form.id = res.res[0].temp_id;
                        this.form.temp_details = res.res[0].detail;
                        this.disabled = false;
                    })
                    .catch(error => {
                        this.$message.error(error.data.message);
                    });
            }
        }
    }
</script>

<style scoped lang="scss">
    .le-card {
        background: #fff;
        margin-top: 24px;
        padding: 40px;
    }

    .le-input--240 {
        width: 240px;
    }

    .le-input--500 {
        width: 500px;
    }

    .le-input--600 {
        width: 600px;
    }

    .le-prompt-text {
        margin-top: 5px;
    }

    .le-parameter {
        width: 500px;
        height: 244px;
        background: #f3f5f7;
        border-radius: 4px;
        padding: 24px 0 0 0;
        position: relative;
        margin-bottom: 16px;

        .le-deletion {
            height: auto;
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
            width: 16px;
            transform: translate(50%, -50%);
            opacity: 0;
        }

        &:hover {
            .le-deletion {
                opacity: 1;
            }
        }
    }

    /deep/ .le-content.el-form-item.is-error.is-required {
        .el-input__inner,
        .el-textarea__inner {
            border-color: #dcdfe6 !important;
        }
    }
    .box{
        margin-top: 40px;
    }
</style>