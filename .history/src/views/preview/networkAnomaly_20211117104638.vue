<template>
    <div>
        <div class="App">
            <div >
                <img src="../../assets/img/networkAnomaly.png" alt="">
            </div>
            <div class="networkLoadFailed">网络加载失败</div>
            <div class="reload" @click="reloadClick()">重新加载</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            url: ''
        }
    },
    methods: {
        reloadClick() {
            router.push({ path: 'this.url' });
            this.$router.push({
                name: 'lectureList',
            });
        }
    },
    beforeRouteEnter(to, from ,next) {
        next(
            (vm) => {
                vm.url = from.fullPath
            }
        )
        console.log(to, from ,next,"to, from ,next")
    }
}
</script>

<style lang="less" scoped>
    .App {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        
        .networkLoadFailed{
            height: 33px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            margin-top: 20px;
        }
        .reload{
            width: 100px;
            height: 40px;
            background: #22AD7E;
            border-radius: 4px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 22px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }
    }
</style>>
