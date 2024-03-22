<template>
  <div>
    <!-- 文章详情页 -->
    <div class="back" @click="$router.push('/')">
      <el-button type="primary">首页</el-button>
    </div>
    <div style="margin:10px 120px;">
      <h3>{{article.phead}}</h3>
      <p style="font-size:14px;color:#ccc;">
        作者:{{article.pauthor}}
        <span>{{article.pdate}}</span>
      </p>
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
            <!-- 点赞 -->
            <!--  :class="[!isLike?likeClass:likeClass1]"
            :type="typeInfo"
            :class="likeClass"
            -->

            <el-button size="small" circle @click="like" :class="[!isLike?likeClass:likeClass1]"></el-button>

            <!-- 收藏
             type="danger"
             icon="el-icon-star-off"
             type="danger"
            -->
            <el-button
              size="small"
              :class="[!isCollect?collectClass:collectClass1]"
              circle
              @click="collect"
            ></el-button>
            <!-- 分享 
              icon="el-icon-share"
              type="warning"

            -->
            <el-button size="small" circle :class="shareIcon" @click="share(article._id)"></el-button>
          </span>
        </div>
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
      <el-button @click="visible = true" v-if="$store.state.loginflag" type="info">发表评论</el-button>
      <div v-else>
        请先去
        <el-button type="text" @click="$router.push('/login/login')">登录</el-button>
        <el-button type="text" @click="$router.push('/login/regist')">注册</el-button>，发表评论
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
    <!-- <share :config="config"></share> -->
  </div>
</template>

