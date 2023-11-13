<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="20">
        <el-col :md="8" :sm="12">
          <el-form-item label="产品名称">
            <el-input v-model="form.name" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12">
          <el-form-item label="产品类型">
            <el-select v-model="form.type" class="width-full" placeholder="请选择产品类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12">
          <el-form-item label="产品类型">
            <el-date-picker
              v-model="form.date"
              class="width-full"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-collapse-transition>
          <!-- 这里我们用v-show来判断是否显示那些被深深包裹的检索条件，还涉及到一个知识点，
          我们用v-show而不用v-if，是因为这里需要频繁切换，v-show和v-if应用不清楚
          的同学要去好好学习一下啦-->
          <div v-show="advanced">
            <el-col :md="8" :sm="12">
              <el-form-item label="产品类型">
                <el-date-picker
                  v-model="form.date"
                  class="width-full"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品名称">
                <el-input v-model="form.name" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品类型">
                <el-select v-model="form.type" class="width-full" placeholder="请选择产品类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品类型">
                <el-date-picker
                  v-model="form.date"
                  class="width-full"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品名称">
                <el-input v-model="form.name" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品类型">
                <el-select v-model="form.type" class="width-full" placeholder="请选择产品类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品类型">
                <el-date-picker
                  v-model="form.date"
                  class="width-full"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品名称">
                <el-input v-model="form.name" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="12">
              <el-form-item label="产品类型">
                <el-select v-model="form.type" class="width-full" placeholder="请选择产品类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </el-collapse-transition>
        <div class="right-handle-group">
          <el-button-group>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
            <el-button type="primary" icon="el-icon-magic-stick">重置</el-button>
          </el-button-group>
          <a style="margin-left: 8px" @click="toggleAdvanced">
            {{ advanced ? '收起' : '展开' }}
            <!-- 我们通过vue给class动态赋值，
            添加一个三元判断，判断icon是向下还是向上，这个向下向的状态是基于
            advanced的状态 -->
            <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
          </a>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'collapsePanel',
  data() {
    return {
      //select选项
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      //时间日期组件
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      //我们给搜索条件绑定的表单对象
      form: {
        name: '',
        type: '',
        date: ''
      },
      advanced: false,//这个是关键，我们用它来判断展开/收起
    }
  },
  mounted() {

  },
  methods: {
    //一个简单的js，点击文字，改变状态
    toggleAdvanced() {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.width-full{width: 100%;}
.right-handle-group{float: right;}
.navbar {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  background-color: #767676;
}
</style>
