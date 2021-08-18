<template>
    <div class="le-main le-parameter--box flex">
        <div class="le-left">
            <el-input class="le-search" v-model="search" placeholder="输入搬运模板名称搜索">
                <el-button slot="append" icon="el-icon-search" @click="querySearchAsync"/>
            </el-input>
            <el-scrollbar class="le-scrollbar" ref="scrollbar">
                <el-checkbox-group v-model="check">
                    <el-checkbox
                            :label="item.temp_id"
                            @change="selectTransport(index)"
                            :class="['le-radio--item', { active: index === listIndex }]"
                            v-for="(item, index) in showList" :key="index">
                        {{item.temp_name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-scrollbar>
        </div>
        <el-scrollbar class="le-scrollbar le-right flex-sub">
            <div style="text-align: center;margin-top: 28px;color: #BFBFBF;" v-if="form.detail.length === 0">暂无数据</div>

            <div class="le-parameter--item" v-for="(item,index) in form.detail" :key="index">
                <div class="le-item--row flex align-center">
                    <div class="le-row--label">楼层</div>
                    <div class="le-row--value">{{item.level}}</div>
                </div>
                <div class="le-item--row flex ">
                    <div class="le-row--label">金额</div>
                    <div class="le-row--value">{{item.money}}</div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
    export default {
        name: "chooseTransport",
        data() {
            return {
                listIndex: -1,
                check: [],
                list: [],
                search: '',
                form: {
                    temp_name: '',
                    detail: []
                },
                showList: [],
                page:1,
            };
        },
        mounted() {
            this.getList();
            this.handleScroll();
        },
        methods: {
            affirm(e) {
                let { handleClose } = e;
                this.$emit('input', this.check);
                handleClose();
            },
            getList() {
                this.$heshop
                    .temp('get')
                    .then(res => {
                        this.list = res.res;
                        this.showList = res.res;
                    })
                    .catch(() => {
                        this.$message.error('获取失败');
                    });
            },
            selectTransport(index) {
                this.listIndex = index;
                this.form = this.showList[index];
            },
            querySearchAsync() {
                let restaurants = this.list;
                this.showList = this.search
                    ? restaurants.filter(state => {
                        return state.temp_name.toLowerCase().indexOf(this.search.toLowerCase()) === 0;
                    })
                    : restaurants;
                if (this.showList.length > 0) {
                    this.form = this.showList[0];
                } else {
                    this.form = {
                        detail: []
                    };
                }
            },
            handleScroll() {
                // let scrollbarEl = this.$refs.scrollbar.wrap;
                // scrollbarEl.onscroll = function(){
                //     if ( scrollbarEl.scrollTop > 300 ){
                //         // todo 请求第二页
                //     }
                // }
            }
        },
    }
</script>

<style scoped lang="scss">
    .le-parameter--box {
        border: 1px solid #dcdfe6;
        width: 624px;
        height: 400px;
        border-radius: 4px;
        .le-left {
            width: 262px;
            border-right: 1px solid #dcdfe6;
            .le-search {
                margin: 15px;
                width: 231px !important;
                /deep/.el-input {
                    width: 231px;
                }
                /deep/.el-input-group__append {
                    padding: 0 10px;
                }
            }
            .le-scrollbar {
                height: 338px;
            }
        }
        .el-radio-group {
            width: 100%;
        }
        .le-radio--item {
            display: block;
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #262626;
            margin: 0;
            &:hover {
                background: #f3f5f7;
            }
            &.is-checked {
                /deep/.el-checkbox__label {
                    color: #262626;
                }
            }
            &.active {
                background: #efebfd;
                /deep/.el-checkbox__label {
                    color: #623ceb;
                }
            }
        }
        .le-scrollbar {
            height: 400px;
            /deep/.el-scrollbar__wrap {
                overflow-x: hidden;
            }
        }
        .le-parameter--item {
            width: 100%;
            height: auto;
            background: #f3f5f7;
            border-radius: 4px;
            margin-bottom: 16px;
            padding: 16px 16px 16px 24px;
            position: relative;
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
            &:first-child {
                margin-top: 16px;
            }
            .le-item--row {
                &:first-child {
                    margin-bottom: 24px;
                }
            }
            .le-row--label {
                width: 50px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #262626;
                line-height: 20px;
                margin-right: 16px;
                flex-shrink: 0;
            }
            .le-row--value {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #262626;
                line-height: 20px;
            }
        }
    }
</style>