<template>
<div class="spoken">
    <div class="spoken-list" v-for="(value, index ) in spokenList" :key="index">
        <div class="name">{{ value.sentenceContent }}</div>
        <div class="explanation">{{ value.referenceExplain }}</div>
        <div class="voicebroadcast" @click="playClick(index)">
            <svg-icon class="voice-background" icon-class="icon-voice-background"></svg-icon>
            <div class="wifi-symbol">
                <div :class="{wifiCircle: true, first: true,}"></div>
                <div :class="{wifiCircle: true, second: true, second1: indexFitex == index}"></div>
                <div :class="{wifiCircle: true, third: true, third1: indexFitex == index}"></div>
            </div>
            <div class="timeClass">{{ formatSecond(value.duration).minutes }}:{{ formatSecond(value.duration).seconds }}</div>
            <audio id="mp3Btn" ref="audio" @canplay="getDuration" @ended="endeds(index)" @timeupdate="updata(index)">
                <source :src="value.referenceAnswer" type="audio/mpeg" />
            </audio>
        </div>
        <div class="typesOf">
            <div>
                <div>类型：</div>
                <div v-if="value.spokenType == 'T02'">英语句子</div>
                <div v-if="value.spokenType == 'T01'">英语单词</div>
            </div>
            <div>
                <div>难度：</div>
                <div v-if="value.spokenDegree == 'D01'">简单</div>
                <div v-if="value.spokenDegree == 'D02'">中等</div>
                <div v-if="value.spokenDegree == 'D03'">困难</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getSpokenResourceSingle
} from '@/api/index'
export default {
    data() {
        return {
            duration: '',
            musicUrl: 'http://oss.gaofenyun.com/video/201909/resourceCenter_20190919163654_7c4nT.mp3?Expires=1623319894&OSSAccessKeyId=STS.NU84vcGR3vrJx59YTTEVCRazi&Signature=IzW%2BY4swJGaTanKcRiMp5AYV9eU%3D&security-token=CAISmAJ1q6Ft5B2yfSjIr5aNf8zXqo0SwbChehOIvVQBSdlvvaTRizz2IHBNe3hoAOEWsPoznW1R6vcZlqd8QphLSErLfNZ2q8wPqFsC3SEATIvng4YfgbiJREKhaXeirvKwDsz9SNTCAIDPD3nPii50x5bjaDymRCbLGJaViJlhHLt1Mw6jdmgEfpQ0QDFvs8gHL3DcGO%2BwOxrx%2BArqAVFvpxB3hBEYi8G2ydbO7QHF3h%2BoiL1Xhfyoe8T%2FPpk9YMkvA4%2FqgrwtTMebjn4MsSot3bxtkalJ9Q3AutygGFRL632ESbGEq4I%2BdFYoNvZkR%2FcZ9aStzucLs%2BjShpnxzA1WIeZWXiLQSYat2sLYH%2FmzMdI0ZV0X%2BvMZNDzlGoABJ08pKwVG8ThHLTR08H9EqYmhGTW%2BtAB2GdRuuWpBGhCWD15O4Q%2B2skkNL351bu16oRqFYHqs3Rc8ts2wvrsivKmomiAnPqmzDjM73zbkLhbu2sbFckkzrgFr3ltIreH7bsYpuqvZ5Sy8G7nAoNt8zTjB9DL32rNkbi5XCCMzGH0%3D',
            spokenList: [],
            indexFitex: null,
        }
    },
    methods: {
        getSpokenResourceSingle() {
            let dataFont = JSON.parse(localStorage.getItem('stat'))
            let fonmData = {
                "spokenId": dataFont.resourceId,
                "belongSchoolId": this.$store.getters.schoolId,
                "courseId": dataFont.sysCourseId
            }
            let params = {
                requestJson: JSON.stringify(fonmData)
            }
            getSpokenResourceSingle(params).then(res => {
                if (res.flag) {
                    console.log(res)
                    this.spokenList = res.data[0].spokenSplitSentenceList
                } else {
                    this.$toast(res.msg)
                }
            })
            console.log(dataFont)

        },
        // 处理时间
        formatSecond(second) {
            console.log(second)
            const minutes = Math.floor(((second % 86400) % 3600) / 60);
            const seconds = Math.floor(((second % 86400) % 3600) % 60);
            let forminutes = minutes > 0 ? (minutes >= 10 ? minutes : `0${minutes}`) : '00'
            let forseconds = seconds > 0 ? (seconds >= 10 ? seconds : `0${seconds}`) : '00'
            const forMatDate = {
                minutes: forminutes,
                seconds: forseconds
            };
            return forMatDate;
        },
        // 播放暂停
        playClick(index) {
            console.log(index)
            if (this.$refs.audio[index].paused) { //如果当前是暂停状态
                this.$refs.audio[index].play(); //播放
                this.indexFitex = index
                return;
            } else { //当前是播放状态
                this.$refs.audio[index].pause(); //暂停
                this.indexFitex = null
            }
        },
        // 在canplay（浏览器可以开始播放该音视频）钩子函数回调中访问duration属性可获得（注：在dom挂载完直接获取duration会返回NaN）
        getDuration() {
            let spokenList = JSON.parse(JSON.stringify(this.spokenList))
            spokenList.forEach((value, index) => {
                console.log(Math.round(this.$refs.audio[index].duration))
                value.duration = Math.round(this.$refs.audio[index].duration)
            })
            this.spokenList = spokenList

        },
        // 播放结束
        endeds(index) {
            this.duration = this.$refs.audio[index].duration
            this.indexFitex = null
        },
        // 监听播放时长
        updata(index) {
            this.spokenList[index].duration = this.$refs.audio[index].currentTime
        }

    },
    mounted() {
        this.getSpokenResourceSingle()
    }
}
</script>

