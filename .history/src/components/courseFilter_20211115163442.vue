<template>
  <!--    <section class="course-filter-wrap"></section>-->
  <van-popup :close-on-click-overlay="false" v-model="show" position="bottom" :style="{ height: (type==='myCourse' || type==='error'||type==='fEducation')?'65%':'93%' }">
    <div class="course-filter-wrap">
      <van-overlay class-name="mask" :show="resourceDropdown||gradeDropdown||termDropdown||versionDropdown||classDropdown"
                   @click="gradeDropdown = false;termDropdown=false;versionDropdown=false;classDropdown=false;resourceDropdown=false"/>
      <!-- 资源  resourceName resourceDropdown-->
      <!-- <div v-show="this.type!='myCourse'" style="width:45%;margin:0 auto;" class="course-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="resourceDropdown=!resourceDropdown">
            {{resourceName[resourceIndex].name}}
            <van-icon v-show="resourceNameLength.length>1" :name="resourceDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="resourceDropdown&&resourceNameLength.length>1" class="dropdown-menu">
            <div class="dropdown-menu-item" :class="{active: resourceIndex== index}" v-for="(item,index) in resourceName"
                 :key="index" @click="changeResource(index)" v-show="item.active">{{item.name}}
              <van-icon v-show="resourceIndex == index " class="check blue" name="success"/>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 资源 -->
      <div class="course-filter-wrap__header van-hairline--bottom">
        <div v-if="type==='myCourse' || type==='error'" class="course-filter-wrap__header-tab">
          <span @click="handleSubject(item)" :class="{active:item.active}" v-for="(item, index) in subjectList"
                :key="index">{{item.value}}</span>
        </div>
        <div v-if="type!=='myCourse'&&type!=='fEducation'&&type!=='error'" class="course-filter-wrap__header-tab">
          <span>{{subjectName}}</span>
        </div>
        <div v-if="type==='fEducation'" class="course-filter-wrap__header-tab">
        </div>
        <van-icon v-if="type==='myCourse' || type==='error'|| type==='fEducation'" class="icon-close" @click="show=false" name="close" />
      </div>
      <div  v-if="type==='myCourse' || type==='error'||type === 'fEducation'" class="course-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div class="dropdown-title" @click="gradeDropdown=!gradeDropdown">
            {{gradeList[gradeIndex]?gradeList[gradeIndex].gradeName:'全部'}}
            <van-icon class="arrow" :name="gradeDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" :class="{active: gradeIndex === ''}" v-if="type === 'myCourse'||type === 'fEducation'" @click="changeGrade('')">全部
              <van-icon v-show="gradeIndex === '' " class="check blue" name="success" />
            </div>
            <div  class="dropdown-menu-item" :class="{active: gradeIndex === index}"
                 v-if="item.teacherInfoList.some(t => t.subjectType === subjectList.find(v => v.active).key)"
                 v-for="(item,index) in gradeList" :key="index" @click="changeGrade(index)">{{item.gradeName}}
              <van-icon v-show="gradeIndex === index " class="check blue" name="success"/>
            </div>
          </div>
        </div>

        <div>
          <div class="dropdown-title" @click="termDropdown=!termDropdown">
            <!--            {{termList[termIndex]?termList[termIndex].name:'学期'}}-->
            {{termList[termIndex]?termList[termIndex].name:'全部'}}
            <van-icon class="arrow" :name="termDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType('')" v-if="type==='myCourse'||type==='fEducation'" :class="{active: termIndex === ''}">全部
              <van-icon v-show="termIndex === '' " class="check blue" name="success" />
            </div>
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: termIndex === index}"
                 v-for="(item,index) in termList" :key="index">{{item.name}}
              <van-icon v-show="termIndex === index " class="check blue" name="success"/>
            </div>
          </div>
        </div>

        <div>
          <div class="dropdown-title" @click="classDropdown=!classDropdown">
            <!--            <span>{{classList[classIndex]?classList[classIndex].className:'班级'}}</span>-->
            <span>{{classList[classIndex]?classList[classIndex].className:'全部'}}</span>
            <van-icon class="arrow" :name="classDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="classDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeClass(0)" v-if="type==='myCourse'||type==='fEducation'" :class="{active: classIndex === 0}">全部
              <van-icon v-show="classIndex === 0" class="check blue" name="success" />
            </div>
            <div class="dropdown-menu-item" @click="changeClass(key)" :class="{active: classIndex === key}"
                 v-if="classVisible(value,key)" v-for="(value ,key) in classList" :key="key">{{value.className}}
              <van-icon v-show="classIndex === key" class="check blue" name="success"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="course-filter-wrap__dropdown van-hairline--bottom">
        <!-- 资源  resourceName resourceDropdown-->
        <div v-show="this.type!='myCourse'" style="width:45%;margin:0 auto;" class="course-filter-wrap__dropdown van-hairline--bottom">
          <div>
            <div @click="resourceDropdown=!resourceDropdown">
              {{resourceName[resourceIndex].name}}
              <van-icon v-show="resourceNameLength.length>1" :name="resourceDropdown?'arrow-up':'arrow-down'"/>
            </div>
            <div v-show="resourceDropdown&&resourceNameLength.length>1" class="dropdown-menu">
              <div class="dropdown-menu-item" :class="{active: resourceIndex== index}" v-for="(item,index) in resourceName"
                  :key="index" @click="changeResource(index)" v-show="item.active">{{item.name}}
                <van-icon v-show="resourceIndex == index " class="check blue" name="success"/>
              </div>
            </div>
          </div>
        </div>
      <!-- 资源 -->
      <!-- 班级 -->
        <div>
          <div class="ellipsisFater">
          <div class="ellipsis" @click="gradeDropdown=!gradeDropdown" v-if="classGradeList.length>0">
            {{classGradeList[gradeIndex].classGrade|getGradeName}}
          </div>
           <van-icon :name="gradeDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <!-- 公校才有中考复习班级 -->
            <div class="dropdown-menu-item" :class="{active: gradeIndex== index}" v-for="(item,index) in classGradeList"
                 :key="index" @click="changeGrade(index)" >{{item.classGrade|getGradeName}}
              <van-icon v-show="gradeIndex == index " class="check blue" name="success"/>
            </div>

          </div>
        </div>
      <!-- 班级 -->
      <!-- 班级 -->
          <!-- <div v-if="resourceIndex!=0">
          <div @click="gradeDropdown=!gradeDropdown" v-if="classGradeList.length>0">
            {{classGradeList[gradeIndex].classGrade|getGradeName}}
            <van-icon :name="gradeDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <div v-show="item.classGrade!='G09&1'" class="dropdown-menu-item" :class="{active: gradeIndex== index}" v-for="(item,index) in classGradeList"
                 :key="index" @click="changeGrade(index)" >{{item.classGrade|getGradeName}}
              <van-icon v-show="gradeIndex == index " class="check blue" name="success"/>
            </div>

          </div>
        </div> -->
        <!-- 班级 -->
        <!-- 学期 -->
        <div v-if="resourceIndex==0">
          <div @click="termDropdown=!termDropdown">{{termTypeList2[termIndex]|getTermName}}
            <van-icon :name="termDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div  v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: termIndex== index}"
                 v-for="(item,index) in termTypeList2" :key="index">{{item|getTermName}}
              <van-icon v-show="termIndex== index " class="check blue" name="success"/>
            </div>
          </div>
        </div>
        <!-- 学期 -->
        <!-- 阶段 -->
        <div v-if="resourceIndex==1||resourceIndex==2">
          <!-- {{classGradeList[gradeIndex].classGrade}} -->
          <div v-if="classGradeList[gradeIndex].classGrade=='G09&1'">
             <div @click="termDropdown=!termDropdown">{{termTypeList2[periodIndex]|getPeriodName}}
            <van-icon :name="termDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div  v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: periodIndex== index}"
                 v-for="(item,index) in termTypeList2" :key="index">{{item|getPeriodName}}
              <van-icon v-show="periodIndex== index " class="check blue" name="success"/>
            </div>
          </div>
          </div>
          <div v-else>
             <div @click="termDropdown=!termDropdown">{{periodTypeList[periodIndex]|getPeriodName}}
            <van-icon :name="termDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div  v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: periodIndex== index}"
                 v-for="(item,index) in periodTypeList" :key="index">{{item|getPeriodName}}
              <van-icon v-show="periodIndex== index " class="check blue" name="success"/>
            </div>
          </div>
          </div>
         
        </div>
        <!-- 阶段 -->
        <div>
          <div class="ellipsisFater">
          <div class="ellipsis" @click="versionDropdown=!versionDropdown" v-if="bookInfoList.length>0">
            {{bookInfoList[bookIndex].textBookName}}
          </div>
          <van-icon :name="versionDropdown?'arrow-up':'arrow-down'"/>
          </div>
          <div v-show="versionDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeBook(index)" :class="{active: bookIndex== index}"
                 v-for="(item ,index) in bookInfoList" :key="index">{{item.textBookName}}
              <van-icon v-show="bookIndex== index " class="check blue" name="success"/>
            </div>

          </div>
        </div>
      </div>
      <div class="course-filter-wrap__body">
        <div v-if="type!=='myCourse'||type!=='error'" class="course-filter-wrap__body-left">
          <div :class="unitIndex ==index?'active':'ellipsis' " v-for="(item,index) in unitList" :key="index" @click="handleUnit(index)">
            {{item.nodeName}}
          </div>
        </div>
        <div v-if="type!=='myCourse'||type!=='error'" class="course-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
            <div v-if="item.childNodeList && item.childNodeList.length>0">
              <div class="course-first van-hairline--bottom" @click="$set(item,'fold',!item.fold)"><span>{{item.nodeName}}</span>
                <van-icon class="down-arrow" v-show="item.childNodeList && item.childNodeList.length>0"
                          :name="item.fold?'arrow-up':'arrow-down'"/>
              </div>
              <div :class="['course-sec',{active:currentSysCourseId == c.courseId}]" v-show="item.fold"
                   @click="selectSysCourse(c.courseId,c.nodeName)" v-for="(c,ci) in item.childNodeList" :key="ci">
                {{c.nodeName}}
                <van-icon v-show="currentSysCourseId == c.courseId" class="check blue" name="success"/>
              </div>
            </div>
            <div v-else>
              <div :class="['course-sec',{active:currentSysCourseId == item.courseId}]"
                   @click="selectSysCourse(item.courseId,item.nodeName)"><span>{{item.nodeName}}</span>
                <van-icon v-show="currentSysCourseId == item.courseId" class="check blue" name="success"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="handleSubmit">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {getTextBookCourseInfo, getGradeTermInfo, getTextBookVersionByGradeTerm} from '@/api/index'
  //排序阶段
  function mySorter(a, b){
      if (/^dao\d/.test(a) ^ /^\D/.test(b)) return a>b?1:(a==b?0:-1);
      return a>b?-1:(a==b?0:1);
  }
  // 获取当前季节
  function myDate(){
    let m=new Date().getMonth()+1
    if(m == 3 || m == 4 || m == 5){
        // console.log("此月份是春季！");
        m=0
      }else if(m == 6 || m == 7 || m == 8){
        // console.log("此月份是夏季！");
        m=1
      }else if(m == 9 || m == 10 || m == 11){
        //  console.log("此月份是秋季！");
         m=2
      }else if(m == 12 || m == 1 || m == 2){
        //  console.log("此月份是冬季！");
         m=3
      }
      return m
  }
