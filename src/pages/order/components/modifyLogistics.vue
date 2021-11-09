<template>
    <el-form :model="form" label-width="125px" :rules="rules" ref="ruleForm" class="he-matter">
        <el-form-item label="发货信息">
            <div class="he-delivery-information">
                {{ value.item.buyer.name }} {{ value.item.buyer.mobile }}<br/>
                {{ value.item.buyer.address }}
            </div>
        </el-form-item>
        <el-form-item label="发货方式">
            <el-radio-group v-model="form.type">
                <el-radio :label="1">自己联系快递111</el-radio>
                <el-radio :label="2">无需物流</el-radio>
                <el-radio :label="3">分配给司机</el-radio>
                <el-radio :label="4">货拉拉</el-radio>
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
                <el-input maxlength="20" placeholder="请输入快递单号" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
                          v-model="form.freight_sn"></el-input>
            </el-form-item>
        </template>
        <template v-if="form.type === 3">
            <el-form-item label="选择司机" prop="drive_name">
                <el-autocomplete
                        v-model="form.drive_name"
                        :fetch-suggestions="driverSearchAsync"
                        placeholder="请选择或输入司机名称"
                        @select="handleDriverSelect"
                ></el-autocomplete>
            </el-form-item>
        </template>

        <template v-if="form.type === 4">
            <el-form-item label="司机名称" prop="drive_name">
                <el-input
                        maxlength="20"
                        placeholder="请输入货拉拉司机师傅名称"
                        v-model="form.drive_name"
                ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="drive_mobile">
                <el-input
                        maxlength="20"
                        placeholder="请输入货拉拉司机师傅手机号"
                        v-model="form.drive_mobile"
                ></el-input>
            </el-form-item>
        </template>

        <el-form-item label="物流管理员" prop="storekeeper">
            <el-select v-model="form.storekeeper" placeholder="请选择">
                <el-option
                        v-for="item in storekeepers"
                        :key="item.id"
                        :label="item.name + ' | ' + item.tel"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        name: "modifyLogistics",
        props: {
            value: {
                type: Object
            }
        },
        data() {
            return {
                form: {
                    type: 1,
                    logistics_company: '',
                    code: 'unknown',
                    freight_sn: '',
                    order_sn: '',
                    driver_id: '',
                    drive_name: '',
                    drive_mobile: '',
                    storekeeper:''

                },
                rules: {
                    freight_sn: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ],
                    logistics_company: [
                        {required: true, message: '请输入物流公司名称', trigger: 'change'}
                    ],
                    drive_name: [
                        {required: true, message: '请输入司机名称', trigger: 'change'}
                    ],
                    drive_mobile: [
                        {required: true, message: '请输入司机手机号', trigger: 'blur'},
                        {
                            validator: function (rule, value, callback) {
                                if (/^1[3456789]\d{9}$/.test(value) === false) {
                                    callback(new Error('手机号格式错误'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    storekeeper:[
                        {required: true, message: '请选择物流管理员', trigger: 'change'}
                    ]
                },
                express: [],
                drivers: [],
                loading: false,
                timeout: null,
                storekeepers:[]
            }
        },
        methods: {
            affirm(e) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.$heshop.order('put', {behavior: 'editfreight'}, this.form).then(() => {
                            this.value.item.freight.freight_sn = this.form.freight_sn;
                            this.value.item.freight.logistics_company = this.form.logistics_company;
                            this.value.item.freight.type = this.form.type;
                            this.value.item.freight.code = this.form.code;
                            this.value.item.freight.driver_id    = this.form.driver_id;
                            this.value.item.freight.drive_name   = this.form.drive_name;
                            this.value.item.freight.drive_mobile = this.form.drive_mobile;
                            this.$message.success('修改物流成功');
                            let {handleClose} = e;
                            handleClose();
                        }).catch(err => {
                            if (err.data[0]) {
                                err.data.forEach(v => {
                                    this.$message.error(v.message);
                                })
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
                let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },
            driverSearchAsync(queryString, cb) {
                let restaurants = this.drivers;
                let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                this.form.code = item.label;
            },
            handleDriverSelect(item) {
                this.form.drive_name = item.value;
                this.form.driver_id = item.label;
            }
        },
        watch: {
            'value.item': {
                handler(newVal) {
                    this.form.order_sn = newVal.order_sn;
                    if (!newVal.freight) return;
                    let {logistics_company, type, freight_sn, code,
                        driver_id, drive_name, drive_mobile} = newVal.freight;
                    this.form.freight_sn = freight_sn;
                    this.form.logistics_company = logistics_company;
                    this.form.type = type;
                    this.form.code = code;
                    this.form.driver_id    = driver_id;
                    this.form.drive_name   = drive_name;
                    this.form.drive_mobile = drive_mobile;
                },
                immediate: true
            }
        },
        mounted() {
            let _this = this;
            this.$heshop.search('post', {include: 'setting'},
                {keyword: 'expressjson'}).then(function (response) {
                _this.express = response.map(item => {
                    return {value: item.name, label: item.code};
                });
            });

            this.$heshop.siji("get").then((res) => {
                _this.drivers = res.res.map(item => {
                    return {value: item.name, label: item.id};
                });
            });

            this.$heshop.ckdaili("get").then((res) => {
                _this.storekeepers = res.res;
            });
        }
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

    /deep/ .el-radio {
        margin: 10px;
    }
</style>
