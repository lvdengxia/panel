<template>
    <el-container>
        <el-aside width="96px" class="apply-main__menus">
            <Sidebar></Sidebar>
        </el-aside>
        <el-main class="apply-main__content le-main">
            <el-scrollbar style="height: 100%;">
                <div style="padding: 24px;">
                    <router-view />
                </div>
                <div class="le-panel__footer">
                    <!--<div class="le-link">-->
                        <!--<span>官网</span>丨-->
                        <!--<span>-->
                            <!--<a href="http://forum.leadshop.vip/" target="_blank">论坛</a>-->
                        <!--</span>丨-->
                        <!--<span>文档</span>-->
                    <!--</div>-->
                    <div class="le-copy" v-html="copyright"></div>
                </div>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>
<script type="text/javascript">
import "@/pages.js";

import Sidebar from '../mainbar/Side';
export default {
    components: {
        Sidebar
    },
    computed: {
        copyright() {
            return this.HTMLDecode($_W.Copyright);
        }
    },
    methods: {
        HTMLDecode(text) {
            var temp = document.createElement("div");
            temp.innerHTML = text;
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        }
    }
}
</script>
<style lang="less" scoped>
@import './style.less';

.le-main {
    padding: 0;
}

/deep/.el-scrollbar__wrap {
    overflow-x: hidden;
}


/deep/.el-scrollbar__wrap {
    overflow-x: hidden;
}

/deep/.el-scrollbar .el-scrollbar__bar,
.is-horizontal {
    height: 10px;
}

.le-panel__footer {
    height: 120px;
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
    opacity: 0.45;
    padding-top: 10px;
    margin-top: 50px;

    .le-link span {
        cursor: pointer;
        display: inline-block;
        margin: 0 10px;

        a {
            color: rgba(0, 0, 0, 0.45)
        }
    }

    .le-copy {
        margin-bottom: 50px;
    }
}
</style>