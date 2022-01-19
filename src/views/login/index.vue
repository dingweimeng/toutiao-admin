<template>
  <div class="login_container">
    <div class="login_box">
      <!-- <div class="box_header">
        <img src="./yj.png" class="login_img" />
      </div> -->
      <h2>黑马头条后台管理系统</h2>
      <el-form :model="user" class="login_form">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked"
            ><span>我已阅读并同意用户协议和隐私条款</span></el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loginLoading"
            class="login_btn"
            @click="onLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111', //手机号
        code: '246810', //验证码
      },
      checked: true, //我已阅读并同意用户协议和隐私条款
      loginLoading: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 登录
    async onLogin() {
      // 开启loading
      this.loginLoading = true
      const data = await request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data: this.user,
      })
      console.log(data)
      if (data.status !== 201) {
        return this.$message.error('登录失败')
      }
      this.$message.success('登录成功')
      // 关闭loading
      this.loginLoading = false
    },
  },
}
</script>

<style scoped lang="less">
.login_container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;

  .login_box {
    background-color: #fff;
    width: 380px;
    height: 320px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    h2 {
      text-align: center;
    }
    .box_header {
      // margin-top: 10px;
      width: 100px;
      height: 100px;
      border: 3px solid #eee;
      border-radius: 50%;
      padding: 10px;
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      .login_img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .login_btn {
        width: 100%;
        height: 40px;
        // margin-top: 10px;
      }
    }
  }
}
span {
  font-size: 14px;
}
</style>
