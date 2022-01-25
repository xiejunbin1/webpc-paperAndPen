<template>
<section class="class-stat-list">
    <div class="" ref="body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
            <div class="null-tips-div" v-if="!listLoading && list.length == 0" style="text-align: center; color: #999999; padding-top: 100px">
                <img class="null-tips" src="../../../assets/img/preview/class_stat_empty.png" alt />
            </div>
            <van-list v-model="listLoading" :finished="finished" :finished-text="list.length > 0 ? '没有更多了' : '当前没有内容～'" @load="onLoad" :offset="80">
                <list-item ref="listItem" @clickTo="viewStat(item)" class="mgt10 common_list" style="background: #fff" @del="handleDelete(item, index)" @clickDel="clickDel(index)" v-for="(item, index) in list" :key="index" :itemTitle="item.taskName" :can-slide="true">
                    <div slot="cover" class="cover icon-test-cover">
                        <svg-icon icon-class="icon-test" />
                    </div>
                    <div class="list-task-title" slot="list-task-title">
                        <div class="list-task-title-top">
                            <p v-if="item.description">{{ item.description }}</p>
                            <p v-else>暂无描述~</p>
                        </div>
                        <div class="list-task-title-bottom">
                            <p class="list-task-title-bottom-left">
                                <svg-icon icon-class="icon_press_content" />
                                <span>未开始{{ item.tchClassTastInfo[0].notStartCount }}</span>
                                <span>进行中{{ item.tchClassTastInfo[0].runningCount }}</span>
                                <span>已完成{{ item.tchClassTastInfo[0].finshCount }}</span>
                                <span>总人数{{ item.tchClassTastInfo[0].allCount }}</span>
                            </p>
                            <div v-for="(c, ci) in item.tchClassTastInfo" :key="ci" v-if="c.classId == $store.getters.getUserInfo.classId">
                                <span><svg-icon icon-class="icon_preview_time" />{{ c.startDate }} ~ {{ c.endDate }}</span>
                            </div>
                        </div>
                    </div>
                    <div slot="icon-go" class="dropdown-header-item-type-icon">
                        <i class="iconGFY icon_course_back"></i>
                    </div>
                </list-item>
            </van-list>
        </van-pull-refresh>
    </div>
</section>
</template>

<script>
import listItem from '../../../components/list-item';
import {
    getCourseTaskList,
    deleteCourseTask
} from '@/api/index';
import eventBus from '@/utils/eventBus';

