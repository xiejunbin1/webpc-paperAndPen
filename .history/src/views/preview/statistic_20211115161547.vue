<template>
  <section class="statistic-wrap">
    <div class="statistic-wrap-content"  ref="body">
      <div class="statistic-wrap__pie-chart">
        <div class="exam_analyse_wrap_pie">
          <div id="myChart1" ref="myChart1" class="pie-chart"></div>
        </div>
        <div class="myChart1-bottom">
            <span class="theCompletionRate">
                <div class="theCompletionRate-div" style="background: #F38560;"></div>
                <div class="text">未完成{{ taskFinishInfo.notStartCount }}人</div>
            </span>
            <span class="theCompletionRate">
                <div class="theCompletionRate-div" style="background: #F38560;"></div>
                <div class="text">进行中{{ taskFinishInfo.runningCount }}人</div>
            </span>
            <span class="theCompletionRate">
                <div class="theCompletionRate-div" style="background: #F5C168;"></div>
                <div class="text">已完成{{ taskFinishInfo.finshCount }}人</div>
            </span>
        </div>
        <div class="filterBox"  v-if="objectiveList.length>0 || taskFinishInfo.paperDataList"> 
          <van-tabs type="card" title-active-color="#fff" title-inactive-color="#666" color="#22AD7E">
            <van-tab :title="'未开始' + this.taskFinishInfo.notStartCount">
              <div class="details-student1" v-if="noStartObj.length>0">
                <span class="statistic-tab" v-for="(item, index) in noStartObj" :key="index">{{ item }}</span>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
              <div class="details-student1" v-else>
                  <div class="details-div">
                      <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                      <div class="details-text">暂无学生任务进行中</div>
                  </div>
              </div>
            </van-tab>  
            
            <van-tab :title="'进行中' + this.taskFinishInfo.runningCount">
              <div class="details-student1" v-if="underwayObj.length>0">
                <span class="statistic-tab" v-for="(item, index) in underwayObj" :key="index">{{ item }}</span>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
              <div class="details-student1" v-else>
                  <div class="details-div">
                      <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                      <div class="details-text">暂无学生任务进行中</div>
                  </div>
              </div>
            </van-tab>
            
            <van-tab :title="'已完成' + this.taskFinishInfo.finshCount">
              <div class="details-student1" v-if="finshObj.length>0">
                <span class="statistic-tab" v-for="(item, index) in finshObj" :key="index">{{ item }}</span>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
              <div class="details-student1" v-else>
                  <div class="details-div">
                      <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                      <div class="details-text">暂无学生任务进行中</div>
                  </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
        
        <div class="stat-dialog-wrap">
        </div>
      </div>

      <div class="statistic-wrap__view"  v-if="objectiveList.length == 0 && !taskFinishInfo.paperDataList">
        <div class="filterBox" :style="filter_box">
          <van-tabs type="card" title-active-color="#fff" title-inactive-color="#666" color="#22AD7E">
            <van-tab :title="'未开始' + this.taskFinishInfo.notStartCount">
              <div class="details-student1" v-if="noStartObj.length>0">
                <span class="statistic-tab" v-for="(item, index) in noStartObj" :key="index">{{ item }}</span>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
              <div class="details-student1" v-else>
                  <div class="details-div">
                      <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                      <div class="details-text">暂无学生任务进行中</div>
                  </div>
              </div>
            </van-tab>  
            
            <van-tab :title="'进行中' + this.taskFinishInfo.runningCount">
              <div class="details-student1" v-if="underwayObj.length>0">
                <span class="statistic-tab" v-for="(item, index) in underwayObj" :key="index">{{ item }}</span>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
              <div class="details-student1" v-else>
                  <div class="details-div">
                      <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                      <div class="details-text">暂无学生任务进行中</div>
                  </div>
              </div>
            </van-tab>
            
            <van-tab :title="'已完成' + this.taskFinishInfo.finshCount">
              <div class="details-student1" v-if="finshObj.length>0">
                <span class="statistic-tab" v-for="(item, index) in finshObj" :key="index">{{ item }}</span>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
              <div class="details-student1" v-else>
                  <div class="details-div">
                      <svg-icon class="details-svg" icon-class="icon-no-students"></svg-icon>
                      <div class="details-text">暂无学生任务进行中</div>
                  </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>


      
      <div class="statistic-wrap__view" v-if="objectiveList.length>0 || taskFinishInfo.paperDataList">
        <!--        主观题 客观题列表-->
        <div v-if="$route.query.taskType !== 'T13'">
          <div>
            <div v-show="taskFinishInfo.examstat && taskFinishInfo.examstat.some((v) => v.auto_scoring === '1')" class="fs12 black statistic-wrap__view-label mgt10 statistic-wrap__view-Question">
              <div class="objectiveQuestion">客观题 <i @click="showPieTip = true" class="iconGFY icon-tip"></i></div>
              <div class="objective-Percentage">
                <div class="Percentage">
                  <span class="color" style="background: #5ACD70;"></span>
                  <span class="text">正确</span>
                </div>
                
                <div class="Percentage">
                  <span class="color" style="background: #FD7272;"></span>
                  <span class="text">错误</span>
                </div>

                <div class="Percentage">
                  <span>%</span>
                  <span class="text" >正确率</span>
                </div>
              </div>
              <!-- 
               -->
            </div>
            <!--            <div id="myChart3" ref="myChart3" class="subject-pie"></div>-->
            <div class="objective-pie-group">
              <div class="objective-pie-group-div">
                <div class="hgsgah" v-for="(item, index) in objectiveList" :key="index" >
                  <div class="hgsgah-div" :id="`objectivePie${index}`"></div>
                  <div class="text_div">第{{ item.num }}题</div>
                </div>
                <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
              </div>
            </div>
          </div>



          <div v-if="taskFinishInfo.paperDataList && taskFinishInfo.paperDataList.some((v) => v.autoScoring === '0' && (v.groupExamList.some((g) => g.autoScoring === '0') || !v.groupExamList.length))">
            <div class="fs12 black statistic-wrap__view-label subjectiveQuestions">主观题</div>
            <div class="statistic-wrap__view-subject subjectiveQuestions-div">
              <div
                class="statistic-wrap__view-subject-item butster"
                @click="viewSubjectList(item)"
                v-for="(item, index) in taskFinishInfo.paperDataList"
                :key="index"
                v-if="item.autoScoring === '0' && (item.groupExamList.some((g) => g.autoScoring === '0') || !item.groupExamList.length)"
              >
                <div class="pd5">
                  <div class="statistic-wrap__view-subject-item-title">第{{ index + 1 }}题</div>
                  <div class="statistic-wrap__view-subject-item-content">
                    <div>平均分: {{ calcScore(item, 'avg_score') }}</div>
                    <div>总分:{{ calcScore(item, 'total_score') }}</div>
                  </div>
                  <div v-if="calcScore(item, 'finish_count') == 0">
                    <div>进度:0%</div>
                    <!-- {{ calcScore(item, 'finish_count') }}{{ calcScore(item, 'student_finish_count') }} -->
                    <van-progress color="#22AD7E" :percentage="0" />
                  </div>
                  <div v-else>
                    <div>进度:{{ ((calcScore(item, 'finish_count') / calcScore(item, 'student_finish_count')) * 100).toFixed(2) }} %</div>
                    <!-- {{ calcScore(item, 'finish_count') }}{{ calcScore(item, 'student_finish_count') }} -->
                    <van-progress color="#22AD7E" :percentage="((calcScore(item, 'finish_count') / calcScore(item, 'student_finish_count')) * 100).toFixed(2)" />
                  </div>
                </div>
                <div class="status">{{ isCorrect(item) ? '已批改' : '批改' }}</div>
              </div>
              <div class='default-box' v-for="n in 10" :key="n+'00'"></div>

            </div>
          </div>

          <!--          单道试题-->
          <div v-if="$route.query.resourceType === 'R03' && taskFinishInfo.examstat.some((v) => v.auto_scoring === '0')">
            <div class="fs12 black statistic-wrap__view-label">主观题</div>
            <div class="statistic-wrap__view-subject">
              <div class="statistic-wrap__view-subject-item" @click="viewSubjectList">
                <div class="pd5">
                  <div>第1题</div>
                  <div>平均分: {{ singleQuestionScore('avg_score') }}</div>
                  <div>总分:{{ singleQuestionScore('total_score') }}</div>
                </div>
                <div class="status">
                  {{ taskFinishInfo.examstat.filter((v) => v.auto_scoring === '0').some((v) => v.student_finish_count > 0 && v.finish_count == v.student_finish_count) ? '已批改' : '批改' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-dialog v-model="stuStatInfo.statDialog" :show-confirm-button="false">
      <div class="stat-dialog-wrap">
        <div class="stat-dialog-wrap__header">
          <span class="stat-dialog-wrap__header-title">{{ stuStatInfo.title }}{{ isfEducation ? '家长' : '学生' }}</span>
          <van-icon class="icon-close" name="clear" @click="stuStatInfo.statDialog = false" />
        </div>
        <div class="stat-dialog-wrap__body">
          <div v-for="(item, index) in stuStatInfo.stu" :key="index">{{ item }}</div>
        </div>
      </div>
    </van-dialog>

    <van-popup round v-model="showReplyTip">
      <div class="pd10 fs16 tip-wrap">
        <div style="text-align: center" class="fs18">讨论详情说明</div>
        <div class="mgt5">1.点击评论区域的评论人名字可直接回复该评论个人</div>
        <div class="mgt5">2.点击自己的名字可直接删除评论或回复</div>
      </div>
    </van-popup>
    <van-popup round v-model="showPieTip">
      <div class="pd10 fs16 tip-wrap">
        <div style="text-align: center" class="fs18">客观题说明</div>
        <div class="mgt5"><span style="color: green">●</span> 错误率 = 答题错误人数/答题总人数</div>
        <div class="mgt5"><span class="red">●</span> 正确率 = 答题正确人数/答题总人数</div>
        <div class="mgt5">● 饼状图中间显示的是该题目的正确率</div>
      </div>
    </van-popup>
    <van-popup round v-model="showTip">
      <div class="pd10 fs16 tip-wrap">
        <div style="text-align: center" class="fs18">任务完成情况说明</div>
        <div class="mgt5">●未开始:{{ isfEducation ? '家长' : '学生' }}还没有开始进行作答</div>
        <div class="mgt5">●进行中:{{ isfEducation ? '家长' : '学生' }}正在作答中</div>
        <div class="mgt5">●已完成:{{ isfEducation ? '家长' : '学生' }}已完成作答</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import { pubApi } from '@/api/parent-GFY';
import listItem from '../../components/list-item';
import spokenTable from '../../components/spokenTable';
import echarts from 'echarts';
import stuExp from '../../components/stuExp';
import {
  statTaskStat,
  getCourseTaskDetail,
  statTaskStatV2,
} from '@/api/index';
import { getStudentName, getParentName, getFontSize } from '@/utils/filter';

// import mixin from '@/utils/mixin.js';
export default {
  // mixins: [mixin],
  name: 'statistic',
  components: { stuExp, spokenTable, listItem },
  data() {
    return {
      //new---
      underwayObj: [],
      finshObj: [],
      noStartObj: [],
      //---
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
      // wareActive: false, //学资源详情tab选中状态
      // lessonActive: false, //微课详情tab选中状态
      isSpoken: false,
      tabIndex: 1,
      isWk: true,
      stuStatInfo: {
        title: '',
        stu: [],
        statDialog: false,
      },
      // info: JSON.parse(JSON.stringify(this.$route.query.info)),
      info: JSON.parse(localStorage.getItem('stat')),
      taskFinishInfo: { examstat: [], studentStatList: [], paperDataList: [] },
      remind: false,
      loadWareFlag: true,
      isFromClassStatList: this.$route.query.from == 'classStatList' ? true : false,
      objectiveList: [],
      scrollTop: 0,
      error: false,
      showTip: false,
      isfEducation: this.$route.query.isfEducation,
      socketTaskId: '',
      showPageAll: false,

      filter_box: {
        height: '87%',
        
      }
    };
  },
  computed: {
    isTestPaper() {
      return this.$route.query.testPaperId > 0;
    },
    ...mapState({
      vanLoading: (state) => state.setting.vanLoading,
    }),
    subjectTypeName() {
      return this.isfEducation ? '家庭教育' : localStorage.currentSubjectTypeName;
    },
    // isTaskEnd() {
    //   return new Date().getTime() >= new Date(this.info.tchClassTastInfo.find(t => t.active).endDate.replace(/-/g, "/")).getTime()
    // },
    isDisabled() {
      return this.$route.query.disabled == 1;
    },
  },
  methods: {
    singleQuestionScore(key) {
      return this.taskFinishInfo.examstat
        .filter((v) => v.auto_scoring === '0')
        .reduce((t, v) => {
          t += Number(v[key].toFixed(1));
          return Number(t.toFixed(1));
        }, 0);
    },
    isCorrect(item) {
      if (item.groupId === -1) {
        let exam = this.taskFinishInfo.examstat.find((v) => v.exam_id == item.examId);
        return exam.student_finish_count > 0 && exam.finish_count == exam.student_finish_count;
      } else {
        return item.groupExamList.some((v) => {
          let exam = this.taskFinishInfo.examstat.find((e) => e.exam_id == v.examGroupId);
          return exam.student_finish_count > 0 && exam.finish_count == exam.student_finish_count;
        });
      }
    },
    calcScore(item, key) {
      if (item.groupId === -1) {
        return this.taskFinishInfo.examstat.find((v) => v.exam_id == item.examId)[key];
      } else {
        return item.groupExamList.reduce((t, v) => {
          t += Number(this.taskFinishInfo.examstat.find((e) => e.exam_id == v.examGroupId)[key]);
          return Number(t.toFixed(2));
        }, 0);
      }
    },
    progress(item, key) {
      if (item.groupId === -1) {
        return this.taskFinishInfo.examstat.find((v) => v.exam_id == item.examId)[key];
      } else {
        return item.groupExamList.reduce((t, v) => {
          t += Number(this.taskFinishInfo.examstat.find((e) => e.exam_id == v.examGroupId)[key]);
          return Number(t);
        }, 0);
      }
    },
    viewStu() {
      
      let queryObj = this.$store.getters.getExamDetailData;
     
      this.$router.push({
        name: `examView`,
        
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
      pubApi.checkUrlPermission({ requestJson: JSON.stringify(permissionParams) }).then((respone) => {
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
        tchCourseId: this.$route.query.tchCourseId,
        taskId: this.$route.query.taskId,
      };
      let params = {
        requestJson: JSON.stringify(obj),
      };
      await getCourseTaskDetail(params).then((res) => {
        if (res.flag) {
          this.wareDetail = res.data[0];
          // this.iconType = this.handleIcon(res.data[0].courseware.srcUrl)
        }
      });
    },
    // 跳转到主观题详情
    viewSubjectList(item) {
      const id = this.$store.getters.getUserInfo.classId;
      
      let questionList = [];
      if (this.$route.query.resourceType === 'R03') {
        questionList.push({ examId: this.taskFinishInfo.resourceId, num: 1 });
      } else {
        this.taskFinishInfo.paperDataList.forEach((v, i) => {
          if (v.autoScoring === '0' && (v.groupExamList.some((g) => g.autoScoring === '0') || !v.groupExamList.length)) {
            questionList.push({ ...v, num: i + 1 });
          }
        });
      }
      const classId = this.$store.getters.getUserInfo.classId;
      console.log('item....', item);
      this.$router.push({
        name: 'subjectList',
        query: {
          taskId: this.$route.query.socketTaskId ? this.$route.query.socketTaskId : this.info.taskId,
          examId: item.examId,
          tchCourseId: this.$store.getters.getBaseData.tchCourseId,
          classId,
          questionList,
          termType: this.$store.getters.getBaseData.termType,
          taskType: this.$route.query.socketTaskId ? 'T10' : this.$store.getters.getExamDetailData.taskType,
          disabled: this.isDisabled ? 1 : '',
          isfEducation: this.isfEducation,
          from: this.$route.query.from,
        },
      });
    },
    // 跳转到客观题详情
    viewAnalyse() {
      try {
        MobclickAgent.onEvent('clickExamAnalyse');
      } catch (e) {
        console.log(e);
      }
      this.$router.push(
        `/examAnalyse?taskId=${this.info.taskId}&classId=${this.$store.getters.getUserInfo.classId}&testPaperId=${this.$route.query.testPaperId}&finishStudent=${this.taskFinishInfo.finishStudent}${
          this.isfEducation ? '&isfEducation=true' : ''
        }`
      );
    },
    async statTaskStat() {
      console.log('执行普通详细统计---', window.location);
      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
        classId: this.$store.getters.getUserInfo.classId,
        taskId: this.info.taskId,
        // classId,
      };
      console.log('this.$route.query.socketTaskId-----', this.$route.query, this.$route.query.socketTaskId);
      console.log('this.$store.getters.getExamDetailData-----', this.$store.getters.getExamDetailData);

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
          console.log('this.taskFinishInfo', this.taskFinishInfo);
        } else {
          this.$toast(res.msg);
        }
      });
    },
    async statTaskStatPaper() {
      console.log('执行推送试卷详细统计---', window.location);

      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
        classId: this.$store.getters.getUserInfo.classId,
        taskId: this.$route.query.socketTaskId,
      };
      console.log('this.$route.query.socketTaskId-----', this.$route.query, this.$route.query.socketTaskId);

      let params = {
        requestJson: JSON.stringify(obj),
      };
      let api;
      api = statTaskStatV2;

      await api(params).then((res) => {
        if (res.flag && res.data[0]) {
          this.taskFinishInfo = res.data[0];
          console.log('  this.taskFinishInfo', this.taskFinishInfo);
        } else {
          this.$toast(res.msg);
        }
      });
    },
    initPage() {
      this.$refs['body'].scrollTop = 0;
      this.finished = true;
      this.currentPage = 1;
    },

    // 左侧图表
    async drawPie() {
      console.log('this.taskFinishInfo.studentUnfinishList-----', this.taskFinishInfo.studentUnfinishList, this.taskFinishInfo.finishStudent, this.taskFinishInfo.finishStudent);
      let that = this;
      this.$nextTick(() => {
        let myChart = echarts.init(this.$refs.myChart1);
        // 绘制图表
        var _option = {
          legend: {
            top: 'bottom',
            data: ['进行中', '未开始', '已完成'],
            formatter: function (name) {
              var index = 0;
              var clientlabels = ['进行中', '未开始', '已完成'];
              var clientcounts = [that.taskFinishInfo.runningCount, that.taskFinishInfo.notStartCount, that.taskFinishInfo.finshCount];
              clientlabels.forEach(function (value, i) {
                if (value == name) {
                  index = i;
                }
              });
              return name + '' + clientcounts[index] + '人';
            },
          },
          calculable: true,
          color: ['#F5C168', '#F38560', '#729AED'],
          series: [
            {
              name: '文言文全章复习与巩固',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '50%'],
              label: {
                emphasis: {
                  show: true,
                },
                // position: 'outside',
                formatter: `{b}{d}%`,
                align: 'left',
                fontSize: getFontSize(0.15),
              },
              labelLine: {
                normal: {
                  show: true,
                },
                emphasis: {
                  show: true,
                },
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#ccc',
                },
              },
              data: [
                { value: this.taskFinishInfo.runningCount,},
                { value: this.taskFinishInfo.notStartCount, },
                { value: this.taskFinishInfo.finshCount, },
              ],
            },
          ],
        };
        myChart.setOption(_option, true);
        myChart.off('click');
        let dataFonde = []
        // 未开始
        this.taskFinishInfo.studentUnfinishList.forEach((v) => {
          (v.noStartList || []).forEach((s) => {
            dataFonde.push(s)
            const name = getStudentName(s, this.$store.getters.getUserInfo.classId);
            this.noStartObj.push(name);
          });
        });
        this.$store.commit('setNumberOfUnfinished', [])
        this.$store.commit('setNumberOfUnfinished', dataFonde)
        // 已完成
        this.taskFinishInfo.finishStudent.reduce((t, v) => {
          const name = getStudentName(v, this.$store.getters.getUserInfo.classId);
          this.finshObj.push(name);
        }, this.stuStatInfo.stu);
        // 把已完成的同学放进dataFomders
        let dataFomders = []
        this.taskFinishInfo.finishStudent.forEach((value, index) => {
          let dataFomder = this.taskFinishInfo.studentStatList.filter(vat => value == vat.accountNo)
          dataFomders.push(...dataFomder)
        })

        // 把全对的人获取出来
        let dataPoind = []
        dataFomders.forEach((value,index) => {
          let I01Num = 0;
          if(value.bigExamAnswerList == undefined ) {
            value.bigExamAnswerList = []
          }
          console.log(value.bigExamAnswerList,"value.bigExamAnswerList")
          for(let i in value.bigExamAnswerList){
            if (value.bigExamAnswerList[i].is_rigth == 'I01'){
              I01Num++;
            }else{
              I01Num=0;
              break;
            }
          }
          

          if(I01Num==value.bigExamAnswerList.length){
            dataPoind.push(value.accountNo)
          }
        })
        
        console.log(dataFomders,"dataPoinddataPoind")
        this.$store.commit('setAllRight', [])
        
        this.$store.commit('setAllRight', Array.from(new Set(dataPoind)))
        console.log(dataPoind,"888777=-=-")
        // 进行中
        this.taskFinishInfo.studentUnfinishList.forEach((v) => {
          (v.runningList || []).forEach((s) => {
            const name = getStudentName(s, this.$store.getters.getUserInfo.classId);
            this.underwayObj.push(name);
          });
        });
      });
    },
    // 客观题
    drawObjectivePie() {
      console.log('drawObjectivePie-----');
      //有客观题才渲染
      if (this.taskFinishInfo.examstat.some((v) => v.auto_scoring === '1')) {
        this.objectiveList = [];
        if (this.$route.query.resourceType === 'R03') {
          // 单试题
          this.taskFinishInfo.examstat.forEach((v, i) => {
            if (v.auto_scoring === '1') {
              this.objectiveList.push({ ...v, num: `1${this.taskFinishInfo.examstat.length > 1 ? `(${i + 1})` : ``}` });
            }
          });
        } else {
          //试卷
          this.taskFinishInfo.paperDataList.forEach((v, i) => {
            if (v.autoScoring === '1' && !v.groupExamList.length) {
              //客观题并且没有小题时才添加
              this.objectiveList.push({
                ...v,
                num: i + 1,
                exam_present: this.taskFinishInfo.examstat.find((e) => e.exam_id == v.examId).exam_present,
              });
            }
            let group = [];
            v.groupExamList.forEach((g, gi) => {
              if (g.autoScoring === '1') {
                group.push({
                  ...g,
                  num: `${i + 1}(${gi + 1})`,
                  exam_present: this.taskFinishInfo.examstat.find((e) => e.exam_id == g.examGroupId).exam_present,
                });
              }
            });
            this.objectiveList = this.objectiveList.concat(group);
          });
        }
        console.log(this.objectiveList,"this.objectiveList")
        this.$nextTick(() => {
          for (let i = 0; i < this.objectiveList.length; i++) {
            let myChart = echarts.init(document.getElementById(`objectivePie${i}`));
            const correct = Number(this.objectiveList[i].exam_present.split('%')[0] / 100);
            var questionOption = {
              color: ['#5EF0A6', '#FF6666'],
              series: [
                {
                  // name: ``,
                  type: 'pie',
                  radius: ['70%', '85%'],
                  label: {
                    show: false,
                    position: 'center',
                    formatter: '',
                  },
                  hoverAnimation: false,
                  data: [
                    {
                      value: correct,
                      name: '正确率',
                      label: {
                        show: true,
                        position: 'center',
                        formatter: '{d}%',
                        textStyle: {
                          baseline: 'bottom',
                          fontSize: getFontSize(0.2),
                          color: '#000',
                        },
                      },
                    },
                    { value: 1 - correct, name: '错误率' },
                  ],
                },
              ],
            };
            myChart.setOption(questionOption, true);
            myChart.off('click');
            myChart.on('click', (params) => {
              const item = this.objectiveList[i];
              const classId = this.$store.getters.getUserInfo.classId;
              let obj = {
                taskId: this.$route.query.socketTaskId ? this.$route.query.socketTaskId : this.info.taskId,
                examId: this.$route.query.resourceType === 'R03' ? item.exam_id : item.examId || item.examGroupId,
                groupId: this.$route.query.resourceType === 'R03' ? item.group_id : item.groupId,
                isfEducation: this.isfEducation,
                classId,
                questionList: this.objectiveList,
                resourceType: this.$route.query.resourceType,
              };
              sessionStorage.setItem('subjectAnalyse', JSON.stringify(obj));
              this.$router.push({
                name: 'subjectAnalyse',
                params: obj,
                query: {
                  from: this.$route.query.from,
                  tchCourseId: this.$store.getters.getBaseData.tchCourseId,
                  classId: this.$store.getters.getUserInfo.classId,
                  taskId: this.$route.query.socketTaskId ? this.$route.query.socketTaskId : this.info.taskId,
                  classId: this.$store.getters.getUserInfo.classId,
                  taskType: this.$route.query.socketTaskId ? 'T10' : this.$store.getters.getExamDetailData.taskType,
                },
                
              });
            });
          }
        });
      }
    },
  },
  async mounted() {
    this.$store.commit('setVanLoading', true);
    let dataForm = this.$store.getters.getExamDetailData
    console.log(this.$route.query,"this.$route.quer")
    dataForm.taskId =  this.$route.query.socketTaskId
    this.$store.commit("setExamDetailData", dataForm)
    console.log("this.$route.query.hasOwnProperty('socketTaskId')---", this.$route.query, this.$route.query.hasOwnProperty('socketTaskId'));
    this.$route.query.hasOwnProperty('socketTaskId') ? await this.statTaskStatPaper() : await this.statTaskStat();
    await this.drawPie();
    
    try {
      
      if (this.taskFinishInfo.examstat) {
        this.drawObjectivePie();
      }
      if (['T01', 'T02', 'T04', 'T06'].includes(this.$store.getters.getExamDetailData.taskType)) {
        
      }
      this.$store.commit('setVanLoading', false);
    } catch (e) {
      this.$store.commit('setVanLoading', false);
    }
    console.log(this.objectiveList,this.taskFinishInfo.paperDataList,"taskFinishInfo.paperDataList------------------")

  },

};
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.statistic-wrap {
  background: #fff;
  flex-direction: column;
  display: flex;
  height: 100%;
  .pie-chart {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }

  .subject-pie {
    width: 100%;
    margin: 0 auto;
  }

  .histogram-chart {
    width: 100%;
    height: 300px;
    margin: 0 auto;
  }

  .divider {
    &::after {
      content: ' ';
      display: block;
      width: 30px;
      height: 2px;
      background: @blue;
    }
  }

  &__tab-scroll {
    flex: 0 0 42px;
    background: #f5f5f5;
    display: flex;
    overflow-x: auto;
    width: 100%;
    white-space: nowrap;
    align-items: center;

    &-item {
      width: 360px;
      height: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      padding: 0 8px;
      line-height: 22px;
      border-radius: 11px;
      background-color: #ddd;
      margin-left: 10px;

      &.active {
        background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
        color: #fff;
      }
    }
  }

  &__pie-chart {
    background: #fff;
    padding: 15px 10px;
    position: relative;
    .icon-tip.psa {
      position: absolute;
      left: 100px;
      top: 3px;
    }

    &-label {
      font-size: 15px;
      color: #333;

      .notice-btn {
        padding: 0;
        font-size: 12px;
        width: 82px;
        border-radius: 11px;
        height: 26px;
        line-height: 26px;
        color: #fff;
        background: @blue;

        &.remind {
          color: #999;
          background: #f5f6fa;
        }
      }
    }
  }

  &__achievement {
    background: #fff;
    padding: 15px 10px;
    margin-top: 5px;

    &-label {
      font-size: 15px;
      color: #333;
      line-height: 26px;
    }

    &-score {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;

      > div {
        font-size: 12px;
        margin-right: 24px;
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;

        &:last-child {
          margin-right: 0;
        }

        .red {
          color: #ff6666;
          margin-top: 8px;
        }
      }
    }
  }

  .objective-pie-group {
    margin-top: 75px;
    
    
    .objective-pie-group-div {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      box-sizing: border-box;
      .hgsgah{
        flex: 0 0 120px;
        height: 120px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .hgsgah-div{
          flex: 0 0 100px;
          height: 100px;
        }
        .text_div{
          width: 100%;
          text-align: center;
          font-size: 20px;
          color: #626464;
        }
      }
      .default-box{
        width: 120px;
        height: 0;
      }
      
    //   &:nth-child(6n) {
    //     margin-right: 0;
    //   }
    }
    
  }

  &__histogram {
    margin-top: 5px;
    padding: 15px 10px;
    background: #fff;

    &-label {
      font-size: 15px;
      line-height: 26px;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tag {
        font-size: 10px;

        &::before {
          background: @graOrange;
          display: inline-block;
          width: 19px;
          height: 9px;
          content: ' ';
          margin-right: 5px;
        }
      }
    }
  }

  &__view {
    padding: 15px 10px;
    margin-top: 5px;
    background: #fff;
    height: 100%;
    // height: 500px;
    width: 50%;
    .ware-detail {
      overflow-x: hidden;

      .dis-ctn {
        img {
          width: 100%;
        }
      }

      > img {
        width: 100%;
        // height: 350px;
      }

      > video {
        display: block;
        width: 340px;
        height: 200px;
        margin: 0 auto;
      }

      > iframe {
        width: 100%;
        height: 350px;
      }

      > .audio {
        display: block;
        width: 340px;
        height: 200px;
        margin: 0 auto;
      }

      .cover {
        background: #f3d233;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .desc-top {
        font-size: 10px;
        color: #666;
      }

      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;
        justify-content: flex-start;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 6px;
          display: flex;
          align-items: center;
        }
      }
    }

    &-tab {
      display: flex;
      margin-bottom: 16px;
      position: relative;

      .icon-tip {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      > div {
        background: #f5f6fa;
        border-radius: 11px;
        font-size: 14px;
        color: #333;
        line-height: 26px;
        text-align: center;
        padding: 0 9px;
        margin-right: 8px;

        &.active {
          background: @graOrange;
          color: #fff;
        }
      }
    }

    &-label {
      position: relative;
      font-size: 26px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1b1b1b;
      line-height: 37px;
      padding-left: 10px;
      &::after {
        width: 6px;
        height: 30px;
        background: #22ad7e;
        content: ' ';
        display: block;
        height: 18px;
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &-subject {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      &-item {
        border: 1px solid #dddddd;
        color: #333;
        font-size: 10px;
        margin-bottom: 5px;
        // flex: 0 0 80px;
        margin-right: 8px;
        width: 360px;
        height: 137px;
        padding: 0 3%;
        &:nth-child(4n) {
          margin-right: 0;
        }

        .status {
          color: #fff;
          // background: @graOrange;

          background: #22ad7e;
          display: flex;
          height: 18px;
          align-items: center;
          justify-content: center;
        }
      }
    }

    &-desc {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-cover {
        flex: 0 0 69px;
        height: 74px;
        border-radius: 5px;
        background: #b9fff8;
        margin-right: 4px;
      }

      &-content {
        .desc {
          i {
            margin-right: 3px;
          }
        }
      }
    }
  }

  &__footer {
    flex: 0 0 55px;
    background: #fff;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      border-radius: 22px;
      color: #fff;
      font-size: 18px;
      flex: 1;

      &:nth-child(2n) {
        margin-left: 23px;
      }
    }
  }

  .stat-dialog-wrap {
    display: flex;
    flex-direction: column;

    &__header {
      font-size: 18px;
      color: #010101;
      flex: 0 0 40px;
      display: flex;
      align-items: center;
      position: relative;

      &-title {
        flex: 1;
        text-align: center;
      }

      .icon-close {
        position: absolute;
        font-size: 22px;
        color: @blue;
        right: 10px;
      }
    }

    &__body {
      max-height: 240px;
      overflow-y: auto;
      font-size: 14px;
      color: #666;
      padding: 10px 20px;
      display: flex;
      flex-wrap: wrap;

      div {
        flex: 0 0 66px;
        padding: 4px;
        text-align: center;
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 0 20px;
      display: flex;
      align-items: center;

      .dialog-btn {
        border-radius: 22px;
        color: #fff;
        font-size: 18px;
        flex: 1;
      }
    }
  }

  .disabled {
    background: #f5f6fa;
    color: #ccc;
    border: 1px solid #ccc;
  }
  .tip-wrap {
    width: 280px;
  }
}
// new----
.statistic-wrap-content {
  width: 100%;
  height: calc(100vh - 130px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .statistic-wrap__pie-chart {
    width: 45%;
    height: 97%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .exam_analyse_wrap_pie{
      height: 50%;
    }
    
    .myChart1-bottom {
      width: 45%;
      display: flex;
      justify-content: space-around;
      margin: 0 auto;

      .theCompletionRate {
        display: flex;
        align-items: center;

        .theCompletionRate-div {
          width: 10px;
          height: 10px;

          border-radius: 50px;
        }

        .text {
          text-indent: 10px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
        }
      }
    }
    .details-student1{
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: space-between;
      overflow: auto;
      padding-top: 20px;
      box-sizing: border-box;
      .statistic-tab {
        width: 100px;
        height: 36px;
        background: #f8f8f8;
        margin-bottom: 25px;
        border-radius: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .default-box{
        width: 100px;
        height: 0;
      }
       
    }
    .details-student1::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 6px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
        border-radius: 5px;
    }

    .details-student1::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 5px;
        background: #DDDDDD;
    }

    .details-student1::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        border-radius: 6;
    }
    &:after {
      content: '';
      display: inline-block;
      width: 1px;
      height: 90%;
      border-right: 1px solid #e6e6e6;
      position: absolute;
      right: -40px;
    }
  }
    .filterBox{
      height: 50%;
      .details-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .details-svg {
            width: 448px;
            height: 240px;
        }

        .details-text {
            font-size: 24px;
            font-weight: 400;
            color: #666666;
        }
      }
    }

  }

