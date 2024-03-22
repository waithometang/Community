<template>
  <div class="edit">
    <div style="position:sticky;top:0px;z-index:2;width:100%">
      <div style="display:flex;background-color:#fff;">
        <div ref="editor" style="margin:20px 0;text-align:left;width:60%;"></div>
        <div style="margin:20px;margin-right:50px;text-align:right;width:40%;">
          <router-link to="/">
            <el-button type="info">首页</el-button>
          </router-link>
        </div>
      </div>
    </div>
    <div style="display:flex;margin-top:50px;">
      <div ref="text" style="min-height:70vh;width:50%;border:1px solid #ccc;text-align:left;"></div>
      <div
        v-html="article.content"
        style="text-align:left;width:50%;background-color:#fff3f3;padding-left:8px;"
        class="preview"
      ></div>
    </div>
    <el-form ref="article" :model="article" label-width="80px" style="margin-top:20px;">
      <el-form-item label="标题">
        <el-input v-model="article.head"></el-input>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="article.abstract" type="textarea" style="width:40%"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="article.sort" placeholder="选择分类">
          <el-option label="技术文章" value="技术"></el-option>
          <el-option label="新闻分享" value="新闻"></el-option>
          <el-option label="个人分享" value="观点"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面">
        <el-upload
          class="avatar-uploader"
          :action="upload"
          name="img"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon">
            <br />
            <span style="font-size:14px;">不上传则为默认封面</span>
          </i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="getContent" type="primary" round size="small">发表文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {
      imageUrl: "",
      article: {
        sort: "", //文章分类
        head: "", //文章标题
        author: this.$store.state.userinfo.nickname, //文章作者
        abstract: "", //文章摘要
        content: "", //文章内容
        user: this.$store.state.userinfo.account,
        image: null //文章封面 默认值null
      },
      upload: "http://localhost:3000/upload",
      disvisble: true
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      this.imageUrl = res.url;
      this.article.image = res.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //发表文章
    getContent: function() {
      if (this.$route.query.flag) {
        //更新文章
        this.article.flag = this.$route.query.flag;
        // console.log(this.article);
        this.$post(this.article, "/posts/updateposts").then(res => {
          this.article = {};
          this.$msg.success(res.msg);
          this.$router.push({
            path: "/article",
            query: { flag: this.$route.query.flag }
          });
        });
      } else {
        //新增文章
        this.$post(this.article, "/posts/store")
          .then(res => {
            this.$msg.success(res.msg);
            this.article.sort = "";
            this.article.head = "";
            this.article.abstract = "";
            this.article.content = "";
            this.$router.push("/");
          })
          .catch(err => {
            this.$msg.fail(err);
          });
      }
    }
  },
  mounted() {
    let editor = new E(this.$refs.editor, this.$refs.text);
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];

    editor.customConfig.onchange = html => {
      this.article.content = html;
    };
    editor.customConfig.zIndex = 1;
    editor.customConfig.uploadImgServer = "http://localhost:3000/upload";
    editor.customConfig.uploadFileName = "img";
    editor.customConfig.uploadImgTimeout = 6000;
    editor.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result) {
        let url = result.url;
        insertImg(url);
      }
    };
    editor.create();
    if (this.$route.query.flag) {
      this.$get({ flag: this.$route.query.flag }, "/posts/findbyid").then(
        res => {
          editor.txt.html(res.content.pcontent);
          this.article.sort = res.content.psort;
          this.article.head = res.content.phead;
          this.article.abstract = res.content.pabstract;
          this.article.image = res.content.pimg;
          this.article.content = res.content.pcontent;
        }
      );
    }
  }
};
</script>

<style scoped>
.edit {
  text-align: start;
  position: relative;
}
.el-input {
  width: 40%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #fff;
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