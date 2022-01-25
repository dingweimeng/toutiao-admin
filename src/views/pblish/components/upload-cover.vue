<template>
  <div class="upload-cover" @click="shouCoverSelect">
    <div class="cover-weap">
      <img class="cover-image" ref="cover-image" :src="coverImage" />
    </div>
    <!-- 弹出层 -->
    <el-dialog title="选择封面" :visible.sync="dialogVisible" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">素材库</el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input type="file" ref="file" @change="onFileChange" />
          <img ref="preview-image" width="150px" height="120px" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image.js'
export default {
  name: 'UploadCover',
  components: {},
  props: ['cover-image'],
  data() {
    return {
      // 控制弹出框的显示隐藏
      dialogVisible: false,
      // 控制Tabs 标签页
      activeName: 'first',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    shouCoverSelect() {
      this.dialogVisible = true
    },
    // 当file 变化时候
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
    },
    // 确认按钮
    async onCoverConfirm() {
      // 确认按钮 是两个同意 所有要判断，并且input-file 有选择文件，才执行上传图片
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择图片')
          return
        }
        // 通过的话 发起请求
        const fd = new FormData()
        fd.append('image', file)
        const res = await uploadImage(fd)
        console.log(res)
        // 关闭对话框
        this.dialogVisible = false
        // 展示上传的图片
        this.$refs['cover-image'].src = res.data.data.url
        // 展示后，需要将图片地址发送给父组件   父给子传值 $emit
        this.$emit('update-cover', res.data.data.url)
      }
    },
  },
}
</script>

<style scoped lang="less">
.cover-weap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  display: flex;
  // justify-content: center;
  // align-items: center;
  .cover-image {
    max-width: 100%;
    height: 120px;
  }
}
</style>
