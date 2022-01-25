<template>
    <div>
        <div class="App">
            <div>
                <img src="../../assets/img/networkAnomaly.png" alt="">
            </div>
            <div class="networkLoadFailed">网络加载失败</div>
        </div>
    </div>
</template>

<script>
export default {

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
            width: 147px;
            height: 33px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 33px;
        }
    }
</style>>
