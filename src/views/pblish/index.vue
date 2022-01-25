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
      <el-form
        ref="publish-form"
        :model="article"
        :rules="formRules"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            lang="zh"
            v-model="article.content"
            :extensions="extensions"
            height="350"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>

        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 文章封面组件 -->
          <!-- 注意 如果想要在事件处理自定义传参后得到原来的那个事件本身用 $event  -->
          <template v-if="article.cover.type > 0">
            <UploadCover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              :cover-image="article.cover.images[index]"
              @update-cover="onUpdateCover(index, $event)"
            ></UploadCover>
          </template>
        </el-form-item>

        <el-form-item label="频道" prop="channel_id">
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
// 引入富文本插件
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor,
} from 'element-tiptap'

// 富文本样式
import 'element-tiptap/lib/index.css'
// 封面组件
import UploadCover from './components/upload-cover.vue'

// 封装的api接口
import {
  getArticlesChannels,
  addArticle,
  getArticle,
  updateArticle,
} from '@/api/article.js'

// 图片接口封装
import { uploadImage } from '@/api/image.js'
export default {
  name: 'PblishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover,
  },
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
      // 富文本
      extensions: [
        // 前面3个必须有
        new Doc(),
        new Text(),
        new Paragraph(),
        // 最多有几级标题
        new Heading({ level: 5 }),
        // 在气泡菜单中渲染菜单按钮
        new Bold({ bubble: true }),
        //图片特殊
        new Image({
          // 默认会把图片生成base64，字符串和内容储存在一起
          uploadRequest(file) {
            // 数据接口要求Content-Type	multipart/form-data，则请求题必须使用 FormData
            const fd = new FormData()
            fd.append('image', file)
            // 第一个return 是返回Promise 对象
            return uploadImage(fd).then((res) => {
              console.log(res)
              // 这个return 是返回最后的结果
              return res.data.data.url
            })
          },
        }),
        // 下划线
        new Underline(),
        // 斜体
        new Italic(),
        // 删除线
        new Strike(),
        // 华丽的分割线
        new HorizontalRule(),
        new ListItem(),
        // 无序列表
        new BulletList(),
        // 有序列表
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        //全屏
        new Fullscreen(),
        // 预览
        new Preview(),
        //文本块 代码块
        new CodeBlock(),
        //颜色
        new TextColor(),
      ],
      // 表单验证正则
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur',
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === '<p></p>') {
                // 代表没有内容 只有空标签
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            },
          },
          { required: true, message: '请选择文章内容' },
        ],
        channel_id: [{ required: true, message: '请选择频道' }],
      },
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
      // 发布前 先验证表单
      this.$refs['publish-form'].validate((valid) => {
        if (!valid) {
          return
        }
        // 验证通过

        //  如果是修改文章,则执行修改操作,否则执行添加操作
        if (this.$route.query.id) {
          //  执行修改文章
          updateArticle(this.$route.query.id, this.article, draft).then(
            (res) => {
              this.$message.success(`${draft ? '存入草稿' : '修改'}成功`)
              // 跳转页码
              this.$router.push('/article')
            }
          )
        } else {
          //  执行添加操作
          addArticle(this.article, draft).then((res) => {
            this.$message.success(`${draft ? '存入草稿' : '发布'}成功`)
            // 跳转页码
            this.$router.push('/article')
          })
        }
      })
    },

    // 修改文章中: 加载文章内容
    async loadArticle() {
      // console.log('这是修改过来的')
      const res = await getArticle(this.$route.query.id)
      console.log(res)
      this.article = res.data.data
    },

    // 子给父传来的图片地址
    onUpdateCover(index, url) {
      // console.log(index, url)
      // 拿到图片路径 赋值
      this.article.cover.images[index] = url
    },
  },
}
</script>

<style scoped lang="less"></style>
