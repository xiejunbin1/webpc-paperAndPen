<template>
  <section class="board-detail">
    <h2>{{ info.name }}</h2>
    <div class="board-detail__body">
      <video v-if="type === 'mp4'" webkit-playsinline playsinline x5-playsinline="" poster="../../../assets/img/video-poster.png" @click="goVideoPage(info.dataUrl)" :src="info.dataUrl"></video>
      <img class="audio" v-else-if="type === 'mp3' && info.dataUrl" src="https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/picture/201910/icon-mp3.png" alt="" @click="goVideoPage(info.dataUrl, 1)" />
      <img v-else-if="type === 'img' && info.dataUrl" :src="info.dataUrl" />
      <iframe v-else-if="(type === 'office' || type === 'pdf') && info.dataUrl && !vanLoading" :src="info.dataUrl"></iframe>
    </div>
  </section>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import listItem from '../../../components/list-item';
import { pubApi } from '@/api/parent-GFY';
import PDF from '../../../components/pdfJS';
export default {
  name: 'boardDetail',
  components: { listItem, PDF },
  data() {
    return {
      info: JSON.parse(localStorage.materialDetail),
      type: '',
      iconType: '',
    };
  },
  computed: {
    ...mapState({
      vanLoading: (state) => state.setting.vanLoading,
    }),
  },
  methods: {
    goBack() {
      this.common.goBack(this);
    },
    goVideoPage(url, isAudeo) {
      if (!url) return;
      this.$router.push({ name: 'videoPage', query: { src: url, title: this.info.name, isMp3: isAudeo } });
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
    checkUrlPermission() {
      // 课件鉴权
      let permissionParams = {
        interUser: 'runLfb',
        interPwd: '25d55ad283aa400af464c76d713c07ad',
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        belongSchoolId: this.$store.getters.schoolId,
        url: this.info.dataUrl,
        sysTypeCd: 'S03',
      };
      this.$store.commit('setVanLoading', true);
      pubApi.checkUrlPermission({ requestJson: JSON.stringify(permissionParams) }).then((respone) => {
        this.$store.commit('setVanLoading', false);
        if (respone.flag) {
          if (this.type == 'office' || this.type == 'pdf') {
            if (this.info.dataUrl.indexOf('pubquanlang') > -1) {
              this.info.dataUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl;
            } else {
              this.info.dataUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl;
            }
          } else {
            this.info.dataUrl = respone.data[0].accessUrl;
          }
        } else {
          this.info.dataUrl = '';
        }
      });
    },
  },
  created() {
    if (this.info.resourceType === 'R01' || this.$route.query.type === 'board') {
      this.type = this.getUrlSuffix(this.info.dataUrl);
      // this.iconType = this.handleIcon(this.info.dataUrl)
      this.checkUrlPermission();
    }
  },
};
</script>

<style lang="less" scoped>
.board-detail {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  &__body {
    width: 100%;
    height: 100%;
    padding: 10px;
    flex: 1;
    // overflow-y: auto;
    width: 80%;
    text-align: center;
    margin: 0 auto;
    > img,
    > iframe {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    > audio {
      height: 95px;
      width: 100%;
    }
    > video {
      width: 60%;
    }
    > .audio {
      height: 210px;
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
  h2 {
    text-align: center;
  }
}
</style>
