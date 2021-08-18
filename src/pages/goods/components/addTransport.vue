<template>
    <el-form ref="form" :model="value" label-width="160px" class="he-add-logistic">
        <el-form-item label="搬运模板">
            <!--<el-tag type="info"-->
                    <!--class="le-cat__footer-tag"-->
                    <!--size="large"-->
                    <!--closable-->
                    <!--@close="deleteTag"-->
            <!--&gt;-->
                <!--{{ transportTemplateName }}-->
            <!--</el-tag>-->
            <template v-for="(item, index) in transportsCopy">
                <el-tag type="info" class="le-cat__footer-tag" size="large" closable @close="deleteTag(item, index)" :key="index" >
                    {{ item.temp_name }}
                </el-tag>
            </template>
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
                @click="toCreate"
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
                transportsCopy:[],
            }
        },
        async mounted() {
            console.log(this.value.temp_id);
            await this.getList();
        },
        methods:{
            getList() {
                this.$heshop
                    .temp('get')
                    .then(res => {
                        let that = this;
                        that.transports = res.res;
                        for (let i = 0; i < that.transports.length; i++) {
                            for (let j = 0; j < that.value.temp_id.length; j++) {
                                if (that.value.temp_id[j] === that.transports[i].temp_id) {
                                    this.transportsCopy.push(that.transports[i]);
                                }
                            }
                        }
                    })
                    .catch(() => {
                        this.$message.error('获取搬运模板失败');
                    });
            },
            getTransports(e){
                this.value.temp_id = e;
                this.transportsCopy = [];
                for (let i = 0; i < this.transports.length; i++) {
                    for (let j = 0; j < e.length; j++) {
                        if (e[j] === this.transports[i].temp_id) {
                            this.transportsCopy.push(this.transports[i]);
                        }
                    }
                }
            },
            deleteTag: function (item, index) {
                this.transportsCopy.splice(index,1);

                let i = this.transports.indexOf(item);
                this.value.temp_id.splice(i,1);
            },
            toCreate(){
                this.$router.push({
                    path: '/goods/transportTemplateEdit'
                });
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