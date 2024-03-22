<template>
  <div class="avatar">
    <el-button type="primary" size="small" @click="edit">创作中心</el-button>
    <div class="dropdown">
      <!-- <img :src="$store.state.userinfo.avatar" alt="头像" @click="changedisplay" > -->
      <el-avatar :size="36" src @error="errorHandler">
        <img :src="$store.state.userinfo.avatar" />
      </el-avatar>
      <ul class="drop_menu">
        <li>
          <el-button @click="menu('mine')">个人中心</el-button>
        </li>
        <li>
          <el-button @click="menu('upload')">上传视频</el-button>
        </li>
        <li>
          <el-button @click="menu('topic')">我要发贴</el-button>
        </li>
        <li>
          <el-button @click="cancel">退出</el-button>
        </li>
      </ul>
    </div>
    <el-badge :value="$store.state.messages.length" :max="10" class="item">
      <el-button
        type="primary"
        size="small"
        @click="menu('message')"
        icon="el-icon-message-solid"
      >通知</el-button>
    </el-badge>
    <el-badge :value="$store.state.privateData.length" :max="10" class="item">
      <el-button type="primary" size="small" @click="menu('private')" icon="el-icon-edit-outline">私信</el-button>
    </el-badge>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {};
  },
  methods: {
    edit() {
      this.$router.push("/edit");
    },
    cancel() {
      this.$store.commit("loginflag", { flag: false });
      this.$emit("menu", "it");
      Cookies.remove("usrinfo", { path: "" });
    },
    menu(data) {
      switch (data) {
        case "mine":
          this.$emit("menu", data);
          break;
        case "upload":
          //todo 上传视频
          this.$router.push({ path: "/upload", query: { flag: "video" } });
          break;
        case "topic":
          //todo 发表帖子
          this.$router.push("/upload");
          break;
        case "message":
          this.$emit("menu", data);
          break;
        case "private":
          // 写私信
          this.$router.push("/private");
          this.$notify.info({
            title: "提示",
            message: "点击左侧名字即可开始私信！"
          });
          break;
      }
    },
    errorHandler() {
      return true;
    }
  }
};
</script>

<style scoped>
.avatar {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.dropdown {
  position: relative;
}
.drop_menu {
  z-index: 10;
  display: none;
  position: absolute;
  /* box-shadow: 0 8px 16px 0 rgba(0,0,0,.2); */
  text-align: center;
  right: -5px;
  top: 22px;
}
li {
  list-style: none;
}
li .el-button {
  width: 100px;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #ccc;
}
.dropdown:hover .drop_menu {
  display: block;
}
</style>