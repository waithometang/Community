<template>
  <div class="topic">
    <div
      v-for="(item,index) in topicList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :key="'topic'+index"
    >
      <!-- 贴子列表 -->
      <h1 style="text-align:center;color: #333;font-size: 20px;letter-spacing:2px">{{item.thead}}</h1>
      <!-- <h4 style="padding-top:5px;color:">{{item.thead}}</h4> -->
      <div>
        <!-- #fafbfc -->
        <p
          style="color: #505050;font-size:18px;line-height:30px;word-break: break-all;"
        >{{item.tcontent}}</p>
      </div>
      <div class="demo-image__preview">
        <el-image
          v-for="(i,index) in item.timage"
          :key="index+'image'"
          style="width: 200px;height: 200px;"
          :src="i"
          :preview-src-list="item.timage"
        ></el-image>
      </div>
      <div style="padding-top:5px;">
        <span style="color:#ccc;font-size:14px;">
          <span style="padding-right:20px;">{{item.tdate}}</span>
          <span>{{item.tname}}</span>
          <span>
            <el-button
              icon="el-icon-chat-dot-round"
              size="medium"
              circle
              type="text"
              @click="item.showcomment = !item.showcomment;comments.id = item._id;comments.content='';"
            >{{item.tcomment.length}}</el-button>
          </span>
        </span>
      </div>
      <div v-show="item.showcomment">
        <div style="width:1000px;">
          <el-input type="textarea" rows="3" v-model="comments.content" placeholder="回复作者..."></el-input>
        </div>
        <div style="margin-top:5px">
          <!-- <el-button v-if="$store.state.loginflag"></el-button> -->
          <el-button @click="comment" type="primary" v-if="$store.state.loginflag">评论</el-button>
          <div v-else>
            请先去
            <el-button type="text" @click="$router.push('/login/login')">登录</el-button>
            <el-button type="text" @click="$router.push('/login/regist')">注册</el-button>，发表评论
          </div>
        </div>
        <div v-for="(i,index) in item.tcomment" :key="'comment'+ index">
          <div style="border-top:1px solid #ccc;margin-top:5px;background-color:#f1f1f1">
            <el-avatar :src="i.avatar"></el-avatar>
            <span style="color:#ccc;font-size:14px;">
              {{i.nickname}}
              <span style="margin-left:10px;">{{i.date}}</span>
            </span>
            <div style="text-indent: 4em;margin-top:5px;">{{i.content}}</div>
          </div>
        </div>
      </div>
      <hr />
    </div>
    <el-pagination
      v-if="topicList.length>0"
      style="margin-top:30px;text-align:center;"
      @current-change="current_change"
      :page-size="pagesize"
      layout="total, prev, pager, next"
      :total="topicList.length"
    ></el-pagination>
    <div v-else style="text-align:center;font-size:20px;height:500px;">
      <el-link type="info" :underline="false">还没有任何帖子</el-link>
    </div>
  </div>
</template>

<script>
export default {
  // // 新增代码
  props: ["topics"],
  // 结束
  data() {
    return {
      topicList: [],
      page: 0,
      sizes: 0,
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      comments: {
        id: "",
        avatar: this.$store.state.userinfo.avatar,
        nickname: this.$store.state.userinfo.nickname,
        content: "",
        date: new Date().toLocaleString().replace(/\d{1,2}$/, "")
      }
    };
  },
  // created() {
  //   console.log(this.topics);
  // },
  // 监控
  watch: {
    topics(newval) {
      this.topicList = newval;
      // console.log(newval);
    }
  },
  mounted() {
    // 新增

    if (this.topics.length > 0) {
      this.topicList = this.topics;
      // console.log(this.topicList);
    }
    // 原来
    // if (this.$store.state.searchtopics.length > 0) {
    //   this.topicList = this.$store.state.searchtopics;
    //   // this.topicList = this.topics;
    // }
    else {
      this.$get({}, "/topic/alltopics")
        .then(res => {
          this.topicList = res.data;
        })
        .catch(err => {
          this.$msg.fail(err);
        });
    }
  },
  // updated() {
  //   console.log(this.topics);
  // },
  methods: {
    current_change(currentPage) {
      this.currentPage = currentPage;
    },
    //评论
    comment() {
      let comment = this.comments;
      if (comment.content.trim().length > 0) {
        this.$post(comment, "/topic/comment")
          .then(res => {
            this.$msg.success(res.msg);
            for (let i = 0; i < this.topicList.length; i++) {
              if (this.topicList[i]._id === comment.id) {
                this.topicList[i].tcomment.push(comment);
                break;
              }
            }
          })
          .catch(err => {
            this.$msg.fail(err);
          });
      } else {
        this.$msg.fail("请填写评论内容！");
      }
    }
  }
};
</script>

<style scoped>
.topic {
  width: 1080px;
  margin: 20px auto;
  background-color: #f9f9f9;
  text-indent: 2em;
}
p {
  text-align: left;
}
</style>