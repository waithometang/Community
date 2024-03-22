<template>
  <div class="upload">
    <div v-if="$route.query.flag" class="video">
      <h3 style="color: skyblue;">分享视频</h3>
      <el-upload
        class="upload-demo"
        drag
        name="video"
        accept="mp4"
        :action="uploadvideo"
        :data="updata"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将视频拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">请上传MP4格式视频</div>
      </el-upload>
      <el-button type="text" size="small" style="margin-top:10px;" @click="$router.push('/')">返回首页</el-button>
    </div>
    <div v-else>
      <el-button
        type="info"
        style="margin-left:20px;margin-top:20px;"
        @click="$router.push('/')"
      >返回首页</el-button>
      <h4 style="margin-left: 315px;padding-bottom:5px;color:rgb(64, 158, 255);">发表帖子</h4>
      <el-form label-width="80px" style="width:500px;margin-left:90px;" :model="topic">
        <el-form-item label="标题">
          <el-input v-model="topic.head"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" rows="6" v-model="topic.content"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            :limit="limit"
            name="img"
            list-type="picture-card"
            :auto-upload="false"
            ref="upload"
            multiple
            :on-change="preview"
            :action="upload"
            :on-success="handleAvatarSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="el-upload__text" @click="$refs.upload.submit();">
            <el-button type="text">点击上传</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="storetopic">发表</el-button>
          <el-button type="info" size="small" @click="$router.push('/')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      limit: 3,
      uploadvideo: "http://localhost:3000/uploadvideo/",
      upload: "http://localhost:3000/upload/",
      topic: {
        head: "",
        nickname: this.$store.state.userinfo.nickname,
        account: this.$store.state.userinfo.account,
        image: [],
        content: ""
      },
      updata: {
        user: this.$store.state.userinfo.nickname,
        account: this.$store.state.userinfo.account
      }
    };
  },
  methods: {
    preview(file) {
      if (!/(.jpg|.jpeg|.png)$/.test(file.name))
        this.$msg.fail("警告,请选择jpg,png格式图片");
    },
    handleAvatarSuccess(res) {
      this.topic.image.push(res.url);
    },
    //发表帖子
    storetopic() {
      this.$post(this.topic, "/topic/store")
        .then(res => {
          this.$msg.success(res.msg);
          this.$router.push("/");
        })
        .catch(err => {
          this.$msg.fail(err);
        });
    }
  }
};
</script>

<style scoped>
.upload {
  background-color: #f9f9f9;
  width: 900px;
  margin: 50px auto;
  min-height: 600px;
}
.video {
  padding: 100px;
  text-align: center;
}
</style>