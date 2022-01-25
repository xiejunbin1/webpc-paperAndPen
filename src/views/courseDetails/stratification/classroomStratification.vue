<template>
<div>
    <div class="inClassDetail">
        <div class="inClassDetail_tab_div">
            <ul class="inClassDetail_tab">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistics' }" @click="goRouter('statistics')">数据统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'stratification' }" @click="goRouter('stratification')">分层情况</li>
            </ul>
        </div>
        <h2 class="inClassDetail-h2">{{ tastName }}</h2>

        <div class="inClassDetail_content">
            <ul class="courseDetails_footer_menu xuanfu" id="moveDiv" ref="ul">
                <li :style="Object.keys(taskId).length == 0 ? 'color:#BFBFBF':''" :class="{ hierarchicalListSvg: Stratification, hierarchicalList}" @click.stop.prevent="Object.keys(taskId).length > 0 ? Stratification = !Stratification : ''">
                    <svg-icon icon-class="icon-temporary"></svg-icon>
                    <span>分层列表</span>
                    <div class="hierarchicalList-div" v-if='Stratification'>
                        <div class="hierarchicalList-tex">
                            <div class="taskList" v-for="(value, index) in hierarchicalList" :key="index" @click.stop.prevent="switchLayering(index)">
                                <svg-icon class="currentData" v-show="indexs == index" icon-class="icon_caourse_currentData"></svg-icon>
                                <div :class="indexs == index ? 'missionName' : 'missionName1'">{{ value.tastName.length >=20 ? interceptionMethod(value.tastName) :  value.tastName}}</div>
                                <div class="toUse" v-show="indext == index">已使用该分层</div>
                            </div>
                        </div>
                    </div>
                </li>

                <li :style="Object.keys(taskId).length == 0 ? 'color:#BFBFBF':''" :class="{ hierarchicalListSvg: hierarchicalListShow, hierarchicalList}" @click.stop.prevent="hierarchicalListClick" v-if="$route.query.router == 'stratification'">
                    <svg-icon icon-class="icon-edit"></svg-icon>
                    <span>修改分层</span>
                </li>

                <li @click="fanhui">
                    <svg-icon icon-class="icon_caourse_back"></svg-icon>
                    <span>返回</span>
                </li>
            </ul>
            <router-view :key="key" ref="target-name"></router-view>
        </div>
    </div>
</div>
</template>

