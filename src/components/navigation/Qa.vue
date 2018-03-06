<template>
 <div class="container">
   <div class="filter">
     <Button type="primary" size="large" class="ask" @click="gotoAskQuestion">
       <i>+</i>
       <span>我要提问</span>
     </Button>
     <div class="action">
       <!-- 排序 -->
       <Dropdown trigger="click" class="filter-dropdown"  @on-click="onSortClick" style="margin-left: 20px">
         <a href="javascript:void(0)" class="filter-dropdown-title" v-bind:class="{active: orderIndex}">
           <Button type="primary" style="line-height:20px;width:100px;">排序&nbsp;<Icon type="android-funnel" size="15"></Icon></Button>
         </a>
         <DropdownMenu slot="list" class="filter-dropdown-list">
           <DropdownItem :selected="orderIndex==1" name="1" style="width:100px;text-align:center;">
             <span>回答数</span>
           </DropdownItem>
           <DropdownItem :selected="orderIndex==2" name="2" style="width:100px;text-align:center;">
             <span>阅读数</span>
           </DropdownItem>
           <DropdownItem :selected="orderIndex==3" name="3" style="width:100px;text-align:center;">
             <span>提问时间</span>
           </DropdownItem>
         </DropdownMenu>
       </Dropdown>
     </div>
     <div class="clearfix" style="ciear:both;"></div>
   </div>
   <div class="question-column" v-for="(question, index) in questionList" v-bind:key="index">
     <div class="discuss">
       <div class="up-quality">
         <Button type="primary" icon="thumbsup" @click="signQuestionAnd(question.id, 1)">顶{{question.thumbUp}}</Button>
       </div>
       <div class="down-quality">
         <Button type="primary" icon="thumbsdown" @click="signQuestionAnd(question.id, -1)">踩{{question.thumbDown}}</Button>
       </div>
     </div>
     <div style="clear:both;"></div>
     <div style="line-height:20px;" class="answer">
       <div class="answer-quantity">
         <span><Icon type="chatboxes" size="20" color="#c3ce25"></Icon>&nbsp;<span>{{question.answers}}</span>回答</span>
       </div>
       <div class="view-quantity">
         <span><Icon type="eye" size="20" color="#c3ce25"></Icon>&nbsp;<span>{{question.views}}</span>浏览</span>
       </div>
     </div>
     <div style="ciear:both;"></div>
     <div class="box">
       <div @click="signQuestion(question.id,0)">
         <a class="title">{{question.title}}</a>
       </div>
       <div class="date">{{question.userName}} 提问于 {{question.gmtCreated}} &nbsp;&nbsp;&nbsp;&nbsp;</div>
     </div>
   </div>
   <div>
     <Row type="flex" justify="center" class="code-row-bg">
       <Col>
       <Page show-total :total="total" :page-size="pageSize" @on-change="pageable"></Page>
       </Col>
     </row>
   </div>
   <BackTop :height="300" :bottom="100">
     <div class="top"><Icon type="android-navigate" size="30" style="margin-top:-10px;margin-left:5px;text-align:center;"></Icon></div>
   </BackTop>
 </div>
</template>

