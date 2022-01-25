<template>
<section class="exam-view-wrap">
    <!-- <van-nav-bar :title="title" @click-left="goBack" left-arrow> </van-nav-bar> -->
    <!-- <div class="exam-view-wrap__tab">
      <div @click="handleToggle(true)" :class="{ active: classView }">班级查看</div>
      <div @click="handleToggle(false)" :class="{ active: !classView }">小组查看</div>
    </div> -->
    <div class="in-class-wrap_footer_tab">
        <van-tabs class="in-class-wrap_tabs" title-active-color="#22AD7E" title-inactive-color="#666" color="#22AD7E" @click="handleToggle">
            <van-tab title="班级查看"></van-tab>
            <van-tab title="小组查看"></van-tab>
        </van-tabs>
    </div>
    <div class="exam-view-wrap__body">
        <score-table :examScore="info.testPaperScore" @jump="jump" @saveRewardScore="saveRewardScore" :list="classView ? classList : groupList" :classView="classView" :isWk="['T01', 'T03' , 'T02'].includes($store.getters.getExamDetailData.taskType)" :isTest="isTest" :isfEducation="isfEducation"></score-table>
    </div>
    <div class="bulletFrame" v-show="bonusPointsShow">
        <div class="bulletFrame-Frame">
            <svg-icon class="icon-delete" icon-class="icon-delete" @click="bonusPointsShow=false"></svg-icon>
            <svg-icon v-show="bonusPoints" class="bulletFrame-Frame-svg" icon-class="icon-fullScoreReward"></svg-icon>
            <svg-icon v-show="!bonusPoints" class="bulletFrame-Frame-svg" icon-class="icon-toBeImproveds"></svg-icon>
            <div class="student">

                <div class="fullScoreReward" v-show="bonusPoints">
                    <div class="fullScore">满分奖励</div>
                    <div class="Reward">+1</div>
                </div>
                <div class="fullScoreReward" v-show="!bonusPoints">
                    <div class="fullScore">待改进</div>
                    <div class="Reward" style="color:#FF4D4F">-1</div>
                </div>
                <div class="studentsct">
                    <div class="avatar" v-for="(value, index) in Lister" :key="index">
                        <svg-icon class="icon-avatar" icon-class="icon-avatar"></svg-icon>
                        <div class="name">{{ value }}</div>
                    </div>
                </div>

                <div class="reward" v-show="bonusPoints" @click="incompletededuction('T01')">
                    <svg-icon class="icon-reward-bttom" icon-class="icon-reward-bttom"></svg-icon>
                    <div class="jiangli1">继续奖励 {{ Lister.length }} 人</div>
                </div>
                <div class="reward" v-show="!bonusPoints" @click="incompletededuction('T02')">
                    <svg-icon class="icon-reward-bttom" icon-class="icon-toBeImproved-bottom"></svg-icon>
                    <div class="jiangli1">待改进 {{ Lister.length }}人</div>
                </div>
                <!-- <div class="todaysReward">今日剩余奖励分：19分</div> -->
            </div>
        </div>
    </div>
</section>
</template>

<script>
import scoreTable from '../../components/scoreTable';
import {
    getStudentName,
    getParentName,
    formathms
} from '@/utils/filter';
import {
    statTaskStatV2,
    statTaskStat,
    saveRewardScore
} from '@/api/index';

