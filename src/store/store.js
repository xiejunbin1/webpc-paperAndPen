/*
 * @Author: wgj
 * @Date: 2021-01-26 14:02:34
 * @LastEditTime: 2021-02-06 15:42:39
 * @LastEditors: wgj
 * @Description: 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import setting from './modules/setting'
import user from './modules/user'
import teachStat from './modules/teachStat'
import parent from './modules/parent-GFY'
import course from './modules/course'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    setting,
    user,
    teachStat,
    parent,
    course
  },
  getters,
  state: parent.state
})

export default store
