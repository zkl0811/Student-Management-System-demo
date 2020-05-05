<template>

    <div class="header">
        <a href="/">
            <img class="logo" src="@/assets/logo.png" width="25px">
            <span class="company">Student Management System</span>
        </a>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              Menu<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user-solid" command="changepwd">Change Password</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" command="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

</template>

<script>
import {logout} from '@/api/login.js';
export default {
  data () {
    return {
    }
  },

  components: {},

  methods: {
      handleCommand(command){
          
          switch (command){
                case 'Change Password':
                  break;
                case 'logout': 
                  logout(localStorage.getItem('mxg-msm-token')).then(res=>{
                      if(res.data.flag){
                          localStorage.removeItem('mxg-msm-user');
                          localStorage.removeItem('mxg-msm-token');
                          this.$router.push('/login');
                      }else{
                          this.$message({
                              message: res.data.message,
                              type: 'warning',
                              duration: 500
                          });
                      }
                  });
                  break;
                default:
                  break;
          }
      }
  }
}
</script>

<style scoped>
.logo {
    vertical-align: middle;
    padding: 0px 10px 0px 40px ;
}
.company {
    position: absolute;
    color: white;
}
.el-dropdown {
    float: right;
    margin-right: 40px;
}
.el-dropdown-link {
    color: white;
    cursor: pointer;
}
</style>