export default {
  name: "courseFilter",
  props: ['visible', 'sysCourseId', 'type','isfEducation'],
  data() {
    return {
      gradeDropdown: false,
      resourceDropdown:false,
      termDropdown: false,
      versionDropdown: false,
      unitList: [],
      unitIndex: 0,
      subjectList: [],
      // subjectList: {'S01':'语文','S02':'数学'},
      courseList: [],
      //sysCourseId:'',
      termTypeList: [],
      termIndex: ((new Date().getMonth() + 1) >= 2 && (new Date().getMonth() + 1) <= 7) ? 1 : 0,
      gradeTermList: this.$store.getters.getGradeTermInfo,
      subjectName: this.isfEducation?'家庭教育':localStorage.getItem("currentSubjectTypeName"),
      classGradeMap: [],
      gradeIndex: (this.type === 'myCourse') || (this.type === 'fEducation')  ? '' : 0,
      textBookList: [],
      bookIndex: 0,
      currentSysCourseId: this.sysCourseId,
      currentSysCourseName: '',
      isDeploy: false,
      classGradeList: [],
      bookInfoList: [],
      isNowTerm: 0,
      gradeTermMap: '',
      gradeList: JSON.parse(localStorage.getItem("gradeList")),
      // gradeList: JSON.parse(localStorage.getItem("gradeList")).filter(v => v.teacherInfoList.some(s => s.subjectype === localStorage.currentSubjectType)),
      termList: [{ name: '上学期', value: 'T01' }, { name: '下学期', value: 'T02' }],
      period: [{ name: '春季', value: 'P01' }, 
               { name: '夏季', value: 'P02' }, 
               { name: '秋季', value: 'P03' }, 
               { name: '冬季', value: 'P04' }],
      classList: JSON.parse(localStorage.getItem("classMap")),
      classDropdown: false,
      // classIndex: Object.keys(JSON.parse(localStorage.getItem("classMap")))[0],
      classIndex: '',
      showChangeDialog:false,
      resourceName:[
        {'name':'公校资源','active':true},
        {'name':'全朗智教','active':localStorage.getItem('ifQuanlangAccount')==1?true:false},
        {'name':'君韬教育','active':localStorage.getItem('ifJuntaoAccount')==1?true:false}
      ],
      resourceIndex:0, //资源索引
      bookTypeIn:'',
      periodIn:'',
      periodTypeList:'',
      termTypeList2:'',
      periodIndex:''
    }
  },
  computed: {
    show: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    },
  },
  async mounted() {
    if (this.type === 'myCourse' || this.type === 'error' || this.type === 'fEducation') {
      // this.getTextBookCourseInfo()
    } else {
      //获取上下学期
      let now = new Date();
      let month = now.getMonth() + 1;
      if (7 >= month && month >= 2) {
        this.isNowTerm = 1
      } else {
        this.isNowTerm = 0
      }
      //学科信息获取
      if (localStorage.getItem("deployList")) {
        //先查出当前学科有哪些年级
        let gradeArr = []

        if (this.isfEducation) {
          for (let k in JSON.parse(localStorage.getItem("classMap"))) {
          if (JSON.parse(localStorage.getItem("classMap"))[k].teacherInfoList.some(s => s.subjectType === 'S20')) {
            if (!gradeArr.includes(JSON.parse(localStorage.getItem("classMap"))[k].classGrade)) {
              gradeArr.push(JSON.parse(localStorage.getItem("classMap"))[k].classGrade)
            }
          }
        }
        }else{
          for (let k in JSON.parse(localStorage.getItem("classMap"))) {
          if (JSON.parse(localStorage.getItem("classMap"))[k].teacherInfoList.some(s => s.subjectType === localStorage.currentSubjectType)) {
            if (!gradeArr.includes(JSON.parse(localStorage.getItem("classMap"))[k].classGrade)) {
              gradeArr.push(JSON.parse(localStorage.getItem("classMap"))[k].classGrade)
            }
          }
        }
        }
        
        //筛选对应的年级
        if (gradeArr.includes("G09")) {
          gradeArr.push("G09&1")
        }
        this.classGradeList = JSON.parse(localStorage.getItem("deployList")).filter(v => gradeArr.includes(v.classGrade));
        console.log(this.classGradeList,'this.classGradeList')
        let tempList = this.classGradeList[this.gradeIndex].bookInfo
        console.log(tempList,'tempList')
        let sub = localStorage.getItem("currentSubjectType")
        // this.bookInfoList = []
        // tempList.forEach((item) => {
        //   if (item.subjectType == sub) {
        //     this.bookInfoList.push(item)
        //   }
        // });
        this.termTypeList = this.classGradeList[this.gradeIndex].termInfo
        // console.log(this.classGradeList[this.gradeIndex].termInfo,'this.classGradeList[this.gradeIndex].termInfo')
        console.log(this.termTypeList,'this.termTypeListaaaaaaaaa')
      
      console.log(this.termTypeList,'this.termTypeList')
        if (this.termTypeList && this.termTypeList.length > 1) {
          if (this.isNowTerm === 1) {
            this.termTypeList.forEach((item, index) => {
              if (item == "T02") {
                this.termIndex = index
              }
            })
          } else {
            this.termTypeList.forEach((item, index) => {
              if (item == "T01") {
                this.termIndex = index
              }
            })
          }
        } else {
          this.termIndex = 0
          
        }
        this.$emit('init', this.classGradeList[this.gradeIndex].classGrade.split("&")[0], this.termTypeList[this.termIndex])
        this.isDeploy = true;
      } else {
        this.$toast("未配置年级学科信息")
      }

        if (localStorage.getItem('gradeTermMap')) {
          this.gradeTermMap = JSON.parse(localStorage.getItem("gradeTermMap"))
          await this.getTextBookVersionByGradeTerm(this.bookTypeIn,this.periodIn)
        } else {
          this.$toast("年级信息错误")
        }
        if (this.isDeploy) {
          this.getTextBookCourseInfo()
        }
      }
        // 处理公校学期
         this.termTypeList2=function(o){
            let array=new Array();
            for(var i in o){
            if(o[i].indexOf('P')==-1)
            array.push(o[i]);
          }
            return array;
          }(this.termTypeList);
          console.log(this.termTypeList2,'arrrrrrrr');
          console.log( this.termTypeList,' this.termTypeList1aa')
  },
  created() {
    console.log(myDate(),'当前季节')
     //阶段
    this.periodIndex=myDate()
    console.log(this.resourceName,'resourceName初始')
    this.resourceNameLength=this.resourceName.filter(item=>item.active===true)
    console.log(this.resourceNameLength,'this.resourceNameLength')
    console.log(this.resourceName,'resourceName初始')
    if (this.type === 'fEducation' ||this.isfEducation) {
      this.subjectList.push({
        key: 'S20',
        value: '家庭教育',
        active: true
      })
      // for (let key in JSON.parse(localStorage.getItem("classMap"))) {
      //   const value = JSON.parse(localStorage.getItem("classMap"))[key]
      //   if (this.gradeList[this.gradeIndex].classGrade === value.classGrade && value.teacherInfoList.some(v => v.subjectType === "S20")) {
      //     this.classIndex = key
      //     break
      //   }
      // }
      this.initClassIndex()
    } else {
      for (let key in JSON.parse(localStorage.getItem("subjectTypeList"))) {
        this.subjectList.push({
          key,
          value: JSON.parse(localStorage.getItem("subjectTypeList"))[key],
        })
      }
      const index = this.subjectList.findIndex(v => localStorage.getItem("currentSubjectType") === v.key)
      this.$set(this.subjectList[index], 'active', true)
      this.initClassIndex()
    }
  },
  methods: {
    async getTextBookVersionByGradeTerm(bookTypeIn,periodIn) {
      this.$store.commit('setVanLoading', true)
      if(this.resourceIndex==0){
        if(this.termTypeList2&&this.termTypeList2.length<6){
          let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList2[this.termIndex];
        console.log(key,'key111222')
        var gradeId = this.gradeTermMap[key]
        }else{
        let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList[this.termIndex];
        var gradeId = this.gradeTermMap[key]
        console.log(key,'key111222222')
        console.log(this.termTypeList2,'this.termTypeList2')
         }
      }else{
        if(this.classGradeList[this.gradeIndex].classGrade=='G09&1'){
          let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList2[this.periodIndex];
          console.log(this.termTypeList2,'this.periodTypeList')
          console.log(key,'key2222a')
          var gradeId = this.gradeTermMap[key]
        }else{
          let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.periodTypeList[this.periodIndex];
          console.log(this.periodTypeList,'this.periodTypeList')
          var gradeId = this.gradeTermMap[key]
        }
        
      }
      console.log(this.termTypeList,'123')
      console.log(this.termTypeList2,'456')
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "gradeTermId": gradeId,
        "subjectType": this.isfEducation?'S20':localStorage.getItem("currentSubjectType"),
        'bookTypeIn':bookTypeIn,
        'periodIn':periodIn,

      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getTextBookVersionByGradeTerm(params).then(res => {
        this.$store.commit('setVanLoading', false)
        this.bookIndex = 0
        if (res.flag) {
          this.bookInfoList = res.data || []
        } else {
          this.bookInfoList = []
          return this.$toast(res.msg)
        }
      })
    },
    close() {
      this.showChangeDialog = false
      this.$dialog.close()
    },
    initClassIndex() {
      if (this.type === 'myCourse' || this.type === 'fEducation') {
        this.classIndex = 0
      } else {
        for (let key in JSON.parse(localStorage.getItem("classMap"))) {
          const value = JSON.parse(localStorage.getItem("classMap"))[key]
          if (this.gradeList[this.gradeIndex].classGrade.split("&")[0] === value.classGrade && value.teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType)) {
            this.classIndex = key
            break
          }
        }
      }
    },
    classVisible(value, key) {
      if (this.gradeIndex === '') {
        if (this.type === 'fEducation') {
          return value.teacherInfoList.some(v => v.subjectType === "S20")
        }
        return value.teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType)
      } else {
        return (this.gradeList[this.gradeIndex].classGrade.split("&")[0] === value.classGrade && value.teacherInfoList.some(v => v.subjectType === localStorage.currentSubjectType))
      }

    },
    handleSelect(item) {
      this.courseList.forEach(v => {
        v.child.forEach(_v => {
          this.$set(_v, 'check', false)
        })
      })
      this.$set(item, 'check', !item.check)
    },
    handleSubject(item) {
      if (item.active) return
      this.showChangeDialog = true
      this.$dialog.confirm({
        title: '提示',
        message: '是否进行科目的切换？科目切换后，首页的科目也将进行切换',
        closeOnPopstate: true,
        confirmButtonColor: '#39F0DD',
        className: 'change-subject'
      }).then(() => {
        this.showChangeDialog = false
        this.subjectList.forEach(v => {
          v.active = false
        })
        item.active = true
        localStorage.setItem("currentSubjectTypeName", item.value);
        localStorage.setItem("currentSubjectType", item.key);
        this.gradeIndex = this.type === 'myCourse' ? '' : 0
        this.initClassIndex()
        // this.getTextBookCourseInfo()
      }).catch(() => {
        this.showChangeDialog = false
        // on cancel
      });
    },
    handleUnit(index) {
      this.unitIndex = index;
      this.courseList = this.unitList[this.unitIndex].courseList
    },

      async getTextBookCourseInfo() {
        this.$store.commit('setVanLoading', true)
        this.unitIndex = 0
        // this.bookIndex = 0
        // this.unitList = []
        // this.courseList = []
        let obj
        if (this.type === 'myCourse' || this.type === 'error') {
          obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "termType": this.termList[this.termIndex].value, //学期
            "classGrade": this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].classGrade.split("&")[0] : '', //年级
            "classId": this.classIndex || '', //班级
            "subjectType": this.isfEducation?"S20":localStorage.getItem("currentSubjectType") //科目
          }
        } else {
          //年级计算
          // let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList[this.termIndex];
          // let gradeId = this.gradeTermMap[key]
          if(this.resourceIndex==0){
             if(this.termTypeList2&&this.termTypeList2.length<6){
              let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList2[this.termIndex];
            console.log(key,'key111222')
            var gradeId = this.gradeTermMap[key]
            }else{
            let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList[this.termIndex];
            var gradeId = this.gradeTermMap[key]
           }
          }else{
            if(this.classGradeList[this.gradeIndex].classGrade=='G09&1'){
              let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList2[this.periodIndex];
              console.log(this.termTypeList2,'this.periodTypeList')
              console.log(key,'key2222a')
              var gradeId = this.gradeTermMap[key]
            }else{
              let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.periodTypeList[this.periodIndex];
              console.log(this.periodTypeList,'this.periodTypeList')
              console.log(key,'key2222a')
              var gradeId = this.gradeTermMap[key]
            }
          }
          
          if (!this.bookInfoList.length || !this.bookInfoList[this.bookIndex].textBookId) {
            this.$store.commit('setVanLoading', false)
            // this.$toast("版本配置错误")
            this.$toast("当前无配置版本，请先在后台配置")
            this.courseList = []
            this.unitList = []
            this.unitIndex = 0
            return
          }
          obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "textBookId": this.bookInfoList[this.bookIndex].textBookId,
            "gradeTermId": gradeId,
            "subjectType": this.isfEducation?"S20":localStorage.getItem("currentSubjectType")
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }

        getTextBookCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          console.log("课程：", res)
          if (res.flag) {
            //重构数据
            let textBookList = res.resTextbookCourseInfoList
            if (textBookList) {
              //1.找出第一个节点
              let nodeId = "-1";
              for (let book of textBookList) {
                if (book.parentId == -1) {
                  nodeId = book.nodeId
                  break
                }
              }

              //2.获取左侧列表
              this.unitList = []
              let textBookMap = {}
              let list = []
              textBookList.forEach(item => {
                //按照parentId分组
                if (!textBookMap[item.parentId + '']) {
                  textBookMap[item.parentId + ''] = [item]
                } else {
                  textBookMap[item.parentId + ''].push(item)
                }
                if (item.parentId == nodeId) {
                  this.unitList.push(item)
                }
              })
              //3.组件每单元下的数据
              this.unitList.forEach(item => {
                let tmp = textBookMap[item.nodeId + '']
                if (tmp) {
                  tmp.forEach(obj => {
                    obj.childNodeList = textBookMap[obj.nodeId + '']
                  })
                  item.courseList = tmp
                }
              })
              if(this.unitList.length) {
                this.courseList = this.unitList[this.unitIndex].courseList
              }else {
                this.courseList = []
              }
            }
          } else {
            this.$toast(res.msg)
            this.courseList = []
            this.unitList = []
            this.unitIndex = 0
          }

      })
    },
    selectSysCourse(id, name) {
      this.currentSysCourseId = id
      this.currentSysCourseName = name
    },
    changeClass(key) {
      this.classIndex = key
      this.classDropdown = false
      // this.getTextBookCourseInfo()
    },
    async changeTermType(index) {  //点击学期
    console.log(index,'111111111111')
        if(this.resourceIndex==0){
          this.bookTypeIn='' // 公校资源
          this.periodIn=""
        }else if(this.resourceIndex==1){
            console.log('111111111111111111')
            console.log(this.termTypeList[index],'termTypeList')
            console.log(index)
          this.bookTypeIn='B03' // 全朗资源
          this.periodIn="P01,P02,P03,P04"
        }else if(this.resourceIndex==2){
          this.bookTypeIn='B05' // 君韬资源
          this.periodIn=""
        }
      this.termIndex = index
      this.periodIndex=index
      this.termDropdown = !this.termDropdown
      if (this.type === 'myCourse' || this.type === 'error' || this.type === 'fEducation') {
        // this.getTextBookCourseInfo()
      } else {
        await this.getTextBookVersionByGradeTerm(this.bookTypeIn,this.periodIn)
        this.getTextBookCourseInfo()
      }
    },
    async changeGrade(index) {
      console.log('11111111111',index)
      console.log(this.resourceIndex,'资源索引11')
      if (this.type === 'myCourse' || this.type === 'error'|| this.type === 'fEducation') {
        this.gradeIndex = index
        this.initClassIndex()
        this.gradeDropdown = !this.gradeDropdown
        this.resourceDropdown=!this.resourceDropdown
        // this.getTextBookCourseInfo()
      } else {
        this.gradeIndex = index
        console.log('aa')
          let tempList = this.classGradeList[index].bookInfo
          let sub = localStorage.getItem("currentSubjectType")
          // this.bookInfoList = []
          // tempList.forEach((item) => {
          //   if (item.subjectType == sub) {
          //     this.bookInfoList.push(item)
          //   }
          // });
          // this.termTypeList = this.classGradeList[index].termInfo
          console.log(this.classGradeList[index].termInfo,'this.classGradeList[index].termInfo')
          this.termTypeList2 = this.classGradeList[index].termInfo
          console.log(this.termTypeList,'aaaaaaaaa')
          if (this.termTypeList && this.termTypeList.length > 1) {
            if (this.isNowTerm === 1) {
              this.termTypeList.forEach((item, index) => {
                if (item == "T02") {
                  this.termIndex = index
                }
              })
            } else {
              this.termTypeList.forEach((item, index) => {
                if (item == "T01") {
                  this.termIndex = index
                }
              })
            }
          } else {
            this.termIndex = 0
          }

        this.gradeDropdown = !this.gradeDropdown ///
        // this.resourceDropdown=!this.resourceDropdown
        if(this.resourceIndex==0){
          this.bookTypeIn='' // 公校资源
          this.periodIn=""
        }else if(this.resourceIndex==1){
          console.log('111111111111111111')
          this.bookTypeIn='B03' // 公校资源
          this.periodIn="P01,P02,P03,P04"   
          console.log(this.termTypeList2,'2222222')  
          if(this.termTypeList2.length<6){
            this.periodIndex=1
          }    
        }else if(this.resourceIndex==2){
          this.bookTypeIn='B05' // 君韬资源
          this.periodIn=""
          if(this.termTypeList2.length<6){
            this.periodIndex=1
          } 
        }
        await this.getTextBookVersionByGradeTerm(this.bookTypeIn,this.periodIn)
        this.getTextBookCourseInfo()
      }
    },
    //点击资源
    async changeResource(index) {
      console.log(index,'资源索引')
      if(index==0){
         this.bookTypeIn='' // 公校资源
         this.periodIn=""
          // 去掉数组里面P开头的值
          this.termTypeList2=function(o){
            let array=new Array();
            for(var i in o){
            if(o[i].indexOf('P')==-1)
            array.push(o[i]);
          }
            return array;
          }(this.termTypeList);
           this.termIndex= ((new Date().getMonth() + 1) >= 2 && (new Date().getMonth() + 1) <= 7) ? 1 : 0,
          console.log(this.termTypeList2,'arrrrrrrr');
          console.log( this.termTypeList,' this.termTypeList1aa')
          this.gradeIndex=0
      }else if(index==1){
          console.log('111111111111111111')
          this.periodTypeList=function(o){
              let array=new Array();
              for(var i in o){
              if(o[i].indexOf('T')==-1)
              array.push(o[i]);
            }
              return array;
            }(this.termTypeList);
            console.log(this.termTypeList,'1111111111')
            console.log(this.periodTypeList,'arrrrrrrr');
          // 全朗资源排序阶段
          this.periodTypeList=this.periodTypeList.sort(mySorter)
          // console.log(this.periodTypeList,'this.periodTypeList')

         this.bookTypeIn='B03' // 全朗资源
         this.periodIn="P01,P02,P03,P04"
         // 阶段
         this.periodIndex=myDate()
         this.gradeIndex=0
      }else if(index==2){
         this.bookTypeIn='B05' // 君韬资源
         this.periodIn=""
        //  this.termIndex= ((new Date().getMonth() + 1) >= 2 && (new Date().getMonth() + 1) <= 7) ? 1 : 0
          this.periodTypeList=function(o){
              let array=new Array();
              for(var i in o){
              if(o[i].indexOf('T')==-1)
              array.push(o[i]);
            }
              return array;
            }(this.termTypeList);
            console.log(this.periodTypeList,'arrrrrrrr');
          // 全朗资源排序阶段
          this.periodTypeList=this.periodTypeList.sort(mySorter)
          this.periodIndex=myDate()
          this.gradeIndex=0
      }
      this.resourceIndex=index
      this.resourceDropdown = !this.resourceDropdown
      if (this.type === 'myCourse' || this.type === 'error' || this.type === 'fEducation') {
        // this.getTextBookCourseInfo()
      } else {
        await this.getTextBookVersionByGradeTerm(this.bookTypeIn,this.periodIn)
        this.getTextBookCourseInfo()
      }
    },
    changeBook(index) {
      this.bookIndex = index
      this.versionDropdown = !this.versionDropdown
      this.getTextBookCourseInfo()
    },
    handleSubmit() {
      this.show = false
      this.$emit('update:visible', false)
      this.$emit('update:sysCourseId', this.currentSysCourseId)
      if (this.type === 'myCourse' || this.type === 'error'||this.type === 'fEducation') {
        this.$emit('confirm', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].classGrade : '', this.termList[this.termIndex] ? this.termList[this.termIndex].value : '', this.classIndex > 0 ? this.classIndex : '', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].gradeName : '', this.termList[this.termIndex] ? this.termList[this.termIndex].name : '', this.classIndex > 0 ? this.classList[this.classIndex].className : '')
      }
      //  else if (this.type === 'fEducation') {
      //   this.$emit('confirm', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].classGrade : '', this.termList[this.termIndex] ? this.termList[this.termIndex].value : '', this.classIndex > 0 ? this.classIndex : '', this.gradeList[this.gradeIndex] ? this.gradeList[this.gradeIndex].gradeName : '', this.termList[this.termIndex] ? this.termList[this.termIndex].name : '', this.classIndex > 0 ? this.classList[this.classIndex].className : '')
      // }
      else {
        this.$parent.handleSysCourse(this.currentSysCourseName, this.currentSysCourseId, this.classGradeList[this.gradeIndex].classGrade, this.termTypeList[this.termIndex])
      }
    },


    }
  }