export default {
    name: 'classStatList',
    components: {
        listItem
    },
    data() {
        return {
            list: [],
            popShow: false,
            listLoading: false,
            refLoading: false,
            finished: false,
            currentPage: 0,
            total: 0,
            tchClassCourseInfo: this.$store.getters.getBaseData,
            scrollTop: 0,
            clickIndex: 0,
        };
    },
    mounted() {
        // this.getClassTeachCourseInfo()
        eventBus.$off('classStatListEditTask');
        eventBus.$on('classStatListEditTask', (data) => {
            console.log('classStatListEditTask eventbus');
            this.onRefresh();
        });
    },

    methods: {
        // 比较时间大小
        jugeTime(date1, date2) {
            var oDate1 = new Date(date1);
            var oDate2 = new Date(date2);
            if (oDate1.getTime() > oDate2.getTime()) {
                // console.log('第一个大');
                return true;
            } else {
                // console.log('第二个大');
                return false;
            }
        },
        goInClassDetail(item) {
            console.log(item, "==================")
            this.$router.push({
                name: 'inClassDetail'
            });
        },
        clickDel(index) {
            this.clickIndex = index;
        },
        viewStat(item) {
            console.log(item, "=================11111111")
            if (item.tchClassTastInfo.some((v) => v.classId === 0)) {
                return this.$toast('任务班级已不在当前课程的班级中，无法查看任务统计！');
            }
            this.$store.commit('setVanLoading', true);
            this.$store.commit('setExamDetailData', {});
            this.$store.commit('setExamDetailData', {
                info: item,
                testPaperId: item.testPaperId,
                termType: this.$route.query.termType,
                tchCourseId: item.tchCourseId,
                taskId: item.taskId,
                taskType: item.taskType,
                resourceType: item.resourceType,
                courseName: this.$route.query.courseName, // 重发任务需要用到
                from: 'classStatList',
            });

            this.$router.push({
                name: 'statistic',
                query: {
                    info: item,
                    testPaperId: item.testPaperId,
                    termType: this.$route.query.termType,
                    tchCourseId: item.tchCourseId,
                    taskId: item.taskId,
                    taskType: item.taskType,
                    resourceType: item.resourceType,
                    courseName: this.$route.query.courseName, // 重发任务需要用到
                    from: 'classStatList',
                },
            });
            localStorage.setItem('stat', JSON.stringify(item));
        },
        goto(item) {
            if (item.resourceType === 'R03') {
                //单道试题
                this.$router.push(`/questionDetail?tchCourseId=${item.tchCourseId}&taskId=${item.taskId}&title=${item.taskName}`);
            } else {
                //试卷
                this.$router.push({
                    path: `/examDetail`,
                    query: {
                        tchCourseId: this.$route.query.tchCourseId,
                        sysCourseId: this.$route.query.sysCourseId,
                        relationCourseId: this.$route.query.relationCourseId,
                        type: 1,
                        testPaperId: item.testPaperId,
                        subjectType: localStorage.currentSubjectType,
                        classGrade: this.$route.query.classGrade,
                        title: item.testPaperName,
                        fromTask: 1,
                    },
                });
            }
        },
        handleDelete(item, index) {
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                taskId: item.taskId,
                tchCourseId: item.tchCourseId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            deleteCourseTask(params).then((res) => {
                if (res.flag) {
                    this.list.splice(index, 1);
                    this.$toast('删除成功');
                }
            });
        },
        async onLoad() {
            this.currentPage++;
            if (this.currentPage > this.total && this.currentPage > 1) {
                return;
            }
            this.getList();
        },
        async onRefresh() {
            this.finished = false;
            this.currentPage = 0;
            this.onLoad();
        },
        async getList() {
            const page = this.currentPage;
            let obj = {
                interUser: 'runLfb',
                interPwd: '7829b380bd1a1c4636ab735c6c7428bc',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                operateRoleType: 'A02',
                accountNo: this.$store.getters.getUserInfo.accountNo,
                tchCourseId: this.$store.getters.getBaseData.tchCourseId,
                taskType: 'T10',
                pageSize: 10,
                currentPage: this.currentPage,
                classId: this.$store.getters.getUserInfo.classId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            await getCourseTaskList(params).then((res) => {
                this.listLoading = false;
                this.refLoading = false;
                this.total = res.total;
                if (res.flag && res.data && res.data[0]) {
                    this.list = page === 1 ? res.data[0].tchCourseTaskInfo : this.list.concat(res.data[0].tchCourseTaskInfo);
                    //设置班级名称
                    if (localStorage.getItem('classMap')) {
                        let classMap = JSON.parse(localStorage.getItem('classMap'));
                        let hisClassMap = localStorage.getItem('hisClassMap') ? JSON.parse(localStorage.getItem('hisClassMap')) : {};
                        this.list.forEach((item) => {
                            let finishCount = 0;
                            let allCount = 0;
                            if (item.tchClassTastInfo) {
                                item.tchClassTastInfo.forEach((obj, i) => {
                                    if (i == 0) {
                                        //跳转到任务统计页面时自动将第一个班级设置为选中状态
                                        obj.active = true;
                                    }
                                    finishCount += obj.finshCount;
                                    allCount += obj.allCount;
                                    if (classMap[obj.classId] && classMap[obj.classId].className) {
                                        obj['className'] = classMap[obj.classId].className;
                                    } else if (hisClassMap[obj.classId] && hisClassMap[obj.classId].className) {
                                        obj['className'] = hisClassMap[obj.classId].className;
                                    } else {
                                        obj['className'] = '--';
                                    }
                                });
                            }
                            item.finishCount = finishCount;
                            item.allCount = allCount;
                        });
                    }
                    if (this.currentPage >= res.total) {
                        this.finished = true;
                    }
                    this.listLoading = false
                } else {
                    this.list = page === 1 ? [] : this.list.concat([]);
                    this.finished = true;
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

.class-stat-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
        flex: 1;
        overflow-y: auto;

        .desc-top {
            display: flex;
            margin-bottom: 10px;

            .iconGFY {
                margin-right: 5px;
            }
        }

        .desc-bottom {
            margin-top: 18px;
            display: flex;
            font-size: 20px;
            color: #666;

            .iconGFY {
                margin-right: 3px;
            }

            >div {
                margin-right: 18px;
                display: flex;
                align-items: center;
            }
        }
    }
}

.classStatList_listItem_desc {
    display: flex;
}

.classStatList_listItem_img {
    width: 117px;
    height: 127px;
    // position: absolute;
}

.common_list {
    // position: relative;
}

.dropdown-header-item-type-icon {
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
}

// new----
@{deep} .list-task-content-top-title {
    line-height: 38px;
}

.list-task-title {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 38px;
    width: 80%;
}

.list-task-title-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;

    svg {
        margin-right: 5px;
    }

    .list-task-title-bottom-left {
        // margin-right: 80px;
        // width: 100%;
        align-items: flex-end;
    }

    .list-task-title-bottom-left span::after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 2px;
        height: 20px;
        margin: 0 10px 2px;
        background-color: #666;
    }

    .list-task-title-bottom-left span:last-child::after {
        display: none;
    }
}

.list-item-status {
    width: 460px;
    background: #5b8bef;
    font-size: 26px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 37px;
    text-align: center;
    transform: rotate(45deg);
    position: absolute;
    right: -350px;
    top: 50px;
    z-index: 60;
}

.list-item-status-end {
    background: #dedede;
    color: #fff;
}

.icon-test-cover {
    font-size: 150px;
}

@{deep} .icon-wrap {
    height: unset !important;
}
</style>
