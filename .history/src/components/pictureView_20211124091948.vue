<template>
<div>
    <!-- 检查图片遮罩 -->
    <div class="mask" v-if="maskImg">
        <div class="class_div">
            <img :src="imgURL" alt="" class="imgClass">
            <div class="suspensions">
                <ul>
                    <!-- <li @click="replayClick" v-if="ObjFont.paperPen">
                        <img src="../assets/img/chakan/huifang.png" alt="">
                        <span>回放</span>
                    </li> -->
                    <li @click="enlarge(true)">
                        <img src="../assets/img/chakan/fangda.png" alt="">
                        <span>放大</span>
                    </li>
                    <li @click="enlarge(false)">
                        <img src="../assets/img/chakan/suoxiao.png" alt="">
                        <span>缩小</span>
                    </li>
                    <li @click="spinClick(true)">
                        <img src="../assets/img/chakan/xuanzhuan1.png" alt="">
                        <span>向右旋转</span>
                    </li>
                    <li @click="spinClick(false)">
                        <img src="../assets/img/chakan/xuanzhuan2.png" alt="">
                        <span>向左旋转</span>
                    </li>
                    <li @click="returnClick">
                        <svg-icon icon-class="icon_caourse_back"></svg-icon>
                        <span>返回</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="replayClass" v-if="replayShow">
        <div>
            <canvas id="myCanvas"></canvas>
            <div class="suspensions">
                <ul>
                    <li @click="playbackReturn">
                        <svg-icon icon-class="icon_caourse_back"></svg-icon>
                        <span>返回</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getPaperPen
} from '@/api/index';
import {
    selectedrList
} from '@/utils/index'
import {
    Dialog
} from 'vant';
export default {
    data() {
        return {
            replayShow: false,
            maskImgShow: false,
            pageY: 8191, // 设备像素Y轴最大值
            pageX: 14335, // 设备像素X轴最大值
            port: '', // 通信对象
            width: 640,
            height: 960,
            offsetX: 0.5,
            offsetY: 0.5,
            ratioX: 1,
            ratioY: 1,
            x1: 2,
            y1: 2,
            x2: 2,
            y2: 2,
            res: 2,
            canvas: '',
            context: '',
            isStart: 0,
            _timer: '',
            currents: 0,
            informationShow: false
        }
    },
    props: {
        maskImg: {
            type: Boolean,
            default: false
        },
        imgURL: {
            type: String,
            default: ''
        },
        ObjFont: {
            type: Object,
            default: {
                img: '',
                i: '',
                index: '',
                value: '',
                paperPen: false
            }
        },
        pinglunList: {
            type: Array,
            default: []
        },
        current: {
            type: Number,
            default: 0
        },
        Experience: {
            type: Boolean,
            default: false
        }
    },
    methods: {

        // 放大缩小
        enlarge(value) {
            let img = document.getElementsByClassName("imgClass")[0]
            if (value) {
                img.style.width = img.width * 1.1 + 'px';
                img.style.height = img.height * 1.1 + 'px';
                console.log(img.style.width)
            } else {
                img.style.width = img.width / 1.1 + 'px';
                img.style.height = img.height / 1.1 + 'px';
            }
            console.log(img)
        },

        // 向左向右旋转
        spinClick(value) {
            let img = document.getElementsByClassName("imgClass")[0]
            console.log(this.currents, "this.currents")
            if (value) {
                this.currents = (this.currents + 90) % 360
                img.style.transform = 'rotate(' + this.currents + 'deg)';
            } else {
                this.currents = (this.currents - 90) % 360
                img.style.transform = 'rotate(' + this.currents + 'deg)';
            }
        },
        // 反会
        returnClick() {
            this.$emit('returnClick', this.informationShow)
        },

        getPaperPen(finishId,paperPenType) {
            return new Promise((resolve, reject) => {
                let fomData = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
                    "belongSchoolId": this.$store.getters.getUserInfo.schoolId,
                    "finishId": finishId,
                    "paperPenType": paperPenType,
                    "groupFinishId": null
                }
                let obj = {
                    requestJson: JSON.stringify(fomData)
                }
                getPaperPen(obj).then(res => {
                    console.log(res, "------")
                    if (res.flag) {
                        this.replayShow = true
                        let wz = this.ObjFont.img.indexOf('&')
                        let ref = wz != '-1' ? this.ObjFont.img.substring(0, wz) : this.ObjFont.img
                        console.log(ref, "reff")
                        let ind = 0
                        for (let i in res.data) {
                            if (res.data[i].ppUrl.indexOf(ref) != '-1') {
                                this.informationShow = true
                                resolve(res.data[i])
                                return false
                            }
                            ind++
                        }
                        console.log(ind == res.data.length, "res.data.length")
                        if (ind == res.data.length) {
                            this.$toast('该图片没有回放')
                            this.$emit('returnClick', this.informationShow)
                            reject("失败")
                        }

                    } else {
                        this.$toast(res.msg)
                        this.$emit('returnClick', this.informationShow)
                        reject("失败")
                    }
                })
            })
        },
        // 初始化画布
        async initialization() {
            this.canvas = await document.getElementById('myCanvas');
            this.context = await this.canvas.getContext('2d');
            this.context.translate(this.offsetX, this.offsetY);
            this.initCanvas(24672)

        },
        // 初始化画布
        initCanvas(pid) {
            if (pid == 24672 || pid == 24682) {
                // T8Y ｜｜ T8C
                this.pageY = 21000
                this.pageX = 29700
            }
            if (pid == 20200) {
                this.pageY = 20200
                this.pageX = 14328
            }

            this.height = $(window).height() > this.height ? this.height : $(window).height() - 20;
            this.width = parseInt(this.height * this.pageX / this.pageY);
            if (this.width > $(window).width() * 0.68) {
                this.width = parseInt($(window).width() * 0.68);
                this.height = parseInt(this.width * this.pageY / this.pageX);
            }

            this.ratioX = this.width / this.pageX;
            this.ratioY = this.height / this.pageY;
            $('#myCanvas').attr("width", this.width);
            $('#myCanvas').attr("height", this.height);
        },
        // 回放
        async replayClick() {
            if (this.ObjFont.value) {
                this.replayShow = true
                setTimeout(async () => {
                    this.initialization()
                    console.log(this.pinglunList[this.ObjFont.index])
                    let appraiseId = this.Experience ? this.pinglunList[this.ObjFont.index].appraiseId : this.pinglunList[this.ObjFont.index].answer[this.ObjFont.i].examId
                    let fond = this.Experience ? 'R04' : 'R03'
                    let dataFoms = await this.getPaperPen(appraiseId, fond)
                    if (dataFoms != "失败") {
                        let handwriting = await this.unzip(dataFoms.ppData)
                        // console.log(handwriting,"handwriting--")
                        console.log(handwriting,"handwriting")
                        if(handwriting == '失败') return false
                        if (dataFoms.deviceType == '53') {
                            this.canvas.style.webkitTransform = "rotate(180deg)",
                            this.canvas.style.transform = "rotate(180deg)";
                        }
                        //  this.delayEachArray(0,selectedrList);
                        this.delayEachArray(0, JSON.parse(handwriting));
                    }

                }, 0)

            }
        },
        // 解压
        unzip(b64Data) {
            return new Promise((resolve, reject) => {
                try {
                    var strData = atob(b64Data);
                    // Convert binary string to character-number array
                    var charData = strData.split('').map(function (x) {
                        return x.charCodeAt(0);
                    });
                    // Turn number array into byte-array
                    var binData = new Uint8Array(charData);
                    // // unzip
                    var data = pako.inflate(binData);
                    // Convert gunzipped byteArray back to ascii string:
                    strData = String.fromCharCode.apply(null, new Uint16Array(data));
                    let array = new Uint16Array(data)
                    var res = '';
                    var chunk = 8 * 1024;
                    var i;
                    for (i = 0; i < array.length / chunk; i++) {
                        res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
                    }
                    res += String.fromCharCode.apply(null, array.slice(i * chunk));
                    strData = res
                    resolve(strData)
                } catch (error) {
                    console.log(error,"---------")
                    this.$toast('解压失败，不是正确的文件')
                    this.replayShow = false
                    resolve('失败')
                }

            })
        },
        // 每隔一段时间输出一个值
        delayEachArray(delay, arr, index) {
            if (index == undefined) index = 0;
            this.lineTo(arr[index].x, arr[index].y, arr[index].speed, arr[index].width)
            index++;
            //arr[index].speed可以为delay
            if (index < arr.length) this._timer = setTimeout(() => {
                this.delayEachArray(delay, arr, index);
            }, arr[index].speed);
            else console.log("遍历结束")
        },
        lineTo(x, y, s, p) {
            let tx = this.ratioX * x;
            let ty = this.ratioY * y;
            let tw = 1.2;
            // 当速度s为0是未一笔的起点 所以要初始化画点
            if (s == 16 || s == 0) {
                this.isStart = 0;
                return;
            }
            if (this.isStart > 0) {
                this.x2 = Math.floor(this.ratioX * x);
                this.y2 = Math.floor(this.ratioY * y);
                console.log(x, y, "=========")
                let d = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2));
                console.log(d, "d")
                if (d > this.res) {
                    console.log("44")
                    tx = Math.round((this.x1 + this.x2) / 2 * 100) / 100;
                    ty = Math.round((this.y1 + this.y2) / 2 * 100) / 100;
                    if (this.isStart == 1) {
                        this.context.lineTo(tx, ty);
                    } else {
                        this.context.quadraticCurveTo(this.x1, this.y1, tx, ty);
                        this.context.lineWidth = tw;
                        this.context.stroke();
                        this.context.beginPath();
                        this.context.moveTo(tx, ty);
                    }
                    this.x1 = this.x2;
                    this.y1 = this.y2;
                }
                this.isStart++;
            } else {
                /* 初始化画点*/
                this.isStart = 1;
                this.context.beginPath();
                this.context.lineCap = "round";
                this.context.strokeStyle = "#000"; //新增
                this.x1 = tx;
                this.y1 = ty;
                this.context.moveTo(tx, ty); //起点
                this.isStart++;
            }
        },
        // 回放返回
        playbackReturn() {
            this.replayShow = false
            // 返回时终止递归
            clearTimeout(this._timer)
            this._timer = ''
        }

    },
    watch: {
        current: {
            handler(val) {
                this.currents = val
                console.log("777")
            },
            deep: true,
        }
    },
    beforeDestroy() {
        // 退出页面时终止递归
        clearTimeout(this._timer)
        this._timer = ''
    },
}
</script>

<style lang="less" scoped>
.mask {
    position: fixed;
    z-index: 502;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #000;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    >div {
        height: 100%;
        display: flex;
        align-items: center;

        img {
            height: 100%;
            width: auto;
            cursor: move;
        }
    }

}

.suspensions {
    display: flex;
    position: absolute;
    right: 191px;
    z-index: 503;
    bottom: 60px;

    ul {
        display: flex;
        background: #797979;
        border-radius: 10px;

        li {
            width: 90px;
            height: 90px;
            display: flex;
            flex-direction: column;
            color: #fff;
            align-items: center;
            padding: 10px 0;
            box-sizing: border-box;
            justify-content: center;

            /deep/ .svg-icon {
                width: 36px;
                height: 34px;
                fill: currentColor;
            }

            img {
                width: 36px;
                height: 34px;
            }

            font-size: 18px;

            span {
                margin-top: 5px;
            }
        }
    }
}

.replayClass {
    position: fixed;
    z-index: 504;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    >div {
        height: 100%;
        display: flex;
        align-items: center;
    }
}

</style>
