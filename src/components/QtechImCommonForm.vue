<template>
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="72px" :rules="rules">
    <template v-for="item in formConfig">
      <el-form-item v-if="item.visible" :key="item.prop" :label="item.label" :prop="item.prop" :label-width="item.labelWidth" :rules="item.rules">
        <component
          :is="item.type"
          v-model="queryParams[item.prop]"
          v-bind="item.props"
          v-on="item.events"
          v-if="item.type !== 'dateRangePicker'"
        />
        <el-date-picker
          v-model="queryParams[item.prop]"
          v-if="item.type === 'dateRangePicker'"
          style="width: 390px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          :start-placeholder="item.props.startPlaceholder"
          :end-placeholder="item.props.endPlaceholder"
          :picker-options="getMergedPickerOptions(item.props)"
          @change="item.events.change"
        />
        <el-option v-if="item.type !== 'dateRangePicker'" v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled"></el-option>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    formConfig: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    handleQuery() {
      this.$emit('query', this.queryParams);
    },
    resetQuery() {
      this.$emit('reset');
    },
    getMergedPickerOptions(pickerProps) {
      const shortcuts = pickerProps.enableShortcuts
        ? [
          {
            text: '今天',
            onClick(picker) {
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              const end = new Date()
              end.setHours(23, 59, 59, 999)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const start = new Date()
              start.setDate(start.getDate() - 1)
              start.setHours(0, 0, 0, 0)
              const end = new Date()
              end.setDate(end.getDate() - 1)
              end.setHours(23, 59, 59, 999)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const start = new Date()
              start.setDate(start.getDate() - 7)
              start.setHours(0, 0, 0, 0)
              const end = new Date()
              end.setHours(23, 59, 59, 999)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const start = new Date()
              start.setDate(start.getDate() - 30)
              start.setHours(0, 0, 0, 0)
              const end = new Date()
              end.setHours(23, 59, 59, 999)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const start = new Date()
              start.setDate(1)
              start.setHours(0, 0, 0, 0)
              const end = new Date()
              end.setMonth(end.getMonth() + 1, 0)
              end.setHours(23, 59, 59, 999)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const start = new Date()
              start.setMonth(start.getMonth() - 1, 1)
              start.setHours(0, 0, 0, 0)
              const end = new Date()
              end.setMonth(end.getMonth(), 0)
              end.setHours(23, 59, 59, 999)
              picker.$emit('pick', [start, end])
            }
          }
        ]
        : []

      return {
        shortcuts,
        ...pickerProps.pickerOptions
      }
    },
    validateTimeSpan(rule, value, callback) {
      if (value && value.length === 2) {
        const [start, end] = value
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffMilliseconds = endDate - startDate

        const maxSpanMilliseconds = this.convertToMilliseconds(pickerProps.maxSpanValue, pickerProps.maxSpanUnit)

        if (diffMilliseconds > maxSpanMilliseconds) {
          return callback(new Error(`时间跨度不能超过 ${pickerProps.maxSpanValue} ${pickerProps.maxSpanUnit}`))
        }
      }
      callback()
    },
    convertToMilliseconds(value, unit) {
      switch (unit) {
        case 'minute':
          return value * 60 * 1000
        case 'hour':
          return value * 60 * 60 * 1000
        case 'day':
          return value * 24 * 60 * 60 * 1000
        case 'week':
          return value * 7 * 24 * 60 * 60 * 1000
        case 'month':
          return value * this.daysInMonth(new Date()) * 24 * 60 * 60 * 1000
        default:
          return value
      }
    },
    daysInMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }
  }
};
</script>

<style scoped>
</style>


<!--
<template>
  <div>
    <common-form
      :show-search="showSearch"
      :queryParams="queryParams"
      :rules="rules"
      :formConfig="formConfig"
      @query="handleQuery"
      @reset="resetQuery"
    />
  </div>
</template>

<script>
import CommonForm from './CommonForm.vue';

export default {
  components: { CommonForm },
  data() {
    return {
      showSearch: true,
      queryParams: {
        companyName: '',
        groupName: '',
        deviceType: '',
        eqId: '',
        mcId: '',
        simId: '',
        dateRange: []
      },
      rules: {
        dateRange: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ]
      },
      formConfig: [
        {
          prop: 'companyName',
          label: '厂区',
          type: 'el-select',
          visible: true,
          props: {
            placeholder: '请输入厂区',
            clearable: true
          },
          events: {
            change: this.handleQuery
          },
          options: factoryOptions
        },
        {
          prop: 'groupName',
          label: '车间',
          type: 'el-select',
          visible: true,
          props: {
            placeholder: '请输入车间',
            clearable: true
          },
          events: {
            focus: this.getGroupNames,
            change: this.handleQuery
          },
          options: workshopOptions
        },
        {
          prop: 'deviceType',
          label: '设备类型',
          type: 'el-select',
          visible: true,
          props: {
            placeholder: '请输入设备类型',
            clearable: true
          },
          events: {
            change: this.handleQuery
          },
          options: deviceTypeOptions
        },
        {
          prop: 'eqId',
          label: '设备编码',
          type: 'el-input',
          visible: true,
          props: {
            placeholder: '请输入设备编码',
            clearable: true
          },
          events: {
            change: this.handleQuery
          }
        },
        {
          prop: 'mcId',
          label: '机台号',
          type: 'el-input',
          visible: true,
          props: {
            placeholder: '请输入机台号',
            clearable: true
          },
          events: {
            change: this.handleQuery
          }
        },
        {
          prop: 'simId',
          label: '盒子号',
          type: 'el-input',
          visible: true,
          props: {
            placeholder: '请输入盒子号',
            clearable: true
          },
          events: {
            change: this.handleQuery
          }
        },
        {
          prop: 'dateRange',
          label: '时间范围',
          type: 'dateRangePicker',
          visible: true,
          props: {
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            maxSpanValue: 30,
            maxSpanUnit: 'day',
            required: true,
            enableShortcuts: true
          },
          events: {
            change: this.handleDateRangeChange
          }
        }
      ]
    };
  },
  methods: {
    handleQuery(queryParams) {
      console.log('查询参数:', queryParams);
    },
    resetQuery() {
      this.queryParams = {
        companyName: '',
        groupName: '',
        deviceType: '',
        eqId: '',
        mcId: '',
        simId: '',
        dateRange: []
      };
    },
    handleDateRangeChange(value) {
      this.queryParams.dateRange = value;
    },
    getGroupNames() {
      // 获取车间名称逻辑
    }
  }
};
</script>

<style scoped>
</style>

这样，CommonForm 组件可以通过配置文件显示不同类型的表单项，包括日期范围选择器。各项表单配置及其相关逻辑都被封装在 formConfig 数组中，使其具备高度的可配置性和灵活性。
-->
