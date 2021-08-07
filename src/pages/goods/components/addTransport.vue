<template>
    <el-form ref="form" :model="value" label-width="160px" class="he-add-logistic">
        <el-form-item label="搬运模板">
            <el-tag type="info"
                    class="le-cat__footer-tag"
                    size="large"
                    closable
                    @close="deleteTag"
                    v-if="!hiddenTag"
            >
                {{ transportTemplate.temp_name }}
            </el-tag>
            <el-button
                    type="primary" plain
                    class="he-class__button"
                    module="goods"
                    action="getTransports"
                    v-popup.chooseTransport
                    title="选择模板">
                选择模板
            </el-button>
            <el-button
                type="text"
                class="he-class__button"
                title="添加模板">
                添加模板
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
                transports:[],
                transportTemplate:{},
                hiddenTag:true
            }
        },
        mounted() {
            this.getList();
        },
        methods:{
            getList() {
                this.$heshop
                    .temp('get')
                    .then(res => {
                        let that = this;
                        that.transports = res.res;
                        res.res.forEach(function (item) {
                            if (item.temp_id === that.value.temp_id){
                                that.transportTemplate = item;
                                that.hiddenTag = false;
                            }
                        })
                    })
                    .catch(() => {
                        this.$message.error('获取搬运模板失败');
                    });
            },
            getTransports(e){
                this.value.temp_id = e;
                this.transportTemplate = this.transports[e];
                let that = this;
                that.transports.forEach(function (item) {
                    if (item.temp_id === e){
                        that.transportTemplate = item;
                        that.hiddenTag = false;
                    }
                });
            },
            deleteTag: function (item, index) {
                this.transportTemplate = {};
                this.value.temp_id = '';
                this.hiddenTag = true;
            }
        }

    }
</script>

<style scoped>
    .le-cat__footer-tag {
        margin-right: 8px;
        background-color: #ffffff;
        margin-bottom: 8px;
        border: 1px solid #bebebe;
    }
</style>