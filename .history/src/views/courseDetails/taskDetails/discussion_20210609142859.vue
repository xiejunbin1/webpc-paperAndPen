<!--
 * @Author: wgj
 * @Date: 2021-02-22 14:22:51
 * @LastEditTime: 2021-02-27 17:34:56
 * @LastEditors: wgj
 * @Description: 
-->
<!--  -->
<template>
  <div class="discussion">
    <div class="ware-detail">
      <svg-icon class="ware-detail-title" icon-class="icon-topic" />
      <div class="ware-detail-conten-title">
        <span v-html="wareDetail.discussInfo.discussName"></span>
      </div>
      <div class="dis-ctn" v-html="wareDetail.discussInfo.discussContent"></div>
    </div>
  </div>
</template>

<script>
import { getCourseTaskDetail } from '@/api/index';
export default {
  data() {
    return {
      wareDetail: { courseware: { srcUrl: '' }, discussInfo: {} }, // 学资源详情
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getCourseTaskDetail();
  },

  methods: {
    async getCourseTaskDetail() {
      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        accountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.getUserInfo.schoolId,
        operateRoleType: 'A02',
        tchCourseId: this.$store.getters.getExamDetailData.tchCourseId,
        taskId: this.$store.getters.getExamDetailData.taskId || this.$store.getters.getExamDetailData.info.taskId,
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
  },
};
</script>
<style lang='less' scoped>
.ware-detail {
  padding: 26px 0 0 60px;
}
.ware-detail-title {
  font-size: 100px;
}
.ware-detail-conten-title {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #1b1b1b;
  line-height: 42px;
  margin-bottom: 20px;
}
.dis-ctn {
  font-size: 26px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 44px;
}
</style>