<template>
<section class="lecture-list">
    <div class="common_body" ref="body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
            <div class="null-tips-div" v-if="!listLoading && list.length == 0" style="text-align: center; color: #999999; padding-top: 100px">
                <img class="null-tips" src="../../../assets/img/preview/task_null.png" alt />
            </div>
            <van-list v-model="listLoading" :finished="finished" :finished-text="list.length > 0 ? '没有更多了' : '当前没有讲义，快去选择课件吧！'" @load="onLoad" :offset="80">
                <list-item ref="listItem" v-if="renderFlag" @clickTo="goto(item.ClassTeachingData)" class="mgt10 common_list" style="background: #fff" @del="handleDelete(item.ClassTeachingData, index)" @clickDel="clickDel(index)" v-for="(item, index) in list" :key="item.ClassTeachingData.seqId + '' + item.ClassTeachingData.resourceId" :itemTitle="item.ClassTeachingData.name" @up="moveItem(item.ClassTeachingData, index, 0)" @down="moveItem(item.ClassTeachingData, index, 1)" :can-slide="true" :up="index > 0" :top="list.length > 1 && index > 0" :down="list.length - 1 > index" @top="topItem(item.ClassTeachingData, index)">
                    <span class="list-index" slot="list-index">{{ index + 1 }}、</span>
                    <div slot="cover" class="cover paper_logo lectureList-cover-icon">
                        <svg-icon :icon-class="handleIcon(item.ClassTeachingData).class" />
                        <span class="lectureList-cover-icon-title">{{ handleIcon(item.ClassTeachingData).title }}：</span>
                    </div>
                    <!--            item.ClassTeachingData.seqId-->
                    <!-- <div slot="desc">
              <div class="desc-top">
                <i
                  class="iconGFY"
                  :class="{
                    'icon-personal': item.ClassTeachingData.shareType === 'S01',
                    'icon-school': item.ClassTeachingData.shareType === 'S02',
                    'icon-share': item.ClassTeachingData.shareType === 'S03',
                  }"
                ></i>
                <i class="iconGFY" :class="{ 'icon-choice': item.ClassTeachingData.qualityType === 'Q01', 'icon-boutique': item.ClassTeachingData.qualityType === 'Q02' }"></i>
              </div>
              <div class="desc-bottom">
                <div v-if="item.ClassTeachingData.belongAccountName"><i class="iconGFY icon-feather"></i>{{ item.ClassTeachingData.belongAccountName }}</div>
                <div><i class="iconGFY icon-download"></i>{{ item.ClassTeachingData.downCount }}</div>
                <div><i class="iconGFY icon-points"></i>{{ item.ClassTeachingData.useCount }}</div>
                <div><i class="iconGFY icon-star"></i>{{ item.ClassTeachingData.collectCount }}</div>
              </div>
            </div> -->
                    <div slot="icon-go" class="dropdown-header-item-type-icon">
                        <!-- <i class="iconGFY icon_course_back"></i> -->
                        <!-- PC端做推送，web端先隐藏 -->
                        <!-- <span class="CaruseSend_img" v-if="jugeType(item) == 'img'" @click.stop="CaruseSendImg(item.ClassTeachingData)">推送</span> -->
                    </div>
                </list-item>
            </van-list>
        </van-pull-refresh>
    </div>
    <!-- <div class="lecture-list__footer">
      <van-button type="info" class="btn" @click="handleSelect">选择课件</van-button>
    </div>

    <ware-filter :visible.sync="popShow" @confirm="selectCourse"></ware-filter> -->
</section>
</template>

<script>
import listItem from '../../../components/list-item';
import wareFilter from '../../../components/wareFilter';
import {
    teachApi
} from '@/api/parent-GFY';
import {
    deleteCourseSummitInfo,
    setDataTaskOrder,
    createCourseSummitInfoList,
    stickyNotes
} from '@/api/index';

