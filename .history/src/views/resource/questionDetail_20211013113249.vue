<template>
  <section class="question-detail">
    <!-- <van-nav-bar :title="$route.query.title" @click-left="goBack" left-arrow> </van-nav-bar> -->
    
  </section>
</template>

<script>
import { getCourseTaskDetail } from '@/api/index';
import { ImagePreview } from 'vant';

export default {
  name: 'questionDetail',
  data() {
    return {
      info: {},
      analyseShow: false,
    };
  },
  methods: {
    goBack() {
      this.common.goBack(this);
    },
    previewImg($event) {
      if ($event.target.nodeName == 'IMG') {
        console.log($event.target.src);
        ImagePreview({
          images: [$event.target.src],
          className: 'img-preview-init',
          // startPosition: 1,
          onClose() {
            // do something
            console.log('close');
          },
        });
      }
    },
    getCourseTaskDetail() {
      this.$store.commit('setVanLoading', true);
      let obj = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.schoolId,
        operateRoleType: 'A02',
        tchCourseId: this.$route.query.tchCourseId,
        accountNo: this.$store.getters.getUserInfo.accountNo,
        taskId: this.$route.query.taskId,
      };
      let params = {
        requestJson: JSON.stringify(obj),
      };
      getCourseTaskDetail(params).then((res) => {
        this.$store.commit('setVanLoading', false);
        if (res.flag) {
          this.info = res.data[0].examQuestionInfo;
        } else {
          this.$toast(res.msg);
        }
      });
    },
  },
  created() {
    this.getCourseTaskDetail();
  },
};
</script>

<style lang="less" scoped>
.question-detail {
  display: flex;
  flex-direction: column;
  padding: 1%;
  &__body {
    flex: 1;
    overflow-y: auto;

    &__qst-wrap {
      background: #fff;
      padding: 10px;
      .init-wrap {
        margin: 0 -12px;
        padding: 0 12px;
        position: relative;

        .icon-auto {
          position: absolute;
          right: 0;
          top: 0;
        }
      }

      &__score {
        line-height: 40px;
        text-align: right;
        padding: 0 10px;
        span {
          color: #f00;
          font-size: 15px;
        }
      }
      &__btn {
        font-size: 12px;
        /*width: 63px;*/
        padding: 0 5px;
        line-height: 22px;
        text-align: center;
        border-radius: 10px;
        border: 1px solid #999;
        &.active {
          color: @blue;
          border: 1px solid @blue;
        }
      }
      &__analyse {
        padding: 8px 12px;
      }
    }
  }
}

.question-detail__body__qst-wrap {
  background: #f9f8f4;
  margin-bottom: 10px;
  font-size: 28px;
  line-height: 56px;
  color: #1b1b1b;
  padding: 30px;
}
.question-item-wrap__analyse {
  font-size: 22px;
  color: #606060;
  line-height: 38px;
  background: #f1efe8;
  padding: 40px;
  margin-top: 10px;
}
.icon-group {
  font-size: 24px;
  color: #626464;
  line-height: 33px;
  margin-right: 22px;
}
.btn-item {
  // flex: 0 0 63px;
  width: 120px;
  line-height: 33px;
  text-align: center;
  border-radius: 6px;
  font-size: 24px;
  border: 1px solid #999;
  margin-right: 11px;

  &.active {
    color: #22ad7e;
    border: 1px solid #22ad7e;
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
