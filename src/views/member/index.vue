  <template>
  <!-- data binds data which needs to be rendered 
      height can fix table's head
      prop indicate data's field's name
  type=index can automatically add id(self-increase)
  slot-scope="scope", scope is an object hat contains row/column/index,etc
  ref indicates form name-->
  <div>
    <!-- search form -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="Member Card Num"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="Member Name"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="Payment Type">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker v-model="searchMap.birthday" type="date" placeholder="Birthday"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 10px">
        <el-button type="primary" @click="fetchData">Search</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">Reset</el-button>
        <el-button type="primary" @click="addHandler">AddNew</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list" height="600" border style="width: 100%">
      <el-table-column type="index" label="Id"></el-table-column>
      <el-table-column prop="cardNum" label="Car Number"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="birthday" label="Birthday"></el-table-column>
      <el-table-column prop="phone" label="Phone Num"></el-table-column>
      <el-table-column prop="integral" label="Available Points"></el-table-column>
      <el-table-column prop="money" label="Paid Amount"></el-table-column>
      <el-table-column prop="payType" label="Payment Type">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title="Add/Edit Member" :visible.sync="dialogFormVisible">
      <el-form :model="addMember" ref="addMember" label-position="right" :rules="rules">
        <el-form-item label="Membership" prop="cardNum">
          <el-input v-model="addMember.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="addMember.name"></el-input>
        </el-form-item>
        <el-form-item label="Birthday" prop="birthday">
          <el-date-picker v-model="addMember.birthday" type="date" placeholder="Birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="addMember.phone"></el-input>
        </el-form-item>
        <el-form-item label="Card Amount" prop="money">
          <el-input v-model="addMember.money"></el-input>
        </el-form-item>
        <el-form-item label="Available Points" prop="integral">
          <el-input v-model="addMember.integral"></el-input>
        </el-form-item>
        <el-form-item label="Payment Type" prop="payType">
          <el-select v-model="addMember.payType" placeholder="请选择活动区域">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input type="textarea" v-model="addMember.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addMember.id ? handleUpdate('addMember') :addData('addMember') "
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberApi from "@/api/member.js";
const payTypeOptions = [
  { type: "1", name: "Cash" },
  { type: "2", name: "Wechat" },
  { type: "3", name: "Alipay" },
  { type: "4", name: "Credit Card" }
];
export default {
  //get member lisgt upon initialized
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        carNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      payTypeOptions: payTypeOptions,
      dialogFormVisible: false,
      addMember: {
        id: null,
        name: "",
        region: "",
        birthday: "",
        phone: "",
        cardNum: "",
        payType: "",
        address: "",
        money: "",
        integral: ""
      },
      rules: {
        cardNum: [{ required: true, message: "must fill", trigger: "blur" }],
        name: [{ required: true, message: "must fill", trigger: "blur" }],
        payType: [{ required: true, message: "must fill", trigger: "blur" }]
      }
    };
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => {
        return obj.type === type;
      });

      return payObj ? payObj.name : null;
    }
  },
  components: {},
  methods: {
    //once upon data changed
    fetchData() {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          //console.log(res.data.data.rows);
          if(res.data.flag){
              this.list = res.data.data.rows;
              this.total = res.data.data.total;
          }else{
            this.$message({
              message: 'Server Error',
              type: 'error'
            });
          }
          
        });
    },

    //pagination
    handleCurrentChange(val) {
      //console.log(val);
      this.currentPage = val;
      this.fetchData();
    },
    //reset search form
    resetForm(formName) {
      //methods defined in Element UI to reset values in form(prop attribute needs to be declared in el-form-item)
      this.$refs[formName].resetFields();
      this.fetchData();
    },

    //prompt with empty dialog to add data
    addHandler() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addMember"].resetFields();
      });
    },
    //add data
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //console.log('55');
          memberApi.add(this.addMember).then(res => {
            if (res.data.flag) {
              //console.log(res.data);
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: 'Successfully Added',
                type: 'success'
              });
            } else {
              this.$message({
                message: "Whoops Something Went Wrong",
                type: "warning"
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
    //prompt dialog with data to be edited
    handleEdit(id) {
      memberApi.getById(id).then(res => {
        if (res.data.flag) {
          this.addMember = res.data.data;
          this.dialogFormVisible = true;
        } else {
          this.$message({
            message: "Something Went Wrong",
            type: "warning"
          });
        }
      });
    },
    //update edited data
    handleUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.update(this.addMember).then(res => {
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
                type: "warning"
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
    //delete data
    handleDelete(id) {
      this.$confirm("Are you sure you want to delete this data?", "warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel"
      })
        .then(() => {
          //after confirm clicked
          memberApi.deleteById(id).then(res => {
            if (res.data.flag) {
              this.$message({
                message: 'Delete Successfully',
                type: "success"
              });
              this.fetchData();
            } else {
              this.$message({
                message: 'Whoops somenthing went wrong',
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          //after cancel clicked
          this.$message({
            message: "Cancelled",
            type: "info"
          });
        });
    }
  }
};
</script>

<style scoped>
</style>