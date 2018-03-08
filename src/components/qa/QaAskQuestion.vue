<template>
    <div class="container">
        <div class="ask">
            <Input v-model="form.title" placeholder="请填写标题，最多50个字">
              <Select v-model="form.categoryId" slot="prepend" style="width: 80px" placeholder="分类" :label-in-value="true" @on-change="triggerCategory">
                  <Option v-for="(category, index) in categoryList" v-bind:key="index" :value="category.id">{{category.categoryName}}</Option>
              </Select>
            </Input>
        </div>
        <div id="editor"></div>
        <div class="btn-action">
            <Button type="primary" :loading="loading" @click="onSubmit" size="large" styles="color:#fff;margin:auto;">
                <span v-if="!loading" style="color:#fff;">提交</span>
                <span v-else>提交中</span>
            </Button>
        </div>
    </div>
</template>

<script>
  import QaAPI from "@/api/QaAPI";
  import axios from "axios";
  import xss from "xss";
  import Editor from "wangeditor";
  let editor = new Editor("#editor");
  editor.customConfig.menus = [
    "head", // 标题
    "bold", // 粗体
    "underline", // 下划线
    "foreColor", // 文字颜色
    "link", // 插入链接
    "justify", // 对齐方式
    'emoticon',  // 表情
    "quote", // 引用
    "image", // 插入图片
    "code", // 插入代码
    'undo',  // 撤销
    'redo',  // 重复
  ];
  // 上传图片请求地址
  editor.customConfig.uploadImgServer = QaAPI.upload_question_image;
  // 图片大小限制为 10MB
  editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
  // 限制一次最多上传 1 张图片
  editor.customConfig.uploadImgMaxLength = 1;
  // 可自定义filename
  editor.customConfig.uploadFileName = "file";
  // 设置上传超时时间改为 30s
  editor.customConfig.uploadImgTimeout = 30000;
  // 隐藏“网络图片”tab
  editor.customConfig.showLinkImg = false;
  export default {
    name: "AskQuestion",
    data() {
      return {
        categoryList: [],
        form: {
          title: '',
          categoryId: ''
        },
        titleMaxLength: 50,
        loading: false,
      };
    },
    mounted() {
      editor.customConfig.zIndex = 9;
      editor.create();
      this.fetchCatetory();
    },
    methods: {
      fetchCatetory() {
        axios.get(QaAPI.fetch_category).then((resp)=> {
          if (resp.data.code === '000') {
            this.categoryList = resp.data.result;
          }
        }).catch((error)=>{
          this.$Message.error("操作失败【" + error + "】");
        });
      },
      triggerCategory(labelInValue) {
        this.form.categoryId = labelInValue.value;
      },
      onSubmit() {
        this.loading=true;
        let title = this.form.title,
            categoryId = xss(this.form.categoryId),
            content = xss(editor.txt.html());
        if (!this.verifyForm(title, categoryId, content)) {
          return;
        }
        axios.post(QaAPI.save_question, {
            categoryId: categoryId,
            title: title,
            question: content
          }).then((resp)=>{
            if ("000" === resp.data.code) {
              this.loading = false;
              this.form.categoryId = "";
              this.form.title = "";
              editor.txt.clear();
              this.$router.push("/qa");
            } else {
              this.$Message.error(resp.data.message);
            }
          }).catch((error)=>{
            this.$Message.error("操作失败【" + error + "】");
          });
      },
      verifyForm(title, categoryId, content) {
        if (categoryId === '') {
          this.$Message.warning("请选择分类");
          this.loading = false;
          return false;
        }
        if (title === '') {
          this.$Message.warning("请填写标题");
          this.loading = false;
          return false;
        }
        if ( this.form.title.split("").length > this.titleMaxLength){
          this.$Message.warning("标题最多50个字");
          this.loading = false;
          return false;
        }
        if (content === null || content === "<p><br></p>") {
          this.$Message.warning("请填写问题具体内容");
          this.loading = false;
          return false;
        }
        return true;
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 70vw;
    margin: 100px auto;
  }
  .ask {
    margin: 20px 0;
  }
  span {
    color: red;
  }
  .btn-action {
    width: 70vw;
    margin-top: 40px;
  }
</style>
