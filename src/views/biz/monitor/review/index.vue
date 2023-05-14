<template>
  <div class="app-container">
    <el-card>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <div>
        <el-form-item label="厂" prop="factoryName">
          <el-select
            v-model="queryParams.factoryName"
            filterable
            clearable
            placeholder="请输入厂"
            :loading="loading"
            @change="changeOneSelection($event, factoryOptions, queryParams.factoryName)"
          >
            <el-option
              v-for="item in factoryOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区" prop="workshop">
<!--          <el-input
            v-model="queryParams.workshop"
            placeholder="请输入区"
            clearable
            @keyup.enter.native="handleQuery"
            style="width: 180px"
          />-->
          <el-select
            v-model="queryParams.workshop"
            filterable
            clearable
            placeholder="请输入区"
            :loading="loading"
            @focus="getWorkshopList"
          >
            <el-option
              v-for="item in workshopOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机型" prop="partSpec">
          <el-input
            v-model="queryParams.partSpec"
            placeholder="请输入机型"
            clearable
            @keyup.enter.native="handleQuery"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 180px">
            <el-option
              v-for="dict in dict.type.wire_diff_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="daterangeCreateDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-card>

    <el-card style="margin-top: 15px">
    <el-table v-loading="loading" :data="wireList">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column label="厂" align="center" prop="factoryName" />
      <el-table-column label="区" align="center" prop="workshop" />
      <el-table-column label="机型" align="center" prop="partSpec" />
      <el-table-column label="线径" align="center" prop="wireWidth">
        <template slot-scope="scope">{{ getBit(scope.row.wireWidth, 1) }}</template>
      </el-table-column>
      <el-table-column label="实际用量" align="center" prop="actualUsagePerPcs">
        <template slot-scope="scope">{{ getBit(scope.row.actualUsagePerPcs, 4) }}</template>
      </el-table-column>
      <el-table-column label="标准用量" align="center" prop="standardUsagePerPcs">
        <template slot-scope="scope">{{ getBit(scope.row.standardUsagePerPcs, 4) }}</template>
      </el-table-column>
      <el-table-column label="差异" align="center" prop="percents">
        <template slot-scope="scope">{{ scope.row.percents === null ? null : scope.row.percents + "%" }}</template>
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.type.wire_diff_status" :value="scope.row.percents"/>
        </template> -->
      </el-table-column>
    </el-table>
  </el-card>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listWire, getWire, delWire, addWire, updateWire } from "@/api/biz/monitor/wire";
import { listWorkshop } from '../../../../api/biz/monitor/factory'


export default {
  name: "Wire",
  dicts: ['wire_diff_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 金线用量表格数据
      wireList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期时间范围
      daterangeCreateDate: [this.DateToStr(new Date(new Date().valueOf())).substring(0,10),
      this.DateToStr(new Date(new Date().valueOf() + 1 * 1440 * 60 * 1000)).substring(0,10)],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partSpec: null,
        factoryName: null,
        workshop: null,
        createDate: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      // 时间选择器范围
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  created() {
    this.getList();
    this.getFactoryList();
  },
  methods: {
    /** 查询金线用量列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateDate && '' !== this.daterangeCreateDate) {
        this.queryParams.params["beginCreateDate"] = this.daterangeCreateDate[0];
        this.queryParams.params["endCreateDate"] = this.daterangeCreateDate[1];
      }
      listWire(this.queryParams).then(response => {

        this.wireList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        partSpec: null,
        factoryName: null,
        workshop: null,
        actualUsagePerPcs: null,
        standardUsagePerPcs: null,
        percents: null,
        createDate: null,
        status: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('biz/monitor/export', {
        ...this.queryParams
      }, `wire_${new Date().getTime()}.xlsx`)
    },
    /** 日期转字符串 */
    DateToStr(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hours = date.getHours()
      const min = date.getMinutes()
      const second = date.getSeconds()
      return year + "-" +
         ((month + 1) > 9 ? (month + 1) : "0" + (month + 1)) + "-" +
         (day > 9 ? day : ("0" + day)) + " " +
         (hours > 9 ? hours : ("0" + hours)) + ":" +
         (min > 9 ? min : ("0" + min)) + ":" +
         (second > 9 ? second : ("0" + second));
    },
    /** 四舍五入 保留N位小数 */
    getBit (value, bit = 2) {
      if (value !== null && value !== '') {
        let str = Number(value);
        str = str.toFixed(bit)
        return str;
      } else {
        return null;
      }
    },
    /** 远程获取厂区名称 */
    getFactoryList() {
      listFactory().then(res => {
        console.log(res.data);
        for (const i in res.data) {
          console.log(i);
          this.factoryOptions.push(res.data[i]["factoryName"])
        }
        console.log(this.factoryOptions);
      })
    },
    /** 给输入框设置值 */
    changeOneSelection(val, fromObj, targetStr) {
      fromObj.find(item => {
        if (item.value === val) {
          targetStr = item;
        }
      })
      console.log(this.queryParams.factoryName)
    },
    /** 根据厂给定的值，查询区的值 */
    getWorkshopList() {
      console.log("已获取焦点")
      console.log(this.queryParams)
      listWorkshop(this.queryParams).then(res => {
        console.log(res.data);
        this.workshopOptions = [];
        for (const i in res.data) {
          this.workshopOptions.push(res.data[i]["workshopName"])
        }
        console.log(this.workshopOptions);
      })
    }
  }
};
</script>
