<template>
<section class="preview-wrap">
    <div class="preview-wrap-popover">
        <van-popover v-model="showPopover" placement="top" trigger="click" @select="onSelect">
            <ul class="preview-wrap-popover_ul">
                <li :class="{ 'preview-wrap-popover_ul_select': termType == 'T01' }" @click="onSelect('T01')">上学期</li>
                <li :class="{ 'preview-wrap-popover_ul_select': termType == 'T02' }" @click="onSelect('T02')">下学期</li>
                <li :class="{ 'preview-wrap-popover_ul_select': termType == '' }" @click="onSelect('')">全部</li>
            </ul>
            <template #reference>
                <van-button round type="primary">{{ termType == 'T01' ? '上学期' : termType == 'T02' ? '下学期' : '全部' }}</van-button>
            </template>
        </van-popover>
    </div>
    <dropdown-header class="preview-wrap-content" ref="dropdown" v-show="courseList.length || firstFlag" :list="courseList" :course-name="courseName" :tch-course-id="tchCourseId" :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading" :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh" @selectCourse="goDetail">
    </dropdown-header>
</section>
</template>

<script>
import listItem from '../../components/list-item';
import dropdownHeader from '../../components/dropdown-header';
import {
    pubApi
} from '@/api/parent-GFY';
import {
    getClassTeachCourseInfo,
    getCourseTaskList,
    getClassStudent
} from '@/api/index';

