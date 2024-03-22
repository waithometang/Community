<template>
  <div class="login">
    <div style="padding-bottom:20px; margin:0 auto;">
      <img src="../assets/logo.png" alt srcset height="60px" />
      <h3 style="text-align:center;" v-if="$route.params.id === 'login'">用户登录</h3>
      <h3 style="text-align:center;" v-else>用户注册</h3>
    </div>
    <div>
      <el-input placeholder="请输入登录名" v-model="usrname" autofocus maxlength="20" show-word-limit>
        <template slot="prepend">
          <el-button icon="el-icon-user-solid"></el-button>
        </template>
      </el-input>
      <br />
      <el-input placeholder="请输入密码" v-model="pwd" show-password>
        <template slot="prepend">
          <el-button icon="el-icon-lock"></el-button>
        </template>
      </el-input>
      <br />
      <el-input
        placeholder="请再次输入密码"
        v-model="pwd2"
        show-password
        v-if="$route.params.id=='regist'"
      >
        <template slot="prepend">
          <el-button icon="el-icon-lock"></el-button>
        </template>
      </el-input>
    </div>
    <div>
      <el-button
        type="primary"
        plain
        round
        v-if="$route.params.id=='login'"
        @click="login"
        v-on:keyup.enter="login"
      >登录</el-button>
      <el-button type="primary" plain round v-else @click="login" v-on:keyup.enter="login">注册</el-button>
      <el-button type="info" plain round @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      usrname: "",
      pwd: "",
      pwd2: ""
    };
  },
  methods: {
    //button 重置
    reset() {
      (this.usrname = ""), (this.pwd = ""), (this.pwd2 = "");
    },
    // 登录注册事件
    login() {
      //登录
      if (this.$route.params.id == "login") {
        if (this.usrname.trim().length > 0 && this.pwd.trim().length > 0) {
          this.$post({ usrname: this.usrname, pwd: this.pwd }, "/login/login")
            .then(res => {
              // console.log(res);
              if (res.userinfo.uis === true) {
                this.$msg.fail("该用户已被禁止登陆");
                return false;
              } else {
                //跳转到首页
                this.$router.push("/");
                // 查看数据
                // console.log(res.userinfo);
                this.$store.commit("usr_login", res.userinfo);
                Cookies.set("usrinfo", res.userinfo);
                this.$store.commit("loginflag", { flag: true });
                //登录成功，清空数据
                this.usrname = "";
                this.pwd = "";
                this.$msg.success("登录成功");
              }
            })
            .catch(err => {
              this.$msg.fail(err);
            });
        } else {
          this.$msg.fail("请检查信息是否填写完整");
        }
      } else if (this.$route.params.id == "regist") {
        //注册
        if (this.usrname.length > 3 && this.pwd.length > 3) {
          if (this.pwd == this.pwd2) {
            this.$post(
              { usrname: this.usrname, pwd: this.pwd },
              "/login/regist"
            )
              .then(res => {
                //注册成功，先清空数据
                //可使用$ref快速清空
                // 查看数据
                // console.log(res.userinfo);
                this.$msg.success(res.msg);
                this.$store.commit("usr_login", res.userinfo);
                this.$store.commit("loginflag", { flag: true });
                // 注册后也设置cookies
                Cookies.set("usrinfo", res.userinfo);
                this.$router.push("/");
                this.usrname = "";
                this.pwd = "";
                this.pwd2 = "";
              })
              .catch(err => {
                this.$msg.fail(err);
              });
          } else {
            //确认密码输入出错
            this.$msg.fail("两次输入的密码不一致");
          }
        } else {
          this.$msg.fail(
            "登录名或密码过短，登录名应不少于4位，密码长度不少于4位"
          );
        }
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.login {
  /* background-color: rgba(193, 207, 223, 0.8); */
  /* <img src="../assets/logo.png" alt srcset height="60px" /> */
  background: url("../assets/xiaoyuan.jpg") no-repeat;
  /* 测试发布模式，图片过大 */
  /* background: url("../assets/bgc.jpg") no-repeat; */
  background-size: cover;
  box-sizing: border-box;
  height: calc(100vh - 16px);
  /* height: 100vh; */
  display: flex;
  /* justify-content: center; */
  padding-top: 20%;
  align-items: center;

  flex-direction: column;
}

.el-input {
  width: 400px;
  padding-bottom: 10px;
}
h3 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  color: aliceblue;
}
</style>