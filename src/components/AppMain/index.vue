<template>
<div class="main">
  <app-link></app-link>
  <router-view></router-view>
</div>
</template>

<script>
import AppLink from './link.vue';
export default {
  data () {
    return {
    }
  },

  components: {
    AppLink
  },

  methods: {}
}
</script>

