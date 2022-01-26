<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="iscollapse"
    :collapse-transition="false"
  >
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-image-fill"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont icon-publish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="el-icon-s-comment"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <!-- <el-menu-item index="/fans">
      <i class="el-icon-setting"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item> -->
    <el-menu-item index="/setting">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  components: {},
  props: ['iscollapse'], // [] 样式不能用驼峰
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="less">
.iconfont {
  margin-right: 10px;
  padding-left: 5px;
}
</style>