export default {
    name: 'lectureList',
    components: {
        listItem,
        wareFilter
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
            scrollTop: 0,
            renderFlag: true,
            clickIndex: 0,
        };
    },
    created() {
        this.onRefresh();
    },
    // beforeRouteLeave(to, from, next) {
    //   if (this.popShow) {
    //     this.popShow = false;
    //     next(false);
    //   } else if (this.$refs['listItem'] && this.$refs['listItem'][this.clickIndex] && this.$refs['listItem'][this.clickIndex].showDialog) {
    //     this.$refs['listItem'][this.clickIndex].close();
    //     next(false);
    //   } else {
    //     this.scrollTop = this.$refs['body'].scrollTop;
    //     next();
    //   }
    // },
    // beforeRouteEnter(to, from, next) {
    //   localStorage.removeItem('materialDetail');
    //   next((vm) => {
    //     vm.$nextTick(() => {
    //       // vm.$refs["body"].scrollTo(0, vm.scrollTop);
    //       vm.$refs['body'].scrollTop = vm.scrollTop;
    //     });
    //   });
    // },
    methods: {
        CaruseSendImg(item) {
            console.log('item--', item);
            let data = {
                resourceId: item.resourceId,
                resourceType: 'R01',
                courseName: this.$store.getters.getBaseData.courseName,
                courseId: this.$store.getters.getBaseData.tchCourseId,
                url: item.srcUrl,
                fileName: item.name,
            };
            console.log('obj--', data);
            this.socketApi.sendSock({
                type: 'CaruseSendImg',
                data,
                code: 0,
                msg: '成功',
            });
        },
        jugeType(item) {
            console.log('item===', item);
            let t = '';
            let type = '';
            if (item.resourceType === 'R01') {
                t = item.dataUrl.substring(item.dataUrl.lastIndexOf('.') + 1).toLowerCase();
            } else {
                t = item.ClassTeachingData.dataUrl.substring(item.ClassTeachingData.dataUrl.lastIndexOf('.') + 1).toLowerCase();
            }
            if (t === 'ppt' || t === 'pptx') {
                type = 'ppt';
            } else if (t === 'doc' || t === 'docx') {
                type = 'doc';
            } else if (t === 'xls' || t === 'xlsx') {
                type = 'xls';
            } else if (t === 'pdf') {
                type = 'pdf';
            } else if (t == 'jpg' || t == 'png' || t == 'jpeg') {
                type = 'img';
                // this.$toast('功能正在开发中，敬请期待...');
                // return;
            } else if (t == 'mp4' || t == 'mp3') {
                type = 'video';
                // this.$toast('功能正在开发中，敬请期待...');
                // return;
            }
            return type;
        },
        handleSelect() {
            try {
                MobclickAgent.onEvent('clickLectureSelectWare');
            } catch (e) {
                console.log(e);
            }
            this.popShow = true;
        },
        handleBackground(item) {
            const type = this.handleIcon(item.ClassTeachingData);
            if (['icon-video', 'icon-audio'].includes(type)) {
                return '#67E0A3';
            } else if (['icon-exam-100'].includes(type)) {
                return '#39F0DD';
            } else {
                return '#f3d233';
            }
        },
        clickDel(index) {
            this.clickIndex = index;
        },
        topItem(item, index) {
            let obj = {
                interUser: 'runLfb',
                interPwd: '7829b380bd1a1c4636ab735c6c7428bc',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                seqId: item.seqId,
                essFlag: '1',
                tchCourseId: item.tchCourseId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            stickyNotes(params).then((res) => {
                if (res.flag) {
                    this.$refs['body'].scrollTop = 0;
                    this.$toast('置顶成功!');
                    this.onRefresh();
                    this.renderFlag = false;
                    this.$nextTick(() => {
                        this.renderFlag = true;
                    });
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        selectCourse(tchClassTeachingDataList) {
            if (tchClassTeachingDataList.length) {
                this.$store.commit('setVanLoading', true);
                let obj = {
                    interUser: 'runLfb',
                    interPwd: '25d55ad283aa400af464c76d713c07ad',
                    operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                    tchClassTeachingDataList,
                };
                let params = {
                    requestJson: JSON.stringify(obj),
                };
                createCourseSummitInfoList(params).then((res) => {
                    this.$store.commit('setVanLoading', false);
                    if (res.flag) {
                        // this.$refs['body'].scrollTo(0, 0)
                        this.$refs['body'].scrollTop = 0;
                        this.$toast('添加成功!');
                        this.onRefresh();
                        this.renderFlag = false;
                        this.$nextTick(() => {
                            this.renderFlag = true;
                        });
                    } else {
                        this.$toast(res.msg);
                    }
                });
            }
        },
        goto(item) {
            if (item.resourceType === 'R01') {
                let type = '';
                const t = item.dataUrl.substring(item.dataUrl.lastIndexOf('.') + 1).toLowerCase();
                if (t === 'ppt' || t === 'pptx') {
                    type = 'ppt';
                } else if (t === 'doc' || t === 'docx') {
                    type = 'doc';
                } else if (t === 'xls' || t === 'xlsx') {
                    type = 'xls';
                } else if (t === 'pdf') {
                    type = 'pdf';
                } else if (t == 'jpg' || t == 'png' || t == 'jpeg') {
                    type = 'img';
                    // this.$toast('功能正在开发中，敬请期待...');
                    // return;
                } else if (t == 'mp4' || t == 'mp3') {
                    type = 'video';
                    // this.$toast('功能正在开发中，敬请期待...');
                    // return;
                }
                console.log('item----', item);
                let data = {
                    resourceId: item.resourceId,
                    // resourceType: item.resourceType,
                    resourceType: 'R01',
                    courseName: this.$store.getters.getBaseData.courseName,
                    courseId: this.$store.getters.getBaseData.tchCourseId,
                    url: item.srcUrl,
                    fileName: item.name,
                };
                console.log('obj--课件websocket发送', data);
                this.socketApi.sendSock({
                    type: 'coursewareSend',
                    data,
                    code: 0,
                    msg: '成功',
                });
                localStorage.setItem('materialDetail', JSON.stringify(item));
                // this.$router.push({ path: '/boardDetail' });
                if (t == 'mp3') this.$router.push({
                    name: 'boardDetail'
                });
            } else {
                //试卷
                this.$router.push({
                    name: `examDetail`,
                    query: {
                        tchCourseId: this.$route.query.tchCourseId,
                        sysCourseId: this.$route.query.sysCourseId,
                        relationCourseId: this.$route.query.relationCourseId,
                        type: 1,
                        testPaperId: item.resourceId,
                        subjectType: localStorage.currentSubjectType,
                        classGrade: this.$route.query.classGrade,
                        title: item.name,
                        duration: 30,
                        fromLec: 1, //因为讲义进去的试卷详情跟任务列表进去的类似,但是可以移动试题,所以需要区分
                        from: 'lectureList',
                    },
                });
            }
        },
        moveItem(item, index, type) {
            const tarSeqId = this.list[type ? index + 1 : index - 1].ClassTeachingData.seqId;
            let obj = {
                interUser: 'runLfb',
                interPwd: '7829b380bd1a1c4636ab735c6c7428bc',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                oldSeqId: item.seqId,
                tarSeqId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            setDataTaskOrder(params).then((res) => {
                if (res.flag) {
                    this.list[index] = this.list.splice(type ? index + 1 : index - 1, 1, this.list[index])[0];
                    this.renderFlag = false;
                    this.$nextTick(() => {
                        this.renderFlag = true;
                    });
                    this.$toast(`${type ? '下' : '上'}移成功`);
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        handleDelete(item, index) {
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                seqId: item.seqId,
                tchCourseId: item.tchCourseId,
                classId: item.classId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            deleteCourseSummitInfo(params).then((res) => {
                if (res.flag) {
                    this.list.splice(index, 1);
                    this.renderFlag = false;
                    this.$nextTick(() => {
                        this.renderFlag = true;
                    });
                    this.$toast('删除成功');
                }
            });
        },
        handleIcon(item) {
            if (item.resourceType === 'R01') {
                const t = item.srcUrl.substring(item.srcUrl.lastIndexOf('.') + 1).toLowerCase();
                if (t === 'ppt' || t === 'pptx') {
                    // return 'icon-ppt';
                    return {
                        title: 'PPT',
                        class: 'icon-ppt',
                    };
                } else if (t === 'doc' || t === 'docx') {
                    // return 'icon-doc';
                    return {
                        title: 'Word',
                        class: 'icon-doc',
                    };
                } else if (t === 'xls' || t === 'xlsx') {
                    // return 'icon-xls';
                    return {
                        title: 'Excel',
                        class: 'icon-xls',
                    };
                } else if (t === 'pdf') {
                    // return 'icon-pdf';
                    return {
                        title: 'PDF',
                        class: 'icon-pdf',
                    };
                } else if (t == 'jpg' || t == 'png' || t == 'jpeg') {
                    // return 'icon-img';
                    return {
                        title: '图片',
                        class: 'icon-img',
                    };
                } else if (t == 'mp4') {
                    // return 'icon-video';
                    return {
                        title: '视频',
                        class: 'icon-video',
                    };
                } else if (t == 'mp3') {
                    // return 'icon-audio';
                    return {
                        title: '音频',
                        class: 'icon-audio',
                    };
                }
            } else {
                //试卷
                // return 'icon-exam-100';
                return {
                    title: '试卷',
                    class: 'icon-exam-100',
                };
            }
        },
        async onLoad() {
            this.currentPage++;
            if (this.currentPage > this.total && this.currentPage > 1) {
                //由于多了renderFlag,页码不减一会出问题
                this.currentPage--;
                return;
            }
            this.getList();
        },
        async onRefresh() {
            // this.listLoading = false
            this.finished = false;
            this.currentPage = 0;
            this.onLoad();
        },
        getList() {
            const page = this.currentPage;
            let query = '';
            if (localStorage.hasOwnProperty('tchCourseInfo')) {
                query = JSON.parse(localStorage.getItem('tchCourseInfo'));
            }
            // console.log('query', query);
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                classId: this.$store.getters.getUserInfo.classId,
                tchCourseId: JSON.parse(localStorage.getItem('tchCourseInfo')).tchCourseId,
                resourceClass: 'C01',
                pageSize: 10,
                currentPage: this.currentPage,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            teachApi.getCourseSummitInfo(params).then((res) => {
                this.listLoading = false;
                this.refLoading = false;
                this.total = res.total;
                if (res.flag && res.data && res.data[0]) {
                    this.list = page === 1 ? res.data : this.list.concat(res.data);
                    if (page >= res.total) {
                        this.finished = true;
                    }
                    this.listLoading = false;
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

.lecture-list {
    display: flex;
    flex-direction: column;

    &__body {
        flex: 1;
        overflow-y: auto;

        .cover {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }

        .desc-top {
            display: flex;
            margin-bottom: 10px;

            .iconGFY {
                margin-right: 5px;
            }
        }

        .desc-bottom {
            display: flex;
            font-size: 12px;
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

    &__footer {
        background: #fff;
        flex: 0 0 55px;
        padding: 5px 10px;

        .btn {
            width: 100%;
            border-radius: 22px;
            font-size: 18px;
        }
    }
}

// new-----
.lectureList-cover-icon {
    font-size: 80px;
}

.lectureList-cover-icon-title {
    font-size: 26px;
}

@{deep} .list-task-content {
    margin-left: 0;
}

@{deep} .icon-wrap {
    margin-right: 0;
    flex: none !important;
}

.CaruseSend_img {
    display: inline-block;
    width: 120px;
    height: 40px;
    background: #22ad7e;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 10px;
    margin-left: 40px;
    position: absolute;
    top: 12px;
}
</style><style lang="less">
// .lecture-list {
//   .listItem-cover {
//     justify-content: center !important;
//   }
//   .pd10 {
//     padding: 50px;
//   }
// }
// .common_list {
//   width: 80%;
//   margin: 50px auto 0;
//   .list-item-wrap {
//     border: 1px solid #ccc;
//   }
//   .listItem-cover {
//     justify-content: center !important;
//   }
// }
</style>
