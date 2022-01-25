import router from "../router";
import store from "../store/store";

var websock = null;
let rec; //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
let isConnect = false; //连接标识 避免重复连接
let checkMsg = "heartbeat"; //心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理

var globalCallback = function () { };

let createWebSocket = () => {
    try {
        var ws = process.env.VUE_APP_SOCKETIP;
        websock = new WebSocket(ws);
        initWebSocket(); //初始化websocket连接
    } catch (e) {
        console.log("尝试创建连接失败");
        reConnect(); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
    }
};

//定义重连函数
let reConnect = () => {
    console.log("尝试重新连接");
    if (isConnect) return; //如果已经连上就不在重连了
    rec && clearTimeout(rec);
    rec = setTimeout(function () { // 延迟5秒重连  避免过多次过频繁请求重连
        createWebSocket();
    }, 5000);
};
//设置关闭连接
let closeWebSocket = () => {
    webSocket.close();
};
//心跳设置
var heartCheck = {
    timeout: 20000, //每段时间发送一次心跳包 这里设置为20s
    timeoutObj: null, //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）

    start: function () {
        this.timeoutObj = setTimeout(function () {
            if (isConnect) websock.send(checkMsg);
        }, this.timeout);
    },

    reset: function () {
        clearTimeout(this.timeoutObj);
        this.start();
    }
};

// 初始化websocket
function initWebSocket() {
    
    // ws地址 -->这里是你的请求路径
    let uName = localStorage.getItem("uName")
    var ws = process.env.VUE_APP_SOCKETIP
    // var ws = 'ws://192.168.105.164:8090'
    websock = new WebSocket(ws)
    websock.onmessage = function (e) {
        websocketonmessage(e)
    }
    websock.onclose = function (e) {
        websocketclose(e)
    }
    websock.onopen = function () {
        console.log("正在链接")
        websocketOpen()
        // heartCheck.start();
    }

    // 连接发生错误的回调方法
    websock.onerror = function () {
        alert('WebSocket连接发生错误')
        console.log('WebSocket连接发生错误')
        isConnect = false; //连接断开修改标识
        reConnect(); //连接错误 需要重连
    }
}



// 实际调用的方法
function sendSock(agentData, callback) {
    globalCallback = callback
    // console.log(globalCallback)
    if (websock.readyState === websock.OPEN) {
        // 若是ws开启状态
        websocketsend(agentData)
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback)
        }, 1000)
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback)
        }, 1000)
    }
}

function getSock(callback) {
    globalCallback = callback
}
// 数据接收
function websocketonmessage(e) {
    console.log(e.data)
    let O_o = JSON.parse(decodeUnicode(e.data))
    // let data = JSON.parse(e)
    console.log("O_o", O_o,"11111111111")
    if (O_o.type == 'baseInfo') {
        store.commit('setHierarchicalListShow', false)
        // 是否已登录
        store.commit('setHierarchicalListItem', {})
        store.commit('setUseThisLayering', [])
        // store.commit('setLayerUserStatus', {})
        store.commit('setHierarchicalTaskName', '')
        store.commit('setPushstatus', '')
        store.commit('setUserInfo', O_o.data);
        console.log("route", window.location.href, localStorage.hasOwnProperty('querySocket'), store.getters.getQuerySocket)
        // socketTaskId

        // setTimeout(() => {
        // if (store.getters.getQuerySocket == '') {
        //     router.push({ path: '/' });
        // }
        // }, 500);
        console.log()
        if (window.location.href.indexOf('socketTaskId') == -1) {
            router.push({ path: '/' });
        }
    }
    if (O_o.type == 'layerUserStatus') {
        store.commit('setLayerUserStatus', {});
        store.commit('setLayerUserStatus', JSON.parse(JSON.stringify(O_o.data)));
        console.log(store.getters.getLayerUserStatus,"setLayerUserStatus----------==============")
        console.log("88888888888-------",O_o.data)
        return
    }
    if (!O_o) {
        heartCheck.reset();
    } else {
        if (O_o.msg == "open success") {
            sessionStorage.setItem("wid", O_o.wid);
        } else {
            console.log(O_o);
            globalCallback(O_o);
        }
    }


    // globalCallback(JSON.parse(e.data))
    function decodeUnicode(str) {
        str = str.replace(/\\/g, "%");
        //转换中文
        str = unescape(str);
        //将其他受影响的转换回原来
        str = str.replace(/%/g, "\\");
        //对网址的链接进行处理
        str = str.replace(/\\/g, "");
        return str;
    }
}

// 数据发送
function websocketsend(agentData) {
    console.log(JSON.stringify(agentData))
    websock.send(JSON.stringify(agentData))
}

// 关闭
function websocketclose(e) {
    console.log(e)
    isConnect = false; //断开后修改标识
    console.log('connection closed (' + e.code + ')')
}

// 创建 websocket 连接
function websocketOpen(e) {
    console.log('连接成功')
}

initWebSocket()

// 将方法暴露出去
export {
    sendSock,
    getSock,
    createWebSocket,
    closeWebSocket
}
