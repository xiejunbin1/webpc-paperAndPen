<template>
<div class="inClassDetail" :class="{ hideAll: hideSomeThing }">
    <!-- 试卷、点击推送 -->
    <div v-if="hideSomeThing" class="daya">
        <div class="inClassDetail_tab_div">
            <ul class="inClassDetail_tab">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistic' }" @click="goRouter('statistic')">数据统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'examView' }" @click="goRouter('examView')">详细统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'examDetail' || $route.name == 'questionDetail' }" @click="goRouter('examDetail')">试卷</li>
            </ul>
        </div>
        <div class="inClassDetail_content">
            <router-view :key="key" ref="target-name"></router-view>
        </div>
    </div>
    <div v-else class="daya">
        <div class="inClassDetail_tab_div" v-if="showSide">
            <!-- 堂测--详细统计 -->
            <ul class="inClassDetail_tab" v-if="isFromClassStatList || ['T03'].includes($store.getters.getExamDetailData.taskType)">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistic' }" @click="goRouter('statistic')">数据统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'examView' }" @click="goRouter('examView')">详细统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'examDetail' || $route.name == 'questionDetail' }" @click="goRouter('examDetail')">试卷</li>
            </ul>
            <ul class="inClassDetail_tab" v-if="['T13'].includes($store.getters.getExamDetailData.taskType)">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistic' }" @click="goRouter('statistic')">数据统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'detailedOralStatistics' }" @click="goRouter('detailedOralStatistics')">详细统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'spoken'}" v-if="['T13'].includes($store.getters.getExamDetailData.taskType)" @click="goRouter('spoken')">口语</li>
            </ul>
            <ul class="inClassDetail_tab" v-if="['T01', 'T02'].includes($store.getters.getExamDetailData.taskType)">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistic' }" @click="goRouter('statistic')">数据统计</li>
                <li v-if="isTestPaper || ['T01', 'T02', 'T13'].includes($store.getters.getExamDetailData.taskType) || $store.getters.getExamDetailData.resourceType === 'R03'" :class="{ select_inClassDetail_tab: $route.name == 'examView' }" @click="goRouter('examView')">
                    详细统计
                </li>
                <!-- 微课+心得-->
                <li v-if="['T02'].includes($store.getters.getExamDetailData.taskType)" :class="{ select_inClassDetail_tab: $route.name == 'experience' }" @click="goRouter('experience')">心得</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'microlecture' }" @click="goRouter('microlecture')">微课</li>
                <!-- 微课+试卷-->
                <li v-if="['T01'].includes($store.getters.getExamDetailData.taskType)" :class="{ select_inClassDetail_tab: $route.name == 'examDetail' || $route.name == 'questionDetail' }" @click="goRouter('examDetail')">
                    试卷
                </li>
            </ul>
            <ul class="inClassDetail_tab" v-if="['T04'].includes($store.getters.getExamDetailData.taskType)">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistic' }" @click="goRouter('statistic')">数据统计</li>
                <li v-if="isTestPaper || ['T01', 'T02', 'T13'].includes($store.getters.getExamDetailData.taskType) || $store.getters.getExamDetailData.resourceType === 'R03'" :class="{ select_inClassDetail_tab: $route.name == 'examView' }" @click="goRouter('examView')">
                    详细统计
                </li>
                <li v-if="isTestPaper" :class="{ select_inClassDetail_tab: $route.name == 'examDetail' || $route.name == 'questionDetail' }" @click="goRouter('examDetail')">试卷</li>
                <li v-else :class="{ select_inClassDetail_tab: $route.name == 'experience' }" @click="goRouter('experience')">心得</li>
                <!-- <li :class="{ select_inClassDetail_tab: $route.name == 'courseware' }" @click="goRouter('courseware')">课件</li> -->
                <li :class="{ select_inClassDetail_tab: $route.name == 'microlecture' }" @click="goRouter('microlecture')">课件</li>
            </ul>
            <ul class="inClassDetail_tab" v-if="['T06'].includes($store.getters.getExamDetailData.taskType)">
                <li :class="{ select_inClassDetail_tab: $route.name == 'statistic' }" @click="goRouter('statistic')">数据统计</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'experience' }" @click="goRouter('experience')">心得</li>
                <li :class="{ select_inClassDetail_tab: $route.name == 'discussion' }" @click="goRouter('discussion')">论题</li>
            </ul>
        </div>
        <div class="inClassDetail-h2" v-if="$route.query.from == 'lectureList' || $route.query.from == 'examList'">{{ this.$route.query.title }}</div>
        <div class="inClassDetail-h2" v-else>{{ $store.getters.getExamDetailData.info.taskName }}</div>

        <div class="inClassDetail_content">
            <ul class="courseDetails_footer_menu" v-if="$route.query.from == 'lectureList' || $route.query.from == 'examList'">
                <!--  -->
                <li @click="strShowClick" v-show="showCourseDetailsFooter">
                    <div :class="{ select_li: strShow,sgtejh: true }">
                        <svg-icon icon-class="icon_caourse_send"></svg-icon>
                        <span>推送</span>
                    </div>
                    <div class="select_li_div" v-show="pushShow">
                        <div :class="{ select_li1: index == 1 }" @click.stop.prevent="hierarchicalPush">推送分层</div>
                        <div :class="{ select_li1: index == 2 }" @click.stop.prevent="pushTheWholeClass">推送全班</div>
                    </div>
                </li>
                <li @click="$router.push({ name: $route.query.from })">
                    <svg-icon icon-class="icon_caourse_back"></svg-icon>
                    <span>返回</span>
                </li>

            </ul>
            <ul class="courseDetails_footer_menu courseDetails_footer_menu_statistic" v-else>
                <li v-if="$route.name == 'subjectList' || $route.name == 'subjectAnalyse'" class="datasi">
                    <div class="numbering" v-if="answerShow">
                        <div class="numbering-div" v-for="(item, index) in questionList" :class="{ active: indexData == index }" :key="index" @click="toggleTab(item, index)">{{ item.num }}</div>
                    </div>
                    <svg-icon :style="answerShow ? 'color: #fdb63f' : ''" icon-class="icon-table-of-contents" @click="answerClick"></svg-icon>
                    <span :style="answerShow ? 'color: #fdb63f' : ''" @click="answerClick">试题目录</span>
                </li>
                <li @click="switchClich(false)" v-if="$route.name == 'subjectList' || $route.name == 'subjectAnalyse'">
                    <svg-icon icon-class="icon-topics"></svg-icon>
                    <span>上一题</span>
                </li>
                <li @click="switchClich(true)" v-if="$route.name == 'subjectList' || $route.name == 'subjectAnalyse'">
                    <svg-icon icon-class="icon-next-question"></svg-icon>
                    <span>下一题</span>
                </li>
                <li @click="incompletededuction" v-if="$route.name == 'examView' || $route.name == 'detailedOralStatistics'">
                    <svg-icon icon-class="icon-toBeImproved"></svg-icon>
                    <span>未完成待改进</span>
                </li>
                <li @click="fullScoreReward" v-if="$route.name == 'examView' || $route.name == 'detailedOralStatistics'">
                    <svg-icon icon-class="icon-reward"></svg-icon>
                    <span>满分奖励</span>
                </li>
                <li @click="goBack">
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
export default {
    data() {
        return {
            showCourseDetailsFooter: true, //展开收起菜单
            showSide: this.$route.query.from == 'classStatList' || this.$route.query.from == 'preview' ? true : false,
            showTestPaper: false,
            hideSomeThing: this.$route.query.hasOwnProperty('socketTaskId'),
            isFromClassStatList: this.$route.query.from == 'classStatList' ? true : false,
            strShow: false,
            index: 1,
            pushShow: false,
            questionList: [],
            indexData: 0,
            answerShow: false
        };
    },

    components: {},

    computed: {
        isTestPaper() {
            return this.$store.getters.getExamDetailData.testPaperId > 0;
        },
        key() {
            return this.$route.path;
        },
        item() {
            return this.$store.getters.getExamDetailData;
        },
        getListOfTestQuestions() {
            return this.$store.getters.getListOfTestQuestions
        },

    },

    mounted() {
        console.log(this.indeXt)
        if (this.$route.query.hasOwnProperty('socketTaskId')) {
            let obj = {
                socketTaskId: this.$route.query.socketTaskId,
                testPaperId: this.$route.query.testPaperId,
            };
            this.$store.commit('setQuerySocket', obj);
        }
    },
    watch: {
        $route: {
            handler(val, oldval) {
                if (val.name == 'subjectList') {
                    this.questionList = JSON.parse(JSON.stringify(this.$route.query.questionList))
                }
                if (val.name == 'subjectAnalyse') {
                    this.questionList = JSON.parse(sessionStorage.getItem('subjectAnalyse')).questionList
                    console.log(JSON.parse(sessionStorage.getItem('subjectAnalyse')).questionList, "JSON.parse(sessionStorage.getItem('subjectAnalyse')).questionList")
                }

            },
            // 深度观察监听
            deep: true
        },
        'getListOfTestQuestions': {
            handler(val, oldval) {
                console.log(val, "1111")
                this.indexData = val
                this.answerShow = false

            },
            deep: true
        }
    },

    beforeRouteLeave(to, from, next) {
        console.log(to, from, "7778887787")
        next();
    },
    created() {},
    methods: {
        strShowClick() {
            this.strShow = !this.strShow
            this.pushShow = !this.pushShow
        },
        hierarchicalPush() {
            this.index = 1
            this.$store.commit('setPushstatus', "1")
            this.$refs['target-name'].examDetailSend()
            this.pushShow = !this.pushShow
        },
        pushTheWholeClass() {
            this.index = 2
            this.$store.commit('setPushstatus', "2")
            this.$refs['target-name'].examDetailSend()
            this.pushShow = !this.pushShow
        },
        goBack() {
            console.log(this.$route.name, this.$route.query, "11111111111-------")
            if (this.$route.name == 'subjectAnalyse' || this.$route.name == 'subjectList') {
                this.$router.go(-1);
            } else {
                this.$router.push({
                    name: this.$route.query.from
                });
            }
        },
        goRouter(name) {
            if (name == 'examDetail') {
                if (this.item.resourceType === 'R03') {
                    console.log(this.$store.getters.getExamDetailData, "111111====")
                    //单道试题
                    this.$router.push(
                        `/inClassDetail/questionDetail?tchCourseId=${this.$store.getters.getBaseData.tchCourseId}&taskId=${this.$store.getters.getExamDetailData.info.taskId}&title=${this.item.info.taskName}&from=classStatList`
                    );
                } else {
                    //试卷
                    this.$router.push({
                        name: `examDetail`,
                        query: {
                            tchCourseId: this.$store.getters.getBaseData.tchCourseId,
                            sysCourseId: this.$route.query.sysCourseId,
                            relationCourseId: this.$route.query.relationCourseId,
                            type: 1,
                            testPaperId: JSON.parse(localStorage.getItem('querySocket')) ? JSON.parse(localStorage.getItem('querySocket')).testPaperId : this.item.testPaperId,
                            subjectType: localStorage.currentSubjectType,
                            classGrade: this.$route.query.classGrade,
                            title: this.item.testPaperName,
                            fromTask: 1,
                            from: this.$route.query.from,
                        },
                    });
                }
            } else if (name == 'statistic') {
                console.log(this.$route.query, "this.$route.query.from------------")
                this.$router.push({
                    name: 'statistic',
                    query: {
                        info: this.item,
                        testPaperId: this.item.testPaperId,
                        termType: this.$route.query.termType,
                        tchCourseId: this.item.tchCourseId,
                        taskId: this.item.taskId,
                        taskType: this.item.taskType,
                        resourceType: this.item.resourceType,
                        courseName: this.$route.query.courseName, // 重发任务需要用到
                        from: this.$route.query.from,
                    },
                });

            } else {
                this.$router.push({
                    name: name,
                    query: {
                        from: this.$route.query.from,
                    },
                });
            }
        },
        switchClich(value) {
            this.$refs['target-name'].toggleQuestion(value)
        },
        toggleTab(item, index) {
            this.indexData = index
            console.log(item)
            this.$store.commit('setListOfTestQuestions', index)
            this.$refs['target-name'].toggleTab(item)
            this.answerShow = false
        },
        answerClick() {
            this.answerShow = !this.answerShow
        },
        incompletededuction() {
            this.$store.commit('setBonusPoints', null)
            this.$store.commit('setBonusPoints', false)
        },
        fullScoreReward() {
            this.$store.commit('setBonusPoints', null)
            this.$store.commit('setBonusPoints', true)
        }
    },
    destroyed() {
        this.$router.push({
            query: {}
        });

        this.$store.commit('setQuerySocket', '');
        localStorage.removeItem('querySocket');
    },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

.inClassDetail {
    height: 100vh;
    background: #15a071;
    display: flex;
    justify-content: center;
    padding-top: 25px;
    box-sizing: border-box !important;
    overflow: hidden;
}

.inClassDetail_tab_div {
    position: absolute;
    left: 5.3%;
    top: 50%;
    transform: translateY(-40%);
}

.inClassDetail_tab {
    display: flex;
    flex-direction: column;

    // position: absolute;
    // left: 3.9%;
    // top: 50%;
    // transform: translateY(-50%);
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

.inClassDetail_content {
    margin-top: 15px;
    width: 1640px;
    height: 92vh;
    overflow: auto;
    background: #ffffff;
    border-radius: 20px 20px 0px 0px;
    position: relative;
    box-sizing: border-box;
}

.courseDetails_footer_menu {
    width: auto;
    min-width: 220px;
    background: #797979;
    border-radius: 10px;
    opacity: 0.95;
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    right: 5%;
    bottom: 5%;
    z-index: 500;

    li {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 98px;
        padding: 0 10px;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        font-size: 18px;
        position: relative;

    }

    .sgtejh {
        display: flex;
        flex-direction: column;
    }

    svg {
        fill: currentColor;
        font-size: 32px;
    }

    .select_li {
        color: #fdb63f;

    }

    .select_li1 {
        color: #22ad7e !important;
    }

    .select_li_div {
        width: 200px;
        height: 100px;
        background: #fff;
        border-radius: 10px;
        position: absolute;
        top: -120px;
        left: -18px;

        div {
            width: 100%;
            height: 50%;
            text-align: center;
            line-height: 50px;
            color: #1b1b1b;
        }
    }
}

.inClassDetail-h2 {
    font-size: 24px;
    text-align: center;
    width: 40%;
    margin: 0 auto;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}

.courseDetails_footer_menu_statistic {
    min-width: 98px;
    max-width: 584px;
    // height: 96px;
    padding: 16px 0;
    background: #797979;
    border-radius: 10px;
    opacity: 0.95;
    z-index: 501 !important;

    .datasi {
        position: relative;

        .numbering {
            position: absolute;
            width: 390px;
            height: 290px;
            background: #FFFFFF;
            box-shadow: 0px 2px 16px 0px rgba(63, 63, 63, 0.2);
            border-radius: 10px;
            border: 2px solid #E6E6E6;
            top: -310px;
            right: -240px;
            display: flex;
            flex-wrap: wrap;
            overflow: auto;

            .numbering-div {
                display: flex;
                width: 70px;
                height: 70px;
                border-radius: 10px;
                border: 2px solid #E6E6E6;
                margin-left: 10px;
                margin-top: 10px;
                color: #A8A8A8;
                font-size: 28px;
                justify-content: center;
                align-items: center;
            }

            .active {
                color: #ffffff;
                background: #fdb63f;
            }
        }

    }
}

.daya {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hideAll {
    // background: #22bd99;
    background: #15a071;
    box-sizing: border-box;

    // background: transparent;
    // padding: 118px 0 0 0;
    // width: 80%;
    // margin: 0 auto;
    // .inClassDetail_content {
    //   // width: 80%;
    //   margin: 0 auto;
    //   // position: relative;
    // }
    // .inClassDetail_tab_div {
    //   left: 7.9%;
    // }

}
</style>