<style lang="less" scoped>
.spoken {
    width: 100%;
    height: 100%;
    background: #F8F8F8;
    border-radius: 20px 20px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .spoken-list {
        width: 1585px;
        background: #FFFFFF;
        border-radius: 6px;
        margin-top: 30px;
        padding: 30px 50px;
        box-sizing: border-box;
        position: relative;

        .name {
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 60px;
        }

        .explanation {
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 30px;
            margin-top: 10px;
        }

        .voicebroadcast {
            position: relative;
            display: flex;
            height: 50px;
            align-items: center;
            margin-top: 30px;

            .voice-background {
                position: absolute;
                width: 230px;
                height: 50px;
            }

            .icon-spokens {
                position: absolute;
                z-index: 99;
                width: 30px;
                height: 30px;
                margin-left: 19px;
            }

            .wifi-symbol {
                width: 50px;
                height: 50px;
                box-sizing: border-box;
                position: absolute;
                z-index: 99;
                margin-left: 25px;
                /*必须，否则苹果overflow失效*/
                overflow: hidden;
                transform: rotate(135deg);

            }

            .wifiCircle {
                border: 3px solid #fff;
                border-radius: 50%;
                position: absolute;
            }

            .first {
                width: 5px;
                height: 5px;
                background: #fff;
                top: 45px;
                left: 45px;
            }

            .second {
                width: 20px;
                height: 20px;
                top: 35px;
                left: 35px;
                // animation: fadeInOut 1s infinite 0.2s;
            }

            .third {
                width: 35px;
                height: 35px;
                top: 25px;
                left: 25px;
                // animation: fadeInOut 1s infinite 0.4s;
            }
            .second1 {
                width: 20px;
                height: 20px;
                top: 35px;
                left: 35px;
                animation: fadeInOut 1s infinite 0.2s;
            }
            
            .third1 {
                width: 35px;
                height: 35px;
                top: 25px;
                left: 25px;
                animation: fadeInOut 1s infinite 0.4s;
            }

            @keyframes fadeInOut {
                0% {
                    opacity: 0;
                    /*初始状态 透明度为0*/
                }

                100% {
                    opacity: 1;
                    /*结尾状态 透明度为1*/
                }
            }

            .timeClass {
                position: absolute;
                z-index: 99;
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                text-align: right;
                width: 211px;
            }
        }

        .typesOf {
            position: absolute;
            z-index: 99;
            width: 320px;
            right: 30px;
            bottom: 48px;
            display: flex;
            justify-content: space-between;

            >div {
                display: flex;
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.45);
                line-height: 28px;
            }
        }
    }
}
</style>
