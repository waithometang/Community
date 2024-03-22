<template>
  <!-- 头部顶栏组件 -->
  <div>
    <div class="header">
      <!-- 导航分类 -->
      <div class="logo">
        <img src="../assets/logo.png" alt height="50px" />
      </div>
      <div class="classify_left">
        <el-button type="text" @click="checksort('it')">技术</el-button>
        <el-button type="text" @click="checksort('news')">新闻</el-button>
        <el-button type="text" @click="checksort('view')">观点</el-button>
        <el-button type="text" @click="checksort('topic')">讨论</el-button>
        <el-button type="text" @click="checksort('video')">视频</el-button>
      </div>
      <!-- 搜索 -->
      <div class="search">
        <el-input
          placeholder="请输入内容:如作者或标题"
          prefix-icon="el-icon-search"
          size="small"
          v-model="searchdata.content"
          clearable
        ></el-input>
        <el-select clearable size="small" v-model="searchdata.sort" placeholder="请选择">
          <el-option label="文章" value="article"></el-option>
          <el-option label="话题" value="topic"></el-option>
        </el-select>
        <span style="padding-left:5px;"></span>
        <el-button icon="el-icon-search" type="primary" size="small" @click="search(searchdata)"></el-button>
      </div>
      <div class="mine">
        <!-- 登录注册按钮 -->
        <div v-if="!$store.state.loginflag">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              @click="login('login')"
              style="margin-right: 2px"
            >登录</el-button>
            <el-button type="primary" size="small" @click="login('regist')">注册</el-button>
          </el-button-group>
        </div>
        <!-- 登录成功 显示头像组件-->
        <div v-else>
          <Avatarcom @menu="checksort"></Avatarcom>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatarcom from "@/components/Avatar";
export default {
  components: {
    Avatarcom
  },
  data() {
    // props:[]
    return {
      //   loginflag:true //登录成功标识
      searchdata: { sort: "", content: "" }
    };
  },
  methods: {
    login(e) {
      //todo login
      this.$router.push("/login/" + e);
    },
    checksort(e) {
      this.$emit("changesort", e);
    },
    //查询文章或帖子
    search(data) {
      // console.log(data);
      let url = data.sort === "topic" ? "/topic/findsome" : "/posts/findsome";
      let commit = data.sort === "topic" ? "search_topic" : "search_article";
      let flag = data.sort === "topic" ? "topic" : "articles";
      // console.log(url);
      // console.log(commit);
      // console.log(flag);
      //查询帖子 data={ sort: "", content: "" } url=/topic/findsome||/posts/findsome
      this.$post(data, url)
        .then(res => {
          // console.log(res);
          if (res.data.length > 0) {
            this.$store.commit(commit, res.data);
            this.checksort(flag);
          } else {
            this.$msg.success("没有查找到任何数据");
          }
        })
        .catch(err => {
          this.$msg.fail(err);
        });
    }
  }
};
</script>

<style scoped>
/* header头部组件 容器 */
a {
  text-decoration: none;
}
.header {
  display: flex;
  align-items: center;
}
/* 分类导航 */
.classify_left {
  display: flex;
  flex-grow: 2;
  justify-content: space-evenly;
}
.logo,
.search,
.mine {
  flex-grow: 1;
}
/* 搜索 */
.search {
  display: flex;
  margin-right: 5px;
}
.search .el-input {
  margin-right: 5px;
}
.classify_left .el-button {
  color: #71777c;
  font-size: 16px;
}
.el-button:hover {
  color: #007fff;
}
</style>