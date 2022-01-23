<template>
  <div class="image-container">
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 上部分 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button
        > -->
      </div>
      <!-- 按钮 -->
      <div class="action-head">
        <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
          <el-radio-button label="false">全部</el-radio-button>
          <el-radio-button label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 上传素材按钮 -->
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
          >上传素材</el-button
        >
      </div>
      <!-- 图片素材 -->
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
        >
          <el-image style="height: 100px" :src="img.url" fit="cover"></el-image
        ></el-col>
      </el-row>
    </el-card>
    <!-- 上传素材弹出层 -->
    <el-dialog
      title="上传素材"
      append-to-body
      :visible.sync="dialogUploadVisible"
      width="30%"
    >
      <!-- 上传组件 -->
      <!-- 
        注 upload 会自己发请求  默认方法POST
       请求路径: action  需要全部路径
       请求头需要加tuken 
       -->
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages } from '@/api/image.js'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data() {
    // 拿到tuken 对象
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: 'false',
      // 请求回来的图片素材列表
      images: [],
      // 控制上传素材弹出层
      dialogUploadVisible: false,
      // 上传组件的请求头 需要token
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadImages()
  },
  mounted() {},
  methods: {
    // 进去页面获取图片数据
    async loadImages(collect = false) {
      const res = await getImages({
        collect,
      })
      console.log(res)
      this.images = res.data.data.results
    },
    // 全部 收藏 按钮发生变化时触发
    onCollectChange(value) {
      this.loadImages(value)
    },
    // 上传图片成功调用
    onUploadSuccess() {
      // 关闭上传素材弹出层
      this.dialogUploadVisible = false
      // 刷新数据
      this.loadImages(false)
      // 提示
      this.$message.success('上传素材成功')
    },
  },
}
</script>

<style scoped lang="less">
// 全部 收藏 上传素材 按钮
.action-head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
