<template>
  <div class="score-table">
    

    <div v-else>
      <el-table :data="listArr" width="100%" class="table-class" height="76vh" :border="false" stripe :header-cell-style="tableHeaderColor" v-show="classView">
        <el-table-column align="center" fixed min-width="180" prop="name" label="学生姓名">
          <template slot-scope="scope">
            <span> {{ scope.row.name }}</span>
            <br />
            <span class="orange"> （{{ scope.row.studentRewardScore || 0 }}）</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="180" prop="endDate" label="完成时间"> </el-table-column>
        <!-- <el-table-column align="center" width="180" v-if="isWk" prop="duration" label="看视频总时"> </el-table-column> -->
        <el-table-column align="center" min-width="180" prop="duration" label="测试总用时"> </el-table-column>
        <el-table-column align="center" min-width="160" prop="score" label="测试得分">
          <template slot-scope="scope">
            <div>{{ scope.row.score | rounding }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120" v-for="(item, index) in examAnswerList" :key="index" :label="item.exam_number + ''">
          <template slot-scope="scope">
            <div class="row-item-I01" v-if="scope.row.examAnswerList[index].is_rigth == 'I01'"><svg-icon icon-class="icon-right" /></div>
            <div class="row-item-I02" v-if="scope.row.examAnswerList[index].is_rigth == 'I02'">
              <svg-icon icon-class="icon-semilogarithm" />
            </div>
            <div class="row-item-I03" v-if="scope.row.examAnswerList[index].is_rigth == 'I03'"><svg-icon icon-class="icon-mistake" /></div>
            <div v-if="scope.row.examAnswerList[index].is_rigth == null || scope.row.examAnswerList[index].is_rigth == ''">--</div>
          </template>
        </el-table-column>
        
        <el-table-column align="center" fixed="right" min-width="260" label="奖励">
          <template slot-scope="scope">
            <div class="row-item-award">
              <span class="icon-be-improved" @click="$emit('saveRewardScore', scope.row, 'T02', 'class')"><svg-icon icon-class="icon-be-improved" />待改进</span>
              <span class="icon-award" @click="$emit('saveRewardScore', scope.row, 'T01', 'class')"><svg-icon icon-class="icon-award" />奖励</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        type="index"
        width="100%"
        height="76vh"
        sort-orders="['ascending', 'descending']" 
        @sort-change="sortChange"
        class="table-group"
        
        :data="dataArr"
        stripe
        :header-cell-style="tableHeaderColor"
        v-show="!classView"
      >
        <el-table-column align="center" fixed width="180" prop="groupName" label="组名">
          <template slot-scope="scope">
            <!-- {{ groupArr[0].stu[0].name }} -->
            <span v-if="scope.row.groupName"> {{ scope.row.groupName }}</span>
            <span v-else>未分组</span>
            <br />
            <span class="orange"> （{{ scope.row.groupScore || 0 }}）</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="average" min-width="130" sortable="custom" label="平均分"> </el-table-column>
        <!-- <el-table-column align="center" prop="name" label="学生姓名"> </el-table-column> -->
        <el-table-column align="center" min-width="280" prop="endDate" label="完成时间">
          <template slot-scope="scope">
            <div class="stu-class" v-for="r in scope.row.stu">{{ r.endDate }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="180" prop="duration" label="测试总用时">
          <template slot-scope="scope">
            <div class="stu-class" v-for="r in scope.row.stu">{{ r.duration }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" prop="score" label="测试得分">
          <template slot-scope="scope">
            <div class="stu-class" v-for="r in scope.row.stu">{{ r.score | rounding }}</div>
          </template>
        </el-table-column>

        <el-table-column label="学生姓名" align="center" prop="stu" width="120" v-if="groupArr.length > 0">
          <!-- <el-table-column v-for="(item, idx) in groupArr" :key="idx"> -->
          <template slot-scope="scope">
            <!-- <div class="row-item-I01" v-if="scope.row.groupArr[0].stu[idx].name">{{ scope.row.groupArr[0].stu[idx].name }}</div> -->
            <div class="stu-class" v-for="r in scope.row.stu">{{ r.name }}</div>
          </template>
          <!-- </el-table-column> -->
        </el-table-column>
        <el-table-column align="center" min-width="120" v-for="(item, index) in examAnswerList1" :key="index" :label="item.exam_number + ''">
          <template slot-scope="scope">
            <div class="stu-class" v-for="(r,rdx) in scope.row.stu" :key="rdx">
              <div >
                <div class="row-item-I01" v-if="r[index+1] == 'I01'"><svg-icon icon-class="icon-right" /></div>
                <div class="row-item-I02" v-if="r[index+1] == 'I02'">
                  <svg-icon icon-class="icon-semilogarithm" />
                </div>
                <div class="row-item-I03" v-if="r[index+1] == 'I03'"><svg-icon icon-class="icon-mistake" /></div>
                <div v-if="r[index+1] == null || r[index+1] == ''">--</div>
              </div>
              
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="260" label="奖励">
          <template slot-scope="scope">
            <div class="row-item-award">
              <span class="icon-be-improved" @click="$emit('saveRewardScore', scope.row, 'T02', 'group')"><svg-icon icon-class="icon-be-improved" />待改进</span>
              <span class="icon-award" @click="$emit('saveRewardScore', scope.row, 'T01', 'group')"><svg-icon icon-class="icon-award" />奖励</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    
    <van-popup v-model="showTip" style="width: 60%">
      <div class="pd10 fs14" style="">
        {{ isfEducation ? '家长' : '学生' }}在规定微课观看时间里，没有正确完成，且没有停留在答题页面，如：退出、关闭浏览器等，系统无法记录他的观看时长，则显示为“--”。
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'scoreTable',
  props: ['classView', 'list', 'groupList', 'examScore', 'isfEducation', 'isWk', 'isTest'], //examScore试卷总分
  data() {
    return {
      showTip: false,
      showTable: false,
      dataArr: [],
    };
  },
  filters: {
    rounding(value) {
      if (!value) return '0.0';
      return value.toFixed(1);
    },
    // scoreAccount(value, len) {
    //   console.log('value', value);
    //   if (!value) return '0.0';
    //   let str = Number(0);
    //   str += parseInt(value);
    //   return parseInt(str) / len;
    // },
  },
  computed: {
    listArr() {
      if (this.list.length > 0) {
        setTimeout(() => {
          this.showTable = true;
        }, 500);
        console.log(this.list,)
        return this.list;
      } else {
        this.showTable = false;
        return [];
      }
    },
    examAnswerList() {
      if (this.list[0]) {
        console.log(' this.list[0].examAnswerList---', this.list[0]);
        return this.list[0].bigExamAnswerList || this.list[0].splitAnswerList
      } else {
        return [];
      }
    },

    groupArr: {
      get: function() {
        if (this.list[0] && !this.classView) {
          console.log(' this.groupArr', JSON.parse(JSON.stringify(this.list)));
          let dataList = JSON.parse(JSON.stringify(this.list))
          console.log(dataList)
          dataList.forEach(value => {
            value.average = value.average*1
          })
          
          return dataList;
          
        } else {
          return [];
        }
      },
      set: function (value) {
        this.dataArr = value
        console.log(value,"88888")
      }
      
    },
    examAnswerList1() {
      if (this.groupArr[0]) {
        console.log(' this.list[0].examAnswerList', this.groupArr[0]);
        return this.groupArr[0].stu[0].bigExamAnswerList  || this.list[0].stu[0].splitAnswerList;
      } else {
        return [];
      }
    },
    stuArr() {
      if (this.list[0] && !this.classView) {
        console.log(' this.list[0].stu', JSON.parse(JSON.stringify(this.list[0].stu)));
        setTimeout(() => {
          this.showTable = true;
        }, 500);
        return JSON.parse(JSON.stringify(this.list[0].stu));
      } else {
        this.showTable = false;

        return [];
      }
    },
  },
  mounted() {
    console.log(this.$store.getters.getExamDetailData.taskType,"$store.getters.getExamDetailData.taskType")
    console.log('listArr---', this.listArr);
    if (!this.classView) {
      this.$nextTick(() => {
        //要先从后面的列开始合并 不然会出错
        // this.mergeCell(this.id,0,0,1)
        // this.mergeCell(this.id,0,0,0)
      });
    }
  },
  watch: {
    groupArr() {
      // this.groupArr.forEach((value, index) => {
      //   let studentRewardScore = 0
      //   value.stu.forEach((va, i) => {
      //       if(va.studentRewardScore == null){
      //           console.log(11111)
      //           va.studentRewardScore = 0
      //       }
      //       console.log(va.studentRewardScore,"studentRewardScore---")
      //       studentRewardScore += parseInt(va.studentRewardScore) 
      //   })
        

      //   value.studentRewardScore = studentRewardScore
      // })
      this.dataArr = this.groupArr
      console.log(this.dataArr,'this.dataArr-----')
    }
  },
  methods: {
    scoreAccount(value, len) {
      console.log('value', value, len);
      // if (!value) return '0.0';
      let str = Number(0);
      str += parseInt(value);
      return str / len;
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background: #449df8;color: #fff;font-size: 28px;';
      }
    },
    sortChange(row){
      const prop = row.prop
      console.log(row.order)
      if(row.order === 'descending'){
        this.dataArr = this.dataArr.sort((a,b) => {
          return parseFloat(a[prop]) - parseFloat(b[prop])
        })
      }
      if(row.order === 'ascending') {
        this.dataArr = this.dataArr.sort((a,b) => {
          return parseFloat(b[prop]) - parseFloat(a[prop])
        })
      }

    },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   console.log('row, column, rowIndex, columnIndex', { row, column, rowIndex, columnIndex });

    //   if (columnIndex === 0 || columnIndex === 1) {
    //     if (rowIndex % 2 === 0) {
    //       return {
    //         rowspan: row.stu.length - 1,
    //         colspan: 1,
    //       };
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0,
    //       };
    //     }
    //   }
    // },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log('{ row, column, rowIndex, columnIndex }', { row, column, rowIndex, columnIndex });
      // if (columnIndex === 0) {
      //   if (rowIndex === 0) {
      //     return {
      //       rowspan: row.stu.length,
      //       colspan: 1,
      //     };
      //   } else if (columnIndex === 6) {
      //     if (rowIndex === 1) {
      //       return {
      //         rowspan: 2,
      //         colspan: 1,
      //       };
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0,
      //     };
      //   }
      // }
      if (columnIndex === 6) {
        if (rowIndex === 1) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        }
      }
    },
    mergeCell(table1, startRow, endRow, col) {
      let tb = document.getElementById(table1);
      if (!tb || !tb.rows || tb.rows.length <= 0) {
        return;
      }
      if (col >= tb.rows[0].cells.length || (startRow >= endRow && endRow != 0)) {
        return;
      }
      if (endRow == 0) {
        endRow = tb.rows.length - 1;
      }
      for (let i = startRow; i < endRow; i++) {
        if (tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML) {
          //如果相等就合并单元格,合并之后跳过下一行
          tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[col]);
          tb.rows[startRow].cells[col].rowSpan = tb.rows[startRow].cells[col].rowSpan + 1;
        } else {
          this.mergeCell(table1, i + 1, endRow, col);
          break;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';
// .score-table {
//   border-bottom: none;
//   color: #333;
//   font-size: 12px;
//   width: 100%;
//   border-collapse: collapse;
//   margin-bottom: 15px;

//   .header {
//     display: flex;
//     align-items: center;
//     font-weight: bold;
//     .icon-tip {
//       margin-left: 2px;
//     }
//     .header-item {
//       height: 44px;
//       flex: 1;
//       text-align: center;
//       // border-right: 1px solid #f5f6fa;
//       // border-bottom: 1px solid #f5f6fa;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       &.team-col {
//         flex: 0 0 10%;
//       }
//       &.name {
//         flex: 0 0 14%;
//       }
//       &.average {
//         flex: 0 0 12%;
//       }

//       &.score {
//         flex: 0 0 10%;
//       }
//       &:last-child {
//         border-right: none;
//       }
//     }
//   }
//   .row {
//     display: flex;
//     .row-item {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//       border-right: 1px solid #e6e6e6;
//       border-bottom: 1px solid #e6e6e6;
//       &.team-col {
//         flex: 0 0 10%;

//         .vertical {
//           padding: 0 10px;
//           word-break: break-all;
//         }
//       }
//       &.name {
//         flex: 0 0 14%;
//       }
//       &.average {
//         flex: 0 0 12%;
//       }
//       &.score {
//         flex: 0 0 10%;
//       }
//       &:last-child {
//         border-right: none;
//       }
//       > div {
//         width: 100%;
//         flex: 1;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         height: 44px;
//         border-bottom: 1px solid #e6e6e6;
//         flex-direction: column;
//         &:last-child {
//           border-bottom: none;
//         }
//       }
//       .stuName {
//         position: relative;
//         overflow: hidden;
//         &::after {
//           position: absolute;
//           left: -29px;
//           top: -11px;
//           width: 80px;
//           height: 30px;
//           line-height: 45px;
//           font-size: 10px;
//           color: #fff;
//           background: #f8d25c;
//           content: '重做';
//           transform: rotateZ(-30deg);
//           text-align: center;
//         }
//       }
//     }
//   }

//   &.scroll-table {
//     overflow-x: auto;
//     .header-item {
//       flex: 0 0 20%;
//       &.team-col {
//         flex: 0 0 10%;
//       }
//       &.average {
//         flex: 1;
//       }

//       &.score {
//         flex: 1;
//       }
//     }
//     .row-item {
//       flex: 0 0 20%;
//       &.team-col {
//         flex: 0 0 10%;
//       }
//       &.average {
//         flex: 1;
//       }

//       &.score {
//         flex: 1;
//       }
//     }
//   }
// }
// new----

// .header {
//   height: 70px;
//   background: #449df8;
//   color: #fff;
//   border-radius: 10px 10px 0px 0px;
//   font-size: 28px;
// }
// .row-item {
//   font-size: 28px;
//   font-family: PingFangSC-Regular, PingFang SC;
//   font-weight: 400;
//   color: #333333;
//   line-height: 40px;
// }
// .score-table .row .row-item > div {
//   padding: 20px 0;
// }
// .row:nth-child(odd) {
//   background-color: #fff;
// }
// .row:nth-child(even) {
//   background: #f8f8f8;
// }
.icon-be-improved {
  margin-right: 50px;
  svg {
    color: #cccccc;
    
  }
}
.icon-award {
  svg {
    color: #fdb63f;
  }
}
.row-item-award {
  flex-direction: row !important;
  svg {
    margin: 0 5px;
  }
  span {
    cursor: pointer;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 33px;
  }
}

.orange {
  color: rgb(253, 182, 63);
}
// --------
@{deep}.table-class {
  width: 100%;

  .cell {
    font-size: 28px;
    line-height: 40px;
  }
}
@{deep} .table-group {
  width: 100%;
  .cell {
    font-size: 28px;
    line-height: 40px;

    padding: 0;
  }
  td {
    padding: 0;
  }

  .stu-class {
    margin: 20px 0 10px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 40px;
  }
  .stu-class:last-child {
    border: 0 none;
    padding-bottom: 0;
  }
}
@{deep}.el-table .sort-caret.ascending {
  border-bottom-color: #fff;
}

@{deep}.el-table .sort-caret.descending {
  border-top-color: #fff;
}
/deep/.el-table__fixed-body-wrapper{
  top: 68px !important;
}
</style>
