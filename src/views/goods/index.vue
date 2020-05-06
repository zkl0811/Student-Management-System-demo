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
        <el-input v-model="searchMap.name" placeholder="Goods' Name"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="Goods' Code"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          v-model="searchMap.supplierName"
          placeholder="Choose a Vendor"
          @click.native="dialogSupplierVisible=true"
        ></el-input>
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
      <el-table-column prop="name" label="Goods' Name"></el-table-column>
      <el-table-column prop="code" label="Goods' Code"></el-table-column>
      <el-table-column prop="spec" label="Goods' Spec"></el-table-column>
      <el-table-column prop="retailPrice" label="Retail Price"></el-table-column>
      <el-table-column prop="purchasePrice" label="Purchase Price"></el-table-column>
      <el-table-column prop="storageNum" label="Stock"></el-table-column>
      <el-table-column prop="supplierName" label="Vendors"></el-table-column>
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
    <!-- dialog to choose vendors -->
    <el-dialog title="Choose A Vendor" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
    </el-dialog>
    <!-- prompt add dialog -->
    <el-dialog title="Add/Edit Goods" :visible.sync="dialogFormVisible">
      <el-form :model="addGoods" ref="addGoods" label-position="right" :rules="rules">
        <el-form-item label="Goods' Name" prop="name">
          <el-input v-model="addGoods.name"></el-input>
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="addGoods.code"></el-input>
        </el-form-item>
        <el-form-item label="Spec" prop="spec">
          <el-input v-model="addGoods.spec"></el-input>
        </el-form-item>
        <el-form-item label="Retail Price" prop="retailPrice">
          <el-input v-model="addGoods.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="Purchase Price" prop="purchasePrice">
          <el-input v-model="addGoods.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="Stock" prop="storageNum">
          <el-input v-model="addGoods.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="Vendors" prop="supplierName">
          <el-input
            readonly
            v-model="addGoods.supplierName"
            placeholder="Choose a Vendor"
            @click.native="editoptionSupplier"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addGoods.id ? handleUpdate('addGoods') : addData('addGoods')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from "@/api/goods.js";
import Supplier from "@/views/supplier";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogSupplierVisible: false,
      dialogFormVisible: false,
      isEdit: false,
      searchMap: {
        supplierId: null,
        name: "",
        code: "",
        supplierName: ""
      },
      addGoods: {
        id: null,
        supplierId: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: ""
      },
      rules: {
        name: [{ required: true, message: "must fill", trigger: "blur" }],
        code: [{ required: true, message: "must fill", trigger: "blur" }],
        retailPrice: [{ required: true, message: "must fill", trigger: "blur" }]
      }
    };
  },

  components: { Supplier },

  methods: {
    //upon data changed
    fetchData() {
      goodsApi
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
    //pagination
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //prompt a dialog with data to be edited
    handleEdit(id) {
      goodsApi.getById(id).then(res => {
        if (res.data.flag) {
          this.addGoods = res.data.data;
          this.dialogFormVisible = true;
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
          goodsApi.deleteById(id).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.$message({
                message: 'Delete Successfully',
                type: 'success'
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
            message: "Cancelled",
            type: "info"
          });
        });
    },
    //clear search conditions
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchData();
    },
    //prompt with an empty dialog to add data
    addHandler() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addGoods"].resetFields();
      });
    },
    //add data
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.add(this.addGoods).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message:'Successfully Added',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.message,
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
    //update data
    handleUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.update(this.addGoods).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: 'Update Successfully',
                type: 'success'
              });
            } else {
              this.$message({
                message: "Whoops something went wrong",
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
    //deal with customized event to get data from child components
    optionSupplier(currentRow) {
      if (this.isEdit) {
        this.addGoods.supplierId = currentRow.id;
        this.addGoods.supplierName = currentRow.name;
        this.isEdit = false;
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id;
      }
      this.dialogSupplierVisible = false;
    },
    //open supplier list dialog to add
    editoptionSupplier() {
      this.dialogSupplierVisible = true;
      this.isEdit = true;
    }
  }
};
</script>

<style scoped>
</style>