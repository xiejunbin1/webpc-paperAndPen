<template>
  <van-swipe-cell class="list-item-wrap">
    <div class="pd10 list-item-wrap__ctn">
      <div class="badge">
        <slot name="badge"></slot>
      </div>
      <div class="aic" style="align-items: stretch" @click="$emit('clickTo')">
        <slot name="list-index"></slot>
        <div class="icon-wrap" v-if="$slots.cover">
          <slot name="cover"></slot>
        </div>
        
      </div>
      <div class="content">
        <slot name="btn"></slot>
        <slot name="remark"></slot>
      </div>
    </div>
    
  </van-swipe-cell>
</template>

<script>
export default {
  name: 'list-item',
  props: ['canSlide', 'fold', 'itemTitle', 'taskType', 'testPaperId', 'classInfoList', 'up', 'down', 'top'],
  data() {
    return {
      showDialog: false,
    };
  },

  methods: {
    close() {
      this.showDialog = false;
      this.$dialog.close();
    },
    del() {
      this.showDialog = true;
      this.$emit('clickDel');
      this.$dialog
        .confirm({
          title: '',
          message: '确定删除吗?',
        })
        .then(() => {
          this.showDialog = false;
          this.$emit('del');
        })
        .catch(() => {
          this.showDialog = false;
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.list-item-wrap {
  &__ctn {
    /*height: 136px;*/
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .content {
    margin-top: 15px;
    margin-bottom: -10px;
  }
  .badge {
    position: absolute;
    right: 0;
    top: 0;
  }
  .icon-wrap {
    flex: 0 0 104px;
    height: 68px;
    margin-right: 10px;
  }
  .title {
    i {
      vertical-align: middle;
    }
    // font-size: 14px;
    font-weight: bold;
    color: #333;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 60px;
    // flex: 0 0 20px;
  }

  .time {
    font-size: 10px;
    color: #999;
  }
}
.paper_logo {
  display: flex;
  align-items: center;
  svg {
    font-size: 150px;
  }
}
.list-task-content {
  display: flex;
  flex-direction: column;
  margin-left: 44px;
  width: 100%;
}
</style>
<style lang="less">
.list-item-wrap {
  .btn-group {
    display: flex;
    height: 34px;
    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
      i {
        margin-right: 5px;
        &.fold {
          transform: rotateZ(90deg);
        }
      }
    }
  }
}
</style>
