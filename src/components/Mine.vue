<template>
  <div class="mine">
    <!-- 个人中心详情页 -->
    <div class="aside">
      <ul>
        <li>
          <el-button type="text" @click="flag='mine';title='个人资料';">个人资料</el-button>
        </li>
        <li>
          <el-button type="text" @click="getmsg('article')">我的文章</el-button>
        </li>
        <li>
          <el-button type="text" @click="getmsg('topic')">我的帖子</el-button>
        </li>
        <li>
          <el-button type="text" @click="getmsg('collect')">我的收藏</el-button>
        </li>
        <li>
          <el-button type="text" @click="getmsg('like')">我的点赞</el-button>
        </li>
        <li>
          <el-button type="text" @click="getmsg('message')">
            通知消息
            <span class="reddot" v-if="$store.state.messages.length>0"></span>
          </el-button>
        </li>
      </ul>
    </div>
    <div class="content">
      <h3>{{title}}</h3>
      <canvas width="700" height="4"></canvas>
      <!-- 个人资料 -->
      <div class="mine_detail" v-if="flag == 'mine'">
        <div>
          <img :src="formdata.avatar" />
          <div style="text-align:center;">
            <el-button type="text" @click="visible=!visible">修改头像</el-button>
          </div>
        </div>
        <div style="margin-left:20px;margin-top:15px;width:450px;">
          <el-form label-width="80px" label-position="right" :model="formdata">
            <el-form-item label="账号:">
              <span style="color:#aaa;">{{formdata.account}}</span>
            </el-form-item>
            <el-form-item label="昵称:">
              <el-input v-if="update_btn" v-model="formdata.nickname"></el-input>
              <span v-else>{{formdata.nickname}}</span>
            </el-form-item>
            <el-form-item label="性别:">
              <el-radio-group v-if="update_btn" v-model="formdata.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
              <span v-else>{{formdata.gender}}</span>
            </el-form-item>
            <el-form-item label="注册时间:">
              <span style="color:#aaa;">{{formdata.date}}</span>
            </el-form-item>
            <el-form-item v-if="update_btn">
              <el-button size="small" type="primary" @click="submit_mine(formdata)">确认修改</el-button>
              <el-button size="small" type="info" @click="update_btn=!update_btn">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button type="text" @click="update_btn=true" v-if="!update_btn">修改资料</el-button>
        </div>
      </div>
      <!-- 我的文章 -->
      <div v-else-if="flag == 'article'">
        <div
          v-for="(item,index) in articleList"
          :key="'article'+index"
          style="max-width:90%;border-bottom:1px solid #ebebeb;margin-top:10px;"
        >
          <div
            style="font-weight:600;font-size:18px;color:#17181a;text-align: center;"
          >{{item.head}}</div>
          <div style="font-size:14px;color: #666;margin-top:5px;text-indent:10px;">{{item.abstract}}</div>
          <span style="color:#b2bac2;font-size:14px;">{{item.date}}</span>
          <span style="padding-left:20px;">
            <el-button type="text" @click="view_article(item.flag)" icon="el-icon-view">查看</el-button>
            <el-button type="text" @click="edit_article(item.flag)" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="text"
              @click="deletevisible = true;deleteflag = item.flag"
              icon="el-icon-delete"
            >删除</el-button>

            <el-dialog :visible.sync="deletevisible" width="400px" title="提示">
              <span>确认删除吗？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="deletevisible = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" @click="deletearticle(deleteflag)">确 定</el-button>
              </span>
            </el-dialog>
          </span>
        </div>
      </div>
      <!-- 我的帖子 -->
      <div v-else-if="flag == 'topic'">
        <div
          v-for="(item,index) in topicList"
          :key="'topic'+index"
          style="max-width:90%;border-bottom:1px solid #ebebeb;"
        >
          <div style="text-align:center;color:#000;font-weight: 600;margin-top: 5px;">{{item.head}}</div>
          <div style="word-break: break-all;text-indent:10px;">{{item.content}}</div>
          <span style="color:#b2bac2;font-size:14px">{{item.date}}</span>
          <span style="padding-left:20px;">
            <el-button
              type="text"
              size="small"
              @click="delete_topic(item.flag)"
              icon="el-icon-delete"
            >删除</el-button>
          </span>
        </div>
      </div>
      <!-- 我的收藏 -->
      <div v-else-if="flag === 'collect'">
        <div
          v-for="(item,index) in collectList"
          :key="'collect'+index"
          style="max-width:90%;border-bottom: 1px solid #ebebeb"
        >
          <div style="text-align:center;color:#000;font-weight: 600;margin-top: 5px;">{{item.head}}</div>
          <p style="text-indent:10px;">{{item.abstract}}</p>
          <span style="color:#b2bac2;font-size:14px;">{{item.date}} {{item.author}}</span>
          <span style="padding-left:20px;">
            <el-button type="text" @click="view_article(item.flag)" icon="el-icon-view">查看</el-button>
            <el-button type="text" @click="delete_collect(item.flag)" icon="el-icon-error">取消收藏</el-button>
          </span>
        </div>
      </div>
      <!-- 我的点赞 -->
      <div v-else-if="flag === 'like'">
        <div
          v-for="(item,index) in likeList"
          :key="'like'+index"
          style="max-width:90%;border-bottom: 1px solid #ebebeb"
        >
          <div style="text-align:center;color:#000;font-weight: 600;margin-top: 5px;">{{item.head}}</div>
          <p style="text-indent:10px;">{{item.abstract}}</p>
          <span style="color:#b2bac2;font-size:14px;">{{item.date}} {{item.author}}</span>
          <span style="padding-left:20px;">
            <el-button type="text" @click="view_article(item.flag)" icon="el-icon-view">查看</el-button>
            <el-button type="text" @click="delete_like(item.flag)" icon="el-icon-error">取消点赞</el-button>
          </span>
        </div>
      </div>
      <!-- 通知消息 -->
      <div v-else-if="flag === 'message'">
        <div
          v-for="(item,index) in $store.state.messages"
          :key="'message'+index"
          style="cursor:pointer;border-bottom:1px solid #ccc;background-color: #fff;margin-bottom:10px;width: 660px;"
          @click="delete_message(item._id)"
        >
          <div>
            <!-- <span class="reddot"></span> -->
            <!-- <el-link type="primary">消息</el-link> -->

            <!-- <p>{{item.title}}</p> -->
          </div>
          <p style="font-size:18px;color=#17181a;text-align: center;">{{ item.title }}</p>
          <div>
            <el-button type="text">{{item.reason}}</el-button>
          </div>
          <span style="color:#000;font-size:14px;">{{item.date}}</span>
        </div>
      </div>

      <el-dialog title="上传头像" :visible.sync="visible" width="500px">
        <span>
          <el-upload
            class="avatar-uploader"
            :action="uploadurl"
            :data="{'user':formdata.account}"
            :show-file-list="false"
            :on-success="upload_success"
            :before-upload="befor_upload"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
  mounted() {
    let mycanvas = document.querySelector("canvas");
    let cxt = mycanvas.getContext("2d");
    cxt.moveTo(0, 2.5);
    cxt.lineTo(660, 2.5);
    cxt.strokeStyle = "#ccc";
    cxt.stroke();
  },
  data() {
    return {
      flag: "mine",
      title: "个人资料",
      update_btn: false,
      visible: false,
      deletevisible: false, //删除确认弹窗
      deleteflag: "",
      formdata: this.$store.state.userinfo,
      uploadurl: "http://localhost:3000/updateavatar",
      articleList: [], //个人文章列表
      topicList: [], //个人帖子列表
      collectList: [], //个人收藏
      likeList: [] // 个人点赞
    };
  },
  // watch: {
  //   formdata: {
  //     handler: "cookieChange",
  //     deep: true
  //   }
  // },
  created() {
    console.log(this.formdata);
  },
  methods: {
    // cookieChange() {
    //   // console.log(oldval, newval);
    //   // console.log(this.formdata);
    //   this.$store.commit("usr_login", this.formdata);
    // },
    //查看文章
    view_article(flag) {
      this.$router.push({ path: "/article", query: { flag: flag } });
      // console.log(this.$store.state.messages);
    },
    //编辑文章
    edit_article(flag) {
      this.$router.push({ path: "/edit", query: { flag: flag } });
    },
    //删除文章
    deletearticle(flag) {
      this.$get({ flag: flag }, "/posts/delete")
        .then(res => {
          this.$msg.success(res.msg);
          this.getmsg("article");
          this.deletevisible = false;
        })
        .catch(err => {
          this.$msg.fail(err);
        });
    },
    //获取文章，帖子，收藏信息
    getmsg(data) {
      switch (data) {
        case "article":
          this.flag = "article";
          this.title = "我的文章";
          this.$get({ account: this.formdata.account }, "/posts/mypost").then(
            res => {
              this.articleList = res.article;
            }
          );
          break;
        case "topic":
          this.flag = "topic";
          this.title = "我的帖子";
          this.$get({ account: this.formdata.account }, "/topic/mytopic")
            .then(res => {
              this.topicList = res.data;
            })
            .catch(err => {
              this.$msg.fail(err);
            });

          break;
        case "collect":
          this.flag = "collect";
          this.title = "我的收藏";
          this.$get(
            { account: this.formdata.account },
            "/posts/showcollect"
          ).then(res => {
            this.collectList = res.data;
            // console.log(res);
          });
          break;
        case "like":
          this.flag = "like";
          this.title = "我的点赞";
          this.$get({ account: this.formdata.account }, "/posts/showlike").then(
            res => {
              this.likeList = res.data;
              // console.log(res);
            }
          );
          break;
        case "message":
          this.flag = "message";
          this.title = "通知消息";
          break;
      }
    },
    // 修改资料
    submit_mine(data) {
      if (data.nickname.trim().length > 0) {
        this.$post(data, "/login/updateinfo")
          .then(res => {
            Cookies.set("usrinfo", data);
            // this.$store.commit("usr_login", data);
            // this.$msg.success(res.msg);
            this.update_btn = false;
            console.log(res);

            // 查看修改后的信息
            // console.log(this.$store.state.userinfo);
            // console.log(this.$store.state.userinfo);
          })
          .catch(err => {
            this.$msg.fail(err);
          });
      } else {
        this.$msg.fail("昵称不能为空");
      }
    },

    //修改头像
    upload_success(_, file) {
      // console.log(file);
      if (file.response.code == 200) {
        this.formdata.avatar = file.response.url;
        Cookies.set("usrinfo", this.formdata);

        // this.$store.commit("usr_login", this.formdata);
        this.$msg.success(file.response.msg);
        this.visible = false;
        // 查看修改后的信息
        // console.log(this.$store.state.userinfo);
      } else {
        this.$msg.fail("更新失败");
      }
    },
    befor_upload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$msg.fail("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$msg.fail("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //删除消息
    delete_message(id) {
      this.$get({ id: id }, "/topic/delete_message").then(() => {
        this.$get(
          { account: this.$store.state.userinfo.account },
          "/topic/message"
        ).then(res => {
          this.$store.commit("message", res.data);
        });
      });
    },
    //删除帖子
    delete_topic(id) {
      this.$get({ id: id }, "/topic/deleteit").then(res => {
        this.$msg.success(res.msg);
        this.getmsg("topic");
      });
    },
    //取消收藏
    delete_collect(flag) {
      // 代码修改开始
      const collectList = JSON.parse(localStorage.getItem("collect")) || [];
      const index = collectList.findIndex(
        v => v.artId === flag && v.usrAcc === this.formdata.account
      );
      if (index !== -1) {
        collectList.splice(index, 1);
        localStorage.setItem("collect", JSON.stringify(collectList));
      }
      console.log(flag);
      // 结束
      this.$post(
        { flag: flag, account: this.formdata.account },
        "/posts/collect"
      ).then(res => {
        this.$message.info(res.msg);
        // this.$msg.success(res.msg);
        this.$get(
          { account: this.formdata.account },
          "/posts/showcollect"
        ).then(res => {
          this.collectList = res.data;
        });
      });
    },
    //取消点赞
    delete_like(flag) {
      // 代码修改开始
      const likeList = JSON.parse(localStorage.getItem("like")) || [];
      const index = likeList.findIndex(
        v => v.artId === flag && v.usrAcc === this.formdata.account
      );
      if (index !== -1) {
        likeList.splice(index, 1);
        localStorage.setItem("like", JSON.stringify(likeList));
      }
      console.log(flag);
      // 结束
      this.$post(
        { flag: flag, account: this.formdata.account },
        "/posts/like"
      ).then(res => {
        this.$message.info(res.msg);
        this.$get({ account: this.formdata.account }, "/posts/showlike").then(
          res => {
            this.likeList = res.data;
          }
        );
      });
    }
  }
};
</script>
<style scoped>
.reddot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(216, 90, 90);
}
img {
  margin-top: 10px;
  max-width: 100px;
  height: 100px;
}
.mine {
  margin: 20px auto;
  width: 900px;
  background-color: #f9f9f9;
  min-height: 200px;
  display: flex;
}
.aside {
  flex-grow: 1;
}
.content {
  flex-grow: 3;
  margin-left: 20px;
}
.mine_detail {
  display: flex;
}

/* 头像上传 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>