<script >
export default {
  data() {
    return {
      article: {},
      visible: false,
      comment: "",
      openBtn: true,
      // 分享icon
      shareIcon: "iconfont icon-fenxaing",
      likeClass: "iconfont icon-zan",
      likeClass1: "iconfont icon-dianzan",
      collectClass: "iconfont icon-shoucang",
      collectClass1: "iconfont icon-icon-shoucang2",
      // // 点赞状态
      isLike: false,
      // 收藏状态
      isCollect: false,
      // typeInfo: "info",
      // // 点赞对象
      likeinfo: {
        isLike: false,
        typeInfo: "info",
        artId: "",
        usrAcc: ""
      },
      // 收藏对象
      collectinfo: {
        isCollect: false,
        typeInfo: "info",
        artId: "",
        usrAcc: ""
      }
    };
  },
  beforeMount() {
    const flag = this.$route.query.flag;
    if (this.$route.query.flag) {
      this.$get({ flag: this.$route.query.flag }, "/posts/findbyid").then(
        res => {
          this.article = res.content;
          // console.log(res);
          const dianzaninfo = JSON.parse(localStorage.getItem("like"));
          const shoucanginfo = JSON.parse(localStorage.getItem("collect"));
          let likeindex = dianzaninfo.findIndex(
            v =>
              v.artId === flag &&
              v.usrAcc === this.$store.state.userinfo.account
          );
          let collectindex = shoucanginfo.findIndex(
            v =>
              v.artId === flag &&
              v.usrAcc === this.$store.state.userinfo.account
          );
          if (likeindex !== -1) {
            this.isLike = true;
          }
          if (collectindex !== -1) {
            this.isCollect = true;
          }
          // console.log(dianzaninfo);
          // console.log(this.article);
          // console.log(res);
          // this.likeinfo.artId = res.content._id;
          // this.likeinfo.usrAcc = this.$store.state.userinfo.account;
        }
      );
    } else {
      this.article = this.$route.query;
      // console.log(this.article);

      // this.likeinfo.artId = this.$route.query._id;
      // this.likeinfo.usrAcc = this.$store.state.userinfo.account;
    }
  },
  mounted() {
    this.getLike();
  },
  methods: {
    // 获取点赞状态
    getLike() {
      // 点赞信息
      this.likeinfo.artId = this.article._id;
      this.likeinfo.usrAcc = this.$store.state.userinfo.account;
      // 收藏信息
      this.collectinfo.artId = this.article._id;
      this.collectinfo.usrAcc = this.$store.state.userinfo.account;

      // console.log(this.article);
      // 点赞
      let likeList = JSON.parse(localStorage.getItem("like")) || [];
      let like = likeList.some(
        v =>
          v.artId === this.article._id &&
          v.usrAcc === this.$store.state.userinfo.account
      );
      this.isLike = like;

      // 收藏
      let collectList = JSON.parse(localStorage.getItem("collect")) || [];
      let collect = collectList.some(
        v =>
          v.artId === this.article._id &&
          v.usrAcc === this.$store.state.userinfo.account
      );
      this.isCollect = collect;
      // if (like) {
      //   this.typeInfo = "danger";
      // } else {
      //   this.typeInfo = "info";
      // }
      // let like = likeList.some(v => {
      // likeList.some(v => {
      //   if (
      //     v.artId === this.article._id &&
      //     v.usrAcc === this.$store.state.userinfo.account
      //   ) {
      //     this.isLike = true;
      //     this.typeInfo = "success";
      //   } else {
      //     this.isLike = false;
      //     this.typeInfo = "info";
      //   }
      // });
      // if (like) {
      //   this.isLike = true;
      //   this.typeInfo = "success";
      // } else {
      //   this.isLike = false;
      //   this.typeInfo = "info";
      // }
      // let like = likeList.some(v => v._id === this.article._id);
      //   this.isLike = like;

      //   //
      //   // (this.likeinfo.artId = this.article._id),
      //   //   (this.likeinfo.usrAcc = this.$store.state.userinfo.account);
    },
    // 点赞
    like() {
      // 不行
      // 是否点赞
      let dianzan = false;
      // 点赞变化颜色
      // let typeInfo = "info";
      // 点击事件触发
      let zan = JSON.parse(localStorage.getItem("like")) || [];
      let index = zan.findIndex(v => {
        //   // console.log(v);
        return (
          v.artId == this.article._id &&
          v.usrAcc == this.$store.state.userinfo.account
        );
      });
      // // console.log(zan);
      // // console.log(index);
      if (index !== -1) {
        // 找到商品
        zan.splice(index, 1);
        dianzan = false;
        // typeInfo = "info";

        //
        this.likeinfo.isLike = false;
        this.likeinfo.typeInfo = "info";
      } else {
        //   // 找不到商品
        dianzan = true;
        // typeInfo = "danger";

        zan.push(this.likeinfo);
        this.likeinfo.isLike = true;
        this.likeinfo.typeInfo = "success";
      }
      localStorage.setItem("like", JSON.stringify(zan));

      this.isLike = dianzan;
      // this.typeInfo = typeInfo;

      //
      let likedata = {
        head: this.article.phead,
        author: this.article.pauthor,
        abstract: this.article.pabstract,
        flag: this.article._id,
        account: this.$store.state.userinfo.account
        // count: this.count
      };
      this.$post(likedata, "/posts/like")
        .then(res => {
          if (res.like === true) {
            this.$message.error("取消点赞");
            // console.log(res);
            // this.isLike = false;
            // this.typeInfo = "info";
          } else {
            this.$message({
              message: "点赞成功",
              type: "info"
            });
            // console.log(res);

            // this.isLike = true;
            // this.typeInfo = "success";
          }
          // this.$msg.success(res.msg);
        })
        .catch(err => {
          this.$msg.fail(err);
        });

      // 点赞状态
      // this.isLike = !this.isLike;
      // if (this.typeInfo === "info") {
      //   this.typeInfo = "success";
      // } else {
      //   this.typeInfo = "info";
      // }
    },
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
    // 发表评论
    send_comment() {
      let comment = this.comment.trimLeft();
      if (comment.length > 0) {
        this.$post(
          {
            head: this.article._id,
            comment: {
              user: this.$store.state.userinfo.nickname,
              comment: comment,
              avatar: this.$store.state.userinfo.avatar,
              date: this.$store.state.userinfo.date
            }
          },
          "/posts/comment"
        )
          .then(res => {
            // console.log(this.article);
            this.$msg.success(res.msg);
            this.article.pcomment.push({
              user: this.$store.state.userinfo.nickname,
              comment: comment,
              avatar: this.$store.state.userinfo.avatar,
              date: this.$store.state.userinfo.date
            });
            this.visible = false;
          })
          .catch(err => {
            this.$msg.fail(err);
          });
      } else {
        this.$msg.fail("请输入内容");
      }
    },
    //收藏文章
    collect() {
      let shoucang = false;
      // 点赞变化颜色
      // let typeInfo = "info";
      // 点击事件触发
      let cang = JSON.parse(localStorage.getItem("collect")) || [];
      let index = cang.findIndex(v => {
        return (
          v.artId == this.article._id &&
          v.usrAcc == this.$store.state.userinfo.account
        );
      });
      if (index !== -1) {
        // 找到商品
        cang.splice(index, 1);
        shoucang = false;
        // typeInfo = "info";

        this.collectinfo.isCollect = false;
        this.collectinfo.typeInfo = "info";
      } else {
        //   // 找不到商品
        shoucang = true;
        // typeInfo = "danger";

        cang.push(this.collectinfo);
        this.collectinfo.isCollect = true;
        this.collectinfo.typeInfo = "success";
      }
      localStorage.setItem("collect", JSON.stringify(cang));

      this.isCollect = shoucang;
      //
      let collectdata = {
        head: this.article.phead,
        author: this.article.pauthor,
        abstract: this.article.pabstract,
        flag: this.article._id,
        account: this.$store.state.userinfo.account
      };
      this.$post(collectdata, "/posts/collect")
        .then(res => {
          if (res.like === true) {
            this.$message.error("取消收藏");
          } else {
            this.$message({
              message: "收藏成功",
              type: "info"
            });
          }
          // this.$msg.success(res.msg);
        })
        .catch(err => {
          this.$msg.fail(err);
        });
    },
    //分享
    share(id) {
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
  /* border-bottom: 1px solid #ebeef5; */
  /* border: 1px solid red; */
  background-color: #fafbfc;
}
.el-image {
  vertical-align: middle;
  margin-right: 5px;
}
/* .open {
  border: 1px solid red;
  text-align: center;
} */
</style>