<script>
import axios from 'axios';
//import ZhidaoAPI from "@/api/zhidao/ZhidaoAPI";
import Sort from '@/components/qa/Sort';
export default {
  data() {
    return {
      // 分类组件需传入
      Sort: [{ id: 0, module: "ask", categoryName: "全部" }],
      // 分类默认选中项
      searchIndex: 0,
      orderIndex: "",
      startDate: "",
      endDate: "",
      pageNum: 1,
      pageSize: 10,
      total: 0,
      questionList: [],
      answerList: [],
    };
  },
  mounted() {
//    this.fetchCatetory();
//    this.fetchQuestionList();
  },
  methods: {
    fetchCatetory() {
        axios
        .get(ZhidaoAPI.fetch_category)
        .then((resp)=> {
          // console.log(resp)
          let categoryList = resp.data.categoryDTOList;
          for (let i = 0; i < categoryList.length; i++) {
            this.Sort.push(categoryList[i]);
          }
        })
        .catch((error)=>{
          this.$Message.error("操作失败【" + error + "】");
        });
    },

    // 分类选中后的回调，参数：sort/选中分类项，index/索引
    onSearchSelect(sort, index) {
      this.searchIndex = sort.id;
      this.fetchQuestionList();
    },
    currentDateRange(currentDate) {
      this.startDate = currentDate[0];
      this.endDate = currentDate[1];
    },
    onFilter() {
      if (this.startDate == null || this.startDate == undefined) {
        this.startDate = "";
      }
      if (this.endDate == null || this.endDate == undefined) {
        this.endDate = "";
      }
      this.fetchQuestionList();
    },
    onSortClick(sort) {
      this.orderIndex = sort;
      this.fetchQuestionList();
    },
    fetchQuestionList() {
         axios
        .get(ZhidaoAPI.fetch_question_list, {
          params: {
            categoryId: this.searchIndex,
            orderBy: this.orderIndex,
            startDate: this.startDate,
            endDate: this.endDate,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        })
        .then((resp)=>{
           this.total = resp.data.total;
           this.pageNum = resp.data.pageNum;
           this.questionList = resp.data.questionDTOList;
        })
        .catch((error)=>{
          this.$Message.error("操作失败【" + error + "】");
        });
    },
    signQuestion(questionId,eventType){
        axios
        .post(ZhidaoAPI.sign_question,{
          questionId: questionId,
          eventType: eventType
        })
        .then((resp)=>{
           this.$router.push("/know-how/AskDetail/" + questionId);
        })
        .catch((error)=>{
          this.$Message.error("操作失败【" + error + "】");
        });
    },
    signQuestionAnd(questionId,eventType) {
        axios
        .post(ZhidaoAPI.sign_question, {
          questionId: questionId,
          eventType: eventType
        })
        .then((resp)=>{
            this.fetchCatetory();
            this.fetchQuestionList();
        })
        .catch((error)=>{
          this.$Message.error("操作失败【" + error + "】");
        });
    },
    gotoAskQuestion(){
      this.$router.push("/know-how/Askquestion/" + this.searchIndex);
    },
    pageable(current) {
      this.pageNum = current;
      this.fetchQuestionList();
    },

  }
};
</script>

<style scoped>
html,body{
   background-color: #fff;
}
/* 问题盒子 */
.container{
  width: 100vw;
  height: 100%;
  position: relative;
  margin-top: 60px;
  margin-bottom: 60px;
  background-color: #fff;
}
/* 提问 */
.ask{
  margin-left: 20px;
}
/* 排序 筛选 */
 .filter{
  width: 70vw;
  height: 60px;
  margin: 0 auto;
  padding-top: 10px;
  border-bottom: 1px solid #f4f4f4;
}
.action{
  float: right;
  width: 12vw;
  height: 30px;
  margin-right: -20px;
}
.action div{
  margin-right: 10px;
  position: relative;
  line-height: 30px;
}
.filter-dropdown{
  padding: 20px;
  position: absolute;
  margin-top: -20px;
}
/* 问题详情 */
.question-column{
  width: 70vw;
  margin: 0 auto;
  background-color: #fff;
  border-bottom: 1px dashed #c9c9c9;
}
.discuss{
  width: 13vw;
  height: 20px;
  float: right;
  margin-top: 10px;
  margin-right: 30px;
  display: flex;
  justify-content: space-around;
}
.answer{
  width: 13vw;
  height: 20px;
  float: right;
  margin-top: 70px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
}
.answer div{
  width: 7vw;
  height: 30px;
  line-height: 5px;
  font-size: 16px;
  margin-right: 10px;
  margin-top: -5px;
}
.box{
  width: 60vw;
  height: 100px;
  font-size: 1.14rem;
  padding-left: 20px;
}
.box .date{
  margin-top: 30px;
}
.box .title{
  position: relative;
  margin-bottom: 20px;
  display:block;
  overflow:hidden;
  word-break:keep-all;
  white-space:nowrap;
  text-overflow:ellipsis;
}
/* 返回顶部 */
.top{
  width: 50px;
  height: 30px;
  line-height: 20px;
  background-color: #1a92ff;
  }
</style>
