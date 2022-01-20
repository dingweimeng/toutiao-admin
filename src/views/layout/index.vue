<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="200px"
      ><AppAside class="aside-menu"></AppAside
    ></el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i class="el-icon-s-fold"></i>
          <span>黑马头条后台管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="img" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
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
      user: {},
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
      console.log(data)
      this.user = data.data
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
}
.main {
  background-color: rgb(72, 154, 168);
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
