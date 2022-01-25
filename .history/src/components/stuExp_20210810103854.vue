<template>
<section class="stu-exp-wrap">
    <div class="stu-exp-wrap__item" v-for="(item, index) in pinglunList" v-if="pinglunList.length" :key="index">
        <div class="stu-exp-wrap__item__content-wrap">
            <div class="stu-name">
                <img src="../assets/img/course/default_avatar.png" class="default_avatar" alt="" />
                <p class="stu-name-p">
                    <span>{{ isfEducation ? getParentName(item.appraiseAccountNo, classId) : getStudentName(item.appraiseAccountNo, classId)
              }}<span class="stu-name-p-score">{{ item.score > 0 ? '+' + item.score : item.score }}</span></span>
                    <!-- <span class="red">{{ item.score > 0 ? '+' + item.score : item.score }}</span> -->
                    <span class="stu-name-appraiseDate">{{ item.appraiseDate }}</span>
                </p>
            </div>

            <div class="stu-answer">
                <div>
                    <div v-html="item.text.split('<br>')[0] "></div>
                    <div class="img-wrap" :class="[{ img4: item.imgArr.length == 4 }, { img56: item.imgArr.length > 4 }]" v-if="item.imgArr && item.imgArr.length">
                        <div class="zhibi" v-for="(img, i) in item.imgArr" :key="i" >
                          <div class="Mask" @click="previewImg(img.imgArr, i,index,true)"></div>
                          <div class="paperAndPenInteraction" v-if="img.show">纸笔互动</div>
                          <img :src="img.imgArr" alt="" />
                        </div>
                    </div>
                    <div style="width: 100%" v-if="item.audioArr && item.audioArr.length">
                        <audio controls="controls" controlsList="nodownload" v-for="(audio, index) in item.audioArr" :key="index" :src="audio"></audio>
                    </div>
                    <div style="width: 100%" v-if="item.videoArr && item.videoArr.length">
                        <video class="video-wrap" v-for="(s, index) in item.videoArr" :key="index" webkit-playsinline playsinline x5-playsinline="" poster="../assets/img/video-poster.png" @click="goVideoPage(s)" :src="s"></video>
                    </div>

                </div>

                <!--          追加内容-->
                <div class="mgt10" v-for="(append, appendIndex) in item.pubAppendContentInfoList" :key="append.appendId">
                    <div class="add_to">
                        <span>追加</span>
                        <span>{{ append.appendTime }}</span>
                    </div>
                    <div v-html="append.text"></div>
                    <div style="width: 100%" v-if="append.audioArr && append.audioArr.length">
                        <audio controls controlsList="nodownload" v-for="(audio, index) in append.audioArr" :key="index" :src="audio"></audio>
                    </div>
                    <div style="width: 100%" v-if="append.videoArr && append.videoArr.length">
                        <video class="video-wrap" v-for="(s, index) in append.videoArr" :key="index" webkit-playsinline playsinline x5-playsinline="" poster="../assets/img/video-poster.png" @click="goVideoPage(s)" :src="s"></video>
                    </div>
                    <div class="img-wrap" :class="[{ img4: append.imgArr.length == 4 }, { img56: append.imgArr.length > 4 }]" v-if="append.imgArr && append.imgArr.length">
                        <div class="zhibi" v-for="(img, i) in append.imgArr" :key="i" >
                          <div class="Mask" @click="previewImg(img.imgArr, i,index,false, appendIndex)"></div>
                          <div class="paperAndPenInteraction" v-if="img.show">纸笔互动</div>
                          <img :src="img.imgArr" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="item.text.substring(item.text.split('<br>')[0].length, item.text.length).length>0" class="reviews">
            <div v-html="item.text.substring(item.text.split('<br>')[0].length, item.text.length)"></div>
            <div class="reviews-div">
                <svg-icon class="reviews-svg" icon-class="icon-reviews"></svg-icon>
            </div>
        </div>

        <div class="likeList">
            <div class="likeList-left">
                <div v-if="!item.praiseFlag" @click="addPraiseClick(item)">
                    <svg-icon class="reviews-svg" icon-class="icon-like"></svg-icon>
                    <div>{{ item.praiseCount }}</div>
                </div>
                <div v-if="item.praiseFlag" @click="addPraiseClick(item)">
                    <svg-icon class="reviews-svg" icon-class="icon-likeIt"></svg-icon>
                    <div>{{ item.praiseCount }}</div>
                </div>
                <div @click="annotateClick(item,index)">
                    <svg-icon class="reviews-svg" icon-class="icon-annotation"></svg-icon>
                    <div>批注</div>
                </div>
                <div>
                    <svg-icon class="reviews-svg" icon-class="icon-comments"></svg-icon>
                    <div>{{ item.replyList.length }}</div>
                </div>
            </div>
            <div class="likeList-right" @click="moreClick(index)">
                <div class="suspension" v-if="index == indexClit">
                    <div @click="topClick(item)">{{ item.topFlag == 1 ? '取消置顶' : '置顶' }}</div>
                    <div @click="delAppraiseClick(item)">删除</div>
                    <div @click="essenceClick(item)">{{ item.essFlag == 1 ? '取消精华' : '精华' }}</div>
                </div>
                <svg-icon class="reviews-svg" icon-class="icon-more"></svg-icon>
            </div>

        </div>
        <!-- <quill-editor ref="text" v-show="index == annotateindex"  v-model="content" class="myQuillEditor" :options="editorOption" /> -->
        <div v-if="index == annotateindex">
            <Kind-editor :id="kindeditor+index" @on-content-change="onContentChange" class="annotateRichText" ref="kindeditor" :content.sync="html"></Kind-editor>
            <div class="bottom" @click="submit">提交</div>
        </div>

        <div class="likePeople" v-show="item.praiseList.length>0">
            <div class="likePeople-left">
                <svg-icon class="reviews-svg" icon-class="icon-like"></svg-icon>
            </div>
            <div class="textileas">
                <div class="likePeople-right" v-for="(value,index) in item.praiseList" :key="index">{{ value.accountNo }} </div>
            </div>
        </div>

        <!--这部分等后台改完以后要替换成上面那种-->
        <div class="yetxrfg">
            <div class="pd10 van-hairline--top" v-for="(rep, repIndex) in item.replyList" :key="repIndex" @click="ReplyClick(item,rep,index)" v-show="item.replyList.length>0">
                {{ rep.parentReplyId == "0" ? rep.replyAccountName : rep.replyAccountName + ' 回复 ' + rep.parentReplyName}}:
                {{ rep.replyContent }}
            </div>
            <div @click="viewAllClick(item,index)" v-show="item.replyList.length>=5" class="viewAll">{{ item.replyList.length>5 ? '收起全部' : '查看全部'}}</div>
            <div class="commentInput-sendClss">
                <input class="commentInput" v-model="item.constText" type="text" :placeholder="item.pinglun">
                <div class="sendClss" @click="sendClick(item,index)">发送</div>
            </div>
        </div>

    </div>
    <div v-if="!pinglunList.length" class="empty-page">
        <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
        <div>当前还没有{{ isfEducation ? '家长' : '学生' }}完成任务,快去提醒{{ isfEducation ? '家长' : '学生' }}完成任务吧!</div>
    </div>

    <van-action-sheet get-container="#app" v-model="delShow" :actions="actions" cancel-text="取消" @cancel="delShow = false" @select="delReply" />
    
    <pictureView :maskImg.sync='maskImg' :imgURL="imgURL" :ObjFont="ObjFont" :pinglunList="pinglunList" :Experience="true" :current="current" @returnClick="returnClick"></pictureView>
    
