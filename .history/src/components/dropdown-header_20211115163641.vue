<template>
  <div class="dropdown-header van-hairline--bottom">
    <slot name="left"></slot>
    <!-- <van-dropdown-menu active-color="none" class="dropdown-btn">
      <van-dropdown-item @open="open" @close="close" ref="dropdown" :title="courseName" :value="tchCourseId"> -->
    <div style="flex: 1; overflow-y: auto; height: calc(100vh - 110px)" class="pd10">
      <van-pull-refresh v-model="refLoad" @refresh="onRefresh">
        <van-list v-model="listLoad" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="80">
          <!-- <swiper class="swiper-container" ref="mySwiper" :options="swiperOptions">
            <swiper-slide class="swiper-slide" :style="swiperStyle"> -->
          <div v-for="(item, index) in list" :key="index" class="list-wrap" :class="{ active: item.tchCourseInfo.tchCourseId == tchCourseId }">
            <img src="../assets/img/course/course.png" alt="" class="course-img" />
            <list-item
              @clickTo="selectCourse(item.tchCourseInfo, index, item.resourceCount)"
              :fold="item.fold"
              class="mgt10"
              style="background: #fff"
              :itemTitle="item.tchCourseInfo.courseName"
              :class-info-list="item.tchCourseInfo.tchClassCourseInfo"
            >
              <!-- <div v-if="item.tchCourseInfo.tchClassCourseInfo.length > 2" @click="$set(item, 'fold', !item.fold)" slot="btn" class="fs10" style="text-align: right">
                <i class="iconGFY icon-ellipsis"></i>
              </div> -->
              <!-- <slot name="course-img"></slot> -->

              <div slot="desc" class="dropdown-header-item-type" :key="idx" v-for="(value, key, idx) in item.resourceCount">
                <template v-if="value.resourceType == 'R01' || value.resourceType == 'R02' || value.resourceType == 'R11'">
                  <p v-if="value.resourceType == 'R01'"><i class="iconGFY icon_courseware"></i>课件{{ value.resourceCount }}</p>
                  <p v-else-if="value.resourceType == 'R02'"><i class="iconGFY icon_paper"></i>试卷{{ value.resourceCount }}</p>
                  <!-- <p v-else-if="value.resourceType == 'R11'"><i class="iconGFY icon_task"></i>任务{{ value.resourceCount }}</p> -->
                </template>
                <!-- <p><van-icon name="info" />{{ item.resourceCount }}</p>
                <p><van-icon name="info" />{{ item.resourceCount }}</p> -->
              </div>
              <div slot="icon-go" class="dropdown-header-item-type-icon">
                <!-- <van-icon name="play-circle-o" color="#16aab7" size="40px" /> -->
                <i class="iconGFY icon_course_back"></i>
              </div>
            </list-item>
          </div>
          <!-- </swiper-slide>
          </swiper> -->
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- <div class="folder-btn" @click="$refs['dropdown'].toggle(false)"><i class="iconGFY icon-fold"></i></div> -->
    <!-- </van-dropdown-item>
    </van-dropdown-menu> -->
    <slot name="right"></slot>
  </div>
</template>

<script>
import '@vant/touch-emulator';

import listItem from './list-item';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
// import 'swiper/swiper.min.css';
export default {
  name: 'dropdown-header',
  props: ['list', 'courseName', 'tchCourseId', 'refLoading', 'listLoading', 'finished'],
  components: {
    listItem,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      courseList: this.list,
      // refLoading: false,
      // listLoading: false,
      // finished: false,
      showDrop: false,
      swiperStyle: {},
      swiperOptions: {
        slidesPerView: 'auto',
        direction: 'vertical',
        freeMode: true, // 随意拖动位置
        mousewheel: true,
      },
      stepActive: 6,
    };
  },
  computed: {
    refLoad: {
      get() {
        return this.refLoading;
      },
      set(v) {
        this.$emit('update:refLoading', v);
      },
    },
    listLoad: {
      get() {
        return this.listLoading;
      },
      set(v) {
        this.$emit('update:listLoading', v);
      },
    },
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  watch: {
    stepActive: {
      handler(newVal, oldVal) {
        console.log(this.stepActive);
        if (this.stepActive) {
          this.swiperStyle = 'height:' + (500 * this.stepActive) / 16 + 'rem'; // 动态设置宽度
        }
      },
      immediate: false,
    },
  },
  methods: {
    open() {
      this.showDrop = true;
    },
    close() {
      this.$refs['dropdown'].toggle(false);
      this.showDrop = false;
    },
    selectCourse(tchCourseInfo, index, resourceCount) {
      this.$emit('selectCourse', tchCourseInfo, index, resourceCount);
      // this.$refs['dropdown'].toggle(false);
      this.showDrop = false;
    },
    onLoad() {
      this.$emit('onLoad');
    },
    onRefresh() {
      this.$emit('refresh');
    },
    chooseCourse(obj) {
      console.log({ 选择课程: obj });
      console.log(obj.tchCourseInfo.tchCourseId);
      this.$parent.getCourseTaskList(obj.tchCourseInfo.courseName, obj.tchCourseInfo.tchCourseId);
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.dropdown-header {
  flex: 0 0 55px;
  // padding: 8px 9px;
  color: #999;
  font-size: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: #fff;
  .btn-left {
    background: #e0fffc;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 27px;
    border-radius: 13px;
    margin-right: 10px;
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
    @{deep} .van-overlay {
      top: 2px;
    }
    @{deep} .van-dropdown-menu__title {
      text-align: center;
      padding-right: 10px;
      width: 170px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #16aab7;
      &::after {
        right: 6px;
        top: 8px;
        content: '';
      }
      &--down::after {
        top: 11px;
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
    .active {
      border: 1px solid #39f0dd;
    }
    .folder-btn {
      width: 100%;
      flex: 0 0 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  // ----新增
  // .van-list {
  //   display: flex;
  //   flex-wrap: wrap;
  // }
  .mgt10 {
    width: 100%;
  }
  .list-wrap {
    width: 100%;
    // border: 1px solid #ccc;
    // margin: 0.5% auto;
    display: flex;
    align-items: center;
    height: 200px;
    font-size: 20px;
    background: #fff;
    // padding-left: 20px;
    padding: 0 10%;
    margin-bottom: 30px;
  }
  .dropdown-header-item-type-icon {
    position: absolute;
    right: 40px;
    top: 50%;
    z-index: 50;
    transform: translateY(-50%);
  }
}
.course-img {
  width: 140px;
  height: 140px;
}
.pd10 {
  padding: 0;
}
</style>
<style lang="less">
.dropdown-header {
  // .van-list__error-text,
  // .van-list__finished-text,
  // .van-list__loading {
  //   width: 100% !important;
  //   flex-grow: 4 !important;
  // }
  .list-item-wrap .title {
    font-size: 26px;
    line-height: 60px;
    margin-bottom: 30px;
    flex: 1;
  }
  .aic {
    padding-left: 42px;
  }
  .dropdown-header-item-type {
    display: flex;
    align-items: center;
    p {
      display: flex;
      align-items: center;

      font-size: 28px;
      margin-right: 26px;
      i {
        margin-right: 8px;
      }
    }
  }
}
</style>