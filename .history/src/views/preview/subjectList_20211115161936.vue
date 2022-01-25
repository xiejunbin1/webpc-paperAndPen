<template>
<div class="subject-list" ref="body">
    <div class="subject-list-wrap" v-show="!statisticsDetails">
        <div class="subject-list-wrap-lelt">
            <ul>
                <li v-for="(item, index) in stuArr" :key="index" @click="jump(index)" :style=" activeStep === index ? yangshi : yangshi1">
                    <div class="avatar-div">
                        <svg-icon class="avatar" icon-class="icon-avatar"></svg-icon>
                        <div class="name" :style="{color: activeStep === index ? '#22AD7E' : '#666'}">{{ isfEducation ? getParentName(item.accountNo, $route.query.classId) : getStudentName(item.accountNo, $route.query.classId) }}</div>
                    </div>
                    <div class="fraction-div">
                        <div :class="item.isMark ? 'fraction' : 'fraction1'">{{ item.isMark ? item.totalScore : notCorrected }}</div>
                        <div class="ion" v-if="item.isMark">分</div>
                    </div>
                </li>
            </ul>
            <div class="bottom-div"></div>
        </div>
        <div class="subject-list-wrap-relot" @scroll="onScroll">
            <div class="subject-list-wrap-relot-const" v-for="(item, index) in stuArr" :key="index">
                <!-- 学生信息 -->
                <div class="personalInformation">
                    <div class="avatar-div">
                        <svg-icon class="avatar" icon-class="icon-avatar"></svg-icon>
                        <div class="name">{{ isfEducation ? getParentName(item.accountNo, $route.query.classId) : getStudentName(item.accountNo, $route.query.classId) }}</div>
                        <div class="fraction">{{ item.isMark ? item.totalScore : '' }}</div>
                    </div>
                    <div class="rewardsAndPunishments">
                        <div class="row-item-award">
                            <span class="icon-be-improved" @click="saveRewardScore(item, 'T02', 'class')">
                                <svg-icon class="svg-icon" icon-class="icon-be-improved" />待改进</span>
                            <span class="icon-award" @click="saveRewardScore(item, 'T01', 'class')">
                                <svg-icon class="svg-icon" icon-class="icon-award" />奖励</span>
                        </div>
                    </div>
                </div>

                <div class="testQuestions">
                    <div v-for="(value,i) in item.answer" :key="i">
                        <div class="testQuestions-div">
                            （{{ i + 1 }}）
                            <div v-if="value.result && value.result !== '<p></p>'">
                                <div class="" v-html="value.text"></div>
                                <div class="answer" v-if="value.imgArr.length > 0">
                                    <div v-for="(imgItem, y) in value.imgArr" :key="y">
                                        <div class="paperAndPenInteraction" v-if="value.show">纸笔互动</div>
                                        <img :src="imgItem.imgArr" @click="previewImg(imgItem.imgArr,i,index,y,false)" alt="">
                                    </div>

                                </div>

                                <div class="reviews" v-if="value.appraiseContent">
                                    <div class="reviews-div">
                                        <svg-icon class="reviews-svg" icon-class="icon-reviews"></svg-icon>
                                    </div>
                                    {{ value.appraiseContent }}
                                </div>
                            </div>
                            <p v-else>未作答</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height: 500px;flex-shrink: 0;"></div>
        </div>
    </div>

    <div class="subject-list-wrap" v-show="statisticsDetails">
        <div class="answerStatistics-lelt">
            <div v-for="(value, index) in info" :key="index">
                <div v-html="value.title"></div>
                <div class="parsing" v-if="value.answer != '<p><br /></p>'">
                    <div class="parsing-div">
                        <div style="display: flex;">
                            <div class="answer-div">【答案】</div>
                            <div v-html="value.answer"></div>
                        </div>
                        <div style="display: flex;margin-top: 10px;" v-if="value.show">
                            <div class="answer-div">【解析】</div>
                            <div v-html="value.examExplain"></div>
                        </div>
                    </div>
                    <div class="parsing-q">
                        <div @click="viewResolution(index)">查看解析</div>
                    </div>
                </div>
                <div v-for="(ietm,i) in value.groupExamList" :key="i">
                    <div class="groupExamList-div">
                        （{{ i + 1 }}）
                        <div v-html="ietm.title"></div>
                    </div>
                    <div class="parsing">
                        <div class="parsing-div">
                            <div style="display: flex;">
                                <div class="answer-div">【答案】</div>
                                <div v-html="ietm.answer"></div>
                            </div>
                            <div style="display: flex;margin-top: 10px;" v-if="ietm.show">
                                <div class="answer-div">【解析】</div>
                                <div v-html="ietm.examExplain"></div>
                            </div>
                        </div>
                        <div class="parsing-q">
                            <div @click="viewResolutions(index,i)">查看解析</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-div"></div>
        </div>

        <div class="statisticsForThisQuestion">
            <div class="statisticsForThisQuestion-div">
                <div class="statisticsForThisQuestion-tou">本题统计</div>
                <div class="fractionwe">
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
                <div class="answers">
                    <div class="answers-echarts">
                        <div class="text">答题情况</div>
                        <div id="myChart-echarts" ref="myChart-echarts" class="pie-chart"></div>
                    </div>
                    <div class="answers-echart1">
                        <div class="numberOfAnsweredQuestions">
                            <div class="uestions-color"></div>
                            <div class="uestions-text">已答题 {{ answeredQuestions }}人</div>
                        </div>
                        <div class="numberOfAnsweredQuestions">
                            <div class="uestions-color" style="background: #E3E3E3;"></div>
                            <div class="uestions-text">未答题 {{ unanswered }}人</div>
                        </div>
                    </div>
                </div>

                <div class="answers">
                    <div class="answers-echarts">
                        <div class="text">批改情况</div>
                        <div id="myChart-echarts1" ref="myChart-echarts1" class="pie-chart1"></div>
                    </div>
                    <div class="answers-echart1">
                        <div class="numberOfAnsweredQuestions">
                            <div class="uestions-color" style="background: #49ABFF"></div>
                            <div class="uestions-text">已批改 {{ correcteds }}人</div>
                        </div>
                        <div class="numberOfAnsweredQuestions">
                            <div class="uestions-color" style="background: #E3E3E3;"></div>
                            <div class="uestions-text">未批改 {{ notCorrecteds }}人</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="bottom">
        <div :class="{classification: true , statistics: statisticsDetails}" @click="statisticsDetails = true">答题统计</div>
        <div :class="{classification: true , statistics1: !statisticsDetails }" @click="statisticsDetails = false">学生答案</div>
    </div>
    <pictureView :maskImg.sync='maskImg' :imgURL="imgURL" :ObjFont="ObjFont" :pinglunList="stuArr" :Experience="false" :current="current" @returnClick="returnClick"></pictureView>