@{deep} .van-tabs--card > .van-tabs__wrap {
  height: 40px;
  margin-top: 70px;
}
@{deep} .van-tabs__nav--card {
  height: 100%;
}
@{deep} .van-tabs__nav--card .van-tab {
  height: 40px;
  line-height: 40px;
  font-size: 22px;
}
@{deep} .van-tabs{
  height: 100%;
}
@{deep} .van-tabs__content{
  height: 90%;
}

.van-tab__pane {
  height: 97%;
}

.statistic-wrap__view{
  overflow: auto;
  height: 97%;
  box-sizing: border-box;
  width: 50%;
  .statistic-wrap__view-Question{
    display: flex;
    justify-content: space-between;
    .objectiveQuestion{
      // width: 60%;
    }
    .objective-Percentage{
      width: 40%;
      display: flex;
      justify-content: space-between;
      .Percentage{
        display: flex;
        align-items: center;
        
        .color{
          display: flex;
          width: 14px;
          height: 14px;
          border-radius: 20px;
          
        }
        .text{
          font-size: 20px;
          color: #8C8C8C;
          text-indent: 10px;
        }
      }
      
    }
  }
  .details-student1{
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: space-between;
      overflow: auto;
      padding-top: 20px;
      box-sizing: border-box;
      .statistic-tab {
        width: 100px;
        height: 36px;
        background: #f8f8f8;
        margin-bottom: 25px;
        border-radius: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .default-box{
        width: 100px;
        height: 0;
      }
    }
}
.statistic-wrap__view::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    border-radius: 5px;
}

.statistic-wrap__view::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    background: #DDDDDD;
}

.statistic-wrap__view::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 6;
}
.subjectiveQuestions{
  margin-top: 76px;
  
}
.subjectiveQuestions-div{
  margin-top: 49px;
  justify-content: space-around;
  .butster{
    border-radius: 20px;
  }
  .default-box{
    width: 360px;
    height: 0;
  }
}
.statistic-wrap__view-subject-item-title {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1b1b1b;
  line-height: 30px;
}
.statistic-wrap__view-subject-item-content {
  display: flex;
  justify-content: space-between;
  width: 78%;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #626464;
  line-height: 48px;
}
@{deep} .van-progress__pivot {
  display: none;
}
</style>
