<template>
<div class="detailedStatistics" >
    <div v-if="Object.keys(taskId).length > 0">
        <div class="wholeClass">
            <span class="fraction">
                <div>{{ fomatFloat(theAverageScore, 2)  }}分</div>
                <div>全班平均分</div>
            </span>
            <span class="fraction separator">
                <div>{{ maxScore }}分</div>
                <div>班级最高分</div>
            </span>
            <span class="fraction separator">
                <div>{{ minScore }}分</div>
                <div>班级最低分</div>
            </span>
        </div>
        <div class="details">
            <div class="details-graphics">
                <div class="exam-analyse-wrap__pie">
                    <div id="myChart1" ref="myChart1" class="chart-pie"></div>
                </div>
                <div class="myChart1-bottom">
                    <span class="theCompletionRate">
                        <div class="theCompletionRate-div" style="background: #F38560;"></div>
                        <div class="text">未完成{{ liseStudent.length }}人</div>
                    </span>
                    <span class="theCompletionRate">
                        <div class="theCompletionRate-div" style="background: #729AED;"></div>
                        <div class="text">已完成{{ finshObj.length }} 人</div>
                    </span>
                </div>
            </div>
            <div class="details-student">
                <div class="details-student-tou">
                    <span style="border-radius: 6px 0px 0px 6px;" :class="{navigation: value == '未完成'}" @click="navigationEventClick(1)">未完成{{ liseStudent.length }}人</span>
                    <span style="border-radius: 0px 6px 6px 0px;" :class="{navigation: value == '已完成'}" @click="navigationEventClick(2)">已完成{{ finshObj.length }}人</span>
                </div>
                <div class="details-student1" v-if="(value == '未完成'&&liseStudent.length > 0) || (value == '已完成'&&finshObj.length > 0) ">
                    <span v-for="(item,index) in liseStudent" v-show="value == '未完成'">{{ item }}</span>
                    <span v-for="(item,index) in finshObj" v-show="value == '已完成'">{{ item }}</span>
                    <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                </div>
                <div class="details-student1" v-else>
                    <div class="details-div">
                        <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                        <div class="details-text">暂无学生任务进行中</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div class="air" v-else>
        <svg-icon class="details-svg" icon-class="icon-empty-data"></svg-icon>
        <div class="details-text">当前暂无分层信息</div>
    </div>
</div>
</template>

<script>
import echarts from "echarts";
import {
    getLayerTaskInfoDetail
} from '@/api/index'
import {
    getStudentName,
} from '@/utils/filter';
export default {
    data() {
        return {
            value: '未完成',
            liseStudent: [], //已完成数据
            finshObj: [], //未完成数据
            graphics: [],
            maxScore: '', //最高分
            minScore: '', //最低分
            theAverageScore: '', //平均分

        }
    },
    computed: {
        taskId() {
            return this.$store.getters.getHierarchicalListItem
        }
    },
    watch: {
        '$store.getters.getHierarchicalListItem': {
            handler(newval, olval) {
                this.getLayerTaskInfoDetail1(newval)
            },
            deep: true
        },

    },
    methods: {
        fomatFloat(src, pos) {
            return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
        },
        navigationEventClick(ietm) {
            switch (ietm) {
                case 1:
                    this.value = '未完成';
                    break;
                case 2:
                    this.value = '已完成';
                    break;
            }
        },
        drawPie() {
            var myChart = echarts.init(document.getElementById('myChart1'));
            var option;
            var color2 = ['#6C89FE', '#FF7373', '#FDCB6D'];
            this.graphics = [{
                value: this.finshObj.length,
                name: '已完成'
            }, {
                value: this.liseStudent.length,
                name: '未完成'
            }]
            option = {
                color: color2,
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: false,
                    top: 'bottom'

                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['56%', '50%'],
                    avoidLabelOverlap: false,
                    label: {

                    },
                    emphasis: {
                        label: {
                            show: true,

                        }
                    },
                    labelLine: {
                        show: true,
                        length: 30
                    },
                    data: this.graphics
                }]
            };
            option && myChart.setOption(option);

        },
        getLayerTaskInfoDetail1(value) {
            if (Object.keys(this.taskId).length == 0) return false
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                tchCourseId: this.$store.getters.getBaseData.tchCourseId,
                taskId: value.taskId,
                classId: this.$store.getters.getUserInfo.classId
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }

            console.log(this.$store.getters.getHierarchicalListItem, "this.$store.getters.getHierarchicalListItem,")
            getLayerTaskInfoDetail(params).then((res) => {
                // console.log(JSON.parse(localStorage.getItem('stat')))
                this.liseStudent = []
                if (res.flag) {
                    this.maxScore = res.data.maxScore
                    this.minScore = res.data.minScore
                    this.theAverageScore = (res.data.totalScore / res.data.finshCount) || 0
                    console.log(res.data.totalScore,res.data.finshCount)
                    console.log(this.theAverageScore,"this.theAverageScore")
                    res.data.studentUnfinishList.forEach((v) => {
                        (v.accountNoList || []).forEach((s) => {
                            const name = getStudentName(s, this.$store.getters.getUserInfo.classId);
                            this.liseStudent.push(name);
                        });
                    });
                    res.data.finishStudent.forEach((v) => {
                        const name = getStudentName(v, this.$store.getters.getUserInfo.classId);
                        this.finshObj.push(name);
                    });

                    this.drawPie()

                } else {
                    this.$toast(res.msg)
                }
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.name !== 'lectureList') {
            //在next中写处理函数
            next(vm => vm.getLayerTaskInfoDetail1(vm.$store.getters.getHierarchicalListItem)); // err 与 12134 是随便传的值， 可忽略
        }
        next()
    },
    mounted() {
        console.log(this.$store.getters.getHierarchicalListItem, '$store.getters.getHierarchicalListItem')
    }

}
</script>

