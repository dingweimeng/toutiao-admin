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
      </div>
      <!-- 封装好的从用组件 -->
      <ImageList></ImageList>
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list.vue'
export default {
  name: '',
  components: { ImageList },
  props: {},
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

<style scoped lang="less"></style>