</div>
</template>

<script>
import {
    getExamItemDetail,
    getExamFinishInfo,
    statTaskStatV2,
    statTaskStat,
    saveRewardScore
} from '@/api/index';
import echarts from 'echarts';
import {
    getStudentName,
    getParentName
} from '@/utils/filter';
import pictureView from '../../components/pictureView.vue'

export default {
    data() {
        return {
            fold: true,
            tabList: JSON.parse(JSON.stringify(this.$route.query.questionList)),
            info: {
                groupFinishMap: {},
                groupExamList: []
            },
            studentStatList: [],
            stuArr: [],
            examNum: '', // 大题题号
            examId: this.$route.query.examId,
            isfEducation: this.$route.query.isfEducation,
            notCorrected: '未批改',
            indextyue1: 1,
            activeStep: 0,
            yangshi: {
                'background': '#F2FCF8',
                'border-right': '3px solid #22AD7E'
            },
            yangshi1: {
                'background': '#fff',
                'border-right': '3px solid #fff'
            },
            indexTist: 0,
            statisticsDetails: true,
            correctRate: '',
            theAverageScore: '',
            highestScore: '0',
            bottomScore: '0',
            answeredQuestions: 0,
            unanswered: 0,
            notCorrecteds: 0, //未批改
            correcteds: 0, //已批改

            maskImg: false,
            current: 0,
            imgURL: '',
            maskImg: false,
            ObjFont: {
                img: '',
                i: '',
                index: '',
                value: true,
                paperPen: false,
                y: ''
            },
        }
    },
    methods: {
        jump(index) {
            var items = document.querySelectorAll(".subject-list-wrap-relot-const");
            for (var i = 0; i < items.length; i++) {
                if (index === i) {
                    items[i].scrollIntoView({
                        block: "start", //默认跳转到顶部
                        behavior: "smooth" //滚动的速度
                    });
                }
            }
        },

        onScroll(e) {
            console.log(e)
            let scrollItems = document.querySelectorAll(".subject-list-wrap-relot-const");
            for (let i = scrollItems.length - 1; i >= 0; i--) {
                // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
                let judge =
                    e.target.scrollTop >=
                    scrollItems[i].offsetTop - scrollItems[0].offsetTop;
                if (judge) {
                    this.activeStep = i;
                    break;
                }
            }
        },

        async statTaskStat() {
            this.$store.commit('setVanLoading', true);
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId: this.$route.query.taskId,
                classId: this.$route.query.classId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            let api;
            if (['T10'].includes(this.$route.query.taskType)) {

                //从堂测统计进入
                api = statTaskStatV2;
            } else {
                api = statTaskStat;
            }
            await api(params).then((res) => {
                this.$store.commit('setVanLoading', false);
                if (res.flag && res.data[0]) {
                    if (this.$route.query.taskType === 'T13') {
                        res.data[0].studentStatList = res.data[0].examstat;
                    }
                    this.studentStatList = res.data[0].studentStatList;
                } else {
                    this.$toast(res.msg);
                }
            });
        },

        //排序学生,将未批改的学生置顶
        sortStuArr(arr) {
            let sortArr = [];
            let isMarkStuIndex = -1;
            arr.forEach((v) => {
                if (v.answer.some((a) => a.isMark === 'I02')) {
                    //未批改的学生需要置顶
                    if (isMarkStuIndex > -1) {
                        // 有已批改完的学生,插入到已批改的学生前面
                        sortArr.splice(isMarkStuIndex, 0, v);
                        isMarkStuIndex++;
                    } else {
                        //还没有已批改完的学生,就接着排下去
                        sortArr.push(v);
                    }
                } else {
                    //已批改的学生
                    sortArr.push(v);
                    if (isMarkStuIndex === -1) {
                        //找出首个已批改完的学生的下标
                        isMarkStuIndex = sortArr.findIndex((s) => s.answer.every((a) => a.isMark === 'I01'));
                    }
                }
            });
            return sortArr;
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
                } else {
                    this.$toast('没有下一题了');
                }
            } else {
                //上一题
                if (index > 0) {
                    this.toggleTab(this.tabList[index - 1]);
                    this.$store.commit('setListOfTestQuestions', 0)
                    this.$store.commit('setListOfTestQuestions', index - 1)
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
            this.correctRate = 0,
                this.theAverageScore = 0,
                this.highestScore = 0,
                this.bottomScore = 0,
                this.answeredQuestions = 0,
                this.unanswered = 0,
                this.notCorrecteds = 0, //未批改
                this.correcteds = 0,
                console.log(this.tabList, "this.tabList")
            this.examId = item.examId;
            this.getExamFinishInfo(item.examId);
        },

        getExamFinishInfo(examId) {

            this.$store.commit('setVanLoading', true);
            const {
                taskId,
                classId
            } = this.$route.query;
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                taskId,
                classId,
                examId,
                // tchCourseId: this.$route.query.tchCourseId,
                tchCourseId: this.$route.query.tchCourseId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            getExamFinishInfo(params).then((res) => {

                this.$store.commit('setVanLoading', false);
                if (res.flag) {
                    this.examNum = this.tabList.find((v) => v.active).num;
                    let stuArr = [];
                    let groupFinishList = [];

                    const key = res.data[0].groupExamList.length ? 'groupFinishMap' : 'finishMap';

                    if (key === 'groupFinishMap') {
                        res.data[0].groupExamList.forEach((v) => {
                            Object.keys(res.data[0][key])
                                .sort()
                                .forEach((k) => {
                                    if (k.indexOf(v.examGroupId + '_') > -1) {
                                        groupFinishList.push(k);
                                    }
                                });
                        });
                    } else {
                        groupFinishList = Object.keys(res.data[0][key]).sort();
                    }

                    groupFinishList.forEach((k) => {
                        let examId = k.split('_')[0],
                            accountNo = k.split('_')[1],
                            errorArr = [],
                            errorPercent = '--',
                            examScore = 0,
                            index = stuArr.findIndex((s) => s.accountNo == accountNo);

                        if (res.data[0].groupExamList.length) {
                            // 有小题时 查询错误率
                            errorArr = res.data[0].groupExamList.find((v) => v.examGroupId == examId).examGroupErrorPercentInfo;
                            examScore = res.data[0].groupExamList.find((v) => v.examGroupId == examId).examScore;
                            if (errorArr.length) {
                                let errorItem = errorArr.find((v) => v.accountNo == accountNo);
                                if (errorItem) errorPercent = (errorItem.errorPercent * 100).toFixed(2) + '%';
                            }
                        } else {
                            if (res.data[0].examErrorPercentInfo.length) {
                                let errorItem = res.data[0].examErrorPercentInfo.find((v) => v.accountNo == accountNo);
                                if (errorItem) errorPercent = (errorItem.errorPercent * 100).toFixed(2) + '%';
                            }
                            examScore = res.data[0].examScore;
                        }

                        let dom = document.createElement('div');
                        res.data[0][key][k].imgArr = [];
                        res.data[0][key][k].audioArr = [];
                        dom.innerHTML = res.data[0][key][k].result;
                        if (res.data[0][key][k].result) {
                            const imgArr = dom.querySelectorAll('img');
                            const audioArr = dom.querySelectorAll('audio');
                            for (let i = 0; i < imgArr.length; i++) {
                                if (imgArr[i].src.indexOf('?') > -1) {
                                    res.data[0][key][k].imgArr.push({
                                        imgArr: imgArr[i].src + '&' + Math.random()
                                    });
                                } else {
                                    res.data[0][key][k].imgArr.push({
                                        imgArr: imgArr[i].src + '?&' + Math.random()
                                    });
                                }

                                let parent = imgArr[i].parentElement;
                                parent.removeChild(imgArr[i]);
                            }
                            for (let i = 0; i < audioArr.length; i++) {
                                res.data[0][key][k].audioArr.push(audioArr[i].src);
                                let parent = audioArr[i].parentElement;
                                parent.removeChild(audioArr[i]);
                            }
                        }
                        res.data[0][key][k].text = dom.outerText === '|||' ? '' : dom.outerText;
                        if (index > -1) {
                            // 该学生已存在数组中
                            stuArr[index].answer.push({
                                ...res.data[0][key][k],
                                error: errorPercent,
                                examScore: examScore === null ? 5 : examScore
                            });
                        } else {
                            stuArr.push({
                                accountNo,
                                rewardScore: this.rewardScore(accountNo),
                                answer: [{
                                    ...res.data[0][key][k],
                                    error: errorPercent,
                                    examScore: examScore === null ? 5 : examScore
                                }],
                            });
                        }
                    });

                    this.info = res.data;
                    this.info.forEach(v => {
                        v.show = false
                        v.groupExamList.forEach(item => {
                            item.show = false
                        })
                    })
                    this.stuArr = this.sortStuArr(stuArr);
                    this.correctRate = this.info[0].examRightPercentInfo || 0
                    this.theAverageScore = this.info[0].avgScore || 0
                    console.log(this.stuArr, "this.stuArrthis.stuArr")

                    let answeredQuestions1 = 0
                    let unanswered1 = 0
                    let correcteds1 = 0
                    let notCorrecteds = 0
                    this.stuArr.forEach(item => {
                        item.totalScore = 0
                        item.item = false
                        let dataFin = item.answer.filter(v => v.text != "" || v.imgArr.length > 0)
                        let dataFin14 = item.answer.filter(v => v.text == "" && v.imgArr.length == 0)
                        let dataFin25 = item.answer.filter(v => v.isMark != 'I02')
                        let dataFin36 = item.answer.filter(v => v.isMark == 'I02')
                        if (dataFin.length > 0) {
                            this.answeredQuestions = ++answeredQuestions1
                        }
                        if (dataFin14.length == item.answer.length) {
                            this.unanswered = ++unanswered1
                        }
                        if (dataFin25.length > 0) {
                            this.correcteds = ++correcteds1
                        }
                        if (dataFin36.length == item.answer.length) {
                            this.notCorrecteds = ++notCorrecteds
                        }
                        console.log(dataFin, "88")
                        item.answer.forEach((v, index) => {
                            item.totalScore += v.score
                            if (v.isMark != 'I02') {
                                item.isMark = true
                            }
                            v.appraiseContent = ''
                            this.info[0].appraiseList.forEach(value => {
                                if (v.seqId == value.objectId) {
                                    v.appraiseContent = value.appraiseContent
                                }
                            })
                        })
                    })
                    this.myChartEcharts()
                    this.myChartEcharts1()
                    console.log(this.stuArr, "this.stuArrthis.stuArr")
                    console.log(this.info, "infoinfoinfo")
                    if (this.stuArr.length > 0) {
                        this.highestScore = Math.max.apply(Math, this.stuArr.map(item => {
                            return item.totalScore
                        })) || 0
                        this.bottomScore = Math.min.apply(Math, this.stuArr.map(item => {
                            return item.totalScore
                        })) || 0

                    }

                    this.$nextTick(() => {
                        //去掉题目内容的audio下载按钮
                        // let dom = this.$refs['title'].querySelectorAll('audio');
                        // if (dom.length) {
                        //     dom[0].controlsList = 'nodownload';
                        // }
                    });
                } else {
                    this.$toast(res.msg);

                }
            });

        },
        saveRewardScore(score, type, saveType) {
            console.log('score---', score, this.info);
            this.$store.commit('setVanLoading', true);
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId: score.answer[0].taskId,
                type: type,
                score: 1,
                subjectType: localStorage.currentSubjectType,
                teacherName: JSON.parse(localStorage.getItem('userInfo')).userName,
                termType: this.termType,
                classId: this.$store.getters.getUserInfo.classId,
            };
            console.log(obj)
            if (saveType == 'group') {
                obj.accountNoList = score.accountNo;
                obj.groupIdList = score.answer[0].groupId;
            } else {
                obj.accountNoList = score.accountNo;
                obj.groupIdList = '';
            }
            let params = {
                requestJson: JSON.stringify(obj),
            };
            saveRewardScore(params).then((res) => {
                this.$store.commit('setVanLoading', false);
                if (res.flag) {
                    this.$toast(type == 'T01' ? '加分成功' : '减分成功');
                    this.statTaskStat();
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        rewardScore(accountNo) {
            return this.studentStatList.find((v) => v.accountNo == accountNo).studentRewardScore || 0;
        },
        viewResolution(index) {
            console.log(this.info[index].show)
            this.info[index].show = !this.info[index].show
            let dataFonm = JSON.parse(JSON.stringify(this.info))
            this.info = []
            this.info = dataFonm
        },
        viewResolutions(index, i) {
            this.info[index].groupExamList[i].show = !this.info[index].groupExamList[i].show
            let dataFom = JSON.parse(JSON.stringify(this.info))
            this.info = []
            this.info = dataFom
        },
        myChartEcharts1() {
            var chartDom = document.getElementById('myChart-echarts1');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                tooltip: {
                    trigger: 'item'
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['70%', '85%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },

                    data: [{
                            value: this.answeredQuestions,
                            name: '已批改人数'
                        },
                        {
                            value: this.unanswered,
                            name: '未批改人数'
                        },
                    ]
                }],
                color: ['#49ABFF', '#E3E3E3']
            };

            option && myChart.setOption(option);
        },
        myChartEcharts() {
            var chartDom = document.getElementById('myChart-echarts');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                tooltip: {
                    trigger: 'item'
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['70%', '85%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },

                    data: [{
                            value: this.answeredQuestions,
                            name: '已答题人数'
                        },
                        {
                            value: this.unanswered,
                            name: '未答题人数'
                        },
                    ]
                }],
                color: ['#3BE090', '#E3E3E3']
            };

            option && myChart.setOption(option);
        },
        previewImg(img, i, index, y, value) {
            this.maskImg = JSON.parse(JSON.stringify(true))
            this.imgURL = img
            this.ObjFont.img = img
            this.ObjFont.index = index
            this.current = 0,
                this.ObjFont.i = i
            // this.ObjFont.paperPen = true
            this.ObjFont.y = y
            this.ObjFont.paperPen = this.pinglunList[index].paperPen
        },
        returnClick(val) {
            if (val) {
                let dataFom = JSON.parse(JSON.stringify(this.stuArr))
                dataFom[this.ObjFont.index].answer[this.ObjFont.i].imgArr[this.ObjFont.y].show = true
                this.stuArr = dataFom

            }
            this.maskImg = false
        }
    },
    async activated() {
        const index = this.tabList.findIndex((v) => v.examId === this.examId);
        this.$set(this.tabList[index], 'active', true);

        //因为在主观题批改里面加减分以后返回到主观题批改列表需要statTaskStat这个接口去更新学生的分数,所以只能每次进来都调这个接口 (有点坑)
        await this.statTaskStat();
        this.getExamFinishInfo(this.examId);
    },
    async mounted() {
        const index = this.tabList.findIndex((v) => v.examId === this.examId);
        this.$set(this.tabList[index], 'active', true);
        console.log(this.tabList, "tabListtabList")
        this.$store.commit('setListOfTestQuestions', 0)
        this.$store.commit('setListOfTestQuestions', index)
        //因为在主观题批改里面加减分以后返回到主观题批改列表需要statTaskStat这个接口去更新学生的分数,所以只能每次进来都调这个接口 (有点坑)
        await this.statTaskStat();

        this.getExamFinishInfo(this.examId);

    },
    computed: {
        getStudentName() {
            return getStudentName;
        },
        getParentName() {
            return getParentName;
        },
    },
    components: {
        pictureView
    }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';

.subject-list {
    height: 100%;
}

.subject-list-wrap {
    height: 100%;
    display: flex;
    justify-content: space-between;

    .subject-list-wrap-lelt {
        height: 100%;
        width: 21%;
        box-shadow: 2px 0px 16px 0px rgba(63, 63, 63, 0.1);

        ul {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 31px;
            box-sizing: border-box;
            overflow-y: auto;

            li {
                width: 324px;
                height: 80px;
                border-bottom: 1px solid #E6E6E6;
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .avatar-div {
                    display: flex;
                    height: 100%;
                    align-items: center;

                    .avatar {
                        width: 40px;
                        height: 40px;

                    }

                    .name {
                        color: #666666;
                        font-size: 24px;
                        text-indent: 15px;
                    }
                }

                .fraction-div {
                    display: flex;
                    justify-content: flex-start;

                    .fraction {
                        color: #EA7149;
                        font-size: 26px;
                    }

                    .fraction1 {
                        color: #A8A8A8;
                        font-size: 18px;
                    }

                    .ion {
                        color: #EA7149;
                        font-size: 16px;
                        display: table-cell;
                        /*按照单元格的样式显示元素*/
                        vertical-align: bottom;
                    }
                }
            }
        }
    }

    .subject-list-wrap-relot {
        width: 79%;
        height: 100%;
        background: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;

        .subject-list-wrap-relot-const {
            // flex-shrink: 0;
            width: 1250px;
            // height: 652px;
            background: #FFFFFF;
            border-radius: 10px;
            padding: 29px;
            // overflow-y: auto;
            margin-top: 31px;
            box-sizing: border-box;

            .personalInformation {
                width: 100%;
                height: 110px;
                border-bottom: 1px solid #E6E6E6;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .avatar-div {
                    display: flex;
                    height: 100%;
                    align-items: center;

                    .avatar {
                        width: 50px;
                        height: 50px;
                    }

                    .name {
                        font-weight: 500;
                        color: #1B1B1B;
                        font-size: 28px;
                        text-indent: 15px;
                    }

                    .fraction {
                        text-indent: 20px;
                        color: #EA7149;
                        font-size: 35px;
                    }
                }

                .rewardsAndPunishments {
                    .row-item-award {
                        width: 240px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .icon-be-improved {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            color: #666666;
                            font-size: 24px;

                            .svg-icon {
                                width: 30px;
                                height: 30px;
                                padding-right: 5px;
                            }

                        }

                        .icon-award {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            color: #666666;
                            font-size: 24px;

                            .svg-icon {
                                width: 30px;
                                height: 30px;
                                color: #FDB63F;
                                padding-right: 5px;
                            }
                        }
                    }
                }
            }

            .testQuestions {
                width: 100%;
                // height: 440px;
                padding-top: 18px;
                box-sizing: border-box;

                .testQuestions-div {
                    display: flex;
                    justify-content: flex-start;
                    color: #333;
                    font-size: 24px;
                    margin-top: 10px;
                }

                .answer {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    position: relative;

                    .paperAndPenInteraction {
                        position: absolute;
                        width: 80px;
                        height: 28px;
                        background: #4F77EC;
                        border-radius: 6px 0px 6px 0px;
                        font-size: 12px;
                        font-family: PingFang-SC-Regular, PingFang-SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 28px;
                        text-align: center;
                    }

                    img {
                        height: 80px;
                        width: 120px;
                        margin-right: 10px;
                        border: 1px solid #DDDDDD;
                    }
                }

                /deep/ p {
                    color: #333;
                    font-size: 24px;

                }

                .reviews {
                    width: 100%;
                    height: 133px;
                    background: #F8F8F8;
                    position: relative;
                    margin-top: 15px;
                    padding: 20px;
                    color: #666F6F;
                    font-size: 20px;
                    display: flex;
                    align-items: center;

                    .reviews-div {
                        position: absolute;
                        width: 117px;
                        height: 47px;
                        top: -10px;
                        left: -10px;

                        .reviews-svg {
                            width: 117px;
                            height: 47px;
                            color: red;
                        }
                    }
                }
            }
        }
    }
}

.bottom-div {
    width: 1640px;
    height: 60px;

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
                width: 33.33%;
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

        .answers {
            width: 100%;
            height: 170px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: 20px;

            .answers-echarts {
                width: 165px;
                height: 165px;
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
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
            }

            .pie-chart1 {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
            }

            .answers-echart1 {
                width: 145px;
                height: 125px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .numberOfAnsweredQuestions {
                    height: 40px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;

                    .uestions-color {
                        width: 16px;
                        height: 16px;
                        background: #46D891;
                    }

                    .uestions-text {
                        font-size: 20px;
                        color: #666666;
                    }
                }
            }
        }
    }
}
</style>
