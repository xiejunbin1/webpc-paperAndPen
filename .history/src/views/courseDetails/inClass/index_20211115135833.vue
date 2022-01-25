<template>
  <section class="in-class-wrap">
    <div class="in-class-wrap__body">
      <div v-if="!courseList.length && !firstFlag" class="empty-page">
        <img src="../../../assets/img/preview/task_null.png" alt />
        <div class="grey9 fs12">当前没有课程,快去新建课程吧！</div>
      </div>
      <div class="in-class-wrap_footer_tab">
        <van-tabs class="in-class-wrap_tabs" title-active-color="#22AD7E" title-inactive-color="#666" color="#22AD7E" @click="goto" v-model="activeName">
          <van-tab title="讲义" name="lectureList"></van-tab>
          <van-tab title="堂测" name="classStatList"></van-tab>
        </van-tabs>
      </div>
      <router-view :key="key"></router-view>
    </div>
  </section>
</template>

<script>
import { getClassTeachCourseInfo } from '@/api/index';

export default {
  name: 'index',
  data() {
    return {
      activeName: this.$route.name,
      dropdownPage: 0,
      dropdownListLoading: false,
      dropdownFinish: false,
      dropdownRefLoading: false,
      dropdownTotal: 0,
      courseList: [],
      courseName: '',
      tchCourseId: '',
      sysCourseId: '',
      relationCourseId: '',
      subjectType: '',
      classId: '',
      tchClassCourseInfo: [],
      index: 0, //选中的课程index
      classGrade: '',
      termType: '',
      firstFlag: true,
      resourceCount: [
        { resourceType: 'R12_C01', resourceCount: 0 },
        { resourceType: 'R12_C02', resourceCount: 0 },
        { resourceType: 'R12_C03', resourceCount: 0 },
      ],
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
  // sockets: {
  //   connect() {
  //     this.id = this.$socket.id;

  //     this.$socket.emit('监听频道', 'loginId'); //监听connect事件
  //   },

  //   message(data) {
  //     //监听message事件，方法是后台定义和提供的

  //     console.log(data);
  //   },
  // },

  created() {
    //发送信息给服务端
    // this.$socket.emit('test', '发送的信息');
    //接收服务端的信息
    // this.sockets.subscribe('relogin', (data) => {
    //   console.log(data.unsuccessful);
    // });
    // this.$store.commit('setVanLoading', true);
    // this.dropdownOnLoad();
    // this.goto('lectureList');
  },
  activated() {
    if (this.tchCourseId) {
      this.getCount(this.tchCourseId);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs['dropdown'] && this.$refs['dropdown'].showDrop) {
      this.$refs['dropdown'].showDrop = false;
      this.$refs['dropdown'].close();
      next(false);
    } else {
      next();
    }
  },

  methods: {
    handleCount(resourceType) {
      return this.resourceCount.find((v) => v.resourceType === resourceType) ? this.resourceCount.find((v) => v.resourceType === resourceType).resourceCount : 0;
    },
    getCount(tchCourseIdSelect) {
      this.$store.commit('setVanLoading', true);
      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        // "belongSchoolId": this.$store.getters.schoolId,
        operateRoleType: 'A02',
        accountNo: this.$store.getters.getUserInfo.accountNo,
        subjectType: localStorage.getItem('currentSubjectType'),
        classGrade: '',
        termType: '',
        pageSize: '20',
        courseType: 'C01',
        classId: '',
        currentPage: 1,
        tchCourseIdSelect,
      };
      let params = {
        requestJson: JSON.stringify(obj),
      };
      getClassTeachCourseInfo(params).then((res) => {
        this.$store.commit('setVanLoading', false);
        if (res.flag) {
          this.resourceCount = res.data[0].resourceCount;
          this.courseList[this.index].resourceCount = this.resourceCount;
        }
      });
    },
    goto(name, event) {
      this.activeName = name;
      if (name === 'classStatSelectList') {
        
      }
     

      const { tchCourseId, sysCourseId, relationCourseId, subjectType, classId, tchClassCourseInfo, classGrade, termType, courseName } = JSON.parse(localStorage.getItem('tchCourseInfo'));
      console.log("localStorage.getItem('tchCourseInfo')----", localStorage.getItem('tchCourseInfo'));
      this.$router.push({
        name: name,
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
    async changeCourse(type) {
      try {
        MobclickAgent.onEvent('clickInClassToggleClass');
      } catch (e) {
        console.log(e);
      }
      if (type) {
        //下一题
        if (this.index >= this.courseList.length - 1) {
          // 当前课程已是列表的最后一个
          if (!this.dropdownFinish) {
            //还能加载下一页
            await this.dropdownOnLoad();
            this.index++;
            this.courseName = this.courseList[this.index].tchCourseInfo.courseName;
            this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId;
            this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId;
            this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId;
            this.resourceCount = this.courseList[this.index].resourceCount;
          } else {
            //最后一页
            this.$toast('没有下一课了');
          }
        } else {
          this.index++;
          this.courseName = this.courseList[this.index].tchCourseInfo.courseName;
          this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId;
          this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId;
          this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId;
          this.resourceCount = this.courseList[this.index].resourceCount;
        }
      } else {
        //上一题
        if (this.index <= 0) {
          // 当前课程已是列表的第一个
          this.$toast('没有上一课了');
        } else {
          this.index--;
          this.courseName = this.courseList[this.index].tchCourseInfo.courseName;
          this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId;
          this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId;
          this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId;
          this.resourceCount = this.courseList[this.index].resourceCount;
        }
      }
    },
    selectCourse(tchCourseInfo, index, resourceCount) {
      this.index = index;
      this.resourceCount = resourceCount;
      this.courseName = tchCourseInfo.courseName;
      this.tchCourseId = tchCourseInfo.tchCourseId;
      this.sysCourseId = tchCourseInfo.sysCourseId;
      this.relationCourseId = tchCourseInfo.relationCourseId;
      this.subjectType = tchCourseInfo.subjectType;
      this.classGrade = tchCourseInfo.classGrade;
      this.termType = tchCourseInfo.termType;
      this.classId = tchCourseInfo.tchClassCourseInfo[0].classId;
      this.tchClassCourseInfo = tchCourseInfo.tchClassCourseInfo;
    },
    async dropdownOnLoad() {
      this.dropdownPage++;
      if (this.dropdownPage > this.dropdownTotal && this.dropdownPage > 1) {
        return;
      }
      await this.getClassTeachCourseInfo();
    },
    async dropdownRefresh() {
      this.dropdownListLoading = false;
      this.dropdownFinish = false;
      this.dropdownPage = 1;
      await this.getClassTeachCourseInfo();
      this.$toast('刷新成功');
    },
    async getClassTeachCourseInfo(tchCourseIdSelect) {
      const page = this.dropdownPage;

      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        // "belongSchoolId": this.$store.getters.schoolId,
        operateRoleType: 'A02',
        accountNo: this.$store.getters.getUserInfo.accountNo,
        subjectType: localStorage.getItem('currentSubjectType'),
        classGrade: '',
        termType: '',
        pageSize: '20',
        courseType: 'C01',
        classId: '',
        currentPage: page,
        tchCourseIdSelect,
      };
      let params = {
        requestJson: JSON.stringify(obj),
      };
      await getClassTeachCourseInfo(params)
        .then((res) => {
          console.log(res, '课程类表');
          this.$store.commit('setVanLoading', false);
          this.dropdownListLoading = false;
          this.dropdownRefLoading = false;
          this.dropdownTotal = res.total;
          if (res.flag && res.data && res.data[0]) {
            this.courseList = page === 1 ? res.data : this.courseList.concat(res.data);
            if (!this.courseName) {
              //首次取第一条课程的信息
              this.resourceCount = this.courseList[0].resourceCount;
              this.courseName = this.courseList[0].tchCourseInfo.courseName;
              this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId;
              this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId;
              this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId;
              this.subjectType = this.courseList[0].tchCourseInfo.subjectType;
              this.classGrade = this.courseList[0].tchCourseInfo.classGrade;
              this.termType = this.courseList[0].tchCourseInfo.termType;
              this.classId = this.courseList[0].tchCourseInfo.tchClassCourseInfo[0].classId;
              this.tchClassCourseInfo = this.courseList[0].tchCourseInfo.tchClassCourseInfo;
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
  },
};
</script>

<style lang="less" scoped>
.in-class-wrap {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  &__body {
    // margin-top: 10px;
    flex: 1;
    // overflow-y: auto;
    height: 100%;
    .null-tips {
      margin-top: 50px;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }
  }
}
.in-class-wrap_footer_tab {
  width: 100%;
  height: 60px;

  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0%;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
}
.in-class-wrap_tabs {
  width: 20%;
  font-size: 24px;
}
</style>
<style lang="less">
.in-class-wrap_tabs {
  .van-tab {
    line-height: 60px;
    font-size: 24px;
    padding-bottom: 12px;
  }
}
</style>