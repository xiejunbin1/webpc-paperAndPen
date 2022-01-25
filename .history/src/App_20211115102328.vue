<!--
 * @Author: yhy
 * @Date: 2021-01-26 14:02:34
 * @LastEditTime: 2021-03-05 15:04:35
 * @LastEditors: wgj
 * @Description: 
-->
<template>
<div id="app">
    <!-- <div class="returnClss xuanfu" id="moveDiv" @touchstart="down" @touchmove.stop.prevent="move" @touchend="end" v-if="$route.name != 'home'">
        <div @click="returnClick">刷新</div>
    </div> -->
    <!--    由于用了vue-navigation插件,所以如果有页面使用了子路由嵌套,当进入子路由时,父路由会重新触发created,相当于新渲染了一个父页面
    暂时先根据有子路由嵌套的路径判断不使用页面缓存(有时间再改),vue-navigation也没有指定页面不缓存的功能 (已修改)-->
    <!--    <router-view v-if="includes()"></router-view>-->
    <transition name="fade">
        <loading v-if="this.$store.getters.getIsLoading"></loading>
    </transition>
    <!-- <navigation> -->
    <router-view v-if="showPage"></router-view>
    <!-- </navigation> -->
    <!-- <upgrade></upgrade> -->
</div>
</template>

