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
          class="imgItem"
        >
          <!-- 图片 -->
          <el-image style="height: 100px" :src="img.url" fit="cover"></el-image>
          <!-- 收藏 删除 图标 -->
          <div class="imgLive">
            <el-button
              type="warning"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              size="small"
              @click="onCollect(img)"
              :loading="img.loading"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="onDelete(img)"
            ></el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 分页器 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total_count"
        :current-page.sync="page"
        @current-change="SizeChange"
      >
      </el-pagination>
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
import { getImages, collectImage, DeleteImage } from '@/api/image.js'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data() {
    // 拿到tuken 对象
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      // 请求回来的图片素材列表
      images: [],
      // 控制上传素材弹出层
      dialogUploadVisible: false,
      // 上传组件的请求头 需要token
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      // 请求回来的总条数
      total_count: 0,
      page: 1,
    }
  },
  computed: {},
  watch: {},
  created() {
    // 初始加载第一页页面
    this.loadImages(1)
  },
  mounted() {},
  methods: {
    // 进去页面获取图片数据
    async loadImages(page, collect = false) {
      this.page = page
      const res = await getImages({
        collect,
        page,
        per_page: 10,
      })
      // console.log(res)
      // 额外添加loading 状态  注意遍历顺序在赋值前
      res.data.data.results.forEach((img) => {
        // img 对象本身没有loading数据，我们添加是用来控制每个按钮loading状态
        img.loading = false
      })
      this.images = res.data.data.results
      this.total_count = res.data.data.total_count
    },
    // 全部 收藏按钮发生变化时触发
    onCollectChange(value) {
      this.loadImages(1, value)
    },
    // 上传图片成功调用
    onUploadSuccess() {
      // 关闭上传素材弹出层
      this.dialogUploadVisible = false
      // 刷新数据
      this.loadImages(this.page, false)
      // 提示
      this.$message.success('上传素材成功')
    },
    // 分页 改变触发
    SizeChange(page) {
      this.loadImages(page)
    },
    // 收藏图标按钮
    async onCollect(img) {
      img.loading = true
      console.log(img)
      if (img.is_collected) {
        // 已收藏，取消收藏
        await collectImage(img.id, false)
        img.is_collected = !img.is_collected
        this.$message.success('已取消收藏')
      } else {
        // 没有收藏，添加收藏
        await collectImage(img.id, true)
        img.is_collected = !img.is_collected
        this.$message.success('已添加收藏')
      }
      img.loading = false
    },

    // 删除图标
    onDelete(img) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          // console.log(img.id)
          const res = await DeleteImage(img.id)
          // console.log(res)
          this.loadImages(this.page)
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
// 全部 收藏 上传素材 按钮
.action-head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

// 图片 收藏 删除部分
.imgItem {
  position: relative;
  .imgLive {
    height: 30px;
    background-color: rgba(116, 114, 114, 0.5);
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: 5px;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>
