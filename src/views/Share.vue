<template>
  <div>
    <!-- 文章详情页 -->
    <div class="back" @click="$router.push('/')"></div>
    <div style="margin:10px 120px;">
      <h3>{{article.phead}}</h3>
      <p style="font-size:14px;color:#ccc;">
        作者:{{article.pauthor}}
        <span>{{article.pdate}}</span>
      </p>
      <!-- <div v-html="article.pcontent">
      </div>-->
      <div style="border: 1px solid #eee">
        <div
          v-html="article.pcontent"
          style="margin: 5px 10px;height:300px;overflow:hidden;"
          class="contentBox"
        >
          <!-- 文章内容 -->
        </div>
        <div style="text-align: center;">
          <el-button
            v-if="openBtn"
            type="info"
            icon="el-icon-caret-bottom"
            @click="openContent"
            class="open"
          >展开更多</el-button>
          <el-button
            v-else
            type="info"
            icon="el-icon-caret-top"
            @click="closeContent"
            class="close"
          >收起</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-card style="margin:10px 60px;">
        <div slot="header" class="clearfix">
          <el-button type="text">
            用户评论:
            <i class="el-icon-chat-dot-square el-icon--right"></i>
          </el-button>
          <span style="float:right;margin:3px 4px" v-if="$store.state.loginflag">
            <!-- 分享 -->
            <el-button
              size="small"
              type="warning"
              icon="el-icon-share"
              circle
              @click="share(article._id)"
            ></el-button>
            <!-- 收藏 -->
            <el-button
              size="small"
              type="warning"
              icon="el-icon-star-off"
              circle
              @click="collect(article._id)"
            ></el-button>
          </span>
        </div>
        <!-- <div
          v-for="item in article.pcomment"
          :key="item.user"
          class="item"
        >{{item.user}} ：{{item.comment}}</div>-->
        <div v-for="item in article.pcomment" :key="item.user+Math.random()" class="item">
          <el-image
            style="width: 50px; height: 50px;border-radius:50%;"
            :src="item.avatar"
            fit="fill"
          ></el-image>
          <!-- <el-avatar :src="$store.state.userinfo.avatar"></el-avatar> -->
          <span style="display: inline-block; padding: 0px 0px;">{{item.user}}</span>
          <!-- <span style="display: inline-block; padding: 0px 0px;">{{item.user}}</span> -->
          <div
            style="color:#505050;text-indent: 54px;margin-top:5px;margin-bottom: 10px;"
          >{{item.comment}}</div>
          <div style="color:#8a93a0;text-indent: 54px;">{{item.date}}</div>
          <!-- {$store.state.userinfo "account": "lisi", "nickname": "李四", "date": "2020-4-29", "gender": "女", "avatar": "http://localhost:3000/images/9957554b31b3edc4569ad99c4e11dcc4" } -->
        </div>
      </el-card>
    </div>
    <div style="text-align:center;margin-bottom:40px;">
      <el-button @click="visible = true" v-if="$store.state.loginflag">发表评论</el-button>
      <div v-else>
        请先去
        <el-button type="text" @click="$router.push('/login/login')">登录</el-button>
        <el-button type="text" @click="$router.push('/login/regist')">注册</el-button>，
        发表评论
      </div>
    </div>
    <el-dialog title="发表评论" :visible.sync="visible" width="40%">
      <span>
        <el-input
          type="textarea"
          v-model="comment"
          :rows="4"
          placeholder="在此输入评论，字数限制200字以内"
          maxlength="200"
        ></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="send_comment">评论</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      visible: false,
      comment: "",
      openBtn: true
    };
  },
  beforeMount() {
    if (this.$route.params.id) {
      this.$get({ flag: this.$route.params.id }, "/posts/findbyid").then(
        res => {
          this.article = res.content;
        }
      );
    } else {
      this.article = this.$route.query;
    }
  },
  methods: {
    // 展开内容
    openContent() {
      let box = document.querySelector(".contentBox");
      box.style.height = "100%";
      this.openBtn = false;
    },
    // 收起内容
    closeContent() {
      let box = document.querySelector(".contentBox");
      box.style.height = "300px";
      this.openBtn = true;
    },
    send_comment() {
      let comment = this.comment.trimLeft();
      if (comment.length > 0) {
        this.$post(
          {
            head: this.article._id,
            comment: {
              user: this.$store.state.nickname,
              comment: comment,
              avatar: this.$store.state.userinfo.avatar,
              date: this.$store.state.userinfo.date
            }
          },
          "/posts/comment"
        )
          .then(res => {
            this.$msg.success(res.msg);
            this.article.pcomment.push({
              user: this.$store.state.nickname,
              comment: comment,
              avatar: this.$store.state.userinfo.avatar,
              date: this.$store.state.userinfo.date
            });
            this.visible = false;
          })
          .catch(err => {
            this.$msg.fail(err);
          });
      }
    },
    //收藏文章
    collect(id) {
      alert("收藏文章:" + id);
    },
    //分享
    share(id) {
      // this.$alert(
      //   `http://localhost:8080/share/${id}`,
      //   "快复制地址分享给小伙伴吧"
      // );
      this.$confirm(
        `http://localhost:8080/share/${id}`,
        "快复制地址分享给小伙伴吧",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.$message({
            type: "success",
            message: "关闭窗口!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "关闭窗口"
          });
        });
    }
  }
};
</script>

<style scoped>
.back {
  margin: 20px;
}
.back:hover {
  cursor: pointer;
}
html {
  background-color: #dce2e7;
}

h3,
p {
  text-align: center;
}
/* .comment{
    font-size: 14px;
    color: #444;
    min-height: 100px;
    line-height: 200%;
    background-color: #ff5722;
} */
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.item {
  font-size: 14px;
  margin-bottom: 18px;
}
</style>>