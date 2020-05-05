<!--login component-->
<template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">Management System</h2>
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login, getUserInfo} from '@/api/login.js';
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: 'username must be filled',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'password must be filled',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName){
        //console.log(this);
        this.$refs[formName].validate(valid=>{
            if(valid){
                login(this.form.username, this.form.password).then(res=>{
                    //console.log(res.data);
                    const userres=res.data
                    if(res.data.flag){
                        getUserInfo(res.data.token).then(res=>{
                           // console.log(res);
                            //console.log(userres);
                            localStorage.setItem('mxg-msm-user', JSON.stringify(res.data.data));
                            localStorage.setItem('mxg-msm-token', userres.data.token);
                            //console.log(this);
                            this.$router.push('/');
                        });
                    }else{
                        //console.log(this);
                        this.$message({
                            message: 'Error from server',
                            type: 'warning'
                        });
                    }
                });
            }else{
            //    console.log(this);
                return false;
            }
        });
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: #ccc;
  padding: 30px;
  border-radius: 20px;
  opacity: 0.9;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg") -200px;
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>