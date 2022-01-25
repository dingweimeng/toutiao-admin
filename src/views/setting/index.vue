<template>
  <div class="setting-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <!-- 表单 -->
          <el-form ref="form" :model="user" label-width="100px">
            <el-form-item label="编号:"> {{ user.id }} </el-form-item>
            <el-form-item label="手机:"> {{ user.mobile }} </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="updateProfileLoading"
                @click="onUpdataUser"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="4" :offset="2">
          <el-avatar
            shape="square"
            :size="150"
            fit="cover"
            :src="user.photo"
          ></el-avatar>
          <p>
            <el-button type="primary" @click="$refs.file.click()"
              >点击修改头像</el-button
            >
          </p>
          <input type="file" hidden ref="file" @change="onFileChange" />
        </el-col>
      </el-row>
    </el-card>
    <!-- 修改头像弹出层 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogCloser"
    >
      <div class="perview-image-wrap">
        <img
          class="perview-image"
          :src="previewImage"
          alt=""
          ref="preview-image"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserProfile,
  udpdateUserPhoto,
} from '@/api/user.js'
// 头像裁切  在加载DOM 后调用
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
// 引入全局通信
import globalBus from '@/utils/global-bus.js'

export default {
  name: 'SettingIndex',
  components: {},
  props: {},
  data() {
    return {
      // 求情回来的用户信息
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: '',
      },
      // 控制上传照片裁切预览  显示与隐藏
      dialogVisible: false,
      // 预览图片
      previewImage: '',
      // 裁切器实例 这样定义 全部能拿到
      cropper: null,
      // 裁切图片确定按钮 loading
      updatePhotoLoading: false,
      // 更新用户信息loading
      updateProfileLoading: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUser()
  },
  mounted() {},
  methods: {
    //  进去页码获取信息
    async loadUser() {
      const res = await getUserProfile()
      // console.log(res)
      this.user = res.data.data
    },
    // 保存按钮
    async onUpdataUser() {
      // 开启loading
      this.updateProfileLoading = true
      const res = await updateUserProfile({
        name: this.user.name,
        intro: this.user.intro,
        email: this.user.email,
      })
      // console.log(res)
      // 关闭loading
      this.updateProfileLoading = false
      // 发布通知,用户信息已修改
      globalBus.$emit('update-user', this.user)
    },
    // 点击修改头像
    onFileChange() {
      // 找到ref DOM结构
      const file = this.$refs.file
      // 拿到url 路径
      const blobData = window.URL.createObjectURL(file.files[0])
      // console.log(blobData)
      this.previewImage = blobData
      // 展示弹出层 预览用户照片
      this.dialogVisible = true
      // 避免选择同一路径不会触发
      this.$refs.file.value = ''
    },
    // Dialog 打开动画结束时的回调 头像裁切需要加载完成
    onDialogOpened() {
      // 图片裁切必须基于img 进行初始化，img 必须是可见状态下才能正常完成初始化
      // 拿到图片
      const image = this.$refs['preview-image']
      // 初始化裁切器
      this.cropper = new Cropper(image, {
        // 长宽比
        aspectRatio: 1,
        //限制裁切框不要超出画布大小
        viewMode: 1,
        // 拖动方式 不让拖动
        dragMode: 'none',
        // 不允许改变裁剪比例大小
        cropBoxResizable: false,
        // 画布 背景图
        background: false,
      })
    },
    // Dialog 关闭动画结束时的回调 相当于销毁
    onDialogCloser() {
      //  对话框关闭，销毁裁切器
      this.cropper.destroy()
    },
    // 修改头像 弹出框确认按钮
    onUpdatePhoto() {
      // 开启loading
      this.updatePhotoLoading = true
      // 获取裁切后的图片
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        const fd = new FormData()
        fd.append('photo', file)
        //  请求更新头像  请求提交fd
        const res = await udpdateUserPhoto(fd)
        // console.log(res)
        // 提示
        this.$message.success('更新头像成功')
        // 关闭弹出框
        this.dialogVisible = false
        // 更新视图
        // this.user.photo = res.data.data.photo
        // 发请求有点慢 直接拿裁切后的照片
        this.user.photo = window.URL.createObjectURL(file)
        // 关闭loading
        this.updatePhotoLoading = false

        // 发布通知,用户信息已修改   globalBus.$emit('update-user', this.user)
        globalBus.$emit('update-user', this.user)
      })
    },
  },
}
</script>

<style scoped lang="less">
// 图片裁切
.perview-image-wrap {
  .perview-image {
    height: 200px;
    max-width: 100%;
  }
}
</style>
