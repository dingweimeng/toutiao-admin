<template>
  <div class="article-container">
    <!-- 卡片视图 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form ref="form" :model="form" size="mini" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="查询全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-DD"
            value-format="yyyy-MM-DD"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- button 按钮 click事件 有默认参数,每页指定参数时候,默认传递一个没有的数据 :disabled="loading" 太卡先关闭 -->
          <el-button type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下部分卡片视图 -->
    <el-card>
      <div slot="header">根据筛选条件共查询到 {{ totalCount }} 条结果:</div>
      <!--  v-loading="loading"  太卡先关闭 -->
      <el-table :data="articles" stripe style="width: 100%" class="list-table">
        <!-- 封面 -->
        <el-table-column prop="date" label="封面" align="center">
          <template slot-scope="scope">
            <!-- <img
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              class="article-cover"
              alt=""
            />
            <img v-else src="./no-cover.jpg" class="article-cover" alt="" /> -->
            <!-- 用组件image  可以懒加载 有加载失败功能 不用直接判断 -->
            <el-image
              style="width: 70px; height: 70px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <!-- 标题 -->
        <el-table-column prop="title" label="标题" align="center">
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success"
              >审核通过</el-tag
            >
            <el-tag v-else-if="scope.row.status === 3" type="danger"
              >审核失败</el-tag
            >
            <el-tag v-else-if="scope.row.status === 4" type="info"
              >已删除</el-tag
            >
          </template>
        </el-table-column>
        <!-- 发布时间 -->
        <el-table-column prop="pubdate" label="发布时间" align="center">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              circle
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器  :disabled="loading"  太卡先关闭 -->
      <el-pagination
        layout="prev, pager, next"
        background
        :page-size="pageSize"
        :total="totalCount"
        :current-page.sync="page"
        @current-change="onCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticlesChannels,
  deleteArticle,
} from '@/api/article.js'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      // 请求回来的数据  文章数据列表
      articles: [],
      // 请求回来的条数
      totalCount: 0,
      // 默认请求第一页
      page: 1,
      // 每页显示多少
      pageSize: 10,
      // 查询文章状态,不传就是全部
      status: null,
      // 请求回来的文章频道列表
      channels: [],
      // 查询频道id
      channelId: null,
      // 筛选范围时间日期
      rangeDate: null,
      // 数据加载loading状态
      // loading: true,   // 太卡 先关闭
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取文章列表
    this.loadArticles()
    // 获取文章频道
    this.loadChannels()
  },
  mounted() {},
  methods: {
    // 获取文章列表
    async loadArticles(page = 1) {
      // 开始加载时候 loading 转圈
      // this.loading = true    // 太卡 先关闭
      const { data } = await getArticles({
        page,
        per_page: this.pageSize, // 每页显示多少
        status: this.status, // 查询文章状态,不传就是全部
        channel_id: this.channelId, // 查询频道id
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null, //结束日期
      })
      // console.log(data)
      this.articles = data.data.results
      this.totalCount = data.data.total_count
      // 加载完成 关闭loading
      // this.loading = false   // 太卡 先关闭
    },
    // 监听页码发生变化
    onCurrentChange(page) {
      // console.log(page)  // 拿到值 给它重新调用
      this.loadArticles(page)
    },

    // 获取文章频道
    async loadChannels() {
      const { data } = await getArticlesChannels()
      console.log(data)
      this.channels = data.data.channels
    },

    // 删除文章按钮
    onDeleteArticle(articleId) {
      // console.log(articleId)
      // console.log(articleId.toString())

      // 添加消息提示  防止误点按钮
      this.$confirm('确认删除吗, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          // toString() 方法用来解决 后端id数字过大问题
          const data = await deleteArticle(articleId.toString())
          // console.log(data)
          // 成功 刷新数据
          this.loadArticles(this.page)

          // deleteArticle(articleId).then((res) => {
          //   console.log(res)
          // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style scoped lang="less">
// 封面照片
// .article-cover {
//   width: 70px;
//   height: 70px;
//   background-size: cover;
// }
</style>