<script>
import {
    getLayerTaskInfoList
} from '@/api/index'
export default {
    data() {
        return {
            flags: false,
            position: {
                x: 0,
                y: 0
            },
            nx: '',
            ny: '',
            dx: '',
            dy: '',
            xPum: '',
            yPum: '',
            hierarchicalList: [],
            indexs: 0,
            indext: null,

            Stratification: false,
            flags1: true,
            hierarchicalListShow: this.$store.getters.getHierarchicalListShow,
            tastName: ''
        }
    },

    methods: {
        fanhui() {
            this.$store.commit('setHierarchicalListShow', false)
            this.hierarchicalListShow = false
            this.$router.go(-1);
        },
        goRouter(value) {
            this.$store.commit('setHierarchicalListShow', false)
            this.Stratification = false
            this.$router.push({
                name: value,
                query: {
                    router: value
                }
            });
        },
        // 实现移动端拖拽
        down(event) {
            console.log(event.target === this.$refs.ul)
            this.flags = true;
            var touch;
            if (event.touches) {
                touch = event.touches[0];
            } else {
                touch = event;
            }
            this.position.x = touch.clientX;
            this.position.y = touch.clientY;
            this.dx = moveDiv.offsetLeft;
            this.dy = moveDiv.offsetTop;
        },
        move(event) {
            if (this.flags) {
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                this.nx = touch.clientX - this.position.x;
                this.ny = touch.clientY - this.position.y;
                this.xPum = this.dx + this.nx;
                this.yPum = this.dy + this.ny;
                let screWidth = this.showCourseDetailsFooter ? 520 : 220;
                const maxWidth = window.screen.width - screWidth; //屏幕分辨率宽度减去悬浮框宽高
                const maxHeight = window.screen.height - 80;
                // const maxWidth = window.screen.width; //屏幕分辨率宽度减去悬浮框宽高
                // const maxHeight = window.screen.height;
                if (this.xPum < 0) {
                    //屏幕x限制
                    this.xPum = 0;
                } else if (this.xPum > maxWidth) {
                    this.xPum = maxWidth;
                }
                if (this.yPum < 0) {
                    //屏幕y限制
                    this.yPum = 0;
                } else if (this.yPum > maxHeight) {
                    this.yPum = maxHeight;
                }
                moveDiv.style.left = this.xPum + 'px';
                moveDiv.style.top = this.yPum + 'px';
                //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
                document.addEventListener(
                    'touchmove',
                    function () {
                        event.preventDefault();
                    },
                    false
                );
            }
        },
        //鼠标释放时候的函数
        end() {
            this.flags = false;
        },
        getLayerTaskInfoList() {
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                tchCourseId: this.$store.getters.getBaseData.tchCourseId,
                pageSize: '0',
                currentPage: '0',
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }
            getLayerTaskInfoList(params).then((res) => {
                if (res.flag) {
                    this.hierarchicalList = res.data

                    if (res.data == null) {
                        this.$store.commit('setHierarchicalListItem', {});
                        return false
                    }
                    this.hierarchicalList.forEach((value, index) => {
                        if (value.tastName == this.$store.getters.getUseThisLayering.tastName) {
                            this.indext = index
                        }
                    })
                    this.$store.commit('setHierarchicalListItem', res.data[0]);
                    this.$store.commit('setHierarchicalTaskName', res.data[0].tastName)
                }
            })
        },
        hierarchicalListClick() {
            if (Object.keys(this.taskId).length == 0) return false
            this.hierarchicalListShow = !this.$store.getters.getHierarchicalListShow
            this.$store.commit('setHierarchicalListShow', this.hierarchicalListShow);

        },
        // 切换分层
        switchLayering(index) {
            this.indexs = index
            this.$store.commit('setHierarchicalListItem', this.hierarchicalList[index]);
            this.$store.commit('setHierarchicalTaskName', this.hierarchicalList[index].tastName)
            this.Stratification = false
        },
        // 截取方法
        interceptionMethod(valueItem) {
            if (valueItem.length >= 20) {
                let consr = valueItem
                let texr = valueItem
                let phone = consr.substring(0, 3) + '...' + texr.substr(-4)
                console.log(consr.substring(0, 3), texr.substr(-4), "consr.substring(0, 3)")
                return phone
            }

        }
    },
    mounted() {
        let a = '论语十二章课文朗读奏乐版论语十二章课文朗读奏乐版任务'
        let b = this.interceptionMethod(a)
        console.log(b)
        this.getLayerTaskInfoList()
    },

    computed: {
        key() {
            return this.$route.path;
        },
        taskId() {
            return this.$store.getters.getHierarchicalListItem
        },
    },
    watch: {

        '$store.getters.getUseThisLayering': {
            handler(newval, olval) {
                this.hierarchicalList.forEach((value, index) => {
                    if (value.tastName == newval.tastName) {
                        this.indext = index
                    }
                })
            },
            deep: true
        },
        //监听课程名称
        '$store.getters.getHierarchicalTaskName': {
            handler(newval, olval) {
                this.tastName = this.$store.getters.getHierarchicalTaskName
            },
            deep: true,
            immediate: true
        },
        "$store.getters.getHierarchicalListShow": {
            handler(newval, olval) {
                this.hierarchicalListShow = this.$store.getters.getHierarchicalListShow
            },
            deep: true
        }

    }
}
</script>