import eventBus from '@/utils/eventBus';
export default {
    name: 'index',
    components: {
        listItem,
        dropdownHeader,
    },
    data() {
        return {
            showTip: false,
            show: false,
            courseList: [],
            courseTaskList: [],
            courseName: '',
            tchCourseId: '',
            relationCourseId: '',
            termType: '',
            refLoading: false,
            listLoading: false,
            finished: false,
            currentPage: 0,
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
            //   ====
            showPopover: false,
            // 通过 actions 属性来定义菜单选项
            actions: [{
                text: '上学期'
            }, {
                text: '下学期'
            }, {
                text: '全部'
            }],
            socket: '',
            showPage: false,
        };
    },
    async mounted() {
        console.log(9, process.env);
        await this.getClassStudent();
        await this.dropdownRefresh();
    },
    computed: {
        reload() {
            return this.$store.getters.getUserInfo;
        },
    },
    watch: {
        async reload() {
            await this.getClassStudent();
            await this.dropdownRefresh();
        },
    },
    created() {},

    methods: {
        handleEnterThing() {
            if (this.value != '') {
                this.socketApi.sendSock(QQi, this.getConfigResult);
            }
        },

        getConfigResult(res) {
            if (res.type == 'baseInfo') {
                this.$store.commit('setUserInfo', res.data);
                this.showPage = true;
            }
            console.log('res--', res);
        },

        async getClassStudent() {
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                classId: this.$store.getters.getUserInfo.classId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };

            getClassStudent(params).then((res) => {
                if (res.flag) {
                    console.log(this.$store.getters.getUserInfo.classId, ',班级学生：', res.data);
                    if (res.data && res.data.length > 0 && res.data[0].classStudent) {
                        let classStudent = res.data[0].classStudent;
                        let classStudentMap = {};
                        classStudent.forEach((item) => {
                            classStudentMap[item.accountNo] = item;
                        });

                        let key = 'classStudent_' + this.$store.getters.getUserInfo.classId;
                        localStorage.setItem(key, JSON.stringify(classStudentMap));
                    }
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 学期筛选
        onSelect(action) {
            this.termType = action;
            this.showPopover = false;
            this.dropdownRefresh(true);
        },
        async goDetail(tchCourseInfo, index) {
            console.log('(tchCourseInfo, index)', tchCourseInfo, index);
            let data = {
                tchCourseId: tchCourseInfo.tchCourseId,
                relationCourseId: tchCourseInfo.relationCourseId,
                sysCourseId: tchCourseInfo.sysCourseId,
            };
            console.log('obj--', data);
            this.socketApi.sendSock({
                type: 'courseSend',
                data,
                code: 0,
                msg: '成功',
            });

            this.$store.commit('setBaseData', tchCourseInfo);
            localStorage.setItem('tchCourseInfo', JSON.stringify(tchCourseInfo));
            const {
                tchCourseId,
                sysCourseId,
                relationCourseId,
                subjectType,
                classId,
                tchClassCourseInfo,
                classGrade,
                termType,
                courseName
            } = tchCourseInfo;
            this.$router.push({
                name: 'lectureList',
                query: {
                    tchCourseId,
                    sysCourseId,
                    relationCourseId,
                    subjectType,
                    classId,
                    tchClassCourseInfo,
                    classGrade,
                    termType,
                    courseName,
                },
            });
        },
        goBack() {
            this.common.goBack(this);
        },
        async selectCourse(tchCourseInfo, index) {
            console.log(tchCourseInfo, 'tchCourseInfo//////');
            this.tchCourseInfo = tchCourseInfo;
            this.courseIndex = index;
            this.currentTchCourseInfo = tchCourseInfo;
            console.log(this.currentTchCourseInfo, 'this.currentTchCourseInfo');
            this.$store.commit('setVanLoading', true);
            this.currentPage = 1;
            this.classGrade = tchCourseInfo.classGrade;
            this.courseName = tchCourseInfo.courseName;
            this.tchCourseId = tchCourseInfo.tchCourseId;
            this.relationCourseId = tchCourseInfo.relationCourseId;
            this.termType = tchCourseInfo.termType;
            this.sysCourseId = tchCourseInfo.sysCourseId;
            await this.getCourseTaskList(this.courseName, this.tchCourseId);
            this.$store.commit('setVanLoading', false);
        },
        async dropdownOnLoad() {
            this.dropdownPage++;
            if (this.dropdownPage > this.dropdownTotal && this.dropdownPage > 1) {
                return;
            }
            await this.getClassTeachCourseInfo();
        },
        async dropdownRefresh(isEdit) {
            this.dropdownListLoading = false;
            this.dropdownFinish = false;
            this.dropdownPage = 1;
            await this.getClassTeachCourseInfo(isEdit);
            //   this.$toast('刷新成功');
        },
        async onLoad() {
            this.currentPage++;
            if (this.currentPage > this.total && this.currentPage > 1) {
                return;
            }

            // if (!this.courseList.length) {
            if (this.firstFlag) {
                //首次加载
                await this.getClassTeachCourseInfo();
                if (this.$route.query.from === 'course') {
                    this.courseName = this.$route.query.courseName;
                    this.classGrade = this.$route.query.classGrade;
                    this.sysCourseId = this.$route.query.sysCourseId;
                    this.tchCourseId = this.$route.query.tchCourseId;
                    this.relationCourseId = this.$route.query.relationCourseId;
                    this.termType = this.$route.query.termType;
                } else {
                    if (this.courseList.length) {
                        this.courseName = this.courseList[0].tchCourseInfo.courseName;
                        this.classGrade = this.courseList[0].tchCourseInfo.classGrade;
                        this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId;
                        this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId;
                        this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId;
                        this.termType = this.courseList[0].tchCourseInfo.termType;
                    }
                }
            }
            this.getCourseTaskList(this.courseName, this.tchCourseId);
        },
        async onRefresh() {
            // this.listLoading = false
            this.finished = false;
            this.currentPage = 1;
            await this.getCourseTaskList(this.courseName, this.tchCourseId);
            //   this.$toast('刷新成功');
        },
        async getClassTeachCourseInfo(isEdit) {
            console.log('getClassTeachCourseInfo....');
            const page = this.dropdownPage;
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                operateRoleType: 'A02',
                accountNo: this.$store.getters.getUserInfo.accountNo,
                subjectType: this.isfEducation ? 'S20' : localStorage.getItem('currentSubjectType'),
                classGrade: this.$route.query.fltGrade || '',
                termType: this.$route.query.fltTerm || this.termType,
                classId: this.$store.getters.getUserInfo.classId,
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
        async getCourseTaskList(name, id) {
            const page = this.currentPage;
            let obj = {
                interUser: 'runLfb',
                interPwd: '7829b380bd1a1c4636ab735c6c7428bc',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                operateRoleType: 'A02',
                accountNo: this.$store.getters.getUserInfo.accountNo,
                tchCourseId: this.tchCourseId,
                pageSize: this.pageSize,
                currentPage: this.currentPage,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            await getCourseTaskList(params).then((res) => {
                //         console.log(res.data[0].tchCourseTaskInfo,'res')
                // console.log(res.data[0].tchCourseTaskInfo[0].tchClassTastInfo,'res')

                // 转换yyyy-MM-dd为 yyyy/MM/dd
                for (var i in res.data[0].tchCourseTaskInfo) {
                    // console.log(res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate,'arr[i].tchClassTastInfo')
                    res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate = res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].startDate.replace(/-/g, '/');

                    res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].endDate = res.data[0].tchCourseTaskInfo[i].tchClassTastInfo[0].endDate.replace(/-/g, '/');
                }

                this.listLoading = false;
                this.refLoading = false;
                this.total = res.total;
                if (res.flag && res.data && res.data[0]) {
                    this.courseTaskList = page === 1 ? res.data[0].tchCourseTaskInfo : this.courseTaskList.concat(res.data[0].tchCourseTaskInfo);

                    //设置班级名称
                    if (localStorage.getItem('classMap')) {
                        let classMap = JSON.parse(localStorage.getItem('classMap'));
                        let hisClassMap = localStorage.getItem('hisClassMap') ? JSON.parse(localStorage.getItem('hisClassMap')) : {};
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

                                    if (classMap[obj.classId] && classMap[obj.classId].className) {
                                        obj['className'] = classMap[obj.classId].className;
                                    } else if (hisClassMap[obj.classId] && hisClassMap[obj.classId].className) {
                                        obj['className'] = hisClassMap[obj.classId].className;
                                    } else {
                                        obj['className'] = '--';
                                    }
                                });
                            }
                            item.notStartCount = notStartCount;
                            item.runningCount = runningCount;
                            item.finishCount = finishCount;
                            item.allCount = allCount;
                        });
                    }
                    if (this.currentPage >= res.total) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                    }
                } else {
                    this.courseTaskList = page === 1 ? [] : this.courseTaskList.concat([]);
                    this.finished = true;
                }
            });
        },
        checkUrlPermission(url, title) {
            // 课件鉴权
            let permissionParams = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                url: url,
                sysTypeCd: 'S03',
            };
            this.$store.commit('setVanLoading', true);
            pubApi
                .checkUrlPermission({
                    requestJson: JSON.stringify(permissionParams),
                })
                .then((respone) => {
                    this.$store.commit('setVanLoading', false);
                    let assUrl;
                    if (respone.flag) {
                        if (this.type == 'office' || this.type == 'pdf') {
                            if (url.indexOf('pubquanlang') > -1) {
                                assUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl;
                            } else {
                                assUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl;
                            }
                        } else {
                            assUrl = respone.data[0].accessUrl;
                        }
                    } else {
                        assUrl = '';
                    }

                    if (!assUrl) {
                        this.$toast('暂无资源');
                        return;
                    }

                    this.$router.push({
                        name: 'videoPage',
                        query: {
                            src: assUrl,
                            title,
                        },
                    });
                })
                .catch(() => {
                    this.$toast('资源错误');
                });
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
    padding-top: 80px;

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

.null-tips {
    margin-top: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 100%;
}

// ----new
.preview-wrap-content {
    //   height: 60%;
}

.preview-wrap-popover {
    position: fixed;
    width: 100%;
    height: 60px;
    background: #ffffff;
    box-shadow: 0px -2px 16px 0px rgba(63, 63, 63, 0.2);
    bottom: 0%;
    left: 0;
    right: 0%;
    z-index: 50;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10%;

    .van-button--round {
        width: 160px;
        height: 40px;
        background: #22ad7e;
        border-radius: 30px;
        font-size: 24px;
    }
}
</style><style lang="less">
.van-popover__action {
    height: 50px;
    border-bottom: 1px solid #ccc;
}

.van-popover__action-text {
    width: 90px;
    height: 42px;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1b1b1b;
    line-height: 42px;
}

.preview-wrap-popover_ul {
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    li {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #ccc;
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b1b1b;
        line-height: 50px;
        cursor: pointer;
        // border: 1px solid #ccc;
        border-bottom: 1px solid #f0f0f0;
    }

    li:last-child {
        border-bottom: 0 none;
    }

    .preview-wrap-popover_ul_select {
        color: #22ad7e;
    }
}
</style>
