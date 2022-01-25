<template>
<div class="subject-analyse">
    <div class="subject-list-wrap" v-show="statisticsDetails">
        <div class="answerStatistics-lelt">
            <div v-for="(value, index) in info" :key="index">
                <div v-html="value.examQuestionInfo.title"></div>
                <div class="parsing" v-show="value.examQuestionInfo.answer != '<p><br /></p>'">
                    <div class="parsing-div">
                        <div style="display: flex;">
                            <div class="answer-div">【答案】</div>
                            <div v-html="value.examQuestionInfo.answer"></div>
                        </div>
                        <div style="display: flex;margin-top: 10px;" v-if="value.examQuestionInfo.show">
                            <div class="answer-div">【解析】</div>
                            <div v-html="value.examQuestionInfo.examExplain"></div>
                        </div>
                    </div>
                    <div class="parsing-q">
                        <div @click="viewResolution(index)">查看解析</div>
                    </div>
                </div>

            </div>
            <div class="bottom-div"></div>
        </div>

        <div class="statisticsForThisQuestion">
            <div class="statisticsForThisQuestion-div">
                <div class="statisticsForThisQuestion-tou">本题统计（本题分数：{{ totalScore }}）</div>
                <div class="fractionwe">
                    <div class="fractionwe-div">
                        <div class="fractionwe1">{{ correctRate }} </div>
                        <div class="fractionwe2">正确率</div>
                    </div>
                    <div class="fractionwe-div">
                        <div class="fractionwe1">{{ theAverageScore }}</div>
                        <div class="fractionwe2">平均分</div>
                    </div>
                    <div class="fractionwe-div">
                        <div class="fractionwe1">{{ highestScore }}</div>
                        <div class="fractionwe2">最高分</div>
                    </div>
                    <div class="fractionwe-div">
                        <div class="fractionwe1">{{ bottomScore }}</div>
                        <div class="fractionwe2">最低分</div>
                    </div>
                </div>
                <div class="happening">答题情况</div>
                <div class="answers">
                    <div class="answers-echarts">
                        <div id="myChart-echarts" ref="myChart-echarts" class="pie-chart"></div>
                    </div>
                </div>
            </div>
            <div class="bottom-div"></div>
        </div>
    </div>

    <div class="subject-list-wrap" v-show="!statisticsDetails">
        <div class="subject-list-wrap-div">
            <div class="avigationBar">
                <div :class="{correctAnswer: true , arctem: arctemShow == 0}" style="border-radius: 6px 0px 0px 6px;" @click="arctemShow = 0">回答正确：{{ showNumber ? rightCount : correctList.length}}人</div>
                <div :class="{correctAnswer: true , arctem: arctemShow == 1}"  style="border-radius: 0px 6px 6px 0px;" @click="arctemShow = 1" v-show="info[0].examQuestionInfo.answerType == 'A04'">回答半对：{{showNumber ? rightCount :  halfPairList.length }}人</div>
                <div :class="{correctAnswer: true , arctem: arctemShow == 2}" style="border-radius: 0px 6px 6px 0px;" @click="arctemShow = 2">回答错误：{{ showNumber ? stuArr.length - rightCount : undoneList.length+errorList.length }}人</div>
            </div>
            <div class="correct-div" v-show="info[0].examQuestionInfo.answerType == 'A01' &&  arctemShow == 0">
                <div class="correct-a">
                    <div>选</div>
                    <div v-html="info[0].examQuestionInfo.answer"></div>
                    <div>{{ zhengque }}人</div>
                </div>
                <div style="width: 100%;height: 100%;">
                    <div v-for="(value,index) in info[0].statStudentAnswer.stuAnswer" :key="index" class="correct-textys" style="width: 100%;">
                        <div class="textys" style="background: #F8F8F8;" v-for="(item, i) in value.studentsNew" :key="i" v-show="value.answer == info[0].examQuestionInfo.answer">{{ getStudentName(item.accountNo, $store.getters.getUserInfo.classId) }}</div>
                        <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                    </div>
                </div>
            </div>

            <div class="correct-div" v-show="info[0].examQuestionInfo.answerType == 'A01' &&  arctemShow == 2">
                <div style="width: 100%;" v-for="(value,index) in info[0].statStudentAnswer.stuAnswer" :key="index">
                    <div class="correct-a" v-if="value.answer != info[0].examQuestionInfo.answer ">
                        <div v-if="value.answer != info[0].examQuestionInfo.answer && value.answer !== ''">选</div>
                        <div v-html="value.answer" v-if="value.answer != info[0].examQuestionInfo.answer  && value.answer !== ''"></div>
                        <div v-if="value.answer == ''">未完成</div>
                        <div>{{ value.studentsNew.length }}人</div>
                    </div>
                    <div style="width: 100%;" v-if="value.answer != info[0].examQuestionInfo.answer ">
                        <div class="correct-textys" style="width: 100%;">
                            <div style="background: #F8F8F8;" class="textys" v-for="(item, i) in value.studentsNew" :key="i">{{ getStudentName(item.accountNo, $store.getters.getUserInfo.classId) }}</div>
                            <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                        </div>
                    </div>
                </div>
                <div class="bottom-div"></div>
            </div>

            <div class="correct-div" v-show="info[0].examQuestionInfo.answerType !== 'A01' &&  arctemShow == 0">
                <div class="correct-a">
                    <div>正确</div>
                    <div>{{ correctList.length }}人</div>
                </div>
                <div style="width: 100%;height: 100%;">
                    <div style="width: 100%;">
                        <div class="correct-textys" style="width: 100%;height: 100%;">
                            <div class="textys" style="background: #F8F8F8;" v-for="(value,index) in correctList" :key="index">
                                {{ getStudentName(value.accountNo, $store.getters.getUserInfo.classId) }}
                                <div class="answerClass" v-if="index == index2">
                                    <div class="answer-div">答案：</div>
                                    <div class="dahajs" v-html="value.answer[0].result"></div>
                                </div>
                            </div>
                            <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                        </div>
                    </div>
                </div>
                <div class="bottom-div"></div>
            </div>

            <div class="correct-div" v-show="info[0].examQuestionInfo.answerType !== 'A01' &&  arctemShow == 1">
                <div class="correct-a">
                    <div>回答半对</div>
                    <div>{{ halfPairList.length }}人</div>
                </div>
                <div style="width: 100%;height: 100%;">
                    <div style="width: 100%;">
                        <div class="correct-textys" style="width: 100%;height: 100%;">
                            <div class="textys" style="background: #F8F8F8;" v-for="(value,index) in halfPairList" :key="index">
                                {{ getStudentName(value.accountNo, $store.getters.getUserInfo.classId) }}
                                <div class="answerClass" v-if="index == index2">
                                    <div class="answer-div">答案：</div>
                                    <div class="dahajs" v-html="value.answer[0].result"></div>
                                </div>
                            </div>
                            <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                        </div>
                    </div>
                </div>
                <div class="bottom-div"></div>
            </div>
            <div class="correct-div" v-show="info[0].examQuestionInfo.answerType !== 'A01' &&  arctemShow == 2">
                <div style="width: 100%;">
                    <div class="correct-a">
                        <div>未完成</div>
                        <div>{{ undoneList.length }}人</div>
                    </div>
                </div>
                <div style="width: 100%;">
                    <div style="width: 100%;">
                        <div class="correct-textys" style="width: 100%;height: 100%;">
                            <div class="textys" style="background: #F8F8F8;" v-for="(value,index) in undoneList" :key="index">{{ getStudentName(value.accountNo, $store.getters.getUserInfo.classId) }}</div>
                            <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                        </div>
                    </div>
                </div>
                <div style="width: 100%;">
                    <div class="correct-a">
                        <div>错误</div>
                        <div>{{ errorList.length }}人</div>
                    </div>
                </div>
                <div style="width: 100%;">
                    <div style="width: 100%;">
                        <div class="correct-textys" style="width: 100%;height: 100%;">
                            <div class="textys" style="border: 1px solid #A8A8A8;" v-for="(value,index) in errorList" :key="index" @click="index1 = index">
                                {{ getStudentName(value.accountNo, $store.getters.getUserInfo.classId) }}
                                <div class="answerClass" v-if="index == index1">
                                    <div class="answer-div">答案：</div>
                                    <div class="dahajs" v-html="value.answer"></div>
                                </div>
                            </div>
                            <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                        </div>
                    </div>
                </div>
                <div class="bottom-div"></div>
            </div>

        </div>

    </div>
    <div class="bottom">
        <div :class="{classification: true , statistics: statisticsDetails}" @click="statisticsDetails = true">答题统计</div>
        <div :class="{classification: true , statistics1: !statisticsDetails }" @click="statisticsDetails = false">学生答案</div>
    </div>

