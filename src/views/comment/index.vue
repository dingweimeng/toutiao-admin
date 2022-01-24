<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表格 -->
      <el-table :data="articles" style="width: 100%" stripe border>
        <el-table-column prop="title" label="标题" align="center" width="500">
        </el-table-column>
        <el-table-column prop="pubdate" label="发布日期" align="center">
        </el-table-column>

        <el-table-column prop="address" label="状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '关闭' : '成功' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template>
            <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
        class="pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data() {
    return {
      // 请求回来的数据
      articles: [],
      // 接口没用 临时代替
      value: true,
      // 请求回来的总数据
      totalCount: 0,
      // 每页请求多少数据
      pageSize: 10,
      // 当前激活的页码
      page: 1,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles()
  },
  mounted() {},
  methods: {
    // 进去页面获取清理管理列表数据
    async loadArticles(page = 1) {
      // 让分页组件激活的页码也请求数据页码保持一致
      this.page = page
      const res = await getArticles({
        response_type: 'comment ',
        page,
        per_page: this.pageSize,
      })
      console.log(res)
      this.articles = res.data.data.results
      this.totalCount = res.data.data.total_count
    },
    // 每页多少条 10  20 30 50
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      console.log(val)
      this.loadArticles(1)
    },
    // 页码改变，加载指定页码数据
    handleCurrentChange(val) {
      // console.log(val)
      this.loadArticles(val)
    },
  },
}
</script>

<style scoped lang="less">
.pagination {
  margin-top: 30px;
}
</style>
