<template>
<section class="preview-wrap">
    <div class="preview-wrap__body common_body" ref="body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
            <div v-if="!listLoading && courseTaskList.length == 0" class="null-tips-div" style="text-align: center; color: #999999; padding-top: 100px">
                <img class="null-tips" src="../../assets/img/preview/task_null.png" alt />
            </div>
            <van-list v-model="listLoading" :finished="finished" :finished-text="courseList.length ? (courseTaskList.length > 0 ? '没有更多了' : '当前没有已发任务，快去新建任务吧！') : '当前没有课程,快去新建课程吧！'" @load="onLoad" :offset="80">
                <!-- @clickTo="goto(item)" -->
                <list-item ref="listItem" v-if="renderFlag" :fold="item.fold" class="mgt10 common_list" style="background: #fff" v-for="(item, index) in courseTaskList" @clickTo="viewStat(item)" :key="`${item.taskId}${index}`" :can-slide="true" :top="courseTaskList.length > 1 && index != 0" :up="courseTaskList.length > 1 && index != 0" :down="courseTaskList.length > 1 && index != courseTaskList.length - 1" :itemTitle="item.taskName" :test-paper-id="item.testPaperId" :taskType="item.taskType" :class-info-list="item.tchClassTastInfo" @clickDel="clickDel(index)">
                    <div class="list-task-title" slot="list-task-title">
                        <div class="list-task-title-top">
                            <p v-if="item.description">{{ item.description }}</p>
                            <p v-else>暂无描述~</p>
                        </div>
                        <div class="list-task-title-bottom">
                            <p class="list-task-title-bottom-left">
                                <svg-icon icon-class="icon_press_content" />
                                <span>未开始{{ item.notStartCount }}</span>
                                <span>进行中{{ item.runningCount }}</span>
                                <span>已完成{{ item.finishCount }}</span>
                                <span>总人数{{ item.allCount }}</span>
                            </p>
                            <div v-for="(c, ci) in item.tchClassTastInfo" :key="ci" v-if="c.classId == $store.getters.getUserInfo.classId">
                                <span>
                                    <svg-icon icon-class="icon_preview_time" />{{ c.startDate }} ~ {{ c.endDate }}</span>
                                <div class="list-item-status" v-if="!jugeTime(c.currentTime, c.startDate)">未开始</div>
                                <div class="list-item-status list-item-status-end" v-else-if="jugeTime(c.currentTime, c.endDate)">已结束</div>
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
import listItem from '../../components/list-item';
import dropdownHeader from '../../components/dropdown-header';
import editCourse from './addCourse';
import {
    pubApi
} from '@/api/parent-GFY';
import {
    getClassTeachCourseInfo,
    getCourseTaskList,
} from '@/api/index';
import eventBus from '@/utils/eventBus';

