<template>
  <div>
      <app-header></app-header>
      <app-nav></app-nav>
      <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from './AppHeader';
import AppNav from './AppNav';
import AppMain from './AppMain';
export default {
  data () {
    return {
    }
  },

  components: {
      AppHeader,
      AppNav,
      AppMain
  },

  methods: {}
}
</script>

<style scoped>
/*header*/
.header {
    position: absolute;
    line-height: 50px;
    top: 0px;
    left:0px;
    right:0px;
    background-color:#2d3a4b;
}

.navbar {
    position: absolute;
    width: 230px;
    top: 49.5px;
    left: 0px;
    bottom: 0px;
    overflow-y: auto;
    background-color: #545c64;
}
.main {
    position:absolute;
    top: 49px;
    left: 230px;
    right: 0;
    bottom: 0;
    padding: 10px;
    overflow-y: auto;
}
</style>