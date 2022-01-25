<!--
 * @Author: wgj
 * @Date: 2021-02-22 14:23:39
 * @LastEditTime: 2021-03-26 14:18:54
 * @LastEditors: wgj
 * @Description: 
-->
<!--  -->
<template>
<div class="microlecture">
    <!--        学资源/微课详情-->
    <div class="ware-detail" v-if="$store.getters.getBaseData.taskType !== 'T06'">
        <div class="openWps" v-if="type != 'mp3' && wareDetail.courseware.srcUrl" @click="openWps">本地打开</div>
        <div v-if="type === 'mp4'" class="dataIsEmpty">
            <div class="vg-icon">
                <svg-icon class="vg-icon-d" icon-class="icon-conversionFailed"></svg-icon>
            </div>
            <div class="openLocally">文件转换失败请本地打开!</div>
            <div class="openLocallyBottom" @click="goVideoPage(wareDetail)">本地打开</div>
        </div>
        <img class="audio" v-else-if="type === 'mp3' && wareDetail.courseware.srcUrl" src="https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/picture/201910/icon-mp3.png" alt="" @click="goVideoPage(wareDetail.courseware.srcUrl, 1)" />

        <img v-else-if="type === 'img' && wareDetail.courseware.srcUrl" :src="wareDetail.courseware.srcUrl" />

        <div v-else-if="(type === 'office' || type === 'pdf') && wareDetail.courseware.srcUrl && !loadWareFlag" class="dataIsEmpty">
            <div class="vg-icon">
                <svg-icon class="vg-icon-d" icon-class="icon-conversionFailed"></svg-icon>
            </div>
            <div class="openLocally">文件转换失败请本地打开!</div>
            <div class="openLocallyBottom" @click="openWps">本地打开</div>
        </div>
    </div>
</div>
</template>

<script>
import {
    pubApi
} from '@/api/parent-GFY';

