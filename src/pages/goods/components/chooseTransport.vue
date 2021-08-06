<template>
    <div>
        asda
    </div>
</template>

<script>
    export default {
        name: "chooseTransport",
        props: {
            value: [Object]
        },
        // data() {
        //     return {
        //         listIndex: -1,
        //         check: [],
        //         list: [],
        //         search: '',
        //         form: {
        //             title: '',
        //             content: []
        //         },
        //         showList: []
        //     };
        // },
        // mounted() {
        //     this.getList();
        //     console.log(12);
        //     console.log(this.value);
        // },
        // methods: {
        //     getList() {
        //         this.$heshop
        //             .goodsargs('get', {
        //                 behavior: 'option'
        //             })
        //             .then(res => {
        //                 this.list = res;
        //                 this.showList = res;
        //
        //                 // this.listIndex = this.list.findIndex(item => !item.disabled);
        //                 if (res.length) {
        //                     // this.form = this.$_.cloneDeep(this.list[0]);
        //                     // this.check = [this.list[0].id];
        //                     // this.getChoose(this.listIndex);
        //                 }
        //                 console.log(this.check);
        //             })
        //             .catch(() => {
        //                 this.$message.error('获取失败');
        //             });
        //     },
        //     // 删除参数
        //     deletionParameter(e) {
        //         this.$delete(this.form.content, e);
        //     },
        // },
    }
</script>

<style scoped>

</style>