</section>
</template>

<script>
import 'video.js/dist/video-js.css';
import {
    videoPlayer
} from 'vue-video-player';
import {
    getStudentName,
    getParentName
} from '@/utils/filter';
import {
    ImagePreview
} from 'vant';
import KindEditor from "../components/kindeditor/index.vue";
import {
    selectedrList
} from '../utils/index'
import {
    Dialog
} from 'vant';
import {
    updateAppraise,
    addPraise,
    topAppraise,
    untopAppraise,
    essAppraise,
    unessAppraise,
    delAppraise,
    getReply,
    addReply,
    delPraise,
    getPaperPen
} from '@/api/index';
import  pictureView from './pictureView.vue'
export default {
    name: 'stuExp',
    components: {
        videoPlayer,
        KindEditor,
        pictureView
    },
    props: ['list', 'classId', 'disable', 'currentPage', 'total', 'finished', 'isfEducation'],
    computed: {
        getStudentName() {
            return getStudentName;
        },
        getParentName() {
            return getParentName;
        },

    },
    data() {
        return {
            comment: '',
            delShow: false,
            actions: [{
                name: '删除'
            }],
            replyAccount: '',
            replyId: '',
            replyIndex: '',
            suspensionList: ['取消置顶', '删除', '取消精华'],
            indexClit: null,
            html: '',
            annotateindex: null,
            kindeditor: 'kindeditor',
            content: '',
            ietmObjt: {},
            dataFont: [],
            constText: '',
            pinglun: '',
            pinglunList: [],

            imgURL: '',
            maskImg: false,
            
            ObjFont: {
                img: '',
                i: '',
                index: '',
                value: '',
                additionalComments: '',
                appendIndex: '',
                paperPen: false
            },
            current: 0
        };
    },
    methods: {
        previewImg(img, i, index, value, appendIndex) {
            if(value) {
              this.ObjFont.additionalComments = '评论'
            } else {
                this.ObjFont.additionalComments = '追加'
            }
            this.maskImg = JSON.parse(JSON.stringify(true)) 
            this.imgURL = img
            this.ObjFont.img = img
            this.ObjFont.i = i
            this.ObjFont.index = index
            this.ObjFont.value = true
            this.current = 0
            this.ObjFont.paperPen = this.pinglunList[index].paperPen
            this.ObjFont.appendIndex = appendIndex
        },
        handleReply(rep, item) {
            this.$emit('comment', rep.comment, item, this.replyAccount);
            this.$set(rep, 'comment', '');
        },
        delReply() {
            //删除回复(后台暂无该接口)
            this.delShow = false;
            this.$emit('delReply', this.replyId, this.replyIndex);
        },
        goVideoPage(url) {
            if (!url) return;
            // this.$router.push({ name: 'videoPage', query: { src: url } });
            console.log('url', url);
            let data = {
                resourceId: this.$store.getters.getExamDetailData.info.resourceId,
                courseName: this.$store.getters.getBaseData.courseName,
                courseId: this.$store.getters.getBaseData.tchCourseId,
                resourceId: this.$store.getters.getExamDetailData.info.resourceId,
                resourceType: 'R01',
                url: url,
                fileName: this.$store.getters.getExamDetailData.info.resourceName,
            };
            console.log('obj--课件websocket发送', data);
            this.socketApi.sendSock({
                type: 'coursewareSend',
                data,
                code: 0,
                msg: '成功',
            });
        },

        handlePraise(item) {
            if (this.disable) return;
            this.$emit('praise', item);
        },
        handleTop(item) {
            if (this.disable) return;
            this.$emit('top', item);
        },
        handleEss(item) {
            if (this.disable) return;
            this.$emit('ess', item);
        },
        handleScore(item, type) {
            if (this.disable) return;
            this.$emit('score', item, type);
        },
        handleComment(item) {
            if (this.disable) return;
            this.$set(item, 'showComment', !item.showComment);
        },
        moreClick(index) {
            if (this.indexClit == index) {
                this.indexClit = null
                return false
            }
            this.indexClit = index
        },
        // 获取编辑器内容
        getContent(content) {
            console.log(content)
            this.content = content
        },
        async getcontent2Url() {
            try {
                const htmlUrl = await this.$refs.kindeditor.content2Url()
                return htmlUrl
            } catch (error) {
                console.log(error)
            }
        },
        annotateClick(ietm, index) {
            console.log(ietm, index)
            this.ietmObjt = ietm
            if (this.annotateindex == index) {
                this.annotateindex = null
                return false
            }
            this.annotateindex = index
            this.html = ietm.appraiseContent
        },
        onContentChange(val) {
            this.content = val
            console.log(val)
        },
        updateAppraise() {
            return new Promise((resolve, reject) => {
                try {
                    let fonDom = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: this.ietmObjt.appraiseId,
                        replyContent: this.content,
                        accountNo: this.$store.getters.getUserInfo.accountNo,
                        parentReplyId: this.replyAccount || 0,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    updateAppraise(fonDom).then((res) => {
                        if (res.flag) {
                            resolve(res)
                            this.annotateindex = null
                            console.log(res)
                        } else {
                            reject(res)
                            this.annotateindex = null
                        }
                    })
                    console.log(fonDom)
                } catch {
                    reject(res)
                    this.annotateindex = null
                }
            })
        },
        // 点赞方法
        addPraise(ietm) {
            return new Promise((resolve, reject) => {
                try {
                    let dataFom = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        objectTypeCd: 'P01',
                        objectId: ietm.appraiseId,
                        accountNo: this.$store.getters.getUserInfo.accountNo,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    addPraise(dataFom).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })

            console.log(dataFom)
        },
        // 取消点赞
        delPraise(ietm) {
            return new Promise((resolve, reject) => {
                try {
                    let praiseId = ietm.praiseList.find(val => val.accountNo == this.$store.getters.getUserInfo.accountNo)
                    console.log(praiseId)
                    let dataFom = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        objectTypeCd: 'P01',
                        objectId: ietm.appraiseId,
                        accountNo: this.$store.getters.getUserInfo.accountNo,
                        classId: this.$store.getters.getUserInfo.classId,
                        praiseId: praiseId.praiseId
                    }
                    delPraise(dataFom).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        // 点赞
        addPraiseClick(ietm) {
            if (ietm.praiseFlag) {
                console.log(11)
                this.$emit('delPraiseClick', ietm)
                return false
            }
            this.$emit('addPraiseClick', ietm)
        },
        // 置顶的方法
        topAppraise(item) {
            return new Promise((resolve, reject) => {
                try {
                    let fonData = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: item.appraiseId,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    topAppraise(fonData).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        // 取消置顶的方法
        untopAppraise(item) {
            return new Promise((resolve, reject) => {
                try {
                    let fonData = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: item.appraiseId,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    untopAppraise(fonData).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        // 置顶 取消置顶
        topClick(item) {
            if (item.topFlag == '0') {
                this.$emit("topClick", item)
            } else {
                this.$emit("untopAppraise", item)
            }
        },
        // 添加精华
        essAppraise(item) {
            return new Promise((resolve, reject) => {
                try {
                    let fonData = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: item.appraiseId,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    essAppraise(fonData).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        unessAppraise(item) {
            return new Promise((resolve, reject) => {
                try {
                    let fonData = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: item.appraiseId,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    unessAppraise(fonData).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        // 精华 取消精华
        essenceClick(item) {
            if (item.essFlag == '0') {
                this.$emit("essenceClick", item)
            } else {
                this.$emit("unessAppraise", item)
            }
        },
        // 删除
        delAppraise(item) {
            return new Promise((resolve, reject) => {
                try {
                    let fonData = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: item.appraiseId,
                    }
                    delAppraise(fonData).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        delAppraiseClick(item) {
            console.log("8887777")
            Dialog.confirm({
                    title: '提示',
                    message: '是否确定删除',
                })
                .then(() => {
                    this.$emit('delAppraise', item)
                })
                .catch(() => {
                    // on cancel
                });
        },
        getReply(item, index) {
            try {
                let fonData = {
                    interUser: 'runLfb',
                    interPwd: '25d55ad283aa400af464c76d713c07ad',
                    operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                    belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                    appraiseId: item.appraiseId,
                    currPage: 1,
                    pageSize: 100,
                    classId: this.$store.getters.getUserInfo.classId,
                }

                if (item.replyList.length > 5) {
                    console.log(this.dataFont)
                    this.pinglunList = this.dataFont
                    return false
                }
                getReply(fonData).then((res) => {
                    console.log(res.data[0].replyListInfo, "res")
                    let data = JSON.parse(JSON.stringify(this.pinglunList))
                    this.dataFont = JSON.parse(JSON.stringify(this.pinglunList))
                    data[index].replyList = res.data[0].replyListInfo
                    this.pinglunList = data
                })
            } catch (e) {
                console.log(e)
            }
        },
        viewAllClick(item, index) {
            console.log(item, index)
            this.getReply(item, index)
        },
        submit() {
            this.$emit('submit')
        },
        // 发表评论
        addReply(item) {
            return new Promise((resolve, reject) => {
                try {
                    let dataFom = {
                        interUser: 'runLfb',
                        interPwd: '25d55ad283aa400af464c76d713c07ad',
                        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                        appraiseId: item.appraiseId,
                        replyContent: item.constText,
                        accountNo: this.$store.getters.getUserInfo.accountNo,
                        parentReplyId: this.replyAccount || 0,
                        classId: this.$store.getters.getUserInfo.classId,
                    }
                    addReply(dataFom).then((res) => {
                        resolve(res)
                    })
                } catch (e) {
                    console.log(e)
                }
            })
        },
        sendClick(item) {
            this.$emit('sendClick', item)
        },
        ReplyClick(value, item, index) {
            if (this.$store.getters.getUserInfo.accountNo == item.replyAccount) {
                this.$toast('自己不能评论自己')
                return false
            }
            let dataFom = JSON.parse(JSON.stringify(this.pinglunList))
            this.replyAccount = item.replyAccount
            dataFom[index].pinglun = `回复${item.replyAccount}`
            this.pinglunList = dataFom

        },
        returnClick(val) {
          if(val) {
              if(this.ObjFont.additionalComments == '评论') {
                  let dataFom = JSON.parse(JSON.stringify(this.pinglunList)) 
                  dataFom[this.ObjFont.index].imgArr[this.ObjFont.i].show = true
                  this.pinglunList = dataFom
              } else {
                  let dataFom = JSON.parse(JSON.stringify(this.pinglunList)) 
                  dataFom[this.ObjFont.index].pubAppendContentInfoList[this.ObjFont.appendIndex].imgArr[this.ObjFont.i].show = true
                  this.pinglunList = dataFom
              } 
          }
          this.maskImg = false
        }
    },
    
    watch: {
        list: {
            handler(vol) {
                if (vol && vol.length > 0) {
                    vol.forEach(item => {
                        item.pinglun = '评论'
                    })
                }
                this.pinglunList = vol

                console.log(vol, "778877887788====")
            },
            deep: true,
        }
    },
    mounted() {
        setTimeout(() => {
            console.log(this.list, "this.list------------------")
        }, 2000)
    }
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

@{deep} .ql-editor {}

.zhibi{
  position: relative;
  margin-right: 10px !important;
  .paperAndPenInteraction{
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
  .Mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 6px;
  }
}

.bottom {
    width: 120px;
    height: 40px;
    background: rgb(34, 173, 126);
    ;
    border-radius: 5px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    line-height: 40px;
}

.textarea {
    width: 100px;
    height: 100px;
    border: 1px solid red;
}

.stu-exp-wrap {
    overflow-x: hidden;
    height: 100%;

    &__item {
        border: 1px solid #eee;
        border-radius: 10px;
        margin-bottom: 10px;
        background: #fff;
        padding: 20px;

        .reply-wrap {
            display: flex;
            word-break: break-all;

            &__name {
                flex: 0 0 15%;
                color: @blue;
                height: 20px;
            }

            &__ctn {
                flex: 0 0 85%;

                &__group {
                    background: #f5f6fa;
                    padding: 5px;
                    margin-top: 5px;
                }

                .comment-input {
                    background: #f5f6fa;
                    margin-top: 5px;

                    @{deep} &.van-field {
                        input {
                            background: #fff !important;
                        }
                    }
                }
            }
        }

        .comment-wrap {
            display: flex;
            align-items: center;

            .submit-btn {
                flex: 0 0 70px;
                border-radius: 5px;
                margin: 0 8px;
                line-height: 35px;
                height: 35px;
            }
        }

        &__content-wrap {
            display: flex;
            flex-direction: column;
            // align-items: center;
            // justify-content: space-between;
            padding: 20px;
            font-size: 24px;

            .stu-name {
                flex: 0 0 76px;
                // text-align: center;
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                // flex-direction: column;
            }

            .stu-answer {
                flex: 1;
                margin-left: 10px;
                overflow: hidden;

                .img-wrap {
                    width: 100%;
                    height: 105px;
                    display: flex;
                    margin-top: 10px;
                    >div {
                        // flex: 1;
                        height: 75px;
                        margin-right: 5px;
                        width: 140px;
                        height: 105px;
                        border-radius: 6px;
                        margin-right: 10px;
                        
                        &:last-child {
                            margin-right: 0;
                        }
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    &.img4 {
                        >div {
                            width: 120px;
                            height: 75px;
                            margin-bottom: 5px;

                            &:nth-child(2n) {
                                margin-right: 0;
                            }
                        }
                    }

                    &.img56 {

                        >div {
                            width: 120px;
                            height: 75px;
                            margin-bottom: 5px;

                            &:nth-child(3n) {
                                margin-right: 0;
                            }
                        }
                    }
                }

                .video-wrap {
                    height: 150px;
                }
            }
        }

        &__btn-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #eee;

            >div {
                flex: 1;
                color: #666;
                font-size: 24px;
                line-height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;

                .iconGFY {
                    margin-right: 3px;
                }

                .icon-good,
                .icon-good-active {
                    width: 15px;
                    height: 15px;
                }
            }

            &.disable {
                >div {
                    color: #999;
                }
            }
        }

        &__good-group {
            padding: 4px 10px;
            background: #e0fffc;
            border-top: 1px solid #eee;
            word-break: break-all;
        }
    }

    @{deep} .video-js {
        height: 30px !important;
        width: 100% !important;
        background: #fff;

        .vjs-error-display {
            display: none !important;
        }

        .vjs-loading-spinner {
            display: none !important;
        }

        .vjs-control-bar {
            display: flex !important;
            height: 30px !important;
            background: #fff;
            transition: none !important;
            opacity: 1 !important;

            .vjs-current-time {
                display: block !important;
                color: #000;
                line-height: 30px;
                padding-right: 0;

                &::after {
                    content: '/';
                }
            }

            .vjs-duration {
                display: block !important;
                padding-left: 0;
                color: #000;
                line-height: 30px;
            }

            .vjs-volume-panel {
                display: none;
            }

            .vjs-fullscreen-control {
                display: none;
            }

            .vjs-play-control {
                width: 15px;

                &.vjs-playing {
                    .vjs-icon-placeholder:before {
                        content: '\F103';
                        color: #fff;
                        background: @blue;
                        border-radius: 50%;
                        width: 15px;
                        height: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }

                .vjs-icon-placeholder:before {
                    content: '\F101';
                    color: #fff;
                    background: @blue;
                    border-radius: 50%;
                    width: 15px;
                    height: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            .vjs-play-progress {
                background: @blue;

                &::before {
                    content: '\F111';
                    color: @blue;
                }
            }

            .vjs-load-progress {
                background: #d2f0e9;
            }
        }

        .vjs-big-play-button {
            display: none;
        }
    }

    .click-active {
        &:active {
            background: #ddd;
        }
    }

    .reviews {
        width: 100%;
        // height: 133px;
        padding: 20px;
        font-size: 20px;
        background: #F8F8F8;
        color: #666F6F;
        position: relative;
        border-radius: 6px;

        /deep/div:nth-child(1) {
            height: 100%;
            // overflow: auto;
        }

        .reviews-div {
            position: absolute;
            width: 117px;
            height: 47px;
            border-radius: 6px;
            z-index: 400;
            top: -10px;
            left: -10px;

            .reviews-svg {
                width: 117px;
                height: 47px;
                color: red;
            }
        }
    }

    .likeList {
        width: 100%;
        height: 100px;
        display: flex;
        margin-top: 31px;
        border-bottom: 1px solid #DDDDDD;

        .likeList-left {
            width: 40%;
            height: 100%;
            display: flex;

            >div {
                width: 33.33%;
                display: flex;
                align-items: center;

                >div {
                    font-size: 28px;
                    color: #606060;
                    text-indent: 12px;
                }

                .reviews-svg {
                    width: 44px;
                    height: 44px;
                }
            }
        }

        .likeList-right {
            width: 60%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            position: relative;

            .suspension {
                width: 220px;
                height: 273px;
                background: #fff;
                box-shadow: 0px 4px 20px 0px rgba(63, 63, 63, 0.1);
                border-radius: 10px;
                position: absolute;
                bottom: 70px;
                padding: 10px;
                box-sizing: border-box;

                >div {
                    width: 100%;
                    height: 33.33%;
                    border-bottom: 1px solid #DDDDDD;
                    font-size: 26px;
                    color: #1B1B1B;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                >div:nth-child(3) {
                    border-bottom: none
                }
            }

            .reviews-svg {
                width: 44px;
                height: 44px;
            }
        }
    }

    .likePeople {
        width: 100%;
        display: flex;
        margin-top: 15px;
        max-height: 120px;
        min-height: 40px;
        overflow: auto;

        .likePeople-left {
            display: flex;
            height: 100%;

            .reviews-svg {
                width: 40px;
                height: 40px;
            }
        }

        .textileas {
            display: flex;
            flex-wrap: wrap;
        }

        .likePeople-right {
            font-size: 28px;
            color: #666666;
            text-indent: 15px;
        }
    }

    .yetxrfg {
        margin-top: 15px;
    }

    .annotateRichText {}

    .viewAll {
        width: 100%;
        color: #22AD7E;
        font-size: 28px;
        text-align: center;
        margin-top: 30px;
    }

    .commentInput {
        width: 80%;
        height: 70px;
        background: #F8F8F8;
        border-radius: 35px;
        padding-left: 20px;
        font-size: 28px;
    }

    .sendClss {
        width: 15%;
        height: 70px;
        border-radius: 35px;
        background: #22AD7E;
        color: #fff;
        font-size: 28px;
        text-align: center;
        line-height: 70px;
    }

    .commentInput-sendClss {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
    }

}

// new---
@{deep} .empty-page>.details-svg {
    width: 556px;
    height: 300px;
}

.default_avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
}

.stu-name-p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 5px;
}

.stu-name-appraiseDate {
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a8a8a8;
    line-height: 25px;
}

.add_to {
    margin: 27px 0 20px;

    span {
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #dfa919;
        line-height: 37px;
        margin-right: 26px;
    }

    span:last-child {
        color: #a8a8a8;
        margin-right: 0;
    }
}

.van-hairline--top {
    background: #fff;
    border-radius: 6px;
    font-size: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666f6f;
    line-height: 30px;
}

.stu-name-p-score {
    font-size: 20px;
    margin-left: 10px;
    color: #dfa919;
}
</style>
