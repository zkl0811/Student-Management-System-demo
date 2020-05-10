<template>
  <div class="header">
    <a href="/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="company">Student Management System</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-user-solid" command="changepwd">Change Password</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" command="logout">Logout</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- change password 
        status-ico attribute can show status of verification of password
    -->
    <el-dialog title="Reset Password" :visible.sync="dialogFormVisible" width="550px">
      <el-form
        :model="passwordForm"
        status-icon
        :rules="rules"
        ref="passwordForm"
        label-width="100px"
        style="width: 450px"
      >
        <el-form-item label="Old Password" prop="oldPass" label-width="130px">
          <el-input type="password" v-model="passwordForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="newPass" label-width="130px">
          <el-input type="password" v-model="passwordForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="checkPass" label-width="130px">
          <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passwordForm')">Submit</el-button>
          <el-button @click="resetForm('passwordForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import passwordApi from "@/api/password.js";
export default {
  data() {
    //customized validator must be declared before return{}
    const validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(res => {
        if (res.data.flag) {
          //when verificatiion success, use callback() by default
          callback();
        } else {
          callback(new Error("Password Verification Failed"));
        }
      });
    };

    const validateNewPass = (rule, value, callback) => {
      if (value !== this.passwordForm.newPass) {
        callback(new Error("Password Not Consistent"));
      } else {
        callback();
      }
    };

    return {
      user: JSON.parse(localStorage.getItem("mxg-msm-user")),
      dialogFormVisible: false,
      passwordForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "must fill", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        newPass: [{ required: true, message: "must fill", trigger: "blur" }],
        checkPass: [
          { required: true, message: "must fill", trigger: "blur" },
          { validator: validateNewPass, trigger: "change" }
        ]
      }
    };
  },

  components: {},

  methods: {
    handleCommand(command) {
      switch (command) {
        case "changepwd":
          this.handlePwd();
          break;
        case "logout":
          this.handleLogout();
          break;
        default:
          break;
      }
    },

    handleLogout() {
      this.$store
        .dispatch("Logout")
        .then(res => {
          if(res.flag){
            this.$router.push('/login');
          }else{
            this.$mesage({
              message: 'Server Error',
              type: 'error'
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "Server Error",
            type: "error"
          });
        });
    },

    //prompt with a dialog to reset password
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["passwordForm"].resetFields();
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.passwordForm.checkPass)
            .then(res => {
              if (res.data.flag) {
                this.$message({
                  message: "Update Successfully",
                  type: "success"
                });
                this.handleLogout();
              } else {
                this.$message({
                  message: "Password Update Failed,please try again later",
                  type: "error"
                });
              }
            });
        } else {
          this.$message({
            message: "Invalid Form",
            type: "warning"
          });
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
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