<script>
import loading from './components/loading/index.vue'
// import { getClassStudent } from '@/api/index';
export default {
    data() {
        return {
            mql: window.matchMedia('(orientation: portrait)'),
            // socket: '',
            websock: null,
            showPage: false,
            flags: false,
            position: {
                x: 0,
                y: 0
            },
            nx: '',
            ny: '',
            dx: '',
            dy: '',
            xPum: '',
            yPum: '',
        };
    },
    components: {
        loading
    },
    
    sockets: {
        welcome: (data) => {
            console.log('welcome data ', data);
        },
    },
    
    created() {
        this.$store.commit('setUserInfo', {});
        
        this.socketApi.getSock(this.getConfigResult);
        let usrInfo = {
            accountNo: 12134,
            areaCode: '513400',
            areaName: null,
            birthDate: -28800000,
            cardNo: null,
            cardTypeCd: null,
            createTime: null,
            creater: null,
            desc: null,
            descOrAsc: null,
            iconUrl: 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/icon/201912/121342019-12-066jQGU.png',
            interPwd: null,
            interUser: null,
            loginName: '高分云语文1',
            modifier: null,
            modifyTime: null,
            onlineAccess: null,
            orderBy: null,
            phoneNo: '13229414863',
            qqNo: null,
            remarks: '你好哈哈哈哈',
            roleCode: 'Instructor',
            roleType: 'A02',
            sexTypeCd: 'S02',
            userId: 12106,
            userName: '语文1',
            weChatNo: null,
            schoolId: 24,
            classId: 60,
        };
        let url = window.location.href
        let wz = url.indexOf('#')
        let res = wz != '-1' ? url.substring(wz+1,url.length) : false
        console.log(res,"==================11")
        if ( res != "/course" &&  res != false){
            setTimeout(() => {
                window.location.href = url
            },500)
        }
        
        
    },
    destroyed() {
        // this.websock.close(); //离开路由之后断开websocket连接
    },
    mounted() {
        console.log('app页面 mounted');
        // this.getClassStudent();

        // this.onMatchMeidaChange(this.mql);
        // this.mql.addListener(this.onMatchMeidaChange);
    },
    methods: {
        getConfigResult(res) {
            if (res.type == 'baseInfo') {
                // this.$store.commit('setUserInfo', {});
                this.$store.commit('setUserInfo', res.data);
                // window.location.reload();
                // setTimeout(() => {
                //   this.$router.push({ path: '/' });
                // }, 500);
                this.showPage = true;
            }

        },

        // initWebSocket() {
        //   //初始化weosocket
        //   // const wsuri = 'ws://192.168.105.163:8090';
        //   // this.websock = new WebSocket(wsuri);
        //   // this.websock.onmessage = this.websocketonmessage;
        //   // this.websock.onopen = this.websocketonopen;
        //   // this.websock.onerror = this.websocketonerror;
        //   // this.websock.onclose = this.websocketclose;
        // },
        // websocketonopen() {
        //   //连接建立之后执行send方法发送数据
        //   let actions = { test: '12345' };
        //   this.websocketsend(JSON.stringify(actions));
        // },
        websocketonerror() {
            //连接建立失败重连
            this.initWebSocket();
        },
        // websocketonmessage(e) {
        //   //数据接收
        //   const redata = JSON.parse(JSON.stringify(e.data));
        //   console.log(redata,"88888888");
        // },
        websocketsend(Data) {
            //数据发送
            // setInterval(() => {
            this.websock.send(Data);
            // }, 1000);
        },
        websocketclose(e) {
            //关闭
            console.log('断开连接', e);
        },
        includes() {
            return [''].includes(this.$route.path);
        },
        onMatchMeidaChange(mql) {
            if (mql.matches) {
                // 竖屏
                console.log('竖屏');
                this.$store.commit('setFullscreen', false);
            } else {
                // 横屏
                console.log('横屏');

                // this.isLandscape = true
            }
        },
        // async getClassStudent() {
        //   let obj = {
        //     interUser: 'runLfb',
        //     interPwd: '25d55ad283aa400af464c76d713c07ad',
        //     operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        //     belongSchoolId: this.$store.getters.getUserInfo.schoolId,
        //     classId: this.$store.getters.getUserInfo.classId,
        //   };
        //   let params = {
        //     requestJson: JSON.stringify(obj),
        //   };

        //   getClassStudent(params).then((res) => {
        //     if (res.flag) {
        //       console.log(this.$store.getters.getUserInfo.classId, ',班级学生：', res.data);
        //       if (res.data && res.data.length > 0 && res.data[0].classStudent) {
        //         let classStudent = res.data[0].classStudent;
        //         let classStudentMap = {};
        //         classStudent.forEach((item) => {
        //           classStudentMap[item.accountNo] = item;
        //         });

        //         let key = 'classStudent_' + this.$store.getters.getUserInfo.classId;
        //         localStorage.setItem(key, JSON.stringify(classStudentMap));
        //       }
        //     } else {
        //       this.$toast(res.msg);
        //     }
        //   });
        // },

        // 实现移动端拖拽
        down(event) {
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

        move(event) {
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
                const maxWidth = window.screen.width - 80; //屏幕分辨率宽度减去悬浮框宽高
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
        returnClick() {
            location.reload()
        }
    },
};
</script>

<style lang="less">
@import 'vant/lib/index.css';
@import 'vant/lib/icon/local.css';
@import './assets/style/reset.less';
@import './assets/style/common.less';
@import './assets/style/icon.less';
@import 'assets/style/resetVant.less';

body {
    font-size: 16px;
    font-family: Adobe Heiti Std R;
    background-color: #ffffff;
    color: #333333;
    // padding-top: constant(safe-area-inset-top);
}

html,
body,
#app {
    // width: 100vw;
    width: 100%;
    height: calc(100% - 80px);
    background: #f5f5f5;

    // height: 100vh;
    // height: calc(100%-2px);
}

::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    background: #DDDDDD;
}

::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 6;
}

.returnClss {
    position: fixed;
    z-index: 999;
    width: 70px;
    height: 70px;
    border: deeppink;
    border-radius: 50%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 100px;
    right: 20px;
    box-shadow: 0px 6px 20px 0px rgba(0, 37, 35, 0.2);
    font-size: 14px;
    -webkit-animation: 3s opacity2, roundRule 2.5s ease-in-out infinite;
    -webkit-transform-origin: top center;
}

@-webkit-keyframes roundRule {

    0%,
    100% {
        -webkit-transform: rotate(-15deg);
    }

    50% {
        -webkit-transform: rotate(15deg);
    }
}

@keyframes opacity2 {
    0% {
        opacity: 0
    }

    20% {
        opacity: 0
    }

    40% {
        opacity: .4
    }

    60% {
        opacity: .6;
    }

    80% {
        opacity: .8;
    }

    100% {
        opacity: 1
    }
}

.xuanfu {
    width: 70px;
    height: 70px;
    /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
    z-index: 999;
    position: fixed;
}
</style>
