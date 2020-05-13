<template>
  <div>
    <h1>Welcome To Student Management System</h1>
    <div class="piechart">
      <pie-chart v-if="isLoaded" :data="pieData" :options="pieChartConfig"></pie-chart>
    </div>
  </div>
</template>

<script>
import PieChart from "./PieChart.vue";
import { getAllData } from "@/api/chartsData.js";
export default {
  created() {
    this.getData();
  },
  data() {
    return {
      isLoaded: false,
      pieData: {
        datasets: [
          {
            data: [],
            backgroundColor: ["red", " green", "yellow", "skyblue"],
            borderWidth: 4
          }
        ],
        labels: [],
      },
      pieChartConfig: {
        title: {
          display: true,
          text: "System Usage"
        }
      }
    };
  },

  components: {
    PieChart
  },

  methods: {
    getData() {
      getAllData()
        .then(res => {
          if (res.data.flag) {
            for (var key in res.data.data) {
              this.pieData.labels.push(key+res.data.data[key]);
              this.pieData.datasets[0].data.push(res.data.data[key]);
            }
            this.isLoaded = true;
          } else {
            this.$message({
              message: "Whoops somenthing went wrong",
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "Server Error",
            type: "error"
          });
        });
    }
  }
};
</script>

<style scoped>
div {
  text-align: center;
}
.piechart {
  position: relative;
  height: 400px;
  width: 400px;
  margin: 0 auto;
}
</style>