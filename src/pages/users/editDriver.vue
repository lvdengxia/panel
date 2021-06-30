<template>
    <el-form class="le-matter" label-width="170px" ref="form" :model="form" :rules="rules" @submit.native.prevent>
        <el-breadcrumb class="he-link-text" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="he-link">
                <he-link href="users/driver">司机管理</he-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                {{$route.query.id ? '编辑司机' : '新增司机'}}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="le-card" v-loading="loading">
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">司机姓名</span>
                <el-input v-model="form.name" maxlength="8" show-word-limit></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">手机号</span>
                <el-input v-model="form.name" maxlength="8" show-word-limit></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">密码</span>
                <el-input v-model="form.name" maxlength="16" show-word-limit></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">车牌号</span>
                <el-input v-model="form.name">
                    <!--<template slot="append">-->
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                    v-for="item in [{value: '选项1',label: '黄金糕'}, {value: '选项2',label: '双皮奶'}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    <!--</template>-->
                </el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">载重</span>
                <el-input v-model="form.name">
                    <template slot="append">吨</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">驾驶证</span>
                <el-input v-model="form.name" maxlength="8" show-word-limit></el-input>
            </el-form-item>
        </div>
        <div class="le-cardpin">
            <el-button :disabled="loading" @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit" :disabled="loading">保存</el-button>
        </div>
    </el-form>
</template>

<script>

