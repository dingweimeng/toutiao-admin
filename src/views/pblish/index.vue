<template>
  <div class="pblish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? '修改文章' : '发布文章'
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 下部分 -->
      <el-form ref="form" :model="article" label-width="50px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>

        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <!-- button 按钮 click事件 有默认参数,每页指定参数时候,默认传递一个没有的数据 -->
          <el-button type="primary" @click="onPblish(false)">{{
            $route.query.id ? '修改' : '发布'
          }}</el-button>
          <el-button @click="onPblish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticlesChannels,
  addArticle,
  getArticle,
  updateArticle,
} from '@/api/article.js'
export default {
  name: 'PblishIndex',
  components: {},
  props: {},
  data() {
    return {
      article: {
        //文章标题
        title: '',
        //文章内容
        content: '',
        //封面类型后端要求对象
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [], //类型
        },
        // 文章所属频道id
        channel_id: null,
      },
      // 请求回来的文章频道
      channels: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    // 请求文章频道
    this.loadChannels()
    // 由于发布和编辑使用同一组件 判断路由路径有id 则展示编辑文章内容
    // 用 this.$route.query.id  可以判断  注意是 this.route
    if (this.$route.query.id) {
      // 路径有id 表示来加载修改
      this.loadArticle()
    }
  },
  mounted() {},
  methods: {
    async loadChannels() {
      const { data } = await getArticlesChannels()
      // console.log(data)
      this.channels = data.data.channels
    },
    // 发布按钮
    onPblish(draft = false) {
      //  如果是修改文章,则执行修改操作,否则执行添加操作
      if (this.$route.query.id) {
        //  执行修改文章
        updateArticle(this.$route.query.id, this.article, draft).then((res) => {
          this.$message.success(`${draft ? '存入草稿' : '修改'}成功`)
          // 跳转页码
          this.$router.push('/article')
        })
      } else {
        //  执行添加操作
        addArticle(this.article, draft).then((res) => {
          this.$message.success(`${draft ? '存入草稿' : '发布'}成功`)
          // 跳转页码
          this.$router.push('/article')
        })
      }
    },

    // 修改文章中: 加载文章内容
    async loadArticle() {
      // console.log('这是修改过来的')
      const res = await getArticle(this.$route.query.id)
      console.log(res)
      this.article = res.data.data
    },
  },
}
</script>

<style scoped lang="less"></style>
