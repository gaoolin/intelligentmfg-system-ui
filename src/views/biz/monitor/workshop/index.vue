<template>
  <div class="app-container">
    <el-card style="margin-top: 2px">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="厂区" prop="factoryName">
        <el-select
          v-model="queryParams.factoryName"
          placeholder="请输入厂区"
          clearable
          filterable
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
      <el-form-item label="车间" prop="workshop">
        <el-select
          v-model="queryParams.workshop"
          placeholder="请输入车间"
          clearable
          filterable
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
      <el-form-item label="EQ" prop="deviceMId">
        <el-input
          v-model="queryParams.deviceMId"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter.native="handleQuery"
          />
      </el-form-item>
      <el-form-item label="机型" prop="partSpec">
        <el-input
          v-model="queryParams.partSpec"
          placeholder="请输入机型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线径" prop="wireWidth">
        <el-input
          v-model="queryParams.wireWidth"
          placeholder="请输入线径"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="daterangeFiscalDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.wire_diff_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['biz/monitor:workshop:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    </el-card>

    <el-card style="margin-top: 2px">
    <el-table v-loading="loading" :data="workshopList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="55" align="center" />
      <el-table-column label="厂区" align="center" prop="factoryName" />
      <el-table-column label="车间" align="center" prop="workshop" />
      <el-table-column label="设备编号" align="center" prop="deviceMId" />
      <el-table-column label="机型" align="center" prop="partSpec" />
      <el-table-column label="线径" align="center" prop="wireWidth" >
        <template slot-scope="scope">{{ getBit(scope.row.wireWidth, 1) }}</template>
      </el-table-column>
      <el-table-column label="实际用量" align="center" prop="actualUsagePerPcs" >
        <template slot-scope="scope">{{ getBit(scope.row.actualUsagePerPcs, 4) }}</template>
      </el-table-column>
      <el-table-column label="标准用量" align="center" prop="standardUsagePerPcs" >
        <template slot-scope="scope">{{ getBit(scope.row.standardUsagePerPcs, 4) }}</template>
      </el-table-column>
      <el-table-column label="占比" align="center" prop="percents" >
        <template slot-scope="scope">{{ getBit(scope.row.percents, 2) }}</template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    </el-card>
  </div>
</template>

<script>
import { listWorkshop, getWorkshop, delWorkshop, addWorkshop, updateWorkshop } from "@/api/biz/monitor/workshop";
import { listFactoryName, listWorkshopName } from "@/api/biz/monitor/factory";

export default {
  name: "Workshop",
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
      // 金线消耗量表格数据
      workshopList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态时间范围
      daterangeFiscalDate: [this.DateToStr(new Date(new Date().valueOf() - 1 * 1440 * 60 * 1000)).substring(0,10),
        this.DateToStr(new Date(new Date().valueOf() - 1 * 1440 * 60 * 1000)).substring(0,10)],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryName: null,
        workshop: null,
        deviceMId: null,
        partSpec: null,
        wireWidth: null,
        fiscalDate: null,
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
    /** 查询金线消耗量列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeFiscalDate && '' !== this.daterangeFiscalDate) {
        this.queryParams.params["beginFiscalDate"] = this.daterangeFiscalDate[0];
        this.queryParams.params["endFiscalDate"] = this.daterangeFiscalDate[1];
      }
      listWorkshop(this.queryParams).then(response => {
        this.workshopList = response.rows;
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
        factoryName: null,
        workshop: null,
        deviceMId: null,
        partSpec: null,
        wireWidth: null,
        actualUsagePerPcs: null,
        standardUsagePerPcs: null,
        percents: null,
        fiscalDate: null,
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
      this.daterangeFiscalDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.mcIds = selection.map(item => item.mcId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('biz/monitor/workshop/export', {
        ...this.queryParams
      }, `workshop_${new Date().getTime()}.xlsx`)
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
      listFactoryName().then(res => {
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
      listWorkshopName(this.queryParams).then(res => {
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