</div>
</template>

<script>
import {
    getExamItemDetail,
    getExamFinishInfo,
    statTaskStatV2,
    statTaskStat,
} from '@/api/index';
import {
    getStudentName,
    getParentName
} from '@/utils/filter';

import echarts from 'echarts';
export default {
    data() {
        return {
            statisticsDetails: true,
            queryObj: '',
            list: '',
            info: {
                examQuestionInfo: {},
                statStudentAnswer: {
                    stuAnswer: []
                }
            },
            isfEducation: '',

            correctRate: '', //正确率
            zhengque: 0, //选择正确答案的人数
            theAverageScore: '', // 平均分
            highestScore: '0', // 最高分
            bottomScore: '0', // 最低分
            tabList: JSON.parse(sessionStorage.getItem('subjectAnalyse')).questionList,
            studentStatList: [],
            stuArr: [],
            totalScore: 0, //总分
            rightCount: 0, // 回答正确的人数
            unanswered: 0, // 未答人数
            arctemShow: 0, // 控制器 正确 半对 错误
            correctList: [], //正确数组
            undoneList: [], //未完成数组
            errorList: [], //错误数组
            halfPairList: [], //半对数组
            index1: null,
            index2: null,
            showNumber: true,
            halfPair: false
        }
    },
    computed: {
        getStudentName() {
            return getStudentName;
        },
        getParentName() {
            return getParentName;
        },
    },
    methods: {
        // Basic Information 获取平均分 总分 正确率  回答正确的人数
        basicInformation() {
            this.correctRate = this.info[0].statStudentAnswer.rightPercent
            this.theAverageScore = this.info[0].statStudentAnswer.avgScore
            this.rightCount = this.info[0].statStudentAnswer.rightCount
            this.totalScore = this.info[0].examQuestionInfo.score || 0
        },
        // Handling empty answers 处理答案为空和答案为空p标签的
        handlingEmptyAnswers() {
            let isEmpty = {
                answer: '',
                students: [],
                studentsNew: []
            }
            this.info.forEach(value => {
                // 拿出答案为空或者为空p标签的
                let data = value.statStudentAnswer.stuAnswer.filter(v => v.answer == '' || v.answer == '<p></p>')
                    // 拿出不答案为空或者为空p标签的
                let dataList = value.statStudentAnswer.stuAnswer.filter(v => v.answer != '' && v.answer != '<p></p>')
                console.log(data,dataList,"8888888")
                // 把答案为空者为空p标签的放到一个对象里面
                data.forEach((val, i) => {
                    isEmpty.students.push(...val.students)
                    isEmpty.studentsNew.push(...val.studentsNew)
                })
                // 和不为空的放到一起
                dataList.unshift(isEmpty)
                console.log(dataList,"78")
                // 替换原来的数组之前数组中未吧答案为空字符串的和空p标签的放到一起
                value.statStudentAnswer.stuAnswer = dataList
                // 拿到正确学生的个数
                value.statStudentAnswer.stuAnswer.forEach(v => {
                    console.log(v,"7878555")
                    if (v.answer == value.examQuestionInfo.answer) {
                        this.zhengque = v.students.length
                    }
                })
            })
        },
        // 初始化数据
        initializationData() {
            this.correctList = []
            this.undoneList = []
            this.errorList = []
            this.halfPairList = []
            this.stuArr = []
        },
        // 
        stuAnswerfun(){
            let stuAnswer = this.info[0].statStudentAnswer.stuAnswer
            let four = []
            stuAnswer.forEach(item => {
                // 拿到未做答学生的个数
                if (!item.answer) {
                    this.unanswered = item.students.length
                }
                item.studentsNew.forEach(v => {
                    v.answer = item.answer
                })
                // 把当前学生放进来
                four.push(...item.studentsNew)
                console.log(item, "itemitemitem777777")
            })
            this.stuArr = four
            return four
        },
        // 正确错误为空半对
        rightAndWrongAreEmptyAndHalfRight(four) {
            four.forEach(item => {
                if (item.isRight == "I01") {
                    this.correctList.push(item)
                }
                if (item.isRight == "I02" ) {
                    this.halfPairList.push(item)
                }
                //答案为空
                if (item.answer == '') {
                    this.undoneList.push(item)
                }
                // 分数未0 且答案不为空
                if (item.isRight == "I03" && item.answer != '') {
                    this.errorList.push(item)
                }
            })
        },
        // 最高分最低分
        highestScoreLowestScore(four) {
            if (four.length != 0) {
                // 获取最高分
                this.highestScore = Math.max.apply(Math, four.map(item => {
                    return item.score
                })) || 0
                // 获取最底分
                this.bottomScore = Math.min.apply(Math, four.map(item => {
                    return item.score
                })) || 0
            }else {
                this.highestScore = 0
                this.bottomScore = 0 
            }
        },
        // 数据展示
        dataDisplay(four) {
            if(this.info[0].examQuestionInfo.answerType == "A01"){
                this.showNumber = true
                let dataValue = ['未答', '答对', '答错']
                let fourList = [this.unanswered, this.rightCount, four.length - (this.unanswered + this.rightCount)]
                this.myChartEcharts(fourList, dataValue)
            }else {
                this.showNumber = false
                let dataValue = ['未答', '答对', "半对",'答错']
                let fourList = [this.undoneList.length,this.correctList.length,this.halfPairList.length,this.errorList.length]
                this.myChartEcharts(fourList, dataValue)
            }
        },
        getExamItemDetail(examId, groupId) {
            this.$store.commit('setVanLoading', true);
            const {
                taskId,
                classId
            } = this.queryObj;
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId,
                examId,
                classId,
                groupId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            getExamItemDetail(params).then((res) => {
                this.$store.commit('setVanLoading', false);
                if (res.flag) {
                    this.info = res.data;
                    console.log(res.data, "res.data")
                    this.$nextTick(() => {
                        this.basicInformation()
                    })
                    this.handlingEmptyAnswers()
                    this.initializationData()
                    let four = this.stuAnswerfun()
                    this.rightAndWrongAreEmptyAndHalfRight(four)
                    this.highestScoreLowestScore(four)
                    this.$nextTick(() => {
                        this.dataDisplay(four)
                    })
                    console.log(four, "fourfourfourfour")
                    console.log(this.info)
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        toggleQuestion(bol) {
            // const index = this.tabList.findIndex((v) => v.active);
            const index = this.$store.getters.getListOfTestQuestions
            console.log(this.$store.getters.getListOfTestQuestions, "1212121")
            if (bol) {
                // 下一题
                if (index < this.tabList.length - 1) {
                    this.toggleTab(this.tabList[index + 1]);
                    this.$store.commit('setListOfTestQuestions', 0)
                    this.$store.commit('setListOfTestQuestions', index + 1)
                    this.index1 = null
                    this.index2 = null
                } else {
                    this.$toast('没有下一题了');
                }
            } else {
                //上一题
                if (index > 0) {
                    this.toggleTab(this.tabList[index - 1]);
                    this.$store.commit('setListOfTestQuestions', 0)
                    this.$store.commit('setListOfTestQuestions', index - 1)
                    this.index1 = null
                    this.index2 = null
                } else {
                    this.$toast('没有上一题了');
                }
            }
        },

        toggleTab(item) {
            console.log(item, "itemitem")
            // if (item.active) return false;
            this.tabList.forEach((v) => {
                this.$set(v, 'active', false);
                if (v.groupId == item.groupId) {
                    v.active = true
                }
            });
            console.log(this.tabList, "this.tabList")
            this.examId = item.examId;
            this.rightCount = 0,
            this.unanswered = 0
            this.totalScore = 0
            this.getExamItemDetail(item.examId || item.examGroupId, item.groupId || item.group_id)
            console.log(item.examId, "item.examId")
        },
       
        viewResolution(index) {
            console.log(this.info[index].examQuestionInfo.show)
            this.info[index].examQuestionInfo.show = !this.info[index].examQuestionInfo.show
            let dataFonm = JSON.parse(JSON.stringify(this.info))
            this.info = []
            this.info = dataFonm
        },

        myChartEcharts(valetItem, dataValue) {
            console.log(this.stuArr.length, this.unanswered, this.rightCount, "888888888888888888")
            var chartDom = document.getElementById('myChart-echarts');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                title: {
                    // text: '深圳月',
                    subtext: '人数（人）',
                },
                xAxis: {
                    type: 'category',
                    data: dataValue
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: valetItem ,
                    type: 'bar',
                    barWidth: 30, //柱图宽度
                    itemStyle: {
                        //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                        emphasis: {
                            barBorderRadius: 30
                        },
                        normal: {
                            //柱形图圆角，初始化效果
                            barBorderRadius: [15, 15, 15, 15],
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: 'black',
                                    fontSize: 16
                                }
                            }
                        }
                    },
                }],
                color: ['#22AD7E']
            };
            option && myChart.setOption(option);
        },

    },
    async mounted() {
        this.queryObj = JSON.parse(sessionStorage.getItem('subjectAnalyse'));
        console.log(this.queryObj)
        this.list = this.queryObj.questionList;
        this.tabList = this.queryObj.questionList
        this.isfEducation = this.$route.query.isfEducation;

        console.log('this.queryObj---', this.queryObj, this.$route.query.tchCourseId);
        const {
            examId,
            groupId,
            resourceType
        } = this.queryObj;
        const index = this.list.findIndex((v) => (resourceType === 'R03' ? v.exam_id : v.examId || v.examGroupId) === examId);
        this.$set(this.list[index], 'active', true);
        this.$store.commit('setListOfTestQuestions', 0)
        this.$store.commit('setListOfTestQuestions', index)
        await this.getExamItemDetail(examId, groupId);
        
    },
    created() {

    },
}
</script>