import {
    getCourseTaskDetail,
    getAppraiseV2,
} from '@/api/index';
import listItem from '../../../components/list-item';
export default {
    data() {
        return {
            loadWareFlag: true,
            info: JSON.parse(localStorage.getItem('stat')),
            type: '', //学资源类型
            wareDetail: {
                courseware: {
                    srcUrl: ''
                },
                discussInfo: {}
            }, // 学资源详情
            iconType: '',
        };
    },

    components: {
        listItem,
    },

    computed: {},

    async mounted() {
        if (['T01', 'T02', 'T04', 'T06'].includes(this.$store.getters.getExamDetailData.taskType)) {
            //如果是学资源则把tab设置为激活
            // this.wareActive = true
            if (!this.isTestPaper) {
                this.getAppraise();
            }
            await this.getCourseTaskDetail();
            if (this.$store.getters.getExamDetailData.taskType !== 'T06') {
                //讨论不需要鉴权
                this.type = this.getUrlSuffix(this.wareDetail.courseware.srcUrl);
                if (this.wareDetail.courseware.srcUrl != '') {
                    this.checkUrlPermission();
                }
            }

        }
    },

    methods: {
        openWps() {
            let data = {
                resourceId: this.wareDetail.courseware.coursewareId,
                // resourceType: item.resourceType,
                resourceType: 'R01',
                courseName: this.$store.getters.getBaseData.courseName,
                courseId: this.$store.getters.getBaseData.tchCourseId,
                url: this.wareDetail.courseware.dstUrl,
                fileName: this.wareDetail.courseware.coursewareName,
            };
            console.log('obj--课件websocket发送', data);
            this.socketApi.sendSock({
                type: 'coursewareSend',
                data,
                code: 0,
                msg: '成功',
            });
        },
        async getAppraise() {
            const page = this.currentPage;
            const pageSize = this.pageSize;
            this.$store.commit('setVanLoading', true);
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                classId: this.$store.getters.getUserInfo.classId,
                // currPage: 1,
                currPage: page,
                isAppendMode: true,
                objectId: this.$store.getters.getExamDetailData.taskId || this.$store.getters.getExamDetailData.info.taskId,
                objectTypeCd: 'A01',
                pageSize,
                praiseType: 1,
                replyType: 1,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            await getAppraiseV2(params).then((res) => {
                console.log(res.msg)
                this.listLoading = false;
                if (pageSize > 10) {
                    this.total = Math.ceil(res.totalNum / 10);
                } else {
                    this.total = res.total;
                }
                this.$store.commit('setVanLoading', false);
                if (res.flag && res.data[0]) {
                    res.data[0].appraiseListInfo.forEach(async (v) => {
                        // 本账号是否有点过赞
                        v.good = v.praiseList.some((p) => p.accountNo === JSON.parse(localStorage.userInfo).accountNo);
                        let dom = document.createElement('div');
                        v.imgArr = [];
                        v.audioArr = [];
                        v.videoArr = [];
                        dom.innerHTML = v.appraiseContent;
                        v.text = dom.outerHTML;
                        //追加内容
                        v.pubAppendContentInfoList.forEach((append) => {
                            let appendDom = document.createElement('div');
                            append.imgArr = [];
                            append.audioArr = [];
                            append.videoArr = [];
                            appendDom.innerHTML = append.appendContent;
                            append.text = appendDom.outerHTML;
                        });
                    });
                    this.appraiseList = page === 1 ? res.data[0].appraiseListInfo : this.appraiseList.concat(res.data[0].appraiseListInfo);
                    if (page >= res.total) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                    }
                } else {
                    this.appraiseList = page === 1 ? [] : this.appraiseList.concat([]);
                    this.finished = true;
                }
            }).catch((err) => {
                this.error = true;
                this.listLoading = false;
                this.currentPage--;
            });
        },
        goVideoPage(url, isAudio) {
            if (!url) return;
            if (isAudio == 1) {
                this.$router.push({
                    name: 'videoPage',
                    query: {
                        src: url,
                        title: this.info.taskName,
                        isMp3: isAudio
                    }
                });
            }
            let data = {
                resourceId: url.courseware.coursewareId,
                resourceType: 'R01',
                courseName: this.$store.getters.getBaseData.courseName,
                courseId: this.$store.getters.getBaseData.tchCourseId,
                url: url.courseware.url,
                fileName: url.courseware.coursewareName,
            };
            console.log('obj--课件websocket发送', data);
            this.socketApi.sendSock({
                type: 'coursewareSend',
                data,
                code: 0,
                msg: '成功',
            });
        },
        checkUrlPermission() {
            // 课件鉴权
            let permissionParams = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                url: this.wareDetail.courseware.srcUrl,
                sysTypeCd: 'S03',
            };
            this.$store.commit('setVanLoading', true);
            pubApi.checkUrlPermission({
                requestJson: JSON.stringify(permissionParams)
            }).then((respone) => {
                this.$store.commit('setVanLoading', false);
                if (respone.flag) {
                    if (this.type == 'office' || this.type == 'pdf') {
                        if (this.wareDetail.courseware.srcUrl.indexOf('pubquanlang') > -1) {
                            this.wareDetail.courseware.srcUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl;
                        } else {
                            this.wareDetail.courseware.srcUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl;
                        }
                    } else {
                        this.wareDetail.courseware.srcUrl = respone.data[0].accessUrl;
                    }
                    this.loadWareFlag = false;
                } else {
                    this.wareDetail.courseware.srcUrl = '';
                }
                // setTimeout(() => {
                //   let iframe = document.getElementById('iframe')
                //   iframe.addEventListener( "load", function(){
                //     //代码能执行到这里说明已经载入成功完毕了
                //     this.removeEventListener( "load", arguments.call, false);
                //     console.log(111111111)

                //     //这里是回调函数
                //   }, false);

                //   console.log(JSON.stringify(document.getElementById('iframe')) ,"document.query")
                // },20)

            });
        },
        getUrlSuffix(url) {
            var t = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            console.log(t);
            if (t == 'ppt' || t == 'pptx') {
                t = 'office';
            } else if (t == 'doc' || t == 'docx') {
                t = 'office';
            } else if (t == 'xls' || t == 'xlsx') {
                t = 'office';
            } else if (t == 'zip' || t == 'rar' || t == '7z') {
                t = 'rar';
            } else if (t == 'pdf') {
                t = 'pdf';
            } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
                t = 'img';
            } else if (t == 'mp4') {
                t = 'mp4';
            } else if (t == 'mp3') {
                t = 'mp3';
            } else {
                t = 'unkown';
            }
            return t;
        },
        handleIcon(url) {
            var t = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            if (t == 'ppt' || t == 'pptx') {
                t = 'icon-ppt';
            } else if (t == 'doc' || t == 'docx') {
                t = 'icon-doc';
            } else if (t == 'xls' || t == 'xlsx') {
                t = 'icon-xls';
            } else if (t == 'zip' || t == 'rar' || t == '7z') {
                // t = 'icon'
            } else if (t == 'pdf') {
                t = 'icon-pdf';
            } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
                t = 'img';
            } else if (t == 'mp4' || t == 'mp3') {
                t = 'icon-video';
            } else {
                // t = 'unkown'
            }
            return t;
        },
        async getCourseTaskDetail() {
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                accountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.schoolId,
                operateRoleType: 'A02',
                tchCourseId: this.$store.getters.getExamDetailData.tchCourseId,
                taskId: this.$store.getters.getExamDetailData.taskId || this.$store.getters.getExamDetailData.info.taskId,
            };
            let params = {
                requestJson: JSON.stringify(obj),
            };
            await getCourseTaskDetail(params).then((res) => {
                if (res.flag) {
                    this.wareDetail = res.data[0] || this.wareDetail;
                    console.log('this.wareDetail-----', this.wareDetail);
                    // this.iconType = this.handleIcon(res.data[0].courseware.srcUrl)
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.microlecture {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.ware-detail {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    iframe {
        width: 80%;
        height: 80%;
    }
}

.openWps {
    cursor: pointer;
    width: 100px;
    padding: 36px 0;
    border-radius: 10px;
    background: #797979;
    opacity: 0.95;
    text-align: center;
    color: #fff;
    font-size: 18px;

    position: absolute;
    left: 3%;
    bottom: 10%;
}

.dataIsEmpty {
    width: 1382px;
    height: 786px;
    background: #F8F8F8;
    border: 1px solid rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    .vg-icon {
        width: 176px;
        height: 165px;

        .vg-icon-d {
            width: 176px;
            height: 165px;
        }
    }

    .openLocally {
        color: #1B1B1B;
        font-size: 26px;
        margin-top: 50px;
    }

    .openLocallyBottom {
        width: 164px;
        height: 50px;
        background: #22AD7E;
        font-size: 24px;
        text-align: center;
        line-height: 50px;
        color: #fff;
        border-radius: 4px;
        margin-top: 50px;
    }
}
</style>
