<template>
  <el-menu
      default-active="/"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">Hoem Page</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">Members Management</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-office-building"></i>
        <span slot="title">Venders Management</span>
      </el-menu-item>
      <el-menu-item index="/goods/">
        <i class="el-icon-shopping-cart-full"></i>
        <span slot="title">Goods Management</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">Staff Management</span>
      </el-menu-item>
    </el-menu>
</template>
<style scoped>
.el-menu {
  border-right: none;
}
</style>