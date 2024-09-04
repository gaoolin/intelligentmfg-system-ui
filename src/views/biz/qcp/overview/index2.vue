<template>
  <div class="app-container">
    <!-- 表单筛选部分 -->
    <FilterSelect
      label="厂区"
      :options="filteredFactoryOptions"
      v-model="queryParams.companyName"
      @change="onSelectionChange"
    />
    <FilterSelect
      label="车间"
      :options="filteredWorkshopOptions"
      v-model="queryParams.groupName"
      @change="onSelectionChange"
    />
    <FilterSelect
      label="设备类型"
      :options="filteredDeviceTypeOptions"
      v-model="queryParams.deviceType"
      @change="onSelectionChange"
    />

    <!-- 更新时间和工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="12">
        更新时间：<span style="font-weight: bolder; color: red">{{ updateDt }}</span>
      </el-col>
      <el-col :span="12">
        <right-tool-bar-download :showSearch.sync="showSearch" @queryTable="getList" @handleExport="handleExport"></right-tool-bar-download>
      </el-col>
    </el-row>

    <!-- 表格内容 -->
    <el-table
      class="ele-body-base"
      v-loading="loading"
      :data="filteredTableData"
      ref="table"
      id="table"
      show-summary
      border
      :header-cell-style="headerCellStyle"
      :cell-style="bodyCellStyle"
      :style="tableStyle()"
    >
      <el-table-column prop="companyName" label="厂区" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="groupName" label="车间" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="deviceType" label="设备类型" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="ttlEqs" align="center" min-width="120" fit>
        <template slot="header">
          <HeaderWithTooltip label="设备总数" tooltip="设备总数 = [有qcp参数模版] + [无qcp参数模版] + [未联网]" />
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <HeaderWithTooltip label="已联网" tooltip="已联网设备数 = [有qcp参数模版] + [无qcp参数模版]" />
        </template>
        <el-table-column prop="onlineEqs" align="center" min-width="120" fit>
          <template slot="header">
            <HeaderWithTooltip label="有qcp参数模版" tooltip="设备已联网且有qcp参数模版" />
          </template>
        </el-table-column>
        <el-table-column prop="qcpParamsIsNull" label="无qcp参数模版" align="center" min-width="120" fit>
          <template slot="header">
            <HeaderWithTooltip label="无qcp参数模版" tooltip="设备已联网无qcp参数模版" />
          </template>
          <template slot-scope="scope">
            <router-link :to="{ path: '/biz/qcp/detail', query: { ...scope.row, label: 1 } }">
              <span>{{ scope.row.qcpParamsIsNull || '' }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="remoteControlOff" align="center" min-width="120" show-overflow-tooltip>
          <template slot="header">
            <HeaderWithTooltip label="未开启远程" tooltip="已联网设备中没有开启远程反控（控制）功能的设备" />
          </template>
          <template slot-scope="scope">
            <router-link :to="{ path: '/biz/eqn/networking', query: { ...scope.row, status: 1, label: 2 } }">
              <span>{{ scope.row.remoteControlOff || '' }}</span>
            </router-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="offlineEqs" align="center" min-width="120" fit>
        <template slot="header">
          <HeaderWithTooltip label="未联网" tooltip="设备没有联网，无远程反控（控制）功能" />
        </template>
        <template slot-scope="scope">
          <router-link :to="{ path: '/biz/eqn/networking', query: { ...scope.row, status: 0, label: 0 } }">
            <span>{{ scope.row.offlineEqs || '' }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="qcpCoverRate" label="QCP覆盖率" align="center" min-width="120" fit></el-table-column>
    </el-table>
  </div>
</template>

<script>
import '@/views/biz/common/css/qtech-css.css'
import { headerCellStyle, bodyCellStyle, tableStyle } from '@/views/biz/common/js/tableStyles';
import { listQcpOverview, getDataMaxTime } from '@/api/biz/qcp/parameters'
import RightToolBarDownload from '@/views/biz/common/RightToolBarDownload'
import FilterSelect from './FilterSelect'
import HeaderWithTooltip from './HeaderWithTooltip'

export default {
  name: 'index',
  components: { RightToolBarDownload, FilterSelect, HeaderWithTooltip },

  data() {
    return {
      showSearch: true,
      total: 0,
      loading: true,
      tableData: [],
      factoryOptions: [],
      workshopOptions: [],
      deviceTypeOptions: [],
      updateDt: "-",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: '',
        groupName: '',
        deviceType: '',
        status: null,
        remoteControlOff: null,
      },
      filteredTableData: [], // 添加一个新的属性用于存储过滤后的表格数据
    }
  },

  created() {
    this.initializeData();
  },

  computed: {

    filteredFactoryOptions() {
      const filteredData = this.filteredTableData;
      const factorySet = new Set(filteredData.map(item => item.companyName));
      return [...factorySet].map(name => ({ label: name, value: name }));
    },
    filteredWorkshopOptions() {
      const filteredData = this.filteredTableData;
      const workshopSet = new Set(filteredData.map(item => item.groupName));
      return [...workshopSet].map(name => ({ label: name, value: name }));
    },
    filteredDeviceTypeOptions() {
      const filteredData = this.filteredTableData;
      const deviceTypeSet = new Set(filteredData.map(item => item.deviceType));
      return [...deviceTypeSet].map(type => ({ label: type, value: type }));
    },
  },

  methods: {
    headerCellStyle,
    bodyCellStyle,
    tableStyle,

    // 初始化数据
    async initializeData() {
      await this.getList();
      await this.getDataMaxTime();
      this.filteredTableData = this.tableData; // 初始化时设置 filteredTableData
    },

    // 获取表格数据
    async getList() {
      this.loading = true;
      const response = await listQcpOverview(this.queryParams);
      this.tableData = response.rows;
      console.log('tableData', this.tableData)
      this.updateFilteredTableData(); // 更新 filteredTableData
      this.loading = false;
    },

    // 更新 filteredTableData
    updateFilteredTableData() {
      this.filteredTableData = this.tableData.filter(data => {
        const { companyName, groupName, deviceType } = this.queryParams;
        return (
          (!companyName || data.companyName === companyName) &&
          (!groupName || data.groupName === groupName) &&
          (!deviceType || data.deviceType === deviceType)
        );
      });
      console.log('filteredTableData', this.filteredTableData)
    },

    // 获取数据更新时间
    async getDataMaxTime() {
      const response = await getDataMaxTime();
      this.updateDt = response.data;
    },

    // 表单选择框变化时触发重新计算和合并行
    onSelectionChange() {
      console.log('Selection changed:', this.queryParams);
      this.updateFilteredTableData(); // 更新 filteredTableData
    },

    // 根据 rowMergeArrs 动态设置单元格的合并信息
    arraySpanMethod({ rowIndex, columnIndex }) {
      const colName = this.$refs.table.columns[columnIndex].property;
      const mergeItem = this.rowMergeArrs[colName];
      if (mergeItem) {
        const { rowspan, colspan } = mergeItem[rowIndex] || { rowspan: 1, colspan: 1 };
        return [rowspan, colspan];
      }
      return [1, 1];
    },

    // 导出功能
    handleExport() {
      this.download('/aa/params/hdfs/downloadFile', {
        ...this.queryParams
      }, `设备联网情况明细_${new Date().getTime()}.xlsx`);
    }
  }
}
</script>

<style scoped>
/* 样式相关代码 */
</style>
