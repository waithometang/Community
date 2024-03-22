<template>
  <div class="video">
    <div
      class="container"
      v-for="item in videoList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :key="item.url"
    >
      <div style="text-align: center; font-weight: 600; margin: 10px;">{{item.name}}</div>
      <div style="border-radius: 10px;">
        <video :src="item.url" controls muted width="400" height="240"></video>
      </div>
      <div>
        <el-link icon="el-icon-date" type="info" :underline="false">{{item.date}}</el-link>
        <el-link
          icon="el-icon-user"
          type="info"
          :underline="false"
          style="margin-left: 5px"
        >{{item.user}}</el-link>
      </div>
    </div>
    <el-pagination
      v-if="videoList.length>0"
      @current-change="current_change"
      :page-size="pagesize"
      layout="total, prev, pager, next"
      :total="videoList.length"
    ></el-pagination>
    <div
      v-else
      style="text-align:center;font-size:20px;height:500px;line-height: 500px;width: 100%;"
    >
      <el-link type="info" :underline="false">还没有任何视频</el-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoList: [],
      page: 0,
      sizes: 0,
      pagesize: 6, //每页的数据条数
      currentPage: 1 //默认开始页面
    };
  },
  mounted() {
    this.$get({}, "/videos").then(res => {
      this.videoList = res.data;
      // console.log(this.videoList);
    });
  },

  methods: {
    current_change(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>
<style  scoped>
.video {
  display: flex;
  margin: 20px auto;
  flex-wrap: wrap;
  width: 1330px;
  background-color: #fff;
  position: relative;
}
video:hover {
  box-shadow: 5px 5px 5px #d1cfcf;
  transition: all 0.5s;
  width: 410px;
  height: 250px;
}
.container {
  margin-left: 30px;
  margin-bottom: 40px;
}
.el-pagination {
  position: absolute;

  bottom: 0px;
  left: 50%;
  transform: translate(-50%);
}
</style>