<template>
  <div>
    <el-container>
      <!-- 头部组件 -->
      <el-header style="text-align:center;">
        <!-- 新增代码topics -->
        <Headcom @changesort="changenav"></Headcom>
      </el-header>
    </el-container>
    <div style="min-height:880px;">
      <!-- <Topiccom v-if="display === 'topic'"></Topiccom> -->
      <Topiccom v-if="display === 'topic'" :topics="topics"></Topiccom>
      <Videocom v-else-if="display === 'video'"></Videocom>
      <Minecom v-else-if="display === 'mine'|| display === 'message'"></Minecom>
      <Articlecom
        v-else-if="display === 'it' 
            || display === 'news' || display === 'view' 
            || display === 'articles'"
        :articles="articles"
        :recommend="recommend"
      ></Articlecom>
    </div>
    <el-container>
      <!-- footer 网站声明 -->
      <el-footer
        style="line-height:60px;text-align:center;color: #99a9bf;font-weight:600"
      >CopyRights 2020.By 五邑大学-计算机科学与技术-唐伟鸿 AllRights Reserved.</el-footer>
    </el-container>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Headcom from "@/components/Header";
import Articlecom from "@/components/Articlead";
import Topiccom from "@/components/Topic";
import Videocom from "@/components/Video";
import Minecom from "@/components/Mine";
export default {
  name: "index",
  components: { Headcom, Articlecom, Topiccom, Videocom, Minecom },
  data() {
    return {
      articles: [],
      recommend: [],
      display: "it",
      // 新增代码
      topics: []
      // topicid: "",
      // cookies个人信息
      // cookieUserInfo: this.$store.state.userinfo
    };
  },

  beforeMount() {
    this.$get({}, "/posts/articles")
      .then(res => {
        this.$store.commit("store_article", res.data);
        this.articles = res.data["技术"];
        let rand = ["技术", "观点", "新闻"];
        let random = Math.round(Math.random() * 2);
        if (res.data[rand[random]].length < 6) {
          this.recommend = res.data[rand[random]];
        } else {
          this.recommend = res.data[rand[random]].slice(0, 6);
        }
      })
      .catch(err => {
        this.$msg.fail(err);
      });
  },
  mounted() {
    if (Cookies.get("usrinfo")) {
      this.$store.commit("usr_login", JSON.parse(Cookies.get("usrinfo")));
      this.$store.commit("loginflag", { flag: true });
      this.$get(
        { account: this.$store.state.userinfo.account },
        "/topic/message"
      ).then(res => {
        this.$store.commit("message", res.data);
      });
      setInterval(() => {
        this.$get(
          { account: this.$store.state.userinfo.account },
          "/topic/message"
        ).then(res => {
          this.$store.commit("message", res.data);
        });
      }, 300000);
      let uacc = JSON.parse(Cookies.get("usrinfo")).account;
      this.$post({ account: uacc }, "/private/findWrite").then(res => {
        // console.log(res);
        this.$store.commit("private", res.data);
      });
    }
    // console.log(JSON.parse(Cookies.get("usrinfo")).account);
    // let uacc = JSON.parse(Cookies.get("usrinfo")).account;
    // this.$post({ account: uacc }, "/private/findWrite").then(res => {
    //   // console.log(res);
    //   this.$store.commit("private", res.data);
    // });
  },

  methods: {
    changenav(data) {
      this.display = data;
      switch (data) {
        case "it":
          this.articles = this.$store.state.articles["技术"];
          this.$store.commit("search_article", []);
          break;
        case "news":
          this.articles = this.$store.state.articles["新闻"];
          this.$store.commit("search_article", []);
          break;
        case "view":
          this.articles = this.$store.state.articles["观点"];
          this.$store.commit("search_article", []);
          break;
        case "topic":
          // this.$store.commit("search_topic", []);
          // 修改
          // this.$store.commit("search_topic", this.$store.state.searchtopics);
          this.topics = this.$store.state.searchtopics;
          break;
        case "articles":
          this.articles = this.$store.state.searcharticles;
        //   // 新增代码 开始
        //   break;
        // case "topics":
        //   this.topics = this.$store.state.searchtopics;
        //   break;
        // 新增代码 结束
        // default:
        //     this.topicid = data
        //     break;
        // case 'topic':
        //     //todo 跳转帖子页面
        //    this.$router.push('/upload')
        //     break;
        // case 'video':
        //     this.$router.push('/upload')
        //     break;
      }
    }
  }
};
</script>

<style scoped>
</style>