export default {
    name: 'index',
    components: {
        listItem,
        dropdownHeader,
        editCourse,
    },
    data() {
        return {
            showTip: false,
            renderFlag: true,
            show: false,
            courseList: [],
            courseTaskList: [],
            courseName: '',
            tchCourseId: this.$store.getters.getBaseData.tchCourseId ? this.$store.getters.getBaseData.tchCourseId : '',
            relationCourseId: '',
            termType: '',
            refLoading: false,
            listLoading: false,
            finished: false,
            currentPage: 1,
            pageSize: 10,
            dropdownPage: 1,
            dropdownRefLoading: false,
            dropdownListLoading: false,
            dropdownFinish: false,
            dropdownTotal: 0,
            total: 0,
            currentTchCourseInfo: {},
            classGrade: '',
            sysCourseId: '',
            courseIndex: 0, //选中的课程index
            currCourse: this.$route.query.currCourse ? JSON.parse(JSON.stringify(this.$route.query.currCourse)) : '', //我的课程跳过来才有的
            scrollTop: 0,
            firstFlag: true,
            tchCourseInfo: '',
            showDrop: false,
            clickIndex: 0,
            isfEducation: this.$route.query.isfEducation,
        };
    },
    mounted() {
        console.log('$route.query--', this.$route.query);
        this.tchCourseId = this.$store.getters.getBaseData.tchCourseId ? this.$store.getters.getBaseData.tchCourseId : '';
        console.log(this.tchCourseId,"this.tchCourseIdthis.tchCourseId")
        // this.onRefresh()
    },

    methods: {
        jugeTime(date1, date2) {
            console.log(date1, date2,"--asjaksjkjas")
            var oDate1 = new Date(date1);
            var oDate2 = new Date(date2);
            if (oDate1.getTime() > oDate2.getTime()) {
                return true;
            } else {
                // console.log('第二个大');
                return false;
            }
        },
        // tab('2017-10-10','2017-10-11');
        goBack() {
            this.common.goBack(this);
        },
        clickDel(index) {
            this.clickIndex = index;
        },
        viewResource() {
            try {
                MobclickAgent.onEvent('clickPreviewAddTask');
            } catch (e) {
                console.log(e);
            }
            this.$router.push({
                path: `/resource`,
                query: {
                    from: 'preview',
                    currCourse: this.courseList[this.courseIndex],
                    isfEducation: this.isfEducation,
                },
            });
        },
        open() {
            this.showDrop = true;
            this.$nextTick(() => {
                this.$refs['editCourse'].courseChange();
            });
        },
        close() {
            this.showDrop = false;
        },

        viewStat(item) {
            console.log(item, "itemitemitemitemitem")
            if (item.tchClassTastInfo.some((v) => v.classId === 0)) {
                return this.$toast('任务班级已不在当前课程的班级中，无法查看任务统计！');
            }
            this.$store.commit('setVanLoading', true);
            this.$store.commit('setExamDetailData', {});
            this.$store.commit('setExamDetailData', {
                info: item,
                testPaperId: item.testPaperId,
                termType: this.termType,
                tchCourseId: item.tchCourseId,
                taskId: item.taskId,
                taskType: item.taskType,
                resourceType: item.resourceType,
                courseName: this.courseName, // 重发任务需要用到
                from: 'preview',
                isfEducation: this.isfEducation,

            });

            this.$router.push({
                name: 'statistic',
                query: {
                    info: item,
                    testPaperId: item.testPaperId,
                    termType: this.termType,
                    tchCourseId: item.tchCourseId,
                    taskId: item.taskId,
                    taskType: item.taskType,
                    resourceType: item.resourceType,
                    courseName: this.courseName, // 重发任务需要用到
                    from: 'preview',
                    isfEducation: this.isfEducation,
                    // socketTaskId: item.taskId
                },
            });
            localStorage.setItem('taskTchCourseInfo', JSON.stringify(this.tchCourseInfo));
            localStorage.setItem('stat', JSON.stringify(item));
        },

        async onLoad() {
            let currentPage = this.currentPage++;
            console.log(1212121)
            console.log(currentPage, "==============")
            console.log(this.firstFlag)
            //首次加载
            await this.getClassTeachCourseInfo();
            // if (this.$route.query.from === 'course') {
            //     this.courseName = this.$route.query.courseName;
            //     this.classGrade = this.$route.query.classGrade;
            //     this.sysCourseId = this.$route.query.sysCourseId;
            //     this.tchCourseId = this.$route.query.tchCourseId;
            //     this.relationCourseId = this.$route.query.relationCourseId;
            //     this.termType = this.$route.query.termType;
            // } else {
            //     if (this.courseList.length) {
            //         this.courseName = this.courseList[0].tchCourseInfo.courseName;
            //         this.classGrade = this.courseList[0].tchCourseInfo.classGrade;
            //         this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId;
            //         this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId;
            //         this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId;
            //         this.termType = this.courseList[0].tchCourseInfo.termType;
            //     }
            // }
            let obj = {
                interUser: 'runLfb',
                interPwd: '7829b380bd1a1c4636ab735c6c7428bc',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                classId: this.$store.getters.getUserInfo.classId,
                operateRoleType: 'A02',
                accountNo: this.$store.getters.getUserInfo.accountNo,
                tchCourseId: this.tchCourseId,
                pageSize: 10,
                currentPage: currentPage,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            console.log(currentPage, " this.currentPage; this.currentPage=+++;")
            getCourseTaskList(params).then((res) => {
                console.log(currentPage, " -----------")
                // 转换yyyy-MM-dd为 yyyy/MM/dd
                for (var i in res.data[0].tchCourseTaskInfo) {
                    res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate = res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate.replace(/-/g, '/');
                    res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].endDate = res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].endDate.replace(/-/g, '/');
                }
                this.listLoading = false;
                this.refLoading = false;
                this.total = res.total;
                if (res.flag && res.data && res.data[0]) {
                    this.courseTaskList = currentPage === 1 ? res.data[0].tchCourseTaskInfo : this.courseTaskList.concat(res.data[0].tchCourseTaskInfo);

                    this.courseTaskList.forEach((item) => {
                        let notStartCount = 0;
                        let runningCount = 0;
                        let finishCount = 0;
                        let allCount = 0;
                        if (item.tchClassTastInfo) {
                            item.tchClassTastInfo.forEach((obj, i) => {
                                if (i == 0) {
                                    //跳转到任务统计页面时自动将第一个班级设置为选中状态
                                    obj.active = true;
                                }
                                notStartCount += obj.notStartCount;
                                runningCount += obj.runningCount;
                                finishCount += obj.finshCount;
                                allCount += obj.allCount;
                            });
                        }
                        item.notStartCount = notStartCount;
                        item.runningCount = runningCount;
                        item.finishCount = finishCount;
                        item.allCount = allCount;

                    });
                    // }
                    console.log()
                    if (res.data[0].tchCourseTaskInfo.length < 8) {
                        this.finished = true;
                        this.$toast('没有更多了');
                        return
                    }
                    console.log(currentPage, res.total, "this.currentPage >= res.total")
                } else {
                    this.courseTaskList = currentPage === 1 ? [] : this.courseTaskList.concat([]);
                    this.finished = true;
                    this.$toast('没有更多了');
                }
            });
        },
        async onRefresh() {
            // this.listLoading = false
            this.currentPage = 1
            this.getCourseTaskList(1).then((res) => {
                if (res == '失败') {
                    this.$toast('加载失败');
                    this.refLoading = false;
                } else {
                    this.$toast('刷新成功');
                    this.refLoading = false;
                }
            })
            this.$toast('刷新成功');
        },
        async getClassTeachCourseInfo(isEdit) {
            console.log('getClassTeachCourseInfo....');
            const page = this.dropdownPage;
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                // "belongSchoolId": this.$store.getters.schoolId,
                operateRoleType: 'A02',
                accountNo: this.$store.getters.getUserInfo.accountNo,
                subjectType: this.isfEducation ? 'S20' : localStorage.getItem('currentSubjectType'),
                classGrade: this.$route.query.fltGrade || '',
                termType: this.$route.query.fltTerm || '',
                classId: this.$route.query.fltClassId || '',
                pageSize: '10',
                courseType: this.isfEducation ? 'C02' : 'C01',
                currentPage: page,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            await getClassTeachCourseInfo(params)
                .then((res) => {
                    this.dropdownTotal = res.total;
                    this.dropdownListLoading = false;
                    this.dropdownRefLoading = false;
                    if (res.flag && res.data && res.data[0]) {
                        if (this.$route.query.from === 'course') {
                            const index = res.data.findIndex((v) => v.tchCourseInfo.tchCourseId == this.$route.query.tchCourseId && v.tchCourseInfo.sysCourseId == this.$route.query.sysCourseId);
                            if (index > -1) {
                                res.data.splice(index, 1);
                            }
                            if (page === 1) {
                                console.log(this.currCourse, 'this.$route.query.currCoursethis.$route.query.currCourse');
                                res.data.unshift({
                                    ...this.currCourse,
                                });
                                this.courseList = res.data;
                            } else {
                                this.courseList = this.courseList.concat(res.data);
                            }
                            // this.courseList = page === 1 ? res.data.unshift(...this.$route.query.currCourse) : this.courseList.concat(res.data)
                        } else {
                            this.courseList = page === 1 ? res.data : this.courseList.concat(res.data);
                            console.log(this.tchCourseInfo, 'this.tchCourseInfo!!!!');
                        }
                        this.tchCourseInfo = this.courseList[0].tchCourseInfo;

                        if (!isEdit) {
                            this.currentTchCourseInfo = this.courseList[0].tchCourseInfo;
                        }
                        if (page >= res.total) {
                            this.dropdownFinish = true;
                        }
                    } else {
                        this.courseList = page === 1 ? [] : this.courseList.concat([]);
                        this.dropdownFinish = true;
                    }
                    this.firstFlag = false;
                })
                .catch((err) => {
                    this.firstFlag = false;
                });
        },
        getCourseTaskList(currentPage) {
            console.log(currentPage, "currentPagecurrentPage")
            return new Promise((resolve, reject) => {
                let obj = {
                    interUser: 'runLfb',
                    interPwd: '7829b380bd1a1c4636ab735c6c7428bc',
                    operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                    belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                    classId: this.$store.getters.getUserInfo.classId,
                    operateRoleType: 'A02',
                    accountNo: this.$store.getters.getUserInfo.accountNo,
                    tchCourseId: this.tchCourseId,
                    pageSize: 8,
                    currentPage: currentPage,
                };
                let params = {
                    requestJson: JSON.stringify(obj),
                };
                console.log(currentPage, " this.currentPage; this.currentPage=+++;")
                getCourseTaskList(params).then((res) => {
                    console.log(currentPage, " -----------")
                    // 转换yyyy-MM-dd为 yyyy/MM/dd
                    for (var i in res.data[0].tchCourseTaskInfo) {
                        res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate = res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate.replace(/-/g, '/');
                        res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].endDate = res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].endDate.replace(/-/g, '/');
                    }
                    this.listLoading = false;
                    this.refLoading = false;
                    this.total = res.total;
                    if (res.flag && res.data && res.data[0]) {
                        this.courseTaskList = currentPage === 1 ? res.data[0].tchCourseTaskInfo : this.courseTaskList.concat(res.data[0].tchCourseTaskInfo);

                        this.courseTaskList.forEach((item) => {
                            let notStartCount = 0;
                            let runningCount = 0;
                            let finishCount = 0;
                            let allCount = 0;
                            if (item.tchClassTastInfo) {
                                item.tchClassTastInfo.forEach((obj, i) => {
                                    if (i == 0) {
                                        //跳转到任务统计页面时自动将第一个班级设置为选中状态
                                        obj.active = true;
                                    }
                                    notStartCount += obj.notStartCount;
                                    runningCount += obj.runningCount;
                                    finishCount += obj.finshCount;
                                    allCount += obj.allCount;
                                });
                            }
                            item.notStartCount = notStartCount;
                            item.runningCount = runningCount;
                            item.finishCount = finishCount;
                            item.allCount = allCount;

                        });
                        // }
                        console.log(currentPage, res.total, "this.currentPage >= res.total")
                        resolve(this.courseTaskList)
                    } else {
                        this.courseTaskList = currentPage === 1 ? [] : this.courseTaskList.concat([]);
                        resolve("失败")
                    }
                });
            })

        },

    },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

