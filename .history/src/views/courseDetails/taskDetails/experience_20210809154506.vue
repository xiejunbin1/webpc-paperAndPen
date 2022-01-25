<!--
 * @Author: wgj
 * @Date: 2021-02-22 14:22:12
 * @LastEditTime: 2021-02-28 14:33:27
 * @LastEditors: wgj
 * @Description: 
-->
<template>
  <div class="experience">
    <van-list
      v-model="listLoading"
      :finished="finished"
      :finished-text="appraiseList.length > 0 ? '没有更多了' : ''"
      @load="onLoad"
      :offset="80"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <!--        学生心得-->
      <stu-exp
        @focus="showFooter = false"
        @blur="showFooter = true"
        @score="handleScore"
        @delReply="delReply"
        @submit="submit"
        @addPraiseClick="addPraiseClick"
        @delPraiseClick="delPraiseClick"
        @topClick="topClick"
        @untopAppraise="untopAppraise"
        @essenceClick="essenceClick"
        @unessAppraise="unessAppraise"
        @delAppraise='delAppraise'
        @sendClick="sendClick"
        :classId="$store.getters.getUserInfo.classId"
        :currentPage="currentPage"
        :total="total"
        :finished="finished"
        :list="appraiseList"
        :disable="isDisabled"
        :isfEducation="isfEducation"
        ref="stuExps"
      >
      </stu-exp>
    </van-list>
    
  </div>
</template>

<script>
import stuExp from '../../../components/stuExp';
import {
  saveRewardScore,
  essAppraise,
  unessAppraise,
  delPraise,
  addPraise,
  topAppraise,
  untopAppraise,
  getAppraiseV2,
  addReply,
  delReplyV2,
  statTaskStat,
  statTaskStatV2,
  
} from '@/api/index';

