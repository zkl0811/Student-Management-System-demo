<template>
  <div>
    <!-- search form -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="Username"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="Name"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 10px">
        <el-button type="primary" @click="fetchData">Search</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">Reset</el-button>
        <el-button type="primary" @click="addHandler">AddNew</el-button>
      </el-form-item>
    </el-form>
    <!-- data table -->
    <el-table :data="list" height="600" border style="width: 100%">
      <el-table-column type="index" label="Id"></el-table-column>
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="age" label="Age"></el-table-column>
      <el-table-column prop="mobile" label="Phone Number"></el-table-column>
      <el-table-column prop="salary" label="Salary"></el-table-column>
      <el-table-column prop="entryDate" label="Start Date"></el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      @size-change="fetchData"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout=" prev, pager, next"
      :total="total"
    ></el-pagination>
    <!-- prompt add dialog -->
    <el-dialog title="Add/Edit Staff" :visible.sync="dialogFormVisible">
      <el-form :model="addStaff" ref="addStaff" label-position="right" :rules="rules">
        <el-form-item label="Username" prop="username">
          <el-input v-model="addStaff.username"></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="addStaff.name"></el-input>
        </el-form-item>
        <el-form-item label="Age" prop="age">
          <el-input v-model="addStaff.age"></el-input>
        </el-form-item>
        <el-form-item label="Phone Numnber" prop="mobile">
          <el-input v-model="addStaff.mobile"></el-input>
        </el-form-item>
        <el-form-item label="Salary" prop="salary">
          <el-input v-model="addStaff.salary"></el-input>
        </el-form-item>
        <el-form-item label="Start Date" prop="entryDate">
          <el-date-picker v-model="addStaff.entryDate" type="date" placeholder="Pick a Date"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="addStaff.id ? handleUpdate('addStaff') : addData('addStaff')"
        >Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from "@/api/staff.js";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        username: "",
        name: ""
      },
      dialogFormVisible: false,
      addStaff: {
        id: null,
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: ""
      },
      rules: {
        username: [{ required: true, message: "must fill", trigger: "blur" }],
        name: [{ required: true, message: "must fill", trigger: "blur" }]
      }
    };
  },

  components: {},

  methods: {
    //upon data changed
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          if (res.data.flag) {
            this.total = res.data.data.total;
            this.list = res.data.data.rows;
          } else {
            this.$message({
              message: "Server Error",
              type: "error"
            });
          }
        });
    },
    //clear search conditions
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchData();
    },
    //pagination
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    //prompt with an empty dialog to add data
    addHandler() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addStaff"].resetFields();
      });
    },
    //add data
    addData(formName) {
      //console.log(typeof(this.addStaff.entryDate));
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.add(this.addStaff).then(res => {
            if(res.data.flag){
                  this.fetchData();
                  this.dialogFormVisible = false;
                  this.$message({
                    message: 'Successfully Added',
                    type: 'success'
                  });
            }else{
              this.$message({
                message: 'Whoops somenthing went wrong',
                type: 'error'
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

    //prompt with a dialog with data to be edited
    handleEdit(id) {
      staffApi.getById(id).then(res=>{
        if(res.data.flag){
            this.addStaff = res.data.data;
            this.dialogFormVisible = true;
        }else{
          this.$message({
            message: 'Whoops somenthing went wrong',
            type: 'error'
          });
        }
      });
    },
    //update data
    handleUpdate(formName) {
      this.$refs[formName].validate(valid=>{
        if(valid){
            staffApi.update(this.addStaff).then(res=>{
                if(res.data.flag){
                    this.fetchData();
                    this.dialogFormVisible = false;
                    this.$message({
                      message: 'Update Successfully',
                      type: 'success'
                    });
                }else{
                  this.$message({
                    message: 'Whoops somenthing went wrong',
                    type: 'error'
                  });
                }
            });
        }else{
          this.$message({
            message: 'Invalid Form',
            type: 'warning'
          });
        }
      });
    },

    //delete data
    handleDelete(id) {
      staffApi.deleteById(id).then(res=>{
        if(res.data.flag){
            this.fetchData();
            this.$message({
              message: 'Delete Successfully',
              type: 'success'
            });
        }else{
          this.$message({
            message: 'Whoops somenthing went wrong',
            type: 'error'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>