<template>
  <div class="container">
    <section class="box">
      <div class="article">
        <dl>
          <dt>{{questionDetail.title}}</dt>
          <dd class="article-content" v-html="questionDetail.question"></dd>
          <dd class="article-info">
            <div class="article-info-user">
              <span>{{questionDetail.userName}}</span>
              <span>{{questionDetail.createTime}}</span>
              <span>{{questionDetail.views}}&nbsp;&nbsp;人阅读</span>
              <span class="answer-num">回答 {{currentAnswers}}</span>
              <span>所属分类&nbsp;&nbsp;{{questionDetail.categoryName}}</span>
            </div>
            <div class="article-info-evaluate">
              <div class="evaluate active" @click="signQuestion(1)">
                <i class="iconfont icon-good"></i>
                <!-- <em>{{currentThumbUp}}</em> -->
              </div>
              <div class="evaluate" @click="signQuestion(-1)">
                <i class="iconfont icon-bad"></i>
                <em style="visibility:hidden;">{{currentThumbDown}}</em>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <div class="comment">
        <div class="comment-info">
          <Dropdown trigger="click" class="filter-dropdown" @on-click="onSortClick">
            <a href="javascript:void(0)" class="filter-dropdown-title" v-bind:class="{active: orderIndex}">
              <Button type="primary" icon="levels" style="float:right;">排序</Button>
              <div style="clear:both;"></div>
              <i class="iconfont icon-aksort"></i>
            </a>
            <DropdownMenu slot="list" class="filter-dropdown-list">
              <DropdownItem :selected="orderIndex==1" name="1">
                <span>回答时间</span>
              </DropdownItem>
              <DropdownItem :selected="orderIndex==2" name="2">
                <span>回复数</span>
              </DropdownItem>
              <DropdownItem :selected="orderIndex==3" name="3">
                <span>认可数</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div style="clear:both;"></div>
        </div>
        <div style="clear:both;"></div>
        <!-- 评论用户信息 -->
        <div class="comment-list" v-for="(answer, index) in answerList" v-bind:key="index">
          <div class="content">
            <!-- 评论用户盒子 -->
            <div class="content-header">
              <!-- 评论用户信息 -->
              <div class="user-info">
                <Icon type="person" size="60" class="photo-user-list"></Icon>
                <p class="username-list">{{answer.userName}}</p>
              </div>
              <!-- 评论弹窗 -->
              <Modal
                title="写下您的评论..."
                align="center"
                v-bind:key="index"
                @on-ok="onSubmitComment(answer)"
                @on-cancel="cancelReply(answer)"
                ok-text="提交"
                v-model="commentModel"
                class-name="vertical-center-modal">
                <Input class="commit-area" v-model="reply" type="textarea" :rows="4" placeholder="请输入您的评论......"></Input>
              </Modal>
              <!-- 顶踩 -->
              <div class="evaluate-list">
                <Button @click="commentModel=true,commentReply(answer)" class="evaluate-pinglun">
                  <Icon type="compose" size="20" style="line-height:10px;"></Icon>
                </Button>
                <Button class="evaluate-block" @click="signAnswer(answer.id, 1)">顶{{answer.likes}}</Button>
                <Button class="evaluate-block" @click="signAnswer(answer.id, -1)">踩{{answer.dislikes}}</Button>
                <div style="clear:both;"></div>
              </div>
              <div style="clear:both;"></div>
              <!-- 评论内容 -->
              <div class="arrow"></div>
              <div class="content-body">
                <div class="content-body-text" v-html="answer.answer"></div>
                <div class="content-body-info" style="padding-top:15px;">
                  <span class="info-date">{{answer.gmtCreated}}</span>
                  <span class="info-comment" @click="commentReply(answer)"><Icon type="android-textsms" size="20"></Icon>&nbsp;评论{{answer.comments}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="content-reply" v-show="answer.isCommentAreaShow">
            <div class="reply reply-normal" v-for="(comment, index) in answer.commentList" v-bind:key="index">
              <div class="arrow"></div>
              <div class="reply-photo">
                <div class="photo">
                  <Icon type="person" size="45" class="photo-user"></Icon>
                </div>
              </div>
              <div class="reply-body">
                <ul class="reply-overflow">
                  <li class="reply-body-name">
                    <span style="padding-left:10px;">{{comment.userName}}</span>
                    <span v-if="comment.replyToUserName != null">回复</span>
                    <i v-if="comment.replyToUserName != null">{{comment.replyToUserName}}</i>
                  </li>
                  <li class="reply-body-content">{{comment.comment}}</li>
                  <li class="reply-body-date">回复时间：{{comment.gmtCreated}}</li>
                  <li class="btn-reply">
                    <Button type="primary" @click="commentReplyModel = true,onReply(answer,comment.id)">@TA</Button>
                    <Modal v-model="commentReplyModel" @on-ok="onSubmitComment(answer)"
                      @on-cancel="cancelReply(answer)">
                      <div class="PopUp-title">
                        <span class="title"><span>回复</span>{{comment.userName}}</span>
                      </div>
                      <Input class="commit-area" v-model="reply" type="textarea" :rows="4" placeholder="说点啥呗......"></Input>
                    </Modal>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-submit">
        <div class="commit-list">
          <div class="content-reply-down">
            <div class="content-overflow">
              <div class="arrow"></div>
              <div id="comment"></div>
              <div class="action-answer">
                <Button type="primary" size="large" @click="onSubmitAnswer" style="position:relative;margin-top:70px;margin-bottom:20px;margin:0 auto;">发布回答</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from "axios";
  import xss from "xss";
  import QaAPI from "@/api/QaAPI";
  import Editor from "wangeditor";
  let editor = new Editor("#comment");
  editor.customConfig.menus = [
    "head", // 标题
    "bold", // 粗体
    "underline", // 下划线
    "foreColor", // 文字颜色
    'emoticon',  // 表情
    "link", // 插入链接
    "justify", // 对齐方式
    "quote", // 引用
    "image", // 插入图片
    "code", // 插入代码
    'undo',  // 撤销
    'redo',  // 重复
  ];
  // 上传图片请求地址
  editor.customConfig.uploadImgServer = QaAPI.upload_answer_image;
  // 图片大小限制为 5M
  editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
  // 限制一次最多上传 1 张图片
  editor.customConfig.uploadImgMaxLength = 2;
  // 可自定义filename
  editor.customConfig.uploadFileName = "file";
  // 设置上传超时时间改为 30s
  editor.customConfig.uploadImgTimeout = 30000;
  // 隐藏“网络图片”tab
  editor.customConfig.showLinkImg = false;
  export default {
    data() {
      return {
        questionDetail: "",
        currentThumbUp: 0,
        currentThumbDown: 0,
        currentAnswers: 0,
        pageNum: 1,
        pageSize: 10,
        orderIndex: 1,
        commentModel: false,
        commentReplyModel: false,
        answerList: [],
        reply: "",
        replyToCommentId: null,
        currentCommentAnswerId: "",
      };
    },
    mounted() {
      editor.customConfig.zIndex = 9;
      editor.create();
      this.fetchQuestionDetail();
      this.fetchAnswerList();
    },
    methods: {
      signQuestion(ops) {
        axios.post(QaAPI.sign_question, {
            questionId: this.$route.params.id,
            ops: ops
          }).then((resp) => {
            if (ops == 1 && resp.data.code == "00") {
              this.currentThumbUp += 1;
            }
            if (ops == -1 && resp.data.code == "00") {
              this.currentThumbDown += 1;
            }
          }).catch((error) => {
            this.$Message.error("操作失败【" + error + "】");
          });
      },
      fetchQuestionDetail() {
        axios.get(QaAPI.fetch_question_detail, {
            params:{
              'questionId': this.$route.params.questionId
            }
          }).then((resp) => {
            if (resp.data.code === '000'){
              this.questionDetail = resp.data.result;
              this.currentThumbUp = this.questionDetail.thumbUp;
              this.currentThumbDown = this.questionDetail.thumbDown;
              this.currentAnswers = this.questionDetail.answers;
            }
          }).catch((error) => {
              this.$Message.error("操作失败【" + error + "】");
          });
      },
      fetchAnswerList() {
        axios.get(QaAPI.fetch_answer_list, {
            params: {
              questionId: this.$route.params.questionId,
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              orderIndex: this.orderIndex
            }
          }).then((resp) => {
            let originalAnswerArray = resp.data.elements;
            //清空数组
            this.answerList.splice(0, this.answerList.length);
            for (let i = 0; i < originalAnswerArray.length; i++) {
              let originalAnswer = originalAnswerArray[i];
              originalAnswer.commentList = [];
              originalAnswer.isCommentAreaShow = false;
              originalAnswer.isReplyAreaShow = false;
              this.answerList.push(originalAnswer);
            }
          }).catch((error) => {
            this.$Message.error("操作失败【" + error + "】");
          });
      },
      onSortClick(sort) {
        this.orderIndex = sort;
        this.fetchAnswerList();
      },
      onSubmitAnswer() {
        let content = xss(editor.txt.html());
        if (content == null || content == "<p><br></p>") {
          this.$Message.warning("写点东西呗");
          return;
        }
        axios.post(QaAPI.save_answer, {
            questionId: this.$route.params.questionId,
            answer: content
          }).then((resp) => {
            if (resp.data.code === '000'){
              editor.txt.clear();
              this.fetchAnswerList();
              this.currentAnswers += 1;
              this.$Message.success("提交成功");
            }
          }).catch((error) => {
            this.$Message.error("操作失败【" + error + "】");
          });
      },
      signAnswer(answerId, ops) {
        axios.post(QaAPI.sign_answer, {
            answerId: answerId,
            ops: ops
          }).then(resp => {
            if (resp.data.code === '000') {
              this.fetchAnswerList();
            }
          }).catch(function(error) {
            this.$Message.error("操作失败【" + error + "】");
          });
      },
      commentReply(answer) {
        this.currentCommentAnswerId = answer.id;
        if (answer.isCommentAreaShow) {
          answer.isCommentAreaShow = !answer.isCommentAreaShow;
        } else {
          this.fetchAnswerComment(answer);
        }
      },
      fetchAnswerComment(answer) {
        axios.get(QaAPI.fetch_answer_comment_list, {
            params: {
              answerId: answer.id,
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }
          }).then((resp) => {
            if (resp.data.code === '000') {
              answer.commentList = resp.data.elements;
              answer.isCommentAreaShow = true;
              answer.isReplyAreaShow = true;
            }
          }).catch((error) => {
            this.$Message.error("操作失败【" + error + "】");
          });
      },
      onReply(answer, commentId) {
        answer.isReplyAreaShow = true;
        this.replyToCommentId = commentId;
      },
      cancelReply(answer) {
        this.reply = "";
        answer.isReplyAreaShow = false;
      },
      onSubmitComment(answer) {
        if (this.reply == "") {
          this.$Message.warning("请填写评论内容");
          return;
        }
        axios.post(QaAPI.save_answer_comment, {
            answerId: this.currentCommentAnswerId,
            comment: this.reply,
            replyToCommentId: this.replyToCommentId
          }).then((resp) => {
            if (resp.data.code === '000') {
              this.fetchQuestionDetail();
              this.fetchAnswerList();
              this.reply = "";
            }
          }).catch((error) => {
            this.$Message.error("操作失败【" + error + "】");
          });
    },
  }
}
</script>

<style scoped>
  .container {
    width: 100vw;
    box-sizing: content-box;
    background: #f4f4f4;
    margin-bottom: 60px;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .box {
    width: 72vw;
    height: auto;
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
    margin-top: 60px;
  }
  .article {
    width: 70vw;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 14px;
    color: #333;
    padding: 0 20px 15px 20px;
    border-bottom: 1px dashed #e4e4e4;
  }
  dl,
  dt {
    line-height: 3;
    font-size: 20px;
  }
  dd.article-content {
    font-size: 16px;
  }
  dd.article-info {
    margin-top: 20px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  dd.article-info-user i {
    color: #999;
    margin-left: 20px;
  }
  em {
    margin-left: 6px;
  }
  em.active {
    color: #ff9933;
  }
  .comment {
    font-size: 14px;
    padding: 0 20px;
  }
  .comment-info {
    width: 60vw;
    margin-left: 7.5vw;
    position: relative;
  }
  .comment-info .answer-num {
    float: right;
    padding-top: 20px;
    margin-right: 10px;
  }
  .filter-dropdown {
    float: right;
    margin-left: 95%;
    margin-top: -100px;
  }
  .filter-dropdown:hover {
    color: #333;
  }
  .filter-dropdown:last-child {
    margin-right: 0;
  }
  .filter-dropdown-title {
    display: block;
    color: #666;
  }
  .filter-dropdown-title.active {
    color: #ff9933;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
  i {
    display: inline-block;
    vertical-align: middle;
  }
  .filter-dropdown-list {
    text-align: center;
    margin-top: -30px;
    float: right;
    background-color: #fff;
    border-left: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
    border-right: 1px solid #e1e1e1;
    z-index: 1000;
  }
  span {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  i {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
  }
  i.filter-date {
    padding: 10px 20px;
    min-width: 380px;
  }
  .comment-list {
    width: 70vw;
    margin-top: 50px;
  }
  .content-header {
    width: 70vw;
    height: auto;
    color: #666;
    position: relative;
    margin: 0 auto;
    margin-top: -30px;
    box-sizing: content-box;
    border: 1px solid #e4e4e4;
  }
  .user-info{
    width: 5vw;
    height: auto;
    padding-bottom: 20px;
    text-align: center;
  }
  .photo-user-list{
    margin: 0 auto;
  }
  .username-list{
    /* margin-top: -10px; */
    margin-bottom: 30px;
    text-align: center;
  }
  .evaluate-list{
    width: 10vw;
    height: auto;
    float: right;
    margin-right: 4vw;
    margin-top: -130px;
    display: flex;
    justify-content: space-between;
  }
  .evaluate-list .evaluate-block {
    font-size: .85rem;
    margin-left:5px;
    cursor: pointer;
    line-height: 10px;
    width: 70px;
    height: 30px;
    outline: none;
    margin-top: 10px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #e4e4e4;
  }
  .evaluate-list .evaluate-pinglun {
    width: 70px;
    height: 30px;
    margin-top: 10px;
    margin-left: 5px;
    background-color: #fff;
    border-radius: 10px;
  }
  .content-overflow {
    width: 68vw;
    margin: 0 auto;
    margin-left: -2vw;
  }
  .evaluate {
    float: right;
    margin-top: 50%;
    margin-right: 50px;
  }
  .evaluate .evaluate-block {
    width: 70px;
    height: 30px;
    font-size: 12px;
    margin-left: 10px;
    border: 1px solid #999;
    cursor: pointer;
    margin-top: 40px;
    line-height: 30px;
    border-radius: 10px;
    background-color: #fff;
    outline: none;
    border: 1px solid #e4e4e4;
  }
  .reply-normal {
    width: 70vw;
    border-bottom: 1px solid #eee;
  }
  .content-body {
    width: 50vw;
    height: auto;
    color: #666;
    margin: 0 auto;
    margin-left: 5vw;
    margin-top: -130px;
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
  }
  .content-body-text{
    width: 50vw;
    word-wrap:break-word;
    padding: 10px 10px 0px 10px;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .content-body-info {
    margin-top: 20px;
    padding-left: 10px;
  }
  img {
    width: 100%;
  }
  .info-comment {
    cursor: pointer;
  }
  .content-reply {
    width: 70vw;
    margin: 0 auto;
    border-top: 1px solid #e7e7e7;
    position: relative;
    background-color: #fff;
  }
  .reply {
    padding: 20px 20px 10px 20px;
  }
  .reply .reply-comment {
    width: 55vw;
    margin: 0 auto;
    border-bottom: none;
  }
  .reply-body {
    margin-top: -50px;
    margin-left: 8vw;
  }
  .reply-overflow {
    color: #333;
    position: relative;
    margin-top: -10px;
  }
  .photo-user{
    margin-left: 5vw;
  }
  .reply-body-name em {
    margin: 0 10px;
    color: #999;
  }
  .reply-body-date {
    color: #333;
    line-height: 1.5;
    margin-top: 10px;
    padding-left: 10px;
  }
  .reply-body-content {
    width: 47vw;
    line-height: 2;
    word-break: break-all;
    padding:10px 10px 0px 10px;
  }
  .btn-reply {
    position: absolute;
    right: 0;
    top: 2px;
  }
  .reply-body .reply-comment .action {
    margin-top: 10px;
    text-align: right;
    padding-bottom: 20px;
  }

  .replay-normal {
    border-bottom: 1px solid #e7e7e7;
  }
  .replay-normal:last-child {
    border-bottom: none;
  }
  .arrow {
    position: absolute;
    width: 14px;
    height: 14px;
    transform: rotate(-45deg);
  }
  .comment-list {
    width: 68vw;
  }
  .action {
    width: 60vw;
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
  .action-answer {
    width: 60vw;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-top: 10px;

  }
  .comment-submit {
    width: 70vw;
    margin: 0 auto;
    margin-top: 20px;
  }
  .comment-submit #comment {
    width: 70vw;
    margin: 0 auto;
    margin-left: 2vw;
  }
</style>
