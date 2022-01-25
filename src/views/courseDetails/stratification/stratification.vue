<template>
<div class="detailedStatistics">
    <div v-if="Object.keys(taskId).length > 0">
        <div class="generateUse" v-if="hierarchicalListShow == false">
            <div class="generateUse-left"></div>
            <div style="width: 30%;">
                <div class="generateUse-right">
                    <div :class="{generate: urdeShow1  ? true : (urdeShow ? false : true)   , use1: urdeShow1  ? false : (urdeShow ? true : false)  , generateUseA: true }" @click="generateLevelTestPaper"> {{ urdeShow1 ? '已生成层级试卷' : '生成层级试卷' }} </div>
                    <div :class="{generate: btnStatus ? (urdeShow ? true : false) : true , use: btnStatus ? (urdeShow ? false : true) : false , generateUseA: true}" @click="useThisLayering">{{ urdeShow ? '已使用该分层' : '使用该分层'}}</div>
                </div>
            </div>
        </div>

        <div class="generateUse" v-if="hierarchicalListShow">
            <div style="width: 50%;"></div>
            <div style="width: 50%;">
                <div class="generateUse-right">
                    <div class="mobile1">选择学生可以移动至不同分层</div>
                    <div class="mobile" @click="mobileShow = !mobileShow">移动({{ mobileList.length }})</div>
                    <div class="mobile" @click="editLayer = !editLayer">编辑层级</div>
                </div>
            </div>
        </div>

        <div class="stratificationDetails">
            <div class="stratificationDetails-const" v-for="(value, index) in stratificationDetailsList" :key="index">
                <div class="stratificationDetails-const-title">{{ value.layerGroupInfo.subgroupName }} ({{ value.layerGroupInfo.subgroupScoreEnd }} ~ {{ value.layerGroupInfo.subgroupScoreStart }}) {{ value.layerGroupStudentList == null ? 0 : value.layerGroupStudentList.length }} 人</div>
                <div class="stratificationDetails-const-name">
                    <span v-for="(ietm, i) in value.layerGroupStudentList || []" :key="ietm.accountNo" :class="{ selected: hierarchicalListShow , selected1: ietm.show && hierarchicalListShow}" @click="selected(ietm,value,index)">{{ ietm.accountName }}</span>
                    <div class='default-box' v-for="n in 10" :key="n+'00'"></div>
                </div>
            </div>
        </div>

        <div class="mask" v-show="mobileShow">
            <div class="mask-bulletFrame">
                <div class="mask-bulletFrame-title">
                    <div class="title">移动{{ mobileList.length }}人至</div>
                    <div class="cross" @click="mobileShow = !mobileShow">
                        <van-icon name="cross" />
                    </div>
                </div>
                <div class="mask-bulletFrame-remind">是否移动到：</div>
                <div class="mask-bulletFrame-select">
                    <div>
                        <van-radio-group v-model="radio" direction="horizontal">
                            <van-radio v-for="(value, index) in stratificationDetailsList" :key="index" :name="index" :disabled="value.alict&&Object.keys(value.alict).length>0" checked-color="#22AD7E">{{ value.layerGroupInfo.subgroupName }} ({{ value.layerGroupInfo.subgroupScoreEnd }} ~ {{ value.layerGroupInfo.subgroupScoreStart }}) </van-radio>
                        </van-radio-group>
                    </div>
                </div>

                <div class="mask-bulletFrame-bottom">
                    <button class="cancel button" @click="mobileShow = !mobileShow">取消</button>
                    <button class="determine button" @click="determineClick">确定</button>
                </div>
            </div>
        </div>

        <div class="mask" v-show="editLayer">
            <div class="mask-bulletFrame" style="width: 1000px;">
                <div class="mask-bulletFrame-div">
                    <div class="mask-bulletFrame-title">
                        <div class="title">分层段调整</div>
                        <div class="cross" @click="editLayer = !editLayer">
                            <van-icon name="cross" />
                        </div>
                    </div>
                    <div class="mask-bulletFrame-remind" style="width: 1000px;">注意：点击每层的分数可以修改分数范围，最多添加6层，每层分数设置要连贯。</div>
                    <div class="mask-bulletFrame-select">
                        <div class="mask-bulletFrame-select-div" v-for="(value, index ) in stratificationDetailsList1" :key="index">
                            <span>{{ value.layerGroupInfo.subgroupName }}:</span>
                            <input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="value.layerGroupInfo.subgroupScoreEnd">
                            <span>~</span>
                            <input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="value.layerGroupInfo.subgroupScoreStart" :style="value.layerGroupInfo.subgroupName == 'A层' ? 'color:#A8A8A8' : ''" :disabled="value.layerGroupInfo.subgroupName == 'A层'">
                            <div class="cross" @click="deleteLayering(index)">
                                <van-icon name="clear" color="#818181" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mask-bulletFrame-div1">
                    <button class="cancel button" :style="this.stratificationDetailsList1.length < 6 ? 'border: 2px solid #22AD7E;color: #22AD7E;' : ''" @click="addFractionalSegments">+ 添加分数段</button>
                    <button class="determine button" @click="sureToAdd">确定</button>
                </div>
            </div>
        </div>
    </div>
    <div class="air" v-else>
        <svg-icon class="details-svg" icon-class="icon-empty-data"></svg-icon>
        <div class="details-text">当前暂无分层信息</div>
    </div>
</div>
</template>

<script>
import {
    getLayerTaskInfoDetail,
    updateTchTeachLayerInfo,
    bindLayeringGroupByTchCourse,
    createLayerTestPaper
} from '@/api/index'
import {
    getStudentName,
} from '@/utils/filter';
export default {
    data() {
        return {
            stratificationDetailsList: [], //分层列表
            stratificationDetailsList1: [],
            mobileList: [], //当前选择的学生
            show: true,
            radio: 0,
            alict: {},
            mobileShow: false,
            editLayer: false,
            generateShow: false,
            generateText: '',
            stratificationDeta: null,

            btnStatus: false,
            urdeShow: false,
            urdeShow1: false,
        }
    },

    computed: {
        hierarchicalListShow() {
            return this.$store.getters.getHierarchicalListShow
        },
        taskId() {
            return this.$store.getters.getHierarchicalListItem
        },
        layerUserStatus_s(){
           return this.$store.state.course.layerUserStatus
        }
    },
    watch: {
        '$store.getters.getHierarchicalListItem': {
            handler(newval, olval) {
                this.getLayerTaskInfoDetail1(newval)
                this.mobileList = []
                this.$store.commit('setHierarchicalListShow', false);
                this.stratificationDetailsList.forEach(value => {
                    (value.layerGroupStudentList || []).forEach(v => {
                        v.show = false
                    })
                })
            },
            deep: true
        },
        'layerUserStatus_s': {
            handler(newval, olval) {
                let arrData = JSON.parse(localStorage.getItem('layerUserStatus'))
                if (arrData.initializationState) {
                    this.btnStatus = true
                } else {
                    console.log(12121)
                    this.btnStatus = false
                }
                this.getLayerTaskInfoDetail1(this.$store.getters.getHierarchicalListItem)

            },
            deep: true,
            immediate: true
        },
        '$store.getters.getHierarchicalListShow': {
            handler(newval, olval) {
                console.log(this.$store.getters, 'hierarchicalListShow11111')
                this.mobileList = []
                this.stratificationDetailsList.forEach(value => {
                    (value.layerGroupStudentList || []).forEach(v => {
                        v.show = false
                    })
                })
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // 获取websocket 使用该分层 按钮状态
        getLayerUserStatus(res) {
            console.log("已连接111")

        },
        getLayerTaskInfoDetail1(value) {
            if (Object.keys(this.taskId).length == 0) return false
            let obj = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                operateAccountNo: this.$store.getters.getUserInfo.accountNo,
                belongSchoolId: this.$store.getters.getUserInfo.schoolId,
                tchCourseId: this.$store.getters.getBaseData.tchCourseId,
                taskId: value.taskId,
                classId: this.$store.getters.getUserInfo.classId
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }
            getLayerTaskInfoDetail(params).then((res) => {
                if (res.flag) {
                    this.stratificationDetailsList = []
                    this.stratificationDetailsList1 = []
                    this.stratificationDeta = res.data
                    this.stratificationDetailsList = res.data.layerInfo.layerGroupInfoList
                    this.stratificationDetailsList1 = JSON.parse(JSON.stringify(res.data.layerInfo.layerGroupInfoList))
                    this.stratificationDetailsList.forEach((v, index) => {
                        (v.layerGroupStudentList || []).forEach((t) => {
                            t.accountName = getStudentName(t.accountNo, this.$store.getters.getUserInfo.classId);
                            t.show = false
                        })
                    })
                    if (res.data.tchCourseUsedLayerId == res.data.layerInfo.layerId) {
                        this.urdeShow = true
                    } else {
                        this.urdeShow = false
                    }
                    if (res.data.layerTestPaperNum > 0 && this.urdeShow) {
                        this.urdeShow1 = true
                    } else {
                        this.urdeShow1 = false
                    }
                   
                } else {
                    this.$toast(res.msg)
                }
            })
        },
        // 当前选中的学生
        selected(item, value, index) {
            console.log(item.accountNo, value, index)
            if (!this.hierarchicalListShow) {
                return false
            }
            this.stratificationDetailsList.forEach(v => {
                (v.layerGroupStudentList || []).forEach(t => {
                    if (item.accountNo == t.accountNo) {
                        t.show = !t.show
                    }
                })
            })
            let data = JSON.stringify(this.stratificationDetailsList)
            this.stratificationDetailsList = []
            this.stratificationDetailsList = JSON.parse(data)
            if (item.show) {
                this.mobileList.push(item)

                //把选中学生放在map里面，key为accountNo
                this.stratificationDetailsList[index].alict = this.stratificationDetailsList[index].alict || {}
                this.stratificationDetailsList[index].alict[item.accountNo] = item
            } else {

                delete this.stratificationDetailsList[index].alict[item.accountNo]
                let list = this.mobileList.filter(v => v.accountNo !== item.accountNo)
                this.mobileList = list
            }

            console.log(this.stratificationDetailsList[index])
        },
        // 移动
        mobileClick() {
            this.mobileShow = true
        },
        // 确定
        determineClick() {
            if (this.mobileList.length == 0) {
                return this.$toast("请先选择要移动的学生")
            }
            let selectList = []
            this.stratificationDetailsList.forEach((item, index) => {
                if (item.layerGroupStudentList && item.layerGroupStudentList.length >= 0) {
                    item.layerGroupStudentList.forEach((itemChild, indexChild) => {
                        //1：当该层学生被选中则先把该条数据置空
                        if (item.alict) {
                            if (item.alict.hasOwnProperty(itemChild.accountNo)) {
                                selectList.push(itemChild)
                                console.log(itemChild.accountNo, indexChild)
                                item.layerGroupStudentList[indexChild] = {}
                            }
                        }

                    })
                    //2：过滤掉已经被移动到其他分层的学生
                    item.layerGroupStudentList = item.layerGroupStudentList.filter(itemChild => Object.keys(itemChild).length > 0)
                }
            })
            selectList.forEach(ietm => {
                this.stratificationDetailsList[this.radio].layerGroupStudentList = this.stratificationDetailsList[this.radio].layerGroupStudentList || []
                this.stratificationDetailsList[this.radio].layerGroupStudentList.push(ietm)
            })

            let fonDate = this.layerGroupStudentInfoList(this.stratificationDetailsList)

            let obj = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": parseInt(this.$store.getters.getUserInfo.accountNo),
                "belongSchoolId": this.$store.getters.getUserInfo.schoolId,
                "layerId": this.stratificationDetailsList[this.radio].layerGroupInfo.layerId,
                layerGroupInfoList: fonDate
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }

            this.updateTchTeachLayerInfo(params)

        },
        layerGroupStudentInfoList(valueItem) {
            let fonDate = []
            valueItem.forEach(v => {
                var layerGroupStudentInfoList = [];
                (v.layerGroupStudentList || []).forEach(t => {
                    var studentInfo = {
                        "accountNo": t.accountNo,
                        "allotType": "T02",
                        "subgroupId": t.subgroupId
                    }
                    layerGroupStudentInfoList.push(studentInfo);
                })

                var tmp = {
                    "subgroupName": v.layerGroupInfo.subgroupName,
                    "subgroupScoreStart": v.layerGroupInfo.subgroupScoreStart,
                    "subgroupScoreEnd": v.layerGroupInfo.subgroupScoreEnd,
                    "layerGroupStudentInfoList": layerGroupStudentInfoList
                }
                fonDate.push(tmp);
            })
            return fonDate
        },
        updateTchTeachLayerInfo(params) {
            updateTchTeachLayerInfo(params).then(res => {
                let data = {
                    "tchCourseId": this.$store.getters.getBaseData.tchCourseId
                }
                this.socketApi.sendSock({
                    type: 'layerInfoSend',
                    data,
                    code: 0,
                    msg: '成功',
                });
                this.getLayerTaskInfoDetail1(this.$store.getters.getHierarchicalListItem)
                this.mobileList = []
                this.mobileShow = false
                this.editLayer = false

            })
        },
        // 添加分数段
        addFractionalSegments() {
            let layerGroupName = ['A层', 'B层', 'C层', 'D层', 'E层', 'F层']
            if (this.stratificationDetailsList1.length >= 6) {
                this.$toast("最多可设置6个层级，请重新调整层级");
                return false;
            }
            var tmp = {
                "layerGroupInfo": {
                    "layerId": this.stratificationDetailsList1[this.radio].layerGroupInfo.layerId,
                    "subgroupName": layerGroupName[this.stratificationDetailsList1.length],
                    "subgroupScoreEnd": null,
                    "subgroupScoreStart": null
                },
                "layerGroupStudentList": null
            }

            this.stratificationDetailsList1.push(tmp);

        },
        // 确定添加
        sureToAdd() {
            let numm = [{
                a: 0,
                b: 3
            }, {
                a: 2,
                b: 5
            }, {
                a: 4,
                b: 7
            }, {
                a: 6,
                b: 9
            }, {
                a: 8,
                b: 11
            }]
            let date = []
            this.stratificationDetailsList1.forEach(value => {
                date.push(value.layerGroupInfo.subgroupScoreEnd, value.layerGroupInfo.subgroupScoreStart)
            })
            console.log(date)
            for (let i in date) {
                if (date[i] == null) {
                    this.$toast("目前分层存在分段为空的情况，请检查分层");
                    return false
                }
                if (date[i].toString() == '') {
                    console.log(i)
                    this.$toast("目前分层存在分段为空的情况，请检查分层");
                    return false
                }

            }
            var find = false;
            for (var i = 0; i < this.stratificationDetailsList1.length; i++) {
                for (var j = i + 1; j < this.stratificationDetailsList1.length; j++) {
                    if (this.stratificationDetailsList1[i].layerGroupInfo.subgroupScoreEnd == this.stratificationDetailsList1[j].layerGroupInfo.subgroupScoreEnd || this.stratificationDetailsList1[i].layerGroupInfo.subgroupScoreStart == this.stratificationDetailsList1[j].layerGroupInfo.subgroupScoreStart) {
                        find = true;
                        console.log(i, j, "8881");
                        this.$toast(`${this.stratificationDetailsList1[i].layerGroupInfo.subgroupName}和${this.stratificationDetailsList1[j].layerGroupInfo.subgroupName}的分数重复了，请检查分数`)
                        return;
                    }
                }
                if (find) return;
            }
            let a = date.find(v => v == 0)
            console.log(a, "aaaaaa")
            if (parseInt(a) !== 0) {
                console.log("www")
                this.$toast("目前的分层存在分数遗漏的情况，请检查分层");
                return false
            }
            console.log(date)
            for (let index in numm) {
                if (this.stratificationDetailsList1.length - 1 > index) {
                    if (parseInt(date[numm[index].a]) != parseInt(date[numm[index].b]) + 1) {
                        console.log(index, "888")
                        this.$toast("目前的分层存在分数遗漏的情况，请检查分层");
                        return false
                    }
                }
            }
            let fonDate = this.layerGroupStudentInfoList(this.stratificationDetailsList1)
            let obj = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": parseInt(this.$store.getters.getUserInfo.accountNo),
                "belongSchoolId": this.$store.getters.getUserInfo.schoolId,
                "layerId": this.stratificationDetailsList[this.radio].layerGroupInfo.layerId,
                layerGroupInfoList: fonDate
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }
            this.updateTchTeachLayerInfo(params)
        },
        // 删除分层
        deleteLayering(index) {
            if (index == 0) {
                return false
            }
            if (this.stratificationDetailsList1.length == 2) {
                this.$toast("最少保留两个分层");
                return false
            }
            if (this.stratificationDetailsList1[index].layerGroupStudentList) {
                this.$toast("该分层存在学生，无法删除");
                return false
            }
            this.stratificationDetailsList1.splice(index, 1);
            let layerGroupName = ['A层', 'B层', 'C层', 'D层', 'E层', 'F层']
            for (let i in layerGroupName) {
                if (this.stratificationDetailsList1.length > i) {
                    this.stratificationDetailsList1[i].layerGroupInfo.subgroupName = layerGroupName[i]
                }
            }

        },
        // 监听页面刷新
        beforeunloadFn(e) {
            this.$store.commit('setHierarchicalListShow', false);
        },
        // 使用该分层
        useThisLayering() {
            if (this.urdeShow) return false
            if (!this.btnStatus) return false
            for (let i in this.stratificationDetailsList) {
                if (!this.stratificationDetailsList[i].layerGroupStudentList) {
                    this.$toast("分层情况存在空的分层，请删除后才可以使用该分层");
                    return false
                }
            }
            let obj = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": parseInt(this.$store.getters.getUserInfo.accountNo),
                "belongSchoolId": this.$store.getters.getUserInfo.schoolId,
                "layerId": this.stratificationDetailsList[this.radio].layerGroupInfo.layerId,
                "classId": this.$store.getters.getUserInfo.classId,
                "tchCourseId": this.$store.getters.getBaseData.tchCourseId
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }
            let data = {
                "tchCourseId": this.$store.getters.getBaseData.tchCourseId
            }

            bindLayeringGroupByTchCourse(params).then(res => {
                if (res.flag) {
                    this.$store.commit('setUseThisLayering', JSON.parse(JSON.stringify(this.$store.getters.getHierarchicalListItem)));
                    this.socketApi.sendSock({
                        type: 'layerInfoSend',
                        data,
                        code: 0,
                        msg: '成功',
                    });
                    this.getLayerTaskInfoDetail1(this.$store.getters.getHierarchicalListItem)
                }
            })

        },
        // 生成试卷
        generateLevelTestPaper() {
            if (this.urdeShow1) return false

            let obj = {
                "interUser": "runLfb",
                "interPwd": '25d55ad283aa400af464c76d713c07ad',
                "operateAccountNo": parseInt(this.$store.getters.getUserInfo.accountNo),
                "belongSchoolId": this.$store.getters.getUserInfo.schoolId,
                "taskId": this.$store.getters.getHierarchicalListItem.taskId,
                "tchCourseId": this.$store.getters.getBaseData.tchCourseId,
                "subjectType": this.$store.getters.getUserInfo.subjectType,
                "className": this.$store.getters.getUserInfo.className,
                "testPaperId": this.$store.getters.getHierarchicalListItem.testPaperId,
                "classGrade": this.$store.getters.getBaseData.classGrade,
                "layerId": this.stratificationDetailsList[this.radio].layerGroupInfo.layerId,
                "classId": this.$store.getters.getUserInfo.classId,
            }
            let params = {
                requestJson: JSON.stringify(obj)
            }
            createLayerTestPaper(params).then((res) => {
                this.getLayerTaskInfoDetail1(this.$store.getters.getHierarchicalListItem)
            })
        },

    },
    created() {
        window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    async mounted() {
        console.log(this.$store.getters.getLayerUserStatus, localStorage.getItem('layerUserStatus'),"this.$store.getters.getLayerUserStatus, localStorage.getItem('layerUserStatus')")
        console.log(this.hierarchicalListShow, "hierarchicalListShow")
       
    }
}
</script>