.preview-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    &__header {
        /*width: 100%;*/
        /*position: absolute;*/
        /*height: 55px;*/
        flex: 0 0 55px;
        padding: 8px 9px;
        color: #16aab7;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;

        .add-class {
            background: #e0fffc;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 66px;
            height: 27px;
            border-radius: 13px;
        }

        .dropdown-btn {
            background: #e0fffc;
            font-size: 14px;
            border-radius: 20px;
            width: 230px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 39px;

            &::after {
                border: none;
            }

            @{deep} .van-dropdown-menu__title {
                text-align: center;
                padding-right: 10px;
                width: 170px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &::after {
                    right: 6px;
                    top: 6px;
                    content: '';
                }

                &--down::after {
                    top: 10px;
                    content: '';
                }
            }

            @{deep} .van-dropdown-item__content {
                height: 95%;
                padding: 8px;
                display: flex;
                flex-direction: column;
                overflow-y: hidden;
            }

            .list-wrap {
                border: 1px solid #ccc;
                border-radius: 5px;
                margin-bottom: 10px;
            }

            .folder-btn {
                width: 100%;
                flex: 0 0 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    &__body {
        flex: 1;
        overflow-y: auto;

        /*padding-top: 55px;*/
        .add-course {
            width: 190px;
            height: 44px;
            border-radius: 22px;
            font-size: 16px;
        }
    }

    &__footer {
        flex: 0 0 44px;
        padding: 4px 12px;

        .add-mission {
            width: 100%;
            border-radius: 22px;
        }
    }

    .preview-wrap-header-right {
        flex: 0 0 40px;

        .edit-btn {
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            /*height: 39px;*/

            &::after {
                border: none;
            }

            @{deep} .van-overlay {
                top: 2px;
            }

            @{deep} .van-dropdown-menu__title {
                font-size: 10px;
                text-align: center;
                display: inline-block;
                color: #16aab7;
                white-space: nowrap;

                .van-ellipsis {
                    display: inline;
                }

                &::after {
                    right: 6px;
                    top: 6px;
                    content: none;
                }

                &--down::after {
                    top: 10px;
                    content: none;
                }

                &::before {
                    content: ' ';
                    background: url('../../assets/img/icon-edit-blue.png') no-repeat;
                    background-size: contain;
                    width: 11px;
                    height: 10px;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 5px;
                }
            }

            @{deep} .van-dropdown-item__content {
                height: 95%;
                display: flex;
                flex-direction: column;
                overflow-y: hidden;
            }
        }
    }
}

.editClass {
    height: 100%;
    width: 100%;
    position: absolute;
}

// new------------
.paper_logo {
    font-size: 140px;
}

@{deep} .list-task-content-top-title {
    width: 1000px;
    overflow: hidden;
    /*超出长度的文字隐藏*/
    text-overflow: ellipsis;
    /*文字隐藏以后添加省略号*/
    white-space: nowrap;
    /*强制不换行*/
    line-height: 38px;
}

.list-task-title {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 38px;
    width: 80%;

    p {
        width: 800px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }
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
</style>