<style lang="less" scoped>
.detailedStatistics {
    .wholeClass {
        width: 1580px;
        height: 143px;
        background: #F9F8F4;
        // border: 1px solid #E6E6E6;
        margin: 0 auto;
        margin-top: 24px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .fraction {
            text-align: center;
            width: 33.33%;

            div:nth-child(1) {
                font-size: 36px;
                font-weight: 500;
            }

            div:nth-child(2) {
                font-size: 24px;
                font-weight: 500;
                color: #626464;
                margin-top: 10px;
            }
        }

        .separator {
            position: relative;
        }

        .separator:after {
            position: absolute;
            top: 18px;
            height: 60px;
            left: 0;
            content: '';
            width: 0;
            // border-left: solid #979797 1px;
        }
    }

    .details {
        width: 100%;
        height: 570px;
        display: flex;

        .details-graphics {
            width: 35%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .chart-pie {
                width: 100%;
                height: 400px;
            }

            .myChart1-bottom {
                width: 400px;
                display: flex;
                justify-content: space-around;
                margin: 0 auto;

                .theCompletionRate {
                    display: flex;
                    align-items: center;

                    .theCompletionRate-div {
                        width: 10px;
                        height: 10px;

                        border-radius: 50px;
                    }

                    .text {
                        text-indent: 10px;
                        font-size: 16px;
                        font-weight: 400;
                        color: #666666;
                    }
                }
            }
        }

        .details-student {
            width: 65%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .details-student-tou {
                display: flex;
                width: 400px;
                margin-top: 40px;

                span {
                    display: flex;
                    width: 200px;
                    height: 60px;
                    background: #FFFFFF;
                    border: 1px solid #CCCCCC;
                    font-weight: 400;
                    font-size: 24px;
                    justify-content: center;
                    align-items: center;
                }

                .navigation {
                    display: flex;
                    width: 200px;
                    height: 60px;
                    background: #22AD7E;
                    color: #fff;
                    font-weight: 400;
                    font-size: 24px;
                    justify-content: center;
                    align-items: center;
                }

            }

            .details-student1 {
                width: 800px;
                height: 70%;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                overflow: auto;
                margin-top: 20px;
                justify-content: space-between;
                margin-top: 25px;

                .details-div {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .details-svg {
                        width: 448px;
                        height: 240px;
                    }

                    .details-text {
                        font-size: 24px;
                        font-weight: 400;
                        color: #666666;
                    }
                }

                span {
                    display: flex;
                    width: 120px;
                    height: 50px;
                    background: #F4F4F4;
                    border-radius: 28px;
                    justify-content: center;
                    align-items: center;
                    margin-top: 18px;
                }

                span:nth-child(-n+6) {
                    margin-top: 0;
                }

                &.temp {
                    height: 0;
                    margin-bottom: 0;
                    border: none;
                    padding: 0;
                }
            }

            .details-student1::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 6px;
                /*高宽分别对应横竖滚动条的尺寸*/
                height: 4px;
                border-radius: 5px;
            }

            .details-student1::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 5px;
                background: #DDDDDD;
            }

            .details-student1::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                border-radius: 6;
                // background: rgba(0, 0, 0, 0.1);
            }
        }
    }
}
.air{
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .details-svg{
        width: 556px;
        height: 300px;
        
    }
    .details-text{
        font-size: 30px;
        color: #626464;
        margin-top: 40px;
    }
}
.default-box {
    width: 120px;
    height: 0;
}
</style>