export default {
  data() {
    return {
      error: false,
      showPieTip: false,
      showReplyTip: false,
      listLoading: false,
      finished: true, //首次加载页面不需要触发列表滚动加载
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showFooter: true,
      appraiseList: [],
      type: '', //学资源类型
      wareDetail: { courseware: { srcUrl: '' }, discussInfo: {} }, // 学资源详情
      iconType: '',
      taskFinishInfo: { examstat: [], studentStatList: [], paperDataList: [] },
      info: JSON.parse(localStorage.getItem('stat')),
      isfEducation: this.$store.getters.getExamDetailData.isfEducation,
      parentClassList: {},
      showfEduction: false,
      subjectTypeList: {},
      imgURL: ''
    };
  },

  components: { stuExp },

  computed: {
    isTestPaper() {
      return this.$route.query.testPaperId > 0;
    },
    isDisabled() {
      return this.$route.query.disabled == 1;
    },
  },

  async mounted() {
    await this.statTaskStat();
    await this.getAppraise();
    // await this.getCourseTaskDetail();
    // await this.getMySchoolInfo()
    // await this.getfEducationParents()
    console.log("===-----====--==--")
  },

  methods: {
    async onLoad() {
      this.currentPage++;
      if (this.currentPage > this.total && this.currentPage > 1) {
        return;
      }
      this.getAppraise();
    },
    rewardScore(accountNo) {
      console.log(' this.taskFinishInfo.', this.taskFinishInfo);
      try {
        return this.taskFinishInfo.studentStatList.find((v) => v.accountNo === accountNo).studentRewardScore || 0;
      } catch {
        console.log(accountNo, '有错啊');
      }
    },
   
    handleAppraiseCtn(dom, v) {
      const imgArr = dom.querySelectorAll('img');
      const audioArr = dom.querySelectorAll('audio');
      const videoArr = dom.querySelectorAll('video');
      for (let i = 0; i < imgArr.length; i++) {
        if (imgArr[i].src.indexOf('?') > -1) {
          v.imgArr.push({imgArr:imgArr[i].src + '&' + Math.random()});
        } else {
          v.imgArr.push({imgArr:imgArr[i].src + '?&' + Math.random()});
        }

        let parent = imgArr[i].parentElement;
        parent.removeChild(imgArr[i]);
      }
      for (let i = 0; i < audioArr.length; i++) {
        v.audioArr.push(audioArr[i].src);
        let parent = audioArr[i].parentElement;
        parent.removeChild(audioArr[i]);
      }
      for (let i = 0; i < videoArr.length; i++) {
        v.videoArr.push(videoArr[i].src);
        let parent = videoArr[i].parentElement;
        parent.removeChild(videoArr[i]);
      }
    },
    delReply(replyId, replyIndex) {
      this.$store.commit('setVanLoading', true);
      delReplyV2({ replyId }).then((res) => {
        this.$store.commit('setVanLoading', false);
        if (res.flag) {
          const index = this.appraiseList[replyIndex].replyList.findIndex((v) => replyId === v.replyId);
          if (index > -1) {
            this.appraiseList[replyIndex].replyList.splice(index, 1);
          }
        } else {
          this.$toast(res.msg);
        }
      });
    },
    
    async statTaskStat(classId = this.info.tchClassTastInfo[0].classId) {
      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
        classId: this.$store.getters.getUserInfo.classId,
        taskId: this.info.taskId,
        // classId,
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
      await api(params).then((res) => {
        if (res.flag && res.data[0]) {
          if (this.$store.getters.getExamDetailData.taskType === 'T13') {
            res.data[0].studentStatList = res.data[0].examstat;
            //因为口语没有testPaperScore这个字段,但是总分是按100分来算的
            res.data[0].testPaperScore = 100;
          }
          this.taskFinishInfo = res.data[0];
        } else {
          this.$toast(res.msg);
        }
      });
    },
    // 加分减分
    handleScore(item, type) {
      if (!this.isfEducation) {
        try {
          MobclickAgent.onEvent(type === 'T01' ? 'resDetailAddScore' : 'resDetailSubScore');
        } catch (e) {
          console.log(e);
        }
      }
      this.$store.commit('setVanLoading', true);
      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.schoolId,
        taskId: this.$route.query.taskId,
        type,
        score: 1,
        subjectType: localStorage.currentSubjectType,
        teacherName: localStorage.userInfo.userName,
        taskName: JSON.parse(localStorage.getItem('stat')).taskName,
        termType: this.$route.query.termType,
        classId: this.info.tchClassTastInfo.find((t) => t.active).classId,
        groupIdList: '',
        accountNoList: item.appraiseAccountNo,
      };
      let params = {
        requestJson: JSON.stringify(obj),
      };
      saveRewardScore(params).then((res) => {
        this.$store.commit('setVanLoading', false);
        if (res.flag) {
          const score = item.score * 1 + (type === 'T01' ? 1 : -1);
          item.score = score;
          this.$toast(`${type === 'T01' ? '加' : '减'}分成功`);

          //更新this.taskFinishInfo.studentStatList的值 因为点赞/置顶/精华/加分/评论以后没有刷新this.taskFinishInfo.studentStatList
          const index = this.taskFinishInfo.studentStatList.findIndex((v) => v.accountNo === item.appraiseAccountNo);
          if (index > -1) {
            this.taskFinishInfo.studentStatList[index].studentRewardScore = score;
          }
        } else {
          this.$toast(res.msg);
        }
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
        // classId: this.info.tchClassTastInfo.find((t) => t.active).classId,
        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
        classId: this.$store.getters.getUserInfo.classId,
        // currPage: 1,
        currPage: page,  
        isAppendMode: true,
        objectId: this.$store.getters.getExamDetailData.taskId || this.$store.getters.getExamDetailData.info.taskId,
        objectTypeCd: 'A01',
        pageSize,
        praiseType: 1,
        roleType: 'A02',
      };
      let params = {
        requestJson: JSON.stringify(obj),
      };
      await getAppraiseV2(params)
        .then((res) => {
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
              v.score = this.rewardScore(v.appraiseAccountNo);
              let dom = document.createElement('div');
              v.imgArr = [];
              v.audioArr = [];
              v.videoArr = [];
              dom.innerHTML = v.appraiseContent;
              if (v.appraiseContent) {
                this.handleAppraiseCtn(dom, v);
              }
              v.text = dom.outerHTML;

              //追加内容
              v.pubAppendContentInfoList.forEach((append) => {
                let appendDom = document.createElement('div');
                append.imgArr = [];
                append.audioArr = [];
                append.videoArr = [];
                appendDom.innerHTML = append.appendContent;
                this.handleAppraiseCtn(appendDom, append);
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
        })
        .catch((err) => {
          this.error = true;
          this.listLoading = false;
          this.currentPage--;
        });
    },
    
    addPraiseClick(ietm) {
      this.$refs.stuExps.addPraise(ietm).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
        }else {
          this.$toast(res.msg);
        }
      })
    },
    delPraiseClick(ietm) {
      console.log(ietm)
      this.$refs.stuExps.delPraise(ietm).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
        }else {
          this.$toast(res.msg);
        }
      })
    },
    topClick(item) {
      this.$refs.stuExps.topAppraise(item).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
          this.$toast('置顶成功')
        }else {
          this.$toast(res.msg);
        }
      })
      console.log(item)
    },
    untopAppraise(item) {
      this.$refs.stuExps.untopAppraise(item).then(res => {
        if(res.flag) {
         this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
          this.$toast('取消成功')
        }else {
          this.$toast(res.msg);
        }
      })
    },
    essenceClick(item) {
      this.$refs.stuExps.essAppraise(item).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
          this.$toast('添加成功')
        }else {
          this.$toast(res.msg);
        }
      })
    },
    unessAppraise(item) {
      this.$refs.stuExps.unessAppraise(item).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
          this.$toast('取消成功')
        }else {
          this.$toast(res.msg);
        }
      })
    },
    delAppraise(item) {
      this.$refs.stuExps.delAppraise(item).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
          this.$toast('删除成功')
        }else {
          this.$toast(res.msg);
        }
      })
    },
    submit() {
      this.$refs.stuExps.updateAppraise().then((res) => {
        this.currentPage = 1;
        this.pageSize = this.appraiseList.length;
        this.getAppraise();
        //刷新数据以后pageSize和currentPage都要还原
        this.currentPage = Math.ceil(this.pageSize / 10);
        this.pageSize = 10;
      })
    },
    sendClick(item) {
      this.$refs.stuExps.addReply(item).then(res => {
        if(res.flag) {
          this.currentPage = 1;
          this.pageSize = this.appraiseList.length;
          this.getAppraise();
          //刷新数据以后pageSize和currentPage都要还原
          this.currentPage = Math.ceil(this.pageSize / 10);
          this.pageSize = 10;
          this.$toast('评论成功')
        }else {
          this.$toast(res.msg);
        }
      })
    }
  },
};
</script>
<style lang='less' scoped>
// @deep: ~'>>>';
.experience {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #f8f8f8;
}

.van-list {
  width: 90%;
  height: 80%;
  margin: 0 auto;
}

</style>