<style lang="less" scoped>
.subject-analyse {
    height: 100%;

    .subject-list-wrap {
        height: 100%;
        display: flex;
        justify-content: space-between;

        .answerStatistics-lelt {
            width: 65%;
            height: 100%;
            padding: 50px;
            box-sizing: border-box;
            background: #FFFFFF;
            overflow: auto;

            /deep/p {
                color: #1B1B1B;
                font-size: 28px;
                line-height: 50px
            }

            .parsing {
                width: 100%;
                background: #F9F8F3;
                margin-top: 20px;
                box-sizing: border-box;

                .parsing-div {
                    border-bottom: 1px solid #E6E6E6;
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding: 30px;
                    box-sizing: border-box;

                    .answer-div {
                        flex-shrink: 0;
                        width: 120px;
                        font-size: 26px;
                        color: #4F5459;
                    }

                    /deep/p {
                        color: #4F5459;
                        font-size: 24px;
                        line-height: 40px;
                    }
                }

                .parsing-q {
                    width: 100%;
                    height: 80px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding: 30px;
                    box-sizing: border-box;

                    div {
                        width: 120px;
                        height: 40px;

                        border-radius: 6px;
                        border: 2px solid #22AD7E;
                        color: #22AD7E;
                        text-align: center;
                        line-height: 40px;
                        font-size: 24px;
                    }
                }

            }

            .groupExamList-div {
                display: flex;
                justify-content: flex-start;
                color: #333;
                font-size: 24px;
                margin-top: 10px;
            }
        }

        .statisticsForThisQuestion {
            width: 35%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;

            .statisticsForThisQuestion-div {
                width: 489px;
                height: 100%;
                background: #F8F8F8;
                margin: 0 auto;

                .statisticsForThisQuestion-tou {
                    width: 100%;
                    height: 60px;
                    background: #3387FC;
                    border-radius: 20px 20px 0px 0px;
                    font-size: 28px;
                    color: #FFFFFF;
                    font-weight: 400;
                    text-align: center;
                    line-height: 60px;
                }

                .fractionwe {
                    width: 100%;
                    height: 100px;
                    margin-top: 20px;
                    display: flex;

                    .fractionwe-div {
                        width: 25%;
                        height: 100%;

                        .fractionwe1 {
                            width: 100%;
                            height: 50%;
                            color: #333333;
                            font-size: 30px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }

                        .fractionwe2 {
                            width: 100%;
                            height: 50%;
                            color: #666666;
                            font-weight: 400;
                            font-size: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }

                .happening {
                    height: 40px;
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #1B1B1B;
                    line-height: 40px;
                    text-indent: 20px;
                    margin-top: 80px
                }

                .answers {
                    width: 100%;
                    height: 50%;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    margin-top: 20px;
                    // border: 1px solid red;

                    .answers-echarts {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .text {
                            position: absolute;
                            color: #999999;
                            font-size: 22px;
                        }
                    }

                    .pie-chart {
                        width: 440px;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                    }
                }
            }
        }
    }

    .subject-list-wrap-div {
        width: 100%;
        height: 100%;
        padding: 40px;
        overflow: auto;

        .avigationBar {
            width: 100%;
            height: 50px;
            display: flex;

            .correctAnswer {
                width: 219px;
                height: 50px;
                background: #FFFFFF;
                // border-radius: 0px 6px 6px 0px;
                border: 1px solid #CCCCCC;
                font-size: 22px;
                color: #666666;
                text-align: center;
                line-height: 50px;
            }

            .arctem {
                color: #fff;
                background: #22AD7E;
            }
        }

        .correct-div {
            width: 100%;
            height: 90%;
            padding-top: 20px;
            box-sizing: border-box;

            .correct-a {
                font-weight: 500;
                font-size: 26px;
                color: #1B1B1B;
                width: 208px;
                height: 37px;
                line-height: 37px;
                border-left: 6px solid #22AD7E;
                text-indent: 10px;
                display: flex;
                margin-top: 30px;

            }

            .correct-textys {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }

            .textys {
                width: 160px;
                height: 60px;
                border-radius: 40px;
                color: #333;
                font-size: 24px;
                text-align: center;
                line-height: 60px;
                margin-top: 20px;
                position: relative;

                .answerClass {
                    position: absolute;
                    min-width: 222px;
                    max-width: 444px;
                    min-height: 90px;
                    max-height: 180px;
                    background: #fff;
                    overflow: auto;
                    z-index: 99;
                    font-size: 24px;
                    color: #333;
                    padding: 10px;
                    display: flex;
                    box-shadow: 0px 6px 20px 0px rgba(0, 37, 35, 0.2);

                    .answer-div {
                        width: 30%;
                        min-width: 80px;
                    }

                    .dahajs {
                        word-wrap: break-word;
                        overflow: auto;
                    }

                    /deep/p {
                        word-wrap: break-word;
                        overflow: auto;
                    }
                }
            }
        }
    }

    .default-box {
        width: 160px;
        height: 0;
    }

    .bottom {
        position: fixed;
        bottom: 10px;
        width: 1640px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;

        .classification {
            width: 150px;
            height: 35px;
            text-align: center;
            line-height: 35px;
            font-size: 24px;
            color: #666666;
        }

        .statistics {
            color: #22AD7E;
        }

        .statistics1 {
            color: #22AD7E;
        }

        .statistics::after {
            content: ''; // 必须
            position: absolute;
            left: 693px;
            bottom: 0;
            right: 0;
            width: 100px;
            height: 5PX;
            background-color: #22AD7E;
        }

        .statistics1::after {
            content: ''; // 必须
            position: absolute;
            left: 845px;
            bottom: 0;
            right: 0;
            width: 100px;
            height: 5PX;
            background-color: #22AD7E;
        }

    }

}

.bottom-div {
    width: 1640px;
    height: 60px;

}
</style>
