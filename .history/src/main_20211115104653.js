import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import VueCropper from "vue-cropper";
import common from "./utils/common";
Vue.prototype.common = common;
// import Vconsole from 'vconsole';
// import * as fundebug from "fundebug-javascript";
// import fundebugVue from "fundebug-vue";
import Navigation from "vue-navigation";
import * as myFilter from "./utils/filter";
import * as calculate from "./utils/calculate";
// import VConsole from "vconsole/dist/vconsole.min.js";
import viewportUnitsBuggyfill from "viewport-units-buggyfill";
import '@/icons' // icon
import '@vant/touch-emulator';
import { Table, TableColumn } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';



Vue.use(Table);
// Vue.use(Button);
Vue.use(TableColumn);
// WebSocket封装方法
import * as socketApi from './utils/socket'
Vue.prototype.socketApi = socketApi
// import htmlToPdf from '@/utils/htmlToPdf'
// // 注册-页面转PDF组件
// Vue.use(htmlToPdf)

// let vConsole = new VConsole()
// import SocketService from '@/utils/socket_service'
// SocketService.Instance.connect()
// Vue.prototype.$socket = SocketService.Instance
// Vue.prototype.wsPath = process.env.VUE_APP_SOCKETIP     // websocket路径

// import SocketIO from "socket.io-client"

// import VueSocketIO from 'vue-socket.io'

// Vue.use(new VueSocketIO({

//   debug: true,

//   connection: SocketIO.connect('ws://192.168.105.163:8090', {
//     path: '',  //如果地址是wss path:"/wss"
//     transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
//   })
// }))
// Vue.prototype.SocketIO = SocketIO;

// vuex: {       // 不需要用到vuex这个可以不加

//   store,

//   actionPrefix: 'SOCKET_',

//   mutationPrefix: 'SOCKET_'

// }

// }))
// Vue.use(new VueSocketio({
//   debug: true,
//   connection: socketio.connect('http://192.168.105.163:8090', {
//     path: '',  //如果地址是wss path:"/wss"
//     transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
//   })
// }));

// import VueSocketIO from 'vue-socket.io'
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'ws://192.168.0.133:1024',
//   vuex: {
//   }
// }))

// 引入vant组件
import {
  Button,
  Overlay,
  Field,
  Dialog,
  Loading,
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  Toast,
  ActionSheet,
  NumberKeyboard,
  DropdownMenu,
  DropdownItem,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  Cell,
  CellGroup,
  List,
  PullRefresh,
  Search,
  Tag,
  Popup,
  IndexBar,
  IndexAnchor,
  Row,
  Col,
  Divider,
  Collapse,
  CollapseItem,
  Uploader,
  Notify,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  ImagePreview,
  SwipeCell,
  DatetimePicker,
  Skeleton,
  Grid,
  GridItem,
  Progress,
  Picker,
  Stepper,
  slider,
  Lazyload,
  Sticky,
  Switch,
  Image,
  Popover,
} from "vant";
// import AlloyFinger from 'alloyfinger'
// import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'
//
// Vue.use(AlloyFingerPlugin,{
//   AlloyFinger
// })

viewportUnitsBuggyfill.init({
  hacks: viewportUnitsBuggyfill.hacks
});
// Vue.use(Navigation, {
//   router
// });
Vue.use(VueCropper);
Vue.use(Button)
  .use(Field)
  .use(Dialog)
  .use(Loading)
  .use(NavBar)
  .use(Overlay)
  .use(Switch)
  .use(Image)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Icon)
  .use(Toast)
  .use(ActionSheet)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(NumberKeyboard)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Tab)
  .use(Uploader)
  .use(RadioGroup)
  .use(Radio)
  .use(Tabs)
  .use(Swipe)
  .use(SwipeItem)
  .use(Cell)
  .use(CellGroup)
  .use(Collapse)
  .use(CollapseItem)
  .use(List)
  .use(PullRefresh)
  .use(Search)
  .use(Tag)
  .use(Popup)
  .use(IndexBar)
  .use(IndexAnchor)
  .use(Row)
  .use(Col)
  .use(Divider)
  .use(Notify)
  .use(RadioGroup)
  .use(Radio)
  .use(ImagePreview)
  .use(SwipeCell)
  .use(DatetimePicker)
  .use(Skeleton)
  .use(Grid)
  .use(GridItem)
  .use(Progress)
  .use(Picker)
  .use(Stepper)
  .use(Lazyload)
  .use(slider)
  .use(Popover)
  .use(Sticky);

// 配置fundebug
// fundebug.apikey =
//   "2091a697df9cede7b8df8f5b6d37126230448548399ed1e5227851515fa006eb";
// fundebugVue(fundebug, Vue);
// if (process.env.NODE_ENV != "production") {
//   let vConsole = new VConsole();
// }
// //集成环境或者正式环境才收集错误信息
// if (process.env.NODE_ENV == "sit" || process.env.NODE_ENV == "production") {
//   fundebug.silentDev = false;
//   // fundebug.silentConsole = false
// } else {
//   fundebug.silentDev = true;
//   // fundebug.silentConsole = true
// }

// 过滤监控 unhandledrejection
// if ("fundebug" in window) {
//   fundebug.filters = [
//     {
//       type: /^unhandledrejection$/
//     },
//     {
//       req: {
//         method: /^POST$/
//       },
//       res: {
//         status: /^0$/
//       }
//     }
//   ];
// }


Object.keys(myFilter).forEach(key => {
  Vue.filter(key, myFilter[key]);
});
Object.keys(calculate).forEach(key => {
  Vue.filter(key, calculate[key]);
});
Vue.config.productionTip = false;
//
router.beforeEach((to, from, next) => {
  try {
    console.log("onPageBegin");
    MobclickAgent.onPageBegin(to.path);
    MobclickAgent.onPageEnd(from.path);
  } catch (e) { }
  if (to.path == "/login") {
    if (localStorage.getItem("isLogin")) {
      next("/index");
    }
  }
  // if (to.name == "/login") {
  //   if (localStorage.getItem("isLogin")) {
  //     next("/index");
  //   }
  // }
  // if (to.path.indexOf('inClassDetail') == -1) {
  //   next({
  //     query: ''
  //   })
  // } else {
  if (to.query.socketTaskId) {
    next();
    return;
  };
  if (from.query.socketTaskId) {
    let toQuery = JSON.parse(JSON.stringify(to.query));
    toQuery.socketTaskId = from.query.socketTaskId;
    toQuery.testPaperId = from.query.testPaperId;
    next({
      path: to.path,
      query: toQuery
    })
  } else {
    next()
  }

  // }

  if (from.path == "/login" && (to.path == "/mine" || to.path == "/setting")) {
    console.log("退出登录不能返回我的页面");
    if (!localStorage.getItem("isLogin")) {
      next("/login");
    }
  }
  next();
});


// ios微信浏览器适配导航栏
pushHistory();

function pushHistory() {
  var state1 = {};
  window.history.pushState(state1, "", window.location.href);
}

document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
  WeixinJSBridge.call("hideToolbar");
});

import Tools from '@/utils/tools'
Vue.use(Tools)
// 为了解决setItemEvent不立即生效，使用事件派发强制更高
Tools.dispatchEventStroage()
Tools.dispatchEventStroage_S()

new Vue({

  router,
  store,
  render: h => h(App)
}).$mount("#app");
