<!--
 * @Author: yhy
 * @Date: 2021-01-27 19:12:10
 * @LastEditTime: 2021-03-09 18:00:58
 * @LastEditors: wgj
 * @Description: 
-->
<template>
  <div class="courseDetails">
    <router-view></router-view>
    <ul class="courseDetails_footer_menu xuanfu" id="moveDiv" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove.prevent="move" @mouseup="end" @touchend="end">
      <li @click="showCourseDetailsFooters">
        <svg-icon :icon-class="showCourseDetailsFooter ? 'icon_caourse_close' : 'icon_caourse_open'" /><span>{{ showCourseDetailsFooter ? '收起' : '展开' }}</span>
      </li>
      <li :class="{ select_li: $route.path.indexOf('inClass') > 0 }" v-show="showCourseDetailsFooter" @click="goRouter('inClass')"><svg-icon icon-class="icon_caourse_class" /><span>课中</span></li>
      <li @click="goRouter('preview')" :class="{ select_li: $route.name == 'preview' }" v-show="showCourseDetailsFooter"><svg-icon icon-class="icon_caourse_task"></svg-icon><span>任务</span></li>
      <li :class="{ select_li: $route.name == 'examList' || $route.name == 'examDetail' }" v-show="showCourseDetailsFooter" @click="goRouter('examList')">
        <svg-icon icon-class="icon_caourse_paper" /><span>试卷</span>
      </li>
      <li @click="goRouter('materialList')" :class="{ select_li: $route.name == 'materialList' || $route.name == 'materialDetail' }" v-show="showCourseDetailsFooter">
        <svg-icon icon-class="icon_caourse_courseware" /><span>课件</span>
      </li>

      <!-- <li @click="goRouter('statistics')" :class="{ select_li: $route.name == 'stratification/statistics' || $route.name == 'stratification/stratification' }" v-show="showCourseDetailsFooter">
        <svg-icon icon-class="icon-temporary" /><span>分层</span>
      </li> -->
      <li @click="goBack"><svg-icon icon-class="icon_caourse_back"></svg-icon><span>返回</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCourseDetailsFooter: true, //展开收起菜单
      flags: false,
      position: { x: 0, y: 0 },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: '',
    };
  },

  components: {},

  computed: {
    key() {
      return this.$route.path;
    },
  },

  mounted() {},

  methods: {
    showCourseDetailsFooters() {
      this.showCourseDetailsFooter = !this.showCourseDetailsFooter;
      if (this.showCourseDetailsFooter == false) {
        moveDiv.style.width = '200px';
      } else {
        moveDiv.style.width = '500px';
      }
    },
    // 实现移动端拖拽
    down() {
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = moveDiv.offsetLeft;
      this.dy = moveDiv.offsetTop;
    },
    
    move() {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        let screWidth = this.showCourseDetailsFooter ? 520 : 220;
        const maxWidth = window.screen.width - screWidth; //屏幕分辨率宽度减去悬浮框宽高
        const maxHeight = window.screen.height - 80;
        // const maxWidth = window.screen.width; //屏幕分辨率宽度减去悬浮框宽高
        // const maxHeight = window.screen.height;
        if (this.xPum < 0) {
          //屏幕x限制
          this.xPum = 0;
        } else if (this.xPum > maxWidth) {
          this.xPum = maxWidth;
        }
        if (this.yPum < 0) {
          //屏幕y限制
          this.yPum = 0;
        } else if (this.yPum > maxHeight) {
          this.yPum = maxHeight;
        }
        moveDiv.style.left = this.xPum + 'px';
        moveDiv.style.top = this.yPum + 'px';
        //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener(
          'touchmove',
          function () {
            event.preventDefault();
          },
          false
        );
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
    },
    goRouter(name) {
      console.log('name', name);
      this.$router.push({ name: name });
      //   const { tchCourseId, sysCourseId, relationCourseId, subjectType, classId, tchClassCourseInfo, classGrade, courseName } = this
      // this.$router.push({ path, query: { tchCourseId, sysCourseId, relationCourseId, subjectType, classId, tchClassCourseInfo, classGrade, courseName , isfEducation:this.isfEducation} })
    },
    goBack() {
      if (this.$route.name == 'lectureList' || this.$route.name == 'preview' || this.$route.name == 'examList' || this.$route.name == 'materialList' || this.$route.name == 'classStatList') {
        this.$router.push({ name: 'course' });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.courseDetails {
  width: 100%;
  padding: 80px 0 0;
  // height: 100%;
  height: calc(100vh - 80px);
  position: relative;
}
.courseDetails_footer_menu {
  width: auto;
  min-width: 200px;
  background: #797979;
  border-radius: 10px;
  opacity: 0.95;
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-items: center;
  position: fixed;
  right: 5%;
  bottom: 10%;
  z-index: 60;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
    height: 80%;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
  }

  svg {
    fill: currentColor;
    font-size: 32px;
  }
  .select_li {
    color: #fdb63f;
  }
}
.xuanfu {
  // height: 4.5rem;
  // width: 4.5rem;
  width: 500px;
  // width: auto;
  height: 80px;
  /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
  z-index: 999;
  position: fixed;
  // top: 4.2rem;
  // right: 3.2rem;
  // border-radius: 0.8rem;
  // background-color: rgba(0, 0, 0, 0.55);
}
</style>