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
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="Venders' Name"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="Contactors' Name"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="Mobile Number"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 10px">
        <el-button type="primary" @click="fetchData">Search</el-button>
        <el-button type="primary" @click="resetForm('searchForm')" v-if="!isDialog">Reset</el-button>
        <el-button type="primary" @click="addHandler" v-if="!isDialog">AddNew</el-button>
      </el-form-item>
    </el-form>
    <!-- data table
      highlight-current-row -active single choose and  can use current-cahnge to deal with event tiggered, handleCurrentChange has two viarables defined currentRow&oldCurrentRow
    -->
    <el-table
      :data="list"
      :highlight-current-row="isDialog"
      @current-change="dealCurrentChange"
      height="600"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="Id"></el-table-column>
      <el-table-column prop="name" label="Vendors' Name"></el-table-column>
      <el-table-column prop="linkman" label="Contactors' Name"></el-table-column>
      <el-table-column prop="mobile" label="Phone Number" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remark" label="Comments" v-if="!isDialog"></el-table-column>
      <el-table-column label="Action" v-if="!isDialog">
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
    <el-dialog title="Add/Edit Supplier" :visible.sync="dialogFormVisible" v-if="!isDialog">
      <el-form :model="addSupplier" ref="addSupplier" label-position="right" :rules="rules">
        <el-form-item label="Venders' Name" prop="name">
          <el-input v-model="addSupplier.name"></el-input>
        </el-form-item>
        <el-form-item label="Contactors' Name" prop="linkman">
          <el-input v-model="addSupplier.linkman"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number" prop="mobile">
          <el-input v-model="addSupplier.mobile"></el-input>
        </el-form-item>
        <el-form-item label="Comments" prop="remark">
          <el-input type="textarea" v-model="addSupplier.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addSupplier.id ? handleUpdate('addSupplier') : addData('addSupplier')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from "@/api/supplier.js";
export default {
  created() {
    this.fetchData();
  },
  props: {
    //see if this component is used as a dialog
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogFormVisible: false,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      addSupplier: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "must fill", trigger: "blur" }],
        linkman: [{ required: true, message: "must fill", trigger: "blur" }],
        mobile: [{ required: true, message: "must fill", trigger: "blur" }]
      }
    };
  },
  methods: {
    //upon data changed
    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          if (res.data.flag) {
            this.list = res.data.data.rows;
            this.total = res.data.data.total;
          } else {
            this.$message({
              message: "Server Error",
              type: "error"
            });
          }
        });
    },
    //delete data
    handleDelete(id) {
      this.$confirm("Are you sure you want to delete this data?", "warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel"
      })
        //after confirm clicked
        .then(() => {
          supplierApi.deleteById(id).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.$message({
                message: 'Delete Successfully',
                type: "success"
              });
            } else {
              this.$message({
                message: "Whoops something went wrong",
                type: "error"
              });
            }
          });
        })
        //after cancel clicked
        .catch(() => {
          this.$message({
            message: 'Cancelled',
            type: 'info'
          });
        });
    },
    //prompt a dialog with data to be edited
    handleEdit(id) {
      supplierApi.getById(id).then(res => {
        if (res.data.flag) {
          this.addSupplier = res.data.data;
          this.dialogFormVisible = true;
        } else {
          this.$message({
            message: "Server Error",
            type: "error"
          });
        }
      });
    },
    //update data
    handleUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.update(this.addSupplier).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: res.data.message,
                type: "success"
              });
            } else {
              this.$message({
                message: "Whoopes something went wrong",
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
    //pagination
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //clear search conditions
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchData();
    },
    //prompt with empty dialog to add data
    addHandler() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addSupplier"].resetFields();
      });
    },
    //add data
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.add(this.addSupplier).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: 'Successfully Added',
                type: "success"
              });
            } else {
              this.$message({
                message: 'Whoops something went wrong',
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
    //single-row-choosing triggered event
    dealCurrentChange(currentRow) {
      this.$emit("option-supplier", currentRow);
    }
  }
};
</script>

<style scoped>
</style>