</script>

<style lang="less" scoped>
  .course-filter-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    .mask {
      background: transparent;
    }

    &__header {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      &-tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-right: 35px;
          font-size: 16px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }
      }

      .icon-close {
        font-size: 22px;
        color: #ccc;
      }
    }

    &__dropdown {
      display: flex;
      flex: 0 0 44px;

      > div {
        flex: 1;
        font-size: 16px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ccc;
        position: relative;
        min-width: 0;

        &:last-child {
          border-right: none;
        }

        .dropdown-menu {
          position: absolute;
          width: 100%;
          top: 44px;
          left: 0;
          z-index: 2;
          box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
          color: #333;
          font-size: 14px;
          background: #fff;
          max-height: 180px;
          overflow-y: auto;

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }

      .dropdown-title {
        min-width: 0;
        padding: 0 5px;
        display: flex;
        align-items: center;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }

        .arrow {
          margin-left: 3px;
        }
      }
    }

    &__body {
      display: flex;
      flex: 1;
      overflow: hidden !important;

      &-left {
        flex: 0 0 125px;
        overflow-y: auto;

        > div {
          line-height: 44px;
          color: #000;
          font-size: 15px;
          text-align: center;
          border-left: 3px solid transparent;

          &.active {
            border-left: 3px solid #16aab7;
            color: @blue;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;

        .course-first {
          height: 44px;
          display: flex;
          align-items: center;
          color: #000;
          font-size: 14px;
          padding-right: 10px;
          word-break: break-all;
          justify-content: space-between;

          .down-arrow {
            flex: 0 0 20px;
            text-align: right;
          }
        }

        .course-sec {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 12px;
          padding: 0 5px;
          word-break: break-all;

          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }

          &:last-child {
            border-bottom: 1px solid #ebedf0;
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 6px 10px;

      .confirm-btn {
        width: 100%;
        color: #fff;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
  .ellipsisFater{
    display:flex;
    max-width:100%;
    padding:0 3px
  }
  .ellipsis {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
</style>
