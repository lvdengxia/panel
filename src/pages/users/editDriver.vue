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
                <el-input v-model="form.mobile" maxlength="11" show-word-limit></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">密码</span>
                <el-input v-model="form.pass"  type="password" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">车牌号</span>
                <el-input v-model="form.plate_number">
                    <!--<template slot="append">-->
                        <!--<el-select v-model="form.plate_color" placeholder="请选择">-->
                            <!--<el-option-->
                                    <!--v-for="item in [{value: '1',label: '黄牌'}, {value: '2',label: '蓝牌'}]"-->
                                    <!--:key="item.value"-->
                                    <!--:label="item.label"-->
                                    <!--:value="item.value">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</template>-->
                </el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">载重</span>
                <el-input v-model="form.load">
                    <template slot="append">吨</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label" class="le-form-item__label">驾驶证</span>
                <el-row>
                    <el-col :span="4" class="select-cover__120">
                        <pictureDialog v-model="form.credentials_front" :limit="1">
                            <div slot="upload" class="select-cover__120-add">
                                <i class="le-icon le-icon-add select-cover__120-icon"></i>
                                <span class="select-cover__120-text">驾驶证正面</span>
                            </div>
                            <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                                <el-image :src="scope.url" fit="cover"></el-image>
                                <div class="select-cover__120-tips">
                                    <span>替换</span> | <span @click.stop="(e)=>form.credentials_front=''">删除</span>
                                </div>
                            </div>
                        </pictureDialog>
                    </el-col>

                    <el-col :span="4" class="select-cover__120">
                        <pictureDialog v-model="form.credentials_contrary" :limit="1">
                            <div slot="upload" class="select-cover__120-add">
                                <i class="le-icon le-icon-add select-cover__120-icon"></i>
                                <span class="select-cover__120-text">驾驶证背面</span>
                            </div>
                            <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                                <el-image :src="scope.url" fit="cover"></el-image>
                                <div class="select-cover__120-tips">
                                    <span>替换</span> | <span @click.stop="(e)=>form.credentials_contrary=''">删除</span>
                                </div>
                            </div>
                        </pictureDialog>
                    </el-col>
                </el-row>
            </el-form-item>
            <!--<el-form-item prop="name">-->
                <!--<span slot="label" class="le-form-item__label">备注</span>-->
                <!--<el-input type="textarea" v-model="form.desc"></el-input>-->
            <!--</el-form-item>-->
        </div>
        <div class="le-cardpin">
            <el-button :disabled="loading" @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit" :disabled="loading">保存</el-button>
        </div>
    </el-form>
</template>

<script>
export default {
    name: "editDriver",
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
                name: '',
                mobile: '',
                pass: '',
                plate_number: '',
                // plate_color:'',
                load: 0,
                credentials_front:'',
                credentials_contrary:'',

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
                    if (_this.form.name === ''){
                        _this.loading = false;
                        _this.$message.error('司机用户名不能为空');
                        return;
                    }
                    if (_this.form.mobile === ''){
                        _this.loading = false;
                        _this.$message.error('手机号不能为空');
                        return;
                    }
                    if (_this.form.pass === ''){
                        _this.loading = false;
                        _this.$message.error('密码不能为空');
                        return;
                    }
                    if (_this.form.plate_number === ''){
                        _this.loading = false;
                        _this.$message.error('车牌号不能为空');
                        return;
                    }
                    if (_this.form.load === 0){
                        _this.loading = false;
                        _this.$message.error('载重（吨）不能为空');
                        return;
                    }
                    if (_this.form.credentials_front === ''){
                        _this.loading = false;
                        _this.$message.error('驾驶证正面不能为空');
                        return;
                    }
                    if (_this.form.credentials_contrary === ''){
                        _this.loading = false;
                        _this.$message.error('驾驶证反面不能为空');
                        return;
                    }

                    if (_this.$route.query.id) {
                        _this.$heshop.users('post', {id: _this.$route.query.id}, _this.form).then(function () {
                            _this.cancel();
                        }).catch(function (error) {
                            _this.loading = false;
                            if (error.status === 403) {
                                _this.$message.error(error.data.message);
                            }
                        });
                    } else {
                        _this.$heshop.users('post', _this.form).then(function (res) {
                            _this.loading = false;
                            if (res.status === 0){
                                _this.$message.success("添加成功");
                                _this.form = {
                                    name: '',
                                    mobile: '',
                                    pass: '',
                                    plate_number: '',
                                    load: 0,
                                    credentials_front:'',
                                    credentials_contrary:'',
                                };
                                _this.cancel();
                            }
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
                path: "/users/editDriver",
            })
        },
        getDetail: function (id) {
            let _this = this;
            this.$heshop.siji('get', id).then(function (response) {
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
        await id ? this.getDetail(parseInt(id)) : 0;
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