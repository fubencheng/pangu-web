<template>
  <div style="overflow-x:hidden;background:#f4f4f4;">
    <section class="nav-box">
      <section class="nav">
        <div class="nav-logo">
          <div>
            <img src="" alt="" style="position:absolute;margin-left:-7vw;margin-top:-5px;">
          </div>
        </div>
        <div class="nav-list">
          <ul>
            <li>
              <router-link to="/"><Icon type="ios-home" size="20"></Icon>&nbsp;&nbsp;<span>首页</span></router-link>
            </li>
            <li>
              <router-link to="/project"><Icon type="folder" size="20"></Icon>&nbsp;&nbsp;<span>项目</span></router-link>
            </li>
            <li>
              <router-link to="/vote"><Icon type="ios-checkmark" size="20"></Icon>&nbsp;&nbsp;<span>投票</span></router-link>
            </li>
            <li>
              <router-link to="/qa"><Icon type="help" size="20"></Icon>&nbsp;&nbsp;<span>问答</span></router-link>
            </li>
            <li>
              <router-link to="/course"><Icon type="videocamera" size="20"></Icon>&nbsp;&nbsp;<span>讲堂</span></router-link>
            </li>
          </ul>
        </div>
        <div class="layout-ceiling-main">
          <div>
            <Dropdown @on-click="gotoAdministration">
              <a href="javascript:void(0)">{{userName}}</a>
              <DropdownMenu slot="list" v-show="isAdmin">
                <DropdownItem>课程列表</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div class="layout-ceiling-main-logout">
          <div @click="logout">退出</div>
        </div>
      </section>
    </section>

    <router-view></router-view>

    <Footer></Footer>
  </div>
</template>

<script>
  import axios from "axios";
  import UserAPI from "@/api/UserAPI";
  import Footer from "@/components/Footer"
  export default {
    data () {
      return {
        userName: '',
        isAdmin:false
      }
    },
    components:{
      Footer
    },
    mounted(){
      this.getUserName();
    },
    methods: {
      getUserName() {
        axios.get(UserAPI.user_info).then((resp) => {
          if (resp.data.code === '000') {
            this.isAdmin = resp.data.result.isAdmin;
            this.userName = resp.data.result.name;
          }
        });
      },
      logout() {
        axios.get(UserAPI.logout).then((resp) => {
          if (resp.data.code === '000') {
            this.userName = '';
            this.isAdmin = false;
            this.$router.push("/logout");
          }
        });
      },
      gotoAdministration(){
        this.$router.push('/course/my/list')
      }
    }
  }
</script>

<style scoped>
  .nav-box {
    width: 100vw;
    height: 60px;
    position: fixed;
    z-index: 1000;
    background: rgba(2, 104, 238, 0.6);
  }
  .nav {
    width: 60vw;
    height: 60px;
    text-align: center;
    margin-left: 15vw;
    margin-right: 15vw;
  }
  @font-face {
    font-family: "icomoon";
    src: url("./assets/fonts/icomoon.eot"); /* IE9*/
    src: url("./assets/fonts/icomoon.eot?#iefix") format("embedded-opentype"),
    url("./assets/fonts/icomoon.woff") format("woff"),
    url("./assets/fonts/icomoon.ttf") format("truetype"),
    url("./assets/fonts/icomoon.svg#icomoon") format("svg"); /* iOS 4.1- */
  }
  .nav .nav-logo {
    width: 13vw;
    height: 60px;
    margin-left: -1vw;
    padding-left: -6vw;
  }
  .nav .nav-list {
    width: 60vw;
    height: 60px;
    text-align: center;
    margin-top: -60px;
    margin-left: 8vw;
  }
  .nav .nav-list ul {
    width: 45vw;
    height: 60px;
    list-style: none;
  }
  .nav-list ul li {
    display: flex;
    width: 7vw;
    height: 60px;
    float: left;
    margin-left: 1vw;
  }
  .nav-list ul li a {
    color: #fff;
    width: 7vw;
    text-decoration: none;
    line-height: 60px;
    font-size: 16px;
  }
  .nav-list ul li a:hover {
    border-bottom: 3px solid rgb(252, 125, 6);
  }
  .layout-ceiling-main {
    font-size: 14px;
    line-height:60px;
    float: right;
    color: #fff;
    margin-right:-100px;
    margin-top: -60px;
    margin-left: -2vw;
  }
  .layout-ceiling-main-logout{
    font-size: 14px;
    line-height:60px;
    float: right;
    margin-right: -150px;
    color: #fff;
    margin-top: -60px;
    cursor: pointer;
  }
  .layout-ceiling-main a {
    padding: 0 20px;
    position: relative;
    color: #fff;
    border-right: 1px solid #fff;
    box-shadow: 1px 0 0 #999;
  }
</style>