export default {
    name: "editLabel",
    components: {

    },
    data() {
        return {
            rules: {
                name: [
                    {required: true, message: '请输入标签名称', trigger: 'blur'},
                ]
            },
            form: {
                type: 1,
                name: '',
                status: 1,
                conditions_status: 1,
                conditions_setting: {
                    shopping_time: {
                        checked: false,
                        value: {
                            start: '',
                            end: ''
                        }
                    },
                    shopping_group: {
                        checked: false,
                        value: []
                    },
                    shopping_goods: {
                        checked: false,
                        value: []
                    },
                    shopping_amount: {
                        checked: false,
                        value: ''
                    },
                    shopping_number: {
                        checked: false,
                        value: ''
                    }
                },
                filter_user: [],
            },
            catObject: {
                cat: [],
                result: []
            },
            loading: true,
            catTree: []
        }
    },
    methods: {
        openGroup: function (e) {
            let list = [];
            for (let i = 0; i < e.result.length; i++) {
                let item = e.result[i];
                if (!item.children) list.push(item);
            }
            this.catObject.result = list;
            this.form.conditions_setting.shopping_group.value = this.catObject.result.map(v => {
                return v.id;
            });
        },
        async getGroupList() {
            this.catObject.cat = await this.$heshop.group('get', {include: 'goods'});
            let catList = this.$heshop.toTree({
                parentKey: 'parent_id',
                idKey: 'id',
                parentId: 0,
                childrenKey: 'children'
            }).on(this.catObject.cat).get();
            catList.forEach(cat1 => {
                cat1.value = cat1.name;
                if (cat1.children) {
                    cat1.children.forEach(cat2 => {
                        cat2.value = `${cat1.value} > ${cat2.name}`;
                        if (cat2.children) {
                            cat2.children.forEach(cat3 => {
                                cat3.value = `${cat2.value} > ${cat3.name}`;
                            });
                        }
                    });
                }
            });
            this.catTree = catList;
        },
        chooseUser:function(e){
            this.form.filter_user = e.item;
        },
        deleteTag: function (item, index) {
            this.catObject.result.splice(index, 1);
            let path = item.path.split('-').map(Number);
            let level = path.length;
            if (level === 3) {
                let p_deleted = false; //父级是否被删除,保证每次只删除一个
                let p2_deleted = false; //父父级是否被删除,保证每次只删除一个
                this.catObject.result.forEach((v, k) => {
                    if (v.id === path[1]) {
                        if (!p2_deleted) {
                            p2_deleted = true;
                            this.catObject.result.splice(k, 1);
                        }
                        this.catObject.result.forEach((v2, k2) => {
                            if (v2.id === path[2]) {
                                if (!p_deleted) {
                                    p_deleted = true;
                                    this.catObject.result.splice(k2, 1);
                                }
                            }
                        })
                    }
                })
            } else if (level === 2) {
                let p_deleted = false;
                this.catObject.result.forEach((v, k) => {
                    if (v.id === path[1]) {
                        if (!p_deleted) {
                            p_deleted = true;
                            this.catObject.result.splice(k, 1);
                        }
                    }
                });
            }
            this.form.conditions_setting.shopping_group.value = this.catObject.result.map(v => {
                return v.id;
            });
        },
        submit: function () {
            let _this = this;
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    _this.loading = true;
                    if (_this.form.type === 1) {
                        _this.form.conditions_setting = null;
                        _this.$delete(_this.form, 'filter_user');
                        _this.$delete(_this.form, 'conditions_status');
                        _this.$delete(_this.form, 'status');
                    } else {
                        let {shopping_time, shopping_group, shopping_goods, shopping_amount, shopping_number} = _this.form.conditions_setting;
                        if (!shopping_time.checked && !shopping_amount.checked && !shopping_number.checked && !shopping_goods.checked && !shopping_group.checked) {
                            _this.loading = false;
                            _this.$message.error('请至少设置一个打标条件');
                            return;
                        }
                        if (shopping_time.checked) {
                            let {start, end} = shopping_time.value;
                            if (!start && !end) {
                                _this.loading = false;
                                _this.$message.error('消费时间不能为空');
                                return;
                            } else if (!start && end) {
                                _this.loading = false;
                                _this.$message.error('消费开始时间不能为空');
                                return;
                            } else if (start && !end) {
                                _this.loading = false;
                                _this.$message.error('消费结束时间不能为空');
                                return;
                            }
                            if (start >= end) {
                                _this.loading = false;
                                _this.$message.error('消费时间开始时间必须小于结束时间');
                                return;
                            }
                        }
                        if (shopping_number.checked) {
                            if (!shopping_number.value) {
                                _this.loading = false;
                                _this.$message.error('消费次数不能为空');
                                return;
                            }
                        }
                        if (shopping_amount.checked) {
                            if (!shopping_amount.value) {
                                _this.loading = false;
                                _this.$message.error('消费金额不能为空');
                                return;
                            }
                        }
                        if (shopping_goods.checked) {
                            if (shopping_goods.value.length === 0) {
                                _this.loading = false;
                                _this.$message.error('购买指定商品不能为空');
                                return;
                            }
                        }
                        if (shopping_group.checked) {
                            if (shopping_group.value.length === 0) {
                                _this.loading = false;
                                _this.$message.error('购买指定分类不能为空');
                                return;
                            }
                        }
                        if (shopping_time.checked) {
                            let {start, end} = shopping_time.value;
                            start = start + '';
                            shopping_time.value.start = parseInt(start.substring(0, start.length-3));
                            end = end + '';
                            shopping_time.value.end = parseInt(end.substring(0, end.length-3));
                            _this.form.conditions_setting.shopping_group.value = _this.catObject.result;
                        }
                    }
                    if (_this.$route.query.id) {
                        _this.$heshop.userlabel('put', {id: _this.$route.query.id}, _this.form).then(function () {
                            _this.cancel();
                        }).catch(function (error) {
                            _this.loading = false;
                            if (error.status === 403) {
                                _this.$message.error(error.data.message);
                            }
                        });
                    } else {
                        _this.$heshop.users('post', _this.form).then(function () {
                            _this.cancel();
                        }).catch(function (error) {
                            _this.loading = false;
                            if (error.status === 403) {
                                _this.$message.error(error.data.message);
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        cancel: function () {
            this.$router.replace({
                path: "/users/userLabel",
                query: {
                    type: this.form.type
                }
            })
        },
        getDetail: function (id) {
            let _this = this;
            this.$heshop.userlabel('get', id).then(function (response) {
               _this.form = response;
               if (response.type === 1) return;
               let group = _this.form.conditions_setting.shopping_group.value;
                let {shopping_time} = _this.form.conditions_setting;
                if (shopping_time.checked) {
                    let {start, end} = shopping_time.value;
                    start = start + '000';
                    end = end + '000';
                    shopping_time.value.start = parseInt(start);
                    shopping_time.value.end = parseInt(end);
                }
                let data = [];
                group.forEach(key => {
                    _this.catTree.forEach(item => {
                        if (item.id == key.id) {
                            data.push(item);
                        }
                        if (item.children) {
                            item.children.forEach(item2 => {
                                if (item2.id == key.id) {
                                    data.push(item2);
                                }
                                if (item2.children) {
                                    item2.children.forEach(item3 => {
                                        if (item3.id == key.id) {
                                            data.push(item3);
                                        }
                                    })
                                }
                            });
                        }
                    });
                });
               _this.catObject.result = data;
            });
        },
        checkAmount: function () {
            let price = '' + this.form.conditions_setting.shopping_amount.value;
            price = price
                .replace(/[^\d.]/g, '')
                .replace(/\.{2,}/g, '.')
                .replace(/^\./g, '')
                .replace('.', '$#$')
                .replace(/\./g, '')
                .replace('$#$', '.')
                .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            if (price.indexOf('.') < 0 && price != '') {
                price = parseFloat(price);
            }
            this.form.conditions_setting.shopping_amount.value = price;
        },
        checkNumber: function () {
            let number = '' + this.form.conditions_setting.shopping_number.value;
            number = number
                .replace(/[^\d]/g, '')
            if (number.indexOf('.') < 0 && number != '') {
                number = parseFloat(number);
            }
            this.form.conditions_setting.shopping_number.value = number;
        }
    },
    async mounted() {
        await this.getGroupList();
        this.loading = false;
        let id = this.$route.query.id;
        let type = this.$route.query.type;
        await id ? this.getDetail(parseInt(id)) : this.form.type = parseInt(type);
    }
}
</script>

<style scoped lang="scss">
@import "./css/editLabel.less";

.el-select{
    width: 100px;
}

.le-matter /deep/.he-searchInput {
    width:447px;
}
</style>