<style lang="less" scoped>
.inClassDetail {
    background: #15a071;
    padding: 4.167vw 5% 0 6%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100vh;
    content: "viewport-units-buggyfill; padding: 4.167vw 5% 0 6%";

    .inClassDetail_tab {
        display: flex;
        flex-direction: column;

        li {
            width: 40px;
            height: 140px;
            background: #ffffff;
            border-radius: 6px 0 0 6px;
            border: 1px solid #e6e6e6;
            font-size: 22px;
            font-weight: 400;
            color: #666666;
            line-height: 26px;
            text-align: center;
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .select_inClassDetail_tab {
            color: #fff;
            background: #fdb63f;
            border-color: #fdb63f;
        }
    }

    .inClassDetail_tab_div {
        position: absolute;
        left: 5.75%;
        top: 50%;
        -webkit-transform: translateY(-40%);
        transform: translateY(-40%);
    }

    .inClassDetail-h2 {
        text-align: center;
        margin-bottom: 1.563vw;
        color: #fff;
        font-weight: 500;
        content: "viewport-units-buggyfill; margin-bottom: 1.563vw";
    }

    .inClassDetail_content {
        width: 1640px;
        height: calc(100vh - 7.344vw);
        overflow: auto;
        background: #fff;
        border-radius: 1.042vw 1.042vw 0 0;
        position: relative;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0 auto;
        box-sizing: border-box;

        .courseDetails_footer_menu {
            width: auto;
            // min-width: 200px;
            background: #797979;
            border-radius: 10px;
            opacity: 0.95;
            padding: 10px 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            right: 5%;
            bottom: 10%;
            z-index: 500;
            box-sizing: border-box;

            .hierarchicalListSvg {
                color: #fdb63f;
                fill: currentColor;
            }

            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 90px;
                color: #fff;
                cursor: pointer;
                font-size: 18px;
            }

            .hierarchicalList {
                position: relative;

                .hierarchicalList-div {
                    width: 642px;
                    min-height: 150px;
                    max-height: 380px;
                    background: #FFFFFF;
                    box-shadow: 0px 2px 16px 0px rgba(63, 63, 63, 0.2);
                    border-radius: 10px;
                    position: absolute;
                    bottom: 70px;
                    right: -8.354vw;

                    .hierarchicalList-tex {
                        width: 630px;
                        min-height: 150px;
                        max-height: 380px;
                        overflow-x: hidden;
                        overflow-y: scroll;
                        margin: 0 auto;

                        .taskList {
                            width: 580px;
                            height: 70px;
                            margin: 0 auto;
                            line-height: 70px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            position: relative;
                            border-bottom: 1px solid #F4F4F4;

                            .currentData {
                                font-size: 20px;
                                position: absolute;
                                left: 0;
                            }

                            .missionName {
                                color: #22AD7E;
                                font-size: 20px;
                                text-indent: 30px;
                            }

                            .missionName1 {
                                color: #1B1B1B;
                                font-size: 20px;
                                font-weight: 500;
                                text-indent: 30px;
                            }

                            .toUse {
                                font-size: 18px;
                                color: #A8A8A8;
                                font-weight: 400;
                            }
                        }
                    }
                }

                .hierarchicalList-tex::-webkit-scrollbar {
                    /*滚动条整体样式*/
                    width: 6px;
                    /*高宽分别对应横竖滚动条的尺寸*/
                    height: 4px;
                    border-radius: 5px;
                    margin-right: 5px;
                }

                .hierarchicalList-tex::-webkit-scrollbar-thumb {
                    /*滚动条里面小方块*/
                    border-radius: 5px;
                    background: #DDDDDD;
                    margin-right: 5px;
                }

                .hierarchicalList-tex::-webkit-scrollbar-track {
                    /*滚动条里面轨道*/
                    border-radius: 6;

                }

            }

            svg {
                fill: currentColor;
                font-size: 32px;
            }

            .select_li {
                color: #fdb63f;
            }

        }

        .xuanfu {
            min-width: 200px;
            height: 80px;
            /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
            z-index: 999;
            position: fixed;
        }
    }

}
</style>
