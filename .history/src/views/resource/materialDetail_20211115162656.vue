<template>
<section class="board-detail">
    <h2>
        {{ info.coursewareName }}
    </h2>
    <div class="board-detail__body">
        <video v-if="type === 'mp4'" controls="controls" controlsList="nodownload" :src="info.srcUrl"></video>
        <audio v-else-if="type === 'mp3' && info.srcUrl" controls="controls" controlsList="nodownload" :src="info.srcUrl"></audio>
        <img @click="previewImg" v-else-if="type === 'img' && info.srcUrl" :src="info.srcUrl" />
        <iframe v-else-if="(type === 'office' || type === 'pdf') && info.srcUrl && !vanLoading" :src="info.srcUrl"></iframe>
    </div>
</section>
</template>

<script>
import {
    mapState
} from 'vuex';
import listItem from '../../components/list-item';
import {
    pubApi
} from '@/api/parent-GFY';
import PDF from '../../components/pdfJS';
import {
    ImagePreview
} from 'vant';

export default {
    name: 'boardDetail',
    components: {
        listItem,
        PDF
    },
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
        previewImg($event) {
            if ($event.target.nodeName == 'IMG') {
                console.log($event.target.src);
                ImagePreview({
                    images: [$event.target.src],
                    // startPosition: 1,
                    className: 'img-preview-init',
                    onClose() {
                        // do something
                        console.log('close');
                    },
                });
            }
        },
        goBack() {
            this.common.goBack(this);
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
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                url: this.info.srcUrl,
                sysTypeCd: 'S03',
            };
            this.$store.commit('setVanLoading', true);
            pubApi.checkUrlPermission({
                requestJson: JSON.stringify(permissionParams)
            }).then((respone) => {
                this.$store.commit('setVanLoading', false);
                if (respone.flag) {
                    if (this.type == 'office' || this.type == 'pdf') {
                        if (this.info.srcUrl.indexOf('pubquanlang') > -1) {
                            this.info.srcUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl;
                        } else {
                            this.info.srcUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl;
                        }
                    } else {
                        this.info.srcUrl = respone.data[0].accessUrl;
                    }
                    // window.location.href = this.info.srcUrl;
                    // setTimeout(() => {
                    //   window.open(
                    //     'http://oss.gaofenyun.com/video/202004/resourceCenter_20200401094101_E8Xhx.mp4?Expires=1614426956&OSSAccessKeyId=STS.NTZCko12u8JsUM7epSj2BEkMN&Signature=j6Qteviz%2BY0SDWx5wVMAw1%2Fnap8%3D&security-token=CAISmAJ1q6Ft5B2yfSjIr5fvCNHb3O1Uj4iYV2uGgXAGZr1uqq7mrDz2IHBNe3hoAOEWsPoznW1R6vcZlqd8QphLSErLfNZ2q8wPqFtR4GcwLYrng4YfgbiJREKhaXeirvKwDsz9SNTCAIDPD3nPii50x5bjaDymRCbLGJaViJlhHLt1Mw6jdmgEfpQ0QDFvs8gHL3DcGO%2BwOxrx%2BArqAVFvpxB3hBEYi8G2ydbO7QHF3h%2BoiL1Xhfyoe8T%2FPpk9YMkvA4%2FqgrwtTMebjn4MsSot3bxtkalJ9Q3AutygGFRL632ESbGEq4I%2BdFYoNvZkR%2FcZ9aStzucLs%2BjShpnxzA1WIeZWXiLQSYat2sLYH%2FmzMdI0ZV0X%2BvMZNDzlGoABSphwfG7OLKSvDj9GIbMNef9gM%2BQAOCRaPNPC6ww3ORWqb215%2BRAYX35sEjzb45pGnggQMoBuMs31%2FnnnKQ8C0JcwvTLzB7r%2Bq8SQ6bqrJ7fFdl8aRJzm8m487u3TFdeS3jt6VqOGMY%2B6bYR0rGhDS5BUeTLfae2EhSTXSWUfBCE%3D'
                    //   );
                    // }, 1000);
                } else {
                    this.info.srcUrl = '';
                }
            });
        },
    },
    created() {
        this.type = this.getUrlSuffix(this.info.srcUrl);
        // this.iconType = this.handleIcon(this.info.srcUrl)
        this.checkUrlPermission();
    },
};
</script>

<style lang="less" scoped>
.board-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    padding: 0 10%;
    width: 100%;
    height: 100%;

    &__body {
        width: 100%;
        height: 100%;
        padding: 10px;
        flex: 1;
        // overflow-y: auto;

        >img,
        >video,
        >iframe {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        >audio {
            height: 95px;
            width: 100%;
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

            >div {
                margin-right: 6px;
                display: flex;
                align-items: center;
            }
        }
    }
}

h2 {
    text-align: center;
}
</style>
