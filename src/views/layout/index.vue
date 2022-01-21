<template>
  <el-container class="layout-container">
    <el-aside class="aside" :width="isCollapse ? '65px' : '200px'">
      <!-- 封装组件 -->
      <AppAside class="aside-menu" :iscollapse="isCollapse"></AppAside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold '"
            @click="isCollapse = !isCollapse"
          ></i>
          <span class="span_name">黑马头条后台管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="img" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认不识别原生事件,所有需要加 native 修饰符 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './compontens/aside.vue'
import { getUserProfile } from '@/api/user.js'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside,
  },
  props: {},
  data() {
    return {
      // 用户数据
      user: {},
      // 控制侧边栏折叠
      isCollapse: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile()
      // console.log(data)
      this.user = data.data
    },
    // 退出功能
    onLogout() {
      this.$confirm('确定退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 清除tuken
          window.localStorage.removeItem('user')
          // 跳转页面
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
          })
        })
    },
  },
}
</script>

<style scoped lang="less">
.aside {
  background-color: rgb(185, 94, 94);
  .aside-menu {
    height: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .span_name {
    margin-left: 10px;
  }
}
.main {
  background-color: #e9eff4;
}
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.avatar-wrap {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .img {
    width: 45px;
    height: 45px;
    border: 1px solid #eee;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
