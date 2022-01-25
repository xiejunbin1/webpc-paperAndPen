/*
 * @Author: wgj
 * @Date: 2021-02-26 11:05:27
 * @LastEditTime: 2021-02-26 17:20:47
 * @LastEditors: wgj
 * @Description: 
 */
export default {
    data() {
        return {
            websock: null,
        }
    },
    async created() {
        console.log('这里由 mixin 中 create 方法打印！')
        await this.initWebSocket()
    },
    methods: {
        initWebSocket() {
            //初始化weosocket
            // const wsuri = 'ws://192.168.105.163:8090';
            const wsuri = process.env.VUE_APP_SOCKETIP;
            this.websock = new WebSocket(wsuri);
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onopen = this.websocketonopen;
            this.websock.onerror = this.websocketonerror;
            this.websock.onclose = this.websocketclose;
        },
        websocketonopen() {
            //连接建立之后执行send方法发送数据
            // let actions = { test: '12345' };
            // this.websocketsend(JSON.stringify(actions));
            // let obj = [['data', JSON.stringify(this.actions)]];
            // const map = new Map(Object.entries(obj));
            // console.log(map);
            // this.websock.send(obj);
        },
        websocketonerror() {
            //连接建立失败重连
            this.initWebSocket();
        },
        websocketonmessage(e) {
            //数据接收
            const redata = JSON.parse(e.data);
            if (redata.type == 'baseInfo') {
                this.$store.commit('setUserInfo', redata.data);
            } else if (redata.type == 'classDetail') {
                // this.$store.commit("setHideSomeThing", true)
                this.hideSomeThing = true;
            }

            console.log(redata);
        },
        websocketsend(Data) {
            // this.websock.send('Data', '22');
            //数据发送
            // setInterval(() => {
            // this.websock.send(Data);
            // }, 1000);
        },
        websocketclose(e) {
            //关闭
            console.log('断开连接', e);
        },
    }
}