export default {
    name: 'examView',
    data() {
        return {
            classView: true, //按班级查看
            // info: JSON.parse(JSON.stringify(this.$store.getters.getStatisticData.info)),
            info: '',
            title: this.$store.getters.getExamDetailData.title,
            isSpoken: this.$store.getters.getExamDetailData.isSpoken,
            taskType: this.$store.getters.getExamDetailData.taskType,
            termType: this.$store.getters.getExamDetailData.termType,
            isfEducation: this.$store.getters.getExamDetailData.isfEducation,
            isDisabled: this.$store.getters.getExamDetailData.isDisabled,
            isTest: this.$store.getters.getExamDetailData.testPaperId > 0 || this.$store.getters.getExamDetailData.resourceType === 'R03' || this.$store.getters.getExamDetailData.taskType === 'T13' ? 1 : 0,
            classList: [],
            groupList: [],
            Lister: [],
            bonusPointsShow: false
        };
    },
    computed: {
        bonusPoints() {
            return this.$store.getters.getBonusPoints
        }
    },
    watch: {
        '$store.getters.getBonusPoints': {
            handler(newval, olval) {
                console.log(newval, "newvalnewval")
                if (!newval) {
                    this.Lister = []
                    let accountNoList = this.$store.getters.getNumberOfUnfinished
                    if (!accountNoList.join('|')) {
                        this.$toast("暂无未完成人员")
                        this.bonusPointsShow = false
                        return false
                    }
                    accountNoList.forEach(va => {
                        this.Lister.push(getStudentName(va, this.$store.getters.getUserInfo.classId))
                    })
                    this.bonusPointsShow = true
                } else {
                    this.Lister = []
                    let accountNoLists = this.$store.getters.getAllRight
                    if (!accountNoLists.join('|')) {
                        this.$toast("暂无满分人员")
                        this.bonusPointsShow = false
                        return false
                    }
                    accountNoLists.forEach(va => {
                        this.Lister.push(getStudentName(va, this.$store.getters.getUserInfo.classId))
                    })
                    this.bonusPointsShow = true
                }
            },
            deep: true
        }
    },
    async created() {
        console.log('this.$store.getters.getExamDetailData.taskType', this.$store.getters.getExamDetailData.taskType);
        // await this.statTaskStat();
        this.$route.query.hasOwnProperty('socketTaskId') ? await this.statTaskStatPaper() : await this.statTaskStat();
    },
    // beforeRouteEnter(to, from, next) {
    //   if (from.path === '/addSubScore' || from.path === '/addSubGroupScore') {
    //     next((vm) => {
    //       vm.statTaskStat();
    //     });
    //   } else {
    //     next();
    //   }
    // },
    components: {
        scoreTable
    },
    methods: {
        classLists() {
            let arr = this.info.studentStatList.reduce((t, v) => {
                if (this.info.finishStudent.includes(v.accountNo)) {
                    t.push({
                        ...v,
                        name: this.isfEducation ? getParentName(v.accountNo, this.info.classId) : getStudentName(v.accountNo, this.info.classId),
                        // duration: Math.floor(v.duration / 60) > 0 ? `${Math.floor(v.duration / 60)}分${v.duration % 60}秒` : `${v.duration % 60}秒`,
                        duration: formathms(v.duration),
                        tvTime: v.tvEndDate && v.tvStartDate ?
                            formathms((new Date(v.tvEndDate.replace(/-/g, '/').split('.0')[0]).getTime() - new Date(v.tvStartDate.replace(/-/g, '/').split('.0')[0]).getTime()) / 1000) : '--',
                    });
                }
                return t;
            }, []);
            return this.bubbleSort(arr);
        },
        groupLists() {
            let arr = this.info.studentStatList.reduce((t, v) => {
                if (this.info.finishStudent.includes(v.accountNo)) {
                    const index = t.findIndex((g) => g.groupId === v.groupId);
                    if (v.bigExamAnswerList && v.bigExamAnswerList.length > 0) {
                        v.bigExamAnswerList.forEach((aItem, aIndex) => {
                            if (v.examAnswerList && v.examAnswerList[aIndex])
                                v[aItem.exam_index] = v.examAnswerList[aIndex].is_rigth
                        })
                    }
                    console.log(v,"77vvvvvvvvvvvv")
                    const item = {
                        ...v,
                        name: this.isfEducation ? getParentName(v.accountNo, this.info.classId) : getStudentName(v.accountNo, this.info.classId),
                        // duration: Math.floor(v.duration / 60) > 0 ? `${Math.floor(v.duration / 60)}分${v.duration % 60}秒` : `${v.duration % 60}秒`
                        duration: formathms(v.duration),
                        tvTime: v.tvEndDate && v.tvStartDate ?
                            formathms((new Date(v.tvEndDate.replace(/-/g, '/').split('.0')[0]).getTime() - new Date(v.tvStartDate.replace(/-/g, '/').split('.0')[0]).getTime()) / 1000) : '--',
                    };
                    if (index > -1) {
                        // 已存在相同组
                        t[index].stu.push(item);
                        const total = t[index].stu.reduce((total, s) => {
                            total += s.score;
                            return total;
                        }, 0);
                        t[index].average = (total / t[index].stu.length).toFixed(2);
                    } else {
                        t.push({
                            groupId: v.groupId,
                            groupName: v.groupName,
                            groupScore: v.groupScore,
                            average: item.score,
                            stu: [item],
                        });
                    }
                }
                return t;
            }, []);
            
            // arr.forEach((value, index) => {
            //   let studentRewardScore = 0
            //   value.stu.forEach((va, i) => {
            //       if(va.studentRewardScore == null){
            //           console.log(11111)
            //           va.studentRewardScore = 0
            //       }
            //       studentRewardScore += parseInt(va.studentRewardScore) 
            //       console.log(studentRewardScore,"studentRewardScore")
            //   })
            //   value.studentRewardScore = studentRewardScore
            // })
            // alert("我更新了")
            console.log(arr,"arrarrarr-----------------------")
            return this.bubbleSort(arr);
        },
        // 加分、减分
        saveRewardScore(score, type, saveType) {
            console.log('score---', score);
            this.$store.commit('setVanLoading', true);
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId: this.info.taskId || this.$route.query.socketTaskId,
                type: type,
                score: 1,
                taskName: this.$store.getters.getExamDetailData.info.taskName,
                subjectType: localStorage.currentSubjectType,
                teacherName: JSON.parse(localStorage.getItem('userInfo')).userName,
                termType: this.termType,
                classId: this.$store.getters.getUserInfo.classId,
            };
            if (saveType == 'group') {
                let dataItem = []
                score.stu.forEach(value => {
                    dataItem.push(value.accountNo)
                })
                obj.accountNoList = dataItem.join('|');
                obj.groupIdList = score.groupId;
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

        
        incompletededuction(type) {
            console.log("8787")
            let accountNoList = this.$store.getters.getNumberOfUnfinished
            this.$store.commit('setVanLoading', true);
            let accountNoLists = this.$store.getters.getAllRight
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId: this.info.taskId || this.$route.query.socketTaskId,
                type: type,
                score: 1,
                taskName: this.$store.getters.getExamDetailData.info.taskName,
                subjectType: localStorage.currentSubjectType,
                teacherName: JSON.parse(localStorage.getItem('userInfo')).userName,
                termType: this.termType,
                classId: this.$store.getters.getUserInfo.classId,
                accountNoList: type == 'T02' ? accountNoList.join('|') : accountNoLists.join('|')
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
             this.bonusPointsShow = false
            saveRewardScore(params).then((res) => {
                this.$store.commit('setVanLoading', false);
                if (res.flag) {
                    this.$toast(type == 'T01' ? '加分成功' : '减分成功');
                    this.statTaskStat();
                    this.bonusPointsShow = false
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 获取数据
        async statTaskStat() {
            this.$store.commit('setVanLoading', true);
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId: this.$store.getters.getExamDetailData.taskId || this.$store.getters.getExamDetailData.info.taskId,
                classId: this.$store.getters.getUserInfo.classId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            let api;
            if (['T10'].includes(this.$store.getters.getExamDetailData.taskType)) {
                //从堂测统计进入
                api = statTaskStatV2;
            } else {
                api = statTaskStat;
            }
            api(params).then((res) => {
                this.$store.commit('setVanLoading', false);
                if (res.flag && res.data[0]) {
                    if (this.taskType === 'T13') {
                        console.log('------------------------')
                        res.data[0].studentStatList = res.data[0].examstat;
                        //因为口语没有testPaperScore这个字段,但是总分是按100分来算的
                        res.data[0].testPaperScore = 100;
                    }
                    this.info = res.data[0];
                    console.log(this.info, "this.info")
                    this.classList = this.classLists();
                    this.groupList = this.groupLists();
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        async statTaskStatPaper() {
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                classId: this.$store.getters.getUserInfo.classId,
                // taskId: this.$store.getters.getQuerySocket.socketTaskId,
                taskId: this.$route.query.socketTaskId || this.$store.getters.getQuerySocket.socketTaskId,
                // classId,
            };
            console.log('this.$route.query.socketTaskId-----', this.$route.query, this.$route.query.socketTaskId);

            let params = {
                requestJson: JSON.stringify(obj),
            };
            let api;
            api = statTaskStatV2;

            await api(params).then((res) => {
                if (res.flag && res.data[0]) {
                    // if (this.$store.getters.getExamDetailData.taskType === 'T13') {
                    //   res.data[0].studentStatList = res.data[0].examstat;
                    //   //因为口语没有testPaperScore这个字段,但是总分是按100分来算的
                    //   res.data[0].testPaperScore = 100;
                    // }
                    this.info = res.data[0];
                    console.log(this.info, "this.infothis.info")
                    this.classList = this.classLists();
                    this.groupList = this.groupLists();
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        addSubScore() {
            if (this.isDisabled) return;
            if (this.classView) {
                this.$router.push({
                    name: `addSubScore`,
                    params: {
                        info: this.info,
                        termType: this.termType,
                        isfEducation: this.isfEducation
                    }
                });
            } else {
                this.$router.push({
                    name: `addSubGroupScore`,
                    params: {
                        info: this.info,
                        termType: this.termType,
                        isfEducation: this.isfEducation
                    }
                });
            }
        },
        //冒泡排序
        bubbleSort(arr) {
            for (let i = 0; i < arr.length - 1; i++) {
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    if (arr[j].score < arr[j + 1].score) {
                        let tem = arr[j];

                        arr[j] = arr[j + 1];

                        arr[j + 1] = tem;
                    }
                }
            }
            return arr;
        },
        jump(item) {
            try {
                MobclickAgent.onEvent('viewStuExamDetail');
            } catch (e) {
                console.log(e);
            }
            if (this.isSpoken) {
                let info = this.info.finishResultBySplit.reduce((t, v) => {
                    let answer = v.splitInfoStudentAnswers.find((value) => value.accountNo === item.accountNo);
                    if (answer) t.push({
                        ...answer,
                        sentenceContent: v.splitSentence.sentenceContent
                    }); // 词汇存进数组
                    return t;
                }, []);
                this.$router.push({
                    name: 'spokenAnalyse',
                    params: {
                        type: 'personal',
                        info,
                        classId: this.info.classId,
                        index: 0
                    },
                });
            } else {
                const bigExam = this.info.studentStatList.find((v) => v.accountNo == item.accountNo);
                this.$router.push({
                    path: '/stuAnalyse',
                    query: {
                        accountNo: item.accountNo,
                        classId: this.info.classId,
                        taskType: this.taskType,
                        bigExam: bigExam || {},
                        isfEducation: this.isfEducation
                    },
                });
            }
        },
        handleToggle(bol) {
            //班级未分组时,无法切换小组查看 弹出toast
            // if (
            //   !localStorage[`subGroup_${localStorage.currentSubjectType}_${this.info.classId}`] ||
            //   JSON.parse(localStorage[`subGroup_${localStorage.currentSubjectType}_${this.info.classId}`]).length === 0
            // ) {
            //   return this.$toast('该班级未分组,无法进行小组查看');
            // }
            // if (!this.isfEducation) {
            //   try {
            //     MobclickAgent.onEvent('viewStuExamCount');
            //   } catch (e) {
            //     console.log(e);
            //   }
            // }
            this.classView = !bol;
            console.log('bol---', bol, this.classView);
        },
    },
};
</script>

<style lang="less" scoped>
.exam-view-wrap {
    flex-direction: column;
    display: flex;
    padding: 1%;

    &__tab {
        flex: 0 0 48px;
        padding: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        >div {
            border-radius: 15px;
            font-size: 15px;
            color: #999;
            background: #f5f6fa;
            margin-right: 20px;
            line-height: 30px;
            padding: 0 15px;

            &.active {
                background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
                color: #fff;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    &__body {
        flex: 1;
        overflow-y: auto;
        padding: 0 10px 10px;
    }

    &__footer {
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        padding: 0 10px;

        .btn {
            height: 44px;
            line-height: 44px;
            flex: 1;
            border-radius: 20px;
            font-size: 18px;
        }
    }

    .disabled {
        background: #f5f6fa;
        color: #ccc;
        border: 1px solid #ccc;
    }
}

// new---
.in-class-wrap_footer_tab {
    width: 100%;
    height: 60px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.in-class-wrap_tabs {
    width: 20%;
    font-size: 24px;
}

.empty-page img {
    width: unset;
}
.bulletFrame{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);  ;
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .bulletFrame-Frame{
        width: 900px;
        height: 857px;
        position: relative;
        display: flex;
        justify-content: center;
        .icon-delete{
            width: 30px;
            height: 30px;
            position: absolute;
            right: 10px;
            top: 310px;
        }
        .bulletFrame-Frame-svg{
            width: 900px;
            height: 857px;
        }
        .student{
            position: absolute;
            z-index: 99999;
            width: 900px;
            height: 420px;
            top: 400px;
            .fullScoreReward{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .fullScore{
                    font-size: 30px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #1B1B1B;
                    line-height: 42px;
                }
                .Reward{
                    font-size: 30px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FDB63F;
                    line-height: 42px;
                }
            }
            .studentsct{
                width: 100%;
                height: 260px;
                margin-top: 20px;
                display: flex;
                flex-wrap: wrap;
                overflow: auto;
                .avatar{
                    display: flex;
                    align-items: center;
                    margin-top: 14px;
                    .icon-avatar{
                        width: 36px;
                        height: 36px;
                        margin-left: 35px;
                    }
                    .name{
                        font-size: 20px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        height: 36px;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 36px;
                        text-indent: 10px;
                    }
                }
            }
            .reward{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
                position: relative;
                .icon-reward-bttom{
                    width: 232px;
                    height: 64px;
                }
                .jiangli1{
                    position: absolute;
                    font-size: 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                }
            }
            .todaysReward{
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                text-align: center;
                margin-top: 10px;
            }
        }
    }
}
</style>
