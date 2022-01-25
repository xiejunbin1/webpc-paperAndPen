/*
 * @Author: wgj
 * @Date: 2021-02-06 15:35:21
 * @LastEditTime: 2021-03-05 14:42:53
 * @LastEditors: wgj
 * @Description: 
 */
const course = {
    namespaced: false,
    state: {
        baseData: "",
        examDetailData: "",
        statisticData: "",
        hideSomeThing: false,
        querySocket: "",
        hierarchicalListShow: false, //分层是否可编辑
        hierarchicalListItem:{},//分层列表item
        useThisLayering: [],//当前使用的那个分层
        layerUserStatus: {}, // 是否可以使用分层状态信息
        hierarchicalTaskName: '', //分层课程名称显示
        // currentStratification: '',//当前使用的是哪一个分层状态
        pushstatus: '',//当前推送的是哪一个

        listOfTestQuestions: 0, //当前为那个试题
        isLoading: false,
        bonusPoints: null, // 加分减分
        numberOfUnfinished: [], // 未完成人数
        allRight: [] // 全对
    },

    mutations: {
        setExamDetailData: (state, examDetailData) => {
            state.examDetailData = examDetailData
            localStorage.setItem('examDetailData', JSON.stringify(examDetailData))
        },
        setStatisticData: (state, statisticData) => {
            state.statisticData = statisticData
            localStorage.setItem('statisticData', JSON.stringify(statisticData))
        },
        setBaseData: (state, baseData) => {
            state.baseData = baseData
            localStorage.setItem('baseData', JSON.stringify(baseData))
        },
        setHideSomeThing: (state, hideSomeThing) => {
            state.hideSomeThing = hideSomeThing
            localStorage.setItem('hideSomeThing', JSON.stringify(hideSomeThing))
        },
        setQuerySocket: (state, querySocket) => {
            state.querySocket = querySocket
            localStorage.setItem('querySocket', JSON.stringify(querySocket))
        },
        setHierarchicalListShow: (state, hierarchicalListShow) => {
            state.hierarchicalListShow = hierarchicalListShow
            localStorage.setItem('hierarchicalListShow', JSON.stringify(hierarchicalListShow))
        },
        setHierarchicalListShow: (state, hierarchicalListShow) => {
            state.hierarchicalListShow = hierarchicalListShow
            localStorage.setItem('hierarchicalListShow', JSON.stringify(hierarchicalListShow))
        },
        setHierarchicalListItem: (state, hierarchicalListItem) => {
            state.hierarchicalListItem = JSON.parse(JSON.stringify(hierarchicalListItem)) 
            localStorage.setItem('hierarchicalListItem', JSON.stringify(hierarchicalListItem))
        },
        setUseThisLayering: (state, useThisLayering) => {
            state.useThisLayering = JSON.parse(JSON.stringify(useThisLayering)) 
            localStorage.setItem('useThisLayering', JSON.stringify(useThisLayering))
        },
        setLayerUserStatus: (state, useThisLayering) => {
            state.layerUserStatus = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('layerUserStatus', JSON.stringify(useThisLayering))
        },
        setHierarchicalTaskName: (state, useThisLayering) => {
            state.hierarchicalTaskName = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('hierarchicalTaskName', JSON.stringify(useThisLayering))
        },
        // setCurrentStratification: (state, useThisLayering) => {
        //     state.currentStratification = JSON.parse(JSON.stringify(useThisLayering))
        //     localStorage.setItem('currentStratification', JSON.stringify(useThisLayering))
        // }
        setPushstatus: (state, useThisLayering) => {
            state.pushstatus = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('pushstatus', JSON.stringify(useThisLayering))
        },

        setListOfTestQuestions: (state, useThisLayering) => {
            state.listOfTestQuestions = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('listOfTestQuestions', JSON.stringify(useThisLayering))
        },
        setIsLoading: (state, useThisLayering) => {
            state.isLoading = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('isLoading', JSON.stringify(useThisLayering))
        },
        setBonusPoints: (state, useThisLayering) => {
            state.bonusPoints = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('bonusPoints', JSON.stringify(useThisLayering))
        },
        setNumberOfUnfinished: (state, useThisLayering) => {
            state.numberOfUnfinished = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('numberOfUnfinished', JSON.stringify(useThisLayering))
        },
        setAllRight: (state, useThisLayering) => {
            state.allRight = JSON.parse(JSON.stringify(useThisLayering))
            localStorage.setItem('allRight', JSON.stringify(useThisLayering))
        },

    },
    actions: {
        setIsLoading({ commit, state }, data) {
            commit('setIsLoading', data)
        },
    }
}

export default course
