<template>
  <div>
    <!-- 首页body -->
    <div class="scroll" style="margin-top: 50px;">
      <el-carousel :interval="3000" height="400px">
        <el-carousel-item
          v-for="(item,index) in recommend"
          :key="'ad'+index"
          :style="'background:url('+item.pimg+') no-repeat top center;background-size:100% 100%;'"
        >
          <div
            style="width:100%;height:100%;text-align:center; color:rgb(177, 175, 175);font-size: 16px;font-weight:600;padding-top:10px;"
            @click="recommend_detail(index)"
          >
            <el-button type="text" size="small">文章：{{item.phead}}</el-button>
            <br />
            <el-button type="text" size="small">来源：{{item.psort}}</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div
        class="article"
        v-for="(item,index) in articles.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        :key="index+'article'"
        @click="article_detail(index)"
      >
        <img :src="item.pimg" alt srcset />
        <div>
          <h4
            style="margin-left: -110px;align-self: center;color:#2e3135;font-weight:600;"
          >{{item.phead}}</h4>
          <div
            style="font-size:14px;line-height:200%; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-indent: 30px;"
          >{{item.pabstract}}</div>
          <span style="position:absolute;bottom:10px;left:10px; font-size:14px;">
            <span>{{item.pdate}}</span>
            <span style="padding-left:20px">{{item.pauthor}}</span>
          </span>
        </div>
      </div>
    </div>
    <el-pagination
      v-if="articles.length>0"
      @current-change="current_change"
      :page-size="pagesize"
      layout="total, prev, pager, next"
      :total="articles.length"
      style="text-align: center;"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: ["articles", "recommend"],
  data() {
    return {
      page: 0,
      sizes: 0,
      pagesize: 3, //每页的数据条数
      currentPage: 1 //默认开始页面
    };
  },
  methods: {
    current_change(currentPage) {
      this.currentPage = currentPage;
    },
    article_detail(index) {
      this.$router.push({ path: "/article", query: this.articles[index] });
    },
    recommend_detail(index) {
      this.$router.push({ path: "/article", query: this.recommend[index] });
    }
  }
};
</script>

<style scoped>
.article {
  margin: 0 auto;
  width: 80%;
  display: flex;
  height: 230px;
  background-color: #c4c8cc;
  border-radius: 10px;
  margin-bottom: 5px;
  margin-top: 15px;
}
.article:nth-child(odd) {
  background-color: #d3e1e5;
}

.article img {
  box-sizing: border-box;
  padding: 0 10px;
  align-self: center;
  width: 15%;
}

.article > div {
  padding-left: 10px;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  position: relative;
}
.el-carousel {
  width: 80%;
  margin: 10px auto;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>