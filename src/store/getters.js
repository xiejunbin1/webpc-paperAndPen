/*
 * @Author: yhy
 * @Date: 2021-01-26 14:02:34
 * @LastEditTime: 2021-03-05 14:38:29
 * @LastEditors: wgj
 * @Description: 
 */
// import { parentGetters } from "./modules/parent-GFY";

const getters = {
  schoolId: state => {
    // const schoolMap =
    //   state.user.schoolMap ||
    //   (localStorage.getItem("schoolMap")
    //     ? JSON.parse(localStorage.getItem("schoolMap"))
    //     : "");
    return state.user.userInfo.schoolId ? state.user.userInfo.schoolId : "";
  },
  schoolIdList: () => {
    const schoolMap = localStorage.getItem("schoolMap")
      ? JSON.parse(localStorage.getItem("schoolMap"))
      : "";
    return schoolMap ? Object.keys(schoolMap).join() : "";
  },
  vanLoading: state => state.setting.vanLoading,
  getUserInfo: state =>
    state.user.userInfo || JSON.parse(localStorage.getItem("userInfo")),
  getThirdInfo: state =>
    state.user.thirdInfo || JSON.parse(localStorage.getItem("thirdInfo")),
  getGrade: state => state.user.grade || localStorage.getItem("grade"),
  getSearchInfo: state =>
    state.user.searchInfo || JSON.parse(localStorage.getItem("searchInfo")),
  getArticleInfo: state =>
    state.user.articleInfo || JSON.parse(localStorage.getItem("articleInfo")),
  getArticleScroll: state =>
    state.user.articleScroll ||
    JSON.parse(localStorage.getItem("articleScroll")),
  getRecommentList: state =>
    state.user.recommentList ||
    JSON.parse(localStorage.getItem("recommentList")),
  getLastArticle: state =>
    state.user.lastArticle || JSON.parse(localStorage.getItem("lastArticle")),
  getTempGradeIndex: state => state.teachStat.tempGradeIndex,
  getTempSubjectIndex: state => state.teachStat.tempSubjectIndex,
  getSubjectIndex: state => state.teachStat.subjectIndex,
  getGradeIndex: state => state.teachStat.gradeIndex,
  getClassIndex: state => state.teachStat.classIndex,
  getInterlGradeList: state => state.teachStat.interlGradeList,
  getInterlClassIndex: state => state.teachStat.interlClassIndex,
  getTimeRangeActive: state => state.teachStat.timeRangeActive,
  // ...parentGetters
  // new----
  getExamDetailData: state =>
    state.course.examDetailData || JSON.parse(localStorage.getItem("examDetailData")),
  getStatisticData: state =>
    state.course.statisticData || JSON.parse(localStorage.getItem("statisticData")),
  getBaseData: state =>
    state.course.baseData || JSON.parse(localStorage.getItem("baseData")),
  getHideSomeThing: state =>
    state.course.hideSomeThing || JSON.parse(localStorage.getItem("hideSomeThing")),
  getQuerySocket: state =>
    state.course.querySocket || JSON.parse(localStorage.getItem("querySocket")),

  getHierarchicalListShow: state => 
    state.course.hierarchicalListShow || JSON.parse(localStorage.getItem("hierarchicalListShow")),
  getHierarchicalListItem: state =>
    state.course.hierarchicalListItem || JSON.parse(localStorage.getItem("hierarchicalListItem")),
  getUseThisLayering: state => 
    state.course.useThisLayering || JSON.parse(localStorage.getItem("useThisLayering")),
  getLayerUserStatus: state => 
    state.course.layerUserStatus || JSON.parse(localStorage.getItem("layerUserStatus")),
  getHierarchicalTaskName: state => 
    state.course.hierarchicalTaskName || JSON.parse(localStorage.getItem("hierarchicalTaskName")),
  // getCurrentStratification: state => 
  //   state.course.currentStratification || JSON.parse(localStorage.getItem("currentStratification")),
  getPushstatus: state => 
    state.course.pushstatus || JSON.parse(localStorage.getItem("pushstatus")),
  getListOfTestQuestions: state =>
    state.course.listOfTestQuestions || JSON.parse(localStorage.getItem("listOfTestQuestions")),
  getIsLoading: state => 
    state.course.isLoading || JSON.parse(localStorage.getItem("isLoading")),
  getBonusPoints: state => 
    state.course.bonusPoints || JSON.parse(localStorage.getItem("bonusPoints")),
  getNumberOfUnfinished: state =>
    state.course.numberOfUnfinished || JSON.parse(localStorage.getItem("numberOfUnfinished")),
  getAllRight:  state =>
    state.course.allRight || JSON.parse(localStorage.getItem("allRight")),
};
export default getters;
