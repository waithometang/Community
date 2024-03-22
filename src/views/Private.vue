<template>
  <div class="box">
    <el-container>
      <el-header>论坛小伙伴私信</el-header>
      <el-container>
        <el-aside width="200px">
          <div v-for="(item,index) in userData" :key="index">
            <ul>
              <li>
                <img :src="item.uavatar" style="width: 40px;height: 40px;float:left;" />
                <el-button type="text" @click="write(item)">{{item.unickname}}</el-button>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main>
          <div class="watch">
            <header>我的私信</header>
            <!-- <el-button @click="getPrivate">点击</el-button> -->
            <div v-for="(item,index) in privateData" :key="index" class="pribox">
              <el-image
                style="width: 50px; height: 50px;border-radius:50%;"
                :src="item.avatar"
                fit="fill"
              ></el-image>
              <span
                style="display: inline-block; padding: 0px 0px;"
              >{{item.account}}({{item.uname}})</span>
              <div
                style="color:#000;text-indent: 75px;margin-top:5px;margin-bottom: 10px;"
              >{{item.content}}</div>
              <div style="color:#8a93a0;text-indent: 54px;">{{item.date}}</div>
            </div>
          </div>
          <div class="chat">
            <!-- <div style="height: 80px;"> -->
            <p
              style="text-align:center;font-weight: bold;border-radius: 10px;background-color: rgba(172, 224, 224, 0.8)"
            >{{userInfo.unickname}}</p>
            <div
              style="height: 100px;padding-top: 30px;background-color: #F5F7FA;margin-top: 10px;margin-bottom: 10px;border-radius: 10px;"
            >
              <div v-show="!flag">
                <img :src="userInfo.uavatar" />
                <span>{{userInfo.date}}</span>
              </div>

              <p class="content">{{userInfo.content}}</p>
            </div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="content"
              maxlength="50"
              show-word-limit
              resize="none"
            ></el-input>
            <el-button
              type="primary"
              size="small"
              style="display:block;color: #fff;font-size: 14px;margin: 20px auto;"
              @click="send"
              :disabled="flag"
            >发送</el-button>
          </div>
          <!-- </div> -->
        </el-main>
      </el-container>
    </el-container>
    <el-button
      @click="callback"
      type="primary"
      :underline="false"
      style="font-size: 14px;color:#ffffff;"
    >返回</el-button>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      userData: [], // 所有用户信息
      // 用户资料
      userInfo: {},
      content: "", // 输入内容
      account: "",
      // result: {},
      flag: true,
      privateData: [] // 私信内容
    };
  },
  created() {
    this.account = JSON.parse(Cookies.get("usrinfo")).account;
    this.getUser(); // 用户信息
    this.getPrivate(); // 私信内容
    // console.log(this.account);
  },
  methods: {
    // 获取用户信息
    getUser() {
      this.$get({}, "/private/private").then(res => {
        // console.log(res.data);
        var data = res.data.filter(item => {
          return item.uname !== this.$store.state.userinfo.account;
        });
        this.userData = data;
        // this.userData = res.data;
      });
    },
    async getPrivate() {
      let res = await this.$post(
        { account: this.account },
        "/private/findWrite"
      );
      this.privateData = res.data;
    },
    // 点击头像获取信息
    async write(data) {
      this.userInfo = data;
      this.flag = false;
      // console.log(data);
      this.userInfo.date = new Date().toLocaleString();
      this.userInfo.avaImg = JSON.parse(Cookies.get("usrinfo")).avatar;

      // console.log(new Date().toLocaleString());
      // console.log(this.userInfo);
      // this.result = JSON.parse(Cookies.get("usrinfo"));
      // this.account = this.result.account;
    },
    // 返回首页
    callback() {
      this.$router.push("/");
    },
    // 发送信息
    send() {
      // console.log(this.userInfo);
      // if (this.userInfo.uname === null) {
      //   this.$message.error("请选择要私信的伙伴");
      //   return false;
      // } else {
      if (this.content.trim().length > 0) {
        if (this.flag) {
          this.$message.error("请选择要私信的伙伴");
          return;
        } else {
          this.userInfo.content = this.content;
          this.userInfo.account = this.account;
          this.userInfo.date = new Date().toLocaleString();
          this.userInfo.nickname = JSON.parse(Cookies.get("usrinfo")).nickname;

          this.content = "";
          this.$post(this.userInfo, "/private/writes").then(() => {
            // console.log(res);
          });
          this.$message.success("发送成功");
          // console.log(this.userInfo);
        }
      } else {
        this.$message.error("请填写内容");
      }
    }
  }
};
</script>

<style  scoped>
.box {
  margin: 0 auto;
}
.el-input {
  height: 100px;
}
p {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: rgba(223, 232, 227, 0.8);
}
p.content {
  background-color: #fff;
  border-radius: 15px;
  position: relative;
  box-sizing: border-box;
  margin-left: 20px;
  width: 80%;
  padding-left: 15px;
}
p.content:before {
  display: block;
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  top: 15px;
  left: -18px;
  border-top: 10px solid transparent;
  border-left: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fff;
}
.watch {
  float: left;
  width: 40%;
  height: 70%;
  border-radius: 10px;
}
header {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 10px;
  color: rgba(223, 232, 227, 0.8);
  background-color: #93d1ea;
}
.pribox {
  background-color: #f5f5f5;
  margin: 10px 5px;
  border-bottom: 1px solid #ccc;
}
.pribox .el-image {
  vertical-align: middle;
  margin-right: 10px;
}
.chat {
  float: right;
  width: 50%;
  height: 70%;
  border-radius: 10px;
}
img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 5px;
}
.el-button {
  font-size: 18px;
  color: #000;
  display: block;
  margin: 20px auto;
  text-align: center;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #f9faf9;
  color: #333;
  height: 80vh;
  border-radius: 10px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
ul {
  height: 45px;
  margin-bottom: 10px;
  padding: 0;
}
ul li {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
/* ul li:hover {
  background-color: rgb(248, 244, 244);
} */
.el-button {
  color: #1f0f0f;
  font-size: 16px;
  font-weight: 600;
}
.el-button:hover {
  color: rgb(63, 191, 223);
}
</style>