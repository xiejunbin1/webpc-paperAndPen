<template>
<div class="score-table">
    <div v-if="['T03'].includes($store.getters.getExamDetailData.taskType)">
        <el-table :data="listArr" width="100%" class="table-class" height="76vh" :border="false" stripe :header-cell-style="tableHeaderColor" v-show="classView">
            <el-table-column align="center" fixed min-width="180" prop="name" label="学生姓名">
                <template slot-scope="scope">
                    <span> {{ scope.row.name }}</span>
                    <br />
                    <span class="orange"> （{{ scope.row.studentRewardScore || 0 }}）</span>
                </template>
            </el-table-column>
            <el-table-column align="center" min-width="180" prop="endDate" label="完成时间"> </el-table-column>
            <el-table-column align="center" min-width="180" prop="duration" label="测试总用时"> </el-table-column>
            <el-table-column align="center" min-width="160" prop="score" label="测试得分">
                <template slot-scope="scope">
                    <div>{{ scope.row.score | rounding }}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="['T03'].includes($store.getters.getExamDetailData.taskType)" align="center" min-width="120" v-for="(item, index) in examAnswerList" :key="index" :label="item.exam_number + ''">
                <template slot-scope="scope">
                    {{scope.row.bigExamAnswerList[index].score || '0'}}
                </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" min-width="260" label="奖励">
                <template slot-scope="scope">
                    <div class="row-item-award">
                        <span class="icon-be-improved" @click="$emit('saveRewardScore', scope.row, 'T02', 'class')">
                            <svg-icon icon-class="icon-be-improved" />待改进</span>
                        <span class="icon-award" @click="$emit('saveRewardScore', scope.row, 'T01', 'class')">
                            <svg-icon icon-class="icon-award" />奖励</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-table type="index" width="100%" height="76vh" sort-orders="['ascending', 'descending']" @sort-change="sortChange" class="table-group" :data="dataArr" stripe :header-cell-style="tableHeaderColor" v-show="!classView">
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
                <template slot-scope="scope">
                    <div class="stu-class" v-for="r in scope.row.stu">{{ r.name }}</div>
                </template>
                <!-- </el-table-column> -->
            </el-table-column>
            <el-table-column align="center" min-width="120" v-for="(item, index) in examAnswerList1" :key="index" :label="item.exam_number + ''">
                <template slot-scope="scope">
                    <div class="stu-class" v-for="(r,rdx) in scope.row.stu" :key="rdx">
                        {{ r.bigExamAnswerList[index].score || '0' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" width="260" label="奖励">
                <template slot-scope="scope">
                    <div class="row-item-award">
                        <span class="icon-be-improved" @click="$emit('saveRewardScore', scope.row, 'T02', 'group')">
                            <svg-icon icon-class="icon-be-improved" />待改进</span>
                        <span class="icon-award" @click="$emit('saveRewardScore', scope.row, 'T01', 'group')">
                            <svg-icon icon-class="icon-award" />奖励</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

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
                    <div class="row-item-I01" v-if="scope.row.bigExamAnswerList[index].is_rigth == 'I01'">
                        <svg-icon icon-class="icon-right" />
                    </div>
                    <div class="row-item-I02" v-if="scope.row.bigExamAnswerList[index].is_rigth == 'I02'">
                        <svg-icon icon-class="icon-semilogarithm" />
                    </div>
                    <div class="row-item-I03" v-if="scope.row.bigExamAnswerList[index].is_rigth == 'I03'">
                        <svg-icon icon-class="icon-mistake" />
                    </div>
                    <div v-if="scope.row.bigExamAnswerList[index].is_rigth == null || scope.row.bigExamAnswerList[index].is_rigth == ''">--</div>
                </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" min-width="260" label="奖励">
                <template slot-scope="scope">
                    <div class="row-item-award">
                        <span class="icon-be-improved" @click="$emit('saveRewardScore', scope.row, 'T02', 'class')">
                            <svg-icon icon-class="icon-be-improved" />待改进</span>
                        <span class="icon-award" @click="$emit('saveRewardScore', scope.row, 'T01', 'class')">
                            <svg-icon icon-class="icon-award" />奖励</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-table type="index" width="100%" height="76vh" sort-orders="['ascending', 'descending']" @sort-change="sortChange" class="table-group" :data="dataArr" stripe :header-cell-style="tableHeaderColor" v-show="!classView">
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
                        <div>
                            <div class="row-item-I01" v-if="r[index+1] == 'I01'">
                                <svg-icon icon-class="icon-right" />
                            </div>
                            <div class="row-item-I02" v-if="r[index+1] == 'I02'">
                                <svg-icon icon-class="icon-semilogarithm" />
                            </div>
                            <div class="row-item-I03" v-if="r[index+1] == 'I03'">
                                <svg-icon icon-class="icon-mistake" />
                            </div>
                            <div v-if="r[index+1] == null || r[index+1] == ''">--</div>
                        </div>

                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" width="260" label="奖励">
                <template slot-scope="scope">
                    <div class="row-item-award">
                        <span class="icon-be-improved" @click="$emit('saveRewardScore', scope.row, 'T02', 'group')">
                            <svg-icon icon-class="icon-be-improved" />待改进</span>
                        <span class="icon-award" @click="$emit('saveRewardScore', scope.row, 'T01', 'group')">
                            <svg-icon icon-class="icon-award" />奖励</span>
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
    },
    computed: {
        listArr() {
            if (this.list.length > 0) {
                setTimeout(() => {
                    this.showTable = true;
                }, 500);
                console.log(this.list, )
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
            get: function () {
                if (this.list[0] && !this.classView) {
                    console.log(' this.groupArr', JSON.parse(JSON.stringify(this.list)));
                    let dataList = JSON.parse(JSON.stringify(this.list))
                    console.log(dataList)
                    dataList.forEach(value => {
                        value.average = value.average * 1
                    })

                    return dataList;

                } else {
                    return [];
                }
            },
            set: function (value) {
                this.dataArr = value
                console.log(value, "88888")
            }

        },
        examAnswerList1() {
            if (this.groupArr[0]) {
                console.log(' this.list[0].examAnswerList', this.groupArr[0]);
                return this.groupArr[0].stu[0].bigExamAnswerList || this.list[0].stu[0].splitAnswerList;
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
    },
    watch: {
        groupArr() {
            this.dataArr = this.groupArr
            console.log(this.dataArr, 'this.dataArr-----')
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
        tableHeaderColor({
            rowIndex,
        }) {
            if (rowIndex === 0) {
                return 'background: #449df8;color: #fff;font-size: 28px;';
            }
        },
        sortChange(row) {
            const prop = row.prop
            console.log(row.order)
            if (row.order === 'descending') {
                this.dataArr = this.dataArr.sort((a, b) => {
                    return parseFloat(a[prop]) - parseFloat(b[prop])
                })
            }
            if (row.order === 'ascending') {
                this.dataArr = this.dataArr.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }

        },
        objectSpanMethod({
            rowIndex,
            columnIndex
        }) {
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

/deep/.el-table__fixed-body-wrapper {
    top: 68px !important;
}
</style>
