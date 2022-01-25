import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/home";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/course",
    },
    {
      //课程
      path: "/course",
      name: "course",
      component: () => import("./views/course/index.vue")
    },
    {
      //课程详情
      path: "/courseDetails",
      name: "courseDetails",
      component: () => import("./views/courseDetails/index.vue"),
      children: [
        {
          path: "/courseDetails/inClass",
          name: "inClass",
          redirect: '/courseDetails/inClass/lectureList',
          component: () => import("./views/courseDetails/inClass/index.vue"),
          children: [
            {
              path: "/courseDetails/inClass/lectureList",
              name: "lectureList",
              component: () => import("./views/courseDetails/inClass/lectureList.vue")
            },
            {
              path: "/courseDetails/inClass/classStatList",
              name: "classStatList",
              component: () => import("./views/courseDetails/inClass/classStatList.vue")
            },
            {
              path: "/courseDetails/inClass/boardDetail",
              name: "boardDetail",
              component: () => import("./views/courseDetails/inClass/boardDetail.vue")
            },
          ]
        },
        {
          path: "/courseDetails/preview",
          name: "preview",
          component: () => import("./views/preview/index.vue")
        },
        {
          path: "/questionList",
          name: "questionList",
          component: () => import("./views/resource/questionList.vue"),
          meta: {
            isShowHeader: true,
            title: '试题'
          }
        },
        {
          path: "/examList",
          name: "examList",
          component: () => import("./views/resource/examList.vue"),
          meta: {
            isShowHeader: true,
            title: "试卷"
          }
        },

        {
          path: "/materialList",
          name: "materialList",
          component: () => import("./views/resource/materialList.vue"),
          meta: {
            isShowHeader: true,
            title: "素材"
          }
        },
        {
          path: "/materialDetail",
          name: "materialDetail",
          component: () => import("./views/resource/materialDetail.vue")
        },
        {
          path: "/videoPage",
          name: "videoPage",
          component: () => import("./views/resource/videoPage.vue")
        },
        {
          path: "/preview",
          name: "preview",
          component: () => import("./views/preview/index.vue")
        },


      ]
    },
    {
      path: "/inClassDetail",
      name: "inClassDetail",
      component: () => import("./views/courseDetails/inClassDetail.vue"),
      children: [
        {
          path: "/inClassDetail/statistic",
          name: "statistic",
          component: () => import("./views/preview/statistic.vue")
        },
        {
          path: "/inClassDetail/examDetail",
          name: "examDetail",
          component: () => import("./views/resource/examDetail.vue")
        },
        {
          path: "/inClassDetail/examView",
          name: "examView",
          component: () => import("./views/preview/examView.vue")
        },
        {
          path: "/inClassDetail/detailedOralStatistics",
          name: "detailedOralStatistics",
          component: () => import("./views/preview/detailedOralStatistics.vue")
        },
        {
          path: "/inClassDetail/questionDetail",
          name: "questionDetail",
          component: () => import("./views/resource/questionDetail.vue")
        },
        {
          path: "/inClassDetail/subjectAnalyse",
          name: "subjectAnalyse",
          component: () => import("./views/preview/subjectAnalyse.vue"),
          meta: {
            isShowHeader: true,
            title: "题目分析"
          }
        },

        {
          path: "/inClassDetail/subjectList",
          name: "subjectList",
          component: () => import("./views/preview/subjectList.vue"),
          meta: {
            isShowHeader: true,
            title: "作答情况"
          }
        },
        {
          path: "/addSubScore",
          name: "addSubScore",
          component: () => import("./views/preview/addSubScore.vue"),
          meta: {
            isShowHeader: true,
            title: "加分/减分"
          }
        },
        {//课件
          path: "/inClassDetail/courseware",
          name: "courseware",
          component: () => import("./views/courseDetails/taskDetails/courseware.vue")
        },
        {//讨论
          path: "/inClassDetail/discussion",
          name: "discussion",
          component: () => import("./views/courseDetails/taskDetails/discussion.vue")
        },
        {//心得
          path: "/inClassDetail/experience",
          name: "experience",
          component: () => import("./views/courseDetails/taskDetails/experience.vue")
        },
        {//微课
          path: "/inClassDetail/microlecture",
          name: "microlecture",
          component: () => import("./views/courseDetails/taskDetails/microlecture.vue")
        },
        {
          path: '/inClassDetail/spoken',
          name: "spoken",
          component: () => import("./views/preview/spoken.vue")
        }
        
      ]
    },
    {
      path: "stratification",
      name: "stratification",
      component: () => import("./views/courseDetails/stratification/classroomStratification.vue"),
      children: [
        // 数据统计
        {
          path: "/stratification/statistics",
          name: "statistics",
          component: () => import("./views/courseDetails/stratification/statistics.vue"),
        },
        {
          path: "/stratification/stratification",
          name: "stratification",
          component: () => import("./views/courseDetails/stratification/stratification.vue"),
        },
      ]
    }
  ]
});