<style lang="less" scoped>
.default-box {
    width: 120px;
    height: 0;
}

.detailedStatistics {
    .generateUse {
        width: 100%;
        display: flex;

        .generateUse-left {
            width: 70%;
            height: 110px;

        }

        .generateUse-right {
            width: 100%;
            height: 110px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 30px;
            box-sizing: border-box;

            .generate {
                width: 198px;
                color: #CCCCCC;
                background: #EDEDED;
            }

            .generateUseA {
                height: 50px;
                border-radius: 6px;
                line-height: 50px;
                font-size: 24px;
                font-weight: 400;
                text-align: center;
            }

            .use {
                width: 180px;
                background: #22AD7E;
                color: #FFFFFF;
            }

            .use1 {
                width: 180px;
                border: 2px solid #22AD7E;
                color: #22AD7E;
            }

            .mobile {
                width: 160px;
                height: 50px;
                background: #22AD7E;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
            }

            .mobile1 {
                font-size: 24px;
                font-weight: 400;
                color: #A8A8A8;
            }
        }
    }

    .stratificationDetails {
        padding: 30px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        .stratificationDetails-const {
            width: 92%;

            .stratificationDetails-const-title {
                border-left: 6px solid #22AD7E;
                font-size: 26px;
                font-weight: 500;
                color: #1B1B1B;
                text-indent: 13px;
                margin-top: 30px;
            }

            .stratificationDetails-const-name {
                width: 100%;
                margin-top: 15px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                span {
                    display: flex;
                    width: 120px;
                    height: 50px;
                    background: #F4F4F4;
                    border-radius: 28px;
                    align-items: center;
                    justify-content: center;
                    margin-top: 20px;
                }

                .selected {
                    display: flex;
                    width: 120px;
                    height: 50px;
                    border-radius: 28px;
                    border: 1px solid #A8A8A8;
                    color: #333333;
                    background: #fff;
                }

                .selected1 {
                    display: flex;
                    width: 120px;
                    height: 50px;
                    background: #FFFFFF;
                    border-radius: 28px;
                    border: 1px solid #22AD7E;
                    color: #22AD7E;
                }
            }
        }
    }

    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        bottom: 0;
        background: #000;
        left: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;

        .mask-bulletFrame {
            width: 800px;
            min-height: 604px;
            max-height: 872px;
            background: #FFFFFF;
            box-shadow: 0px 17px 32px 0px rgba(0, 0, 0, 0.15);
            border-radius: 20px;
            box-sizing: border-box;

            .mask-bulletFrame-div {
                height: 60%;
            }

            .mask-bulletFrame-div1 {
                height: 40%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;

                .button {
                    width: 220px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    border-radius: 6px;
                }

                .cancel {
                    color: #DDDDDD;
                    border: 2px solid #DDDDDD;
                }

                .determine {
                    background: #22AD7E;
                    color: #fff;
                    margin-top: 20px;
                }
            }

            .mask-bulletFrame-title {
                width: 100%;
                height: 80px;
                border-bottom: 1px solid #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .title {
                    font-weight: 500;
                    color: #1B1B1B;
                    font-size: 32px;
                }

                .cross {
                    position: absolute;
                    right: 30px;

                    /deep/.van-icon {
                        font-size: 32px;
                        color: #626464;
                    }
                }
            }

            .mask-bulletFrame-remind {
                width: 800px;
                background: #FFFFFF;
                border-radius: 20px;
                font-weight: 400;
                color: #606060;
                font-size: 24px;
                margin-top: 28px;
                padding: 0 55px;
                box-sizing: border-box;
            }

            .mask-bulletFrame-select {
                width: 100%;
                min-height: 350px;
                padding: 20px 55px;
                box-sizing: border-box;

                .mask-bulletFrame-select-div {
                    width: 700px;
                    height: 60px;
                    margin: 0 auto;
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;

                    span {
                        font-size: 24px;
                        font-weight: 400;
                        color: #1B1B1B;
                    }

                    input {
                        width: 160px;
                        height: 60px;
                        background: #FFFFFF;
                        border-radius: 6px;
                        border: 2px solid #DDDDDD;
                        text-align: center;
                    }
                }

                /deep/.van-radio {
                    height: 56px;
                    width: 320px;
                    font-size: 30px;
                    display: flex;
                    align-items: center;
                    margin-top: 20px;

                    .van-radio__icon {
                        height: 35px;
                    }
                }

                /deep/.van-icon {
                    font-size: 30px;
                    border-radius: 50px;
                }
            }

            .mask-bulletFrame-bottom {
                width: 100%;
                height: 110px;
                display: flex;
                justify-content: space-around;

                .button {
                    width: 180px;
                    height: 65px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    border-radius: 6px;
                }

                .cancel {
                    background: #E6E6E6;
                }

                .determine {
                    background: #22AD7E;
                    color: #fff;
                }
            }
        }
    }

}

.air {
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .details-svg {
        width: 556px;
        height: 300px;
    }

    .details-text {
        font-size: 30px;
        color: #626464;
        margin-top: 40px;
    }
}

/deep/.van-radio__icon--checked+.van-radio__label {
    color: #22AD7E;
}
</style>
