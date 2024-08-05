<template>
<div class="app-container">
  <el-form ref="headQueryForm" :model="queryParams" :inline="false" label-width="68px" label-position="right">
    <el-row :gutter="20">
      <el-col :md="6" :sm="12">
        <el-form-item label="料号" prop="materialId">
          <el-input v-model="queryParams.materialId" placeholder="查询单个料号的参数" clearable />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="因子浮动范围（±%）" prop="deviation" label-width="150px">
          <el-input-number v-model="queryParams.deviation" :step="5" controls-position="right" :format-tooltip="formatTooltip" :min="0" :max="1000"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="right-handle-group">
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          </el-button-group>
          <a style="margin-left: 8px" @click="toggleAdvanced" v-show="showSearch">
            {{ advanced ? '收起' : '展开' }}
            <!-- 我们通过vue给class动态赋值，
            添加一个三元判断，判断icon是向下还是向上，这个向下向的状态是基于
            advanced的状态 -->
            <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
          </a>
        </div>
      </el-col>
    </el-row>
  </el-form>
  <el-form ref="queryForm" :model="queryParams" :inline="true" v-show="showSearch" label-width="120px"
           label-position="left">
    <el-row :gutter="20">
      <el-col :md="4" :sm="12">
        <el-form-item label="连接器型号" prop="connectorModel">
          <el-input v-model="queryParams.connectorModel" placeholder="连接器型号" clearable
                    @keyup.enter.native="handleQuery" @input="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-form-item label="治具类型" prop="fixtureCategory">
            <el-input v-model="queryParams.fixtureCategory" placeholder="治具类型" clearable
                    @keyup.enter.native="handleQuery" @input="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-form-item label="连接器总宽" prop="connectorTtlWidth">
          <el-input v-model="queryParams.connectorTtlWidth" placeholder="连接器总宽" clearable
                    @keydown.enter.native="handleQuery" @input="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-form-item label="连接器总长" prop="connectorTtlLength">
          <el-input v-model="queryParams.connectorTtlLength" placeholder="连接器总长" clearable
                    @keyup.enter.native="handleQuery" @input="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-form-item label="连接器露铜部宽" prop="connectorExposedCopperWidth">
          <el-input v-model="queryParams.connectorExposedCopperWidth" placeholder="连接器露铜部宽" clearable
                    @keyup.enter.native="handleQuery" @input="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-form-item label="引脚PIN数" prop="pinPins">
          <el-input v-model="queryParams.pinPins" placeholder="引脚PIN数" clearable @keyup.enter.native="handleQuery" @input="handleQuery"/>
        </el-form-item>
      </el-col>

      <el-collapse-transition>
        <!-- 这里我们用v-show来判断是否显示那些被深深包裹的检索条件，还涉及到一个知识点，
        我们用v-show而不用v-if，是因为这里需要频繁切换，v-show和v-if应用不清楚
        的同学要去好好学习一下啦-->
        <div v-show="advanced">
          <el-col :md="4" :sm="12">
            <el-form-item label="引脚PIN间距" prop="pinSpacing">
              <el-input v-model="queryParams.pinSpacing" placeholder="引脚PIN间距" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="是否有固定PIN" prop="isFixedPin">
              <el-select v-model="queryParams.isFixedPin" placeholder="是否有固定PIN" clearable @change="handleQuery" >
                <el-option
                v-for="dict in dict.type.fixture_pogopin_fixed_pin"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="连接器钢片宽度" prop="connectorSheetWidth">
              <el-input v-model="queryParams.connectorSheetWidth" placeholder="连接器钢片宽度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="连接器钢片长度" prop="connectorSheetLength">
              <el-input v-model="queryParams.connectorSheetLength" placeholder="连接器钢片长度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="模组头部宽度" prop="moduleHeadWidth">
              <el-input v-model="queryParams.moduleHeadWidth" placeholder="模组头部宽度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="模组头部长度" prop="moduleHeadLength">
              <el-input v-model="queryParams.moduleHeadLength" placeholder="模组头部长度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="模组本体高度" prop="moduleBodyHeight">
              <el-input v-model="queryParams.moduleBodyHeight" placeholder="模组本体高度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="LENS中心到连接器中心高度" prop="heightOfLensCenterToConnectorCenter" label-width="200px">
              <el-input v-model="queryParams.heightOfLensCenterToConnectorCenter" placeholder="LENS中心到连接器中心高度"
                        clearable @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="连接器基板厚度" prop="connectorSubstrateThickness">
              <el-input v-model="queryParams.connectorSubstrateThickness" placeholder="连接器基板厚度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="LENS中心到连接器中心左右偏移量" prop="leftRightOffsetHeightLensCenterToConnectorCenter"
                          label-width="260px"
            >
              <el-input v-model="queryParams.leftRightOffsetHeightLensCenterToConnectorCenter"
                        placeholder="LENS中心到连接器中心左右偏移量" clearable @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="FOV角度" prop="fovAngle">
              <el-input v-model="queryParams.fovAngle" placeholder="FOV角度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="是否常规FPC" prop="isRegularFpc">
              <el-select v-model="queryParams.isRegularFpc" placeholder="是否常规FPC" clearable @change="handleQuery" >
                <el-option
                v-for="dict in dict.type.fixture_pogopin_is_regular_fpc"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="4" :sm="12">
            <el-form-item label="FPC最大宽度" prop="fpcMaximumWidth">
              <el-input v-model="queryParams.fpcMaximumWidth" placeholder="FPC最大宽度" clearable
                        @keyup.enter.native="handleQuery" @input="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="模组摆放方向" prop="modulePlacement">
              <el-select v-model="queryParams.modulePlacement" placeholder="模组摆放方向" clearable @change="handleQuery" >
                <el-option
                v-for="dict in dict.type.fixture_pogopin_module_placement"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="机台" prop="mcId">
              <el-select v-model="queryParams.mcId" placeholder="机台" clearable @change="handleQuery" >
                <el-option
                  v-for="dict in dict.type.fixture_pogopin_mc_id"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="测试工装" prop="testFixtures">
              <el-select v-model="queryParams.testFixtures" placeholder="测试工装" clearable @change="handleQuery" >
                <el-option
                  v-for="dict in dict.type.fixtrue_pogopin_test_fixture"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="产品类型" prop="prodLevel">
              <el-select v-model="queryParams.prodLevel" placeholder="产品类型" clearable @change="handleQuery" >
                <el-option
                  v-for="dict in dict.type.fixture_pogopin_prod_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </div>
      </el-collapse-transition>
    </el-row>
  </el-form>

  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAddAndUpdateFixture(null, 1)"
        v-hasPermi="['fixture:params:pogopin:ops']"
      >新增料号
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="danger"
        plain
        size="mini"
        @click="handleFixtureCategoryManage"
        v-hasPermi="['fixture:params:pogopin:ops']"
      >
        <span>管理治具类型</span>
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
        v-hasPermi="['fixture:params:pogopin:export']"
      >导出
      </el-button>
    </el-col>
    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
  </el-row>

  <el-table
    v-loading="loading"
    :data="tableData"
    fit
    class="tableArea mt10"
    style="font-size: 14px;"
    cell-mouse-enter
    cell-mouse-leave
    :header-cell-style="tableHeaderCellStyle"
    border
  >
    <el-table-column prop="materialId" label="料号" align="center" width="120" fixed />
    <el-table-column prop="fixtureName" label="品名" align="center" width="120" fixed show-overflow-tooltip />
    <el-table-column prop="fixtureSpec" label="规格" align="center" width="120" fixed  show-overflow-tooltip />
    <el-table-column prop="buckle" label="连接器朝向" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixture_buckle_status" :value="scope.row.buckle"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="fixtureVersion" label="治具版本" align="center" width="120" />
    <el-table-column prop="connectorModel" label="连接器型号" align="center" width="120" />
    <el-table-column prop="fixtureCategory" label="治具类型" align="center" width="120" />
    <el-table-column prop="fixtureSharedStatus" label="使用机型" align="center" width="120" >
      <template slot-scope="scope">
        <span v-if="scope.row.fixtureSharedStatus===1">
           <router-link :to="{path: '/biz/fixture/search', query: {
              materialId: scope.row.materialId,
              deptId: queryParams.deptId
            }}">
            <dict-tag :options="dict.type.fixture_shared_status" :value="scope.row.fixtureSharedStatus"></dict-tag>
          </router-link>
        </span>
        <span v-else>
          <dict-tag :options="dict.type.fixture_shared_status" :value="scope.row.fixtureSharedStatus"></dict-tag>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="connectorTtlWidth" label="连接器总宽" align="center" width="120" />
    <el-table-column prop="connectorTtlLength" label="连接器总长" align="center" width="120" />
    <el-table-column prop="connectorExposedCopperWidth" label="连接器露铜部宽" align="center" width="120" />
    <el-table-column prop="pinPins" label="引脚pin数" align="center" width="120" />
    <el-table-column prop="pinSpacing" label="引脚PIN间距" align="center" width="120"/>
    <el-table-column prop="isFixedPin" label="是否有固定PIN" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixture_pogopin_fixed_pin" :value="scope.row.isFixedPin"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="connectorSheetWidth" label="连接器钢片宽度" align="center" width="120" />
    <el-table-column prop="connectorSheetLength" label="连接器钢片长度" align="center" width="120"/>
    <el-table-column prop="moduleHeadWidth" label="模组头部宽度" align="center" width="120" />
    <el-table-column prop="moduleHeadLength" label="模组头部长度" align="center" width="120" />
    <el-table-column prop="moduleBodyHeight" label="模组本体高度" align="center" width="120" />
    <el-table-column prop="heightOfLensCenterToConnectorCenter" label="LENS中心到连接器中心高度" align="center" width="120" />
    <el-table-column prop="connectorSubstrateThickness" label="连接器基板厚度" align="center" width="120" />
    <el-table-column prop="leftRightOffsetHeightLensCenterToConnectorCenter" label="LENS中心到连接器中心左右偏移量" align="center" width="120" />
    <el-table-column prop="fovAngle" label="FOV角度" align="center" width="120" />
    <el-table-column prop="isRegularFpc" label="是否常规FPC" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixture_pogopin_is_regular_fpc" :value="scope.row.isRegularFpc"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="fpcMaximumWidth" label="FPC最大宽度" align="center" width="120" />
    <el-table-column prop="modulePlacement" label="模组摆放方向" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixture_pogopin_module_placement" :value="scope.row.modulePlacement"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="mcId" label="机台" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixture_pogopin_mc_id" :value="scope.row.mcId"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="testFixtures" label="测试工装" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixtrue_pogopin_test_fixture" :value="scope.row.testFixtures"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="prodLevel" label="产品类型" align="center" width="120" >
      <template slot-scope="scope">
        <dict-tag :options="dict.type.fixture_pogopin_prod_level" :value="scope.row.prodLevel"></dict-tag>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="备注" align="center" width="130" />
    <el-table-column label="操作" align="center" width="110" fixed="right" >
      <template slot-scope="scope">
        <div class="box-ops">
          <el-button size="mini" type="text" class="btn-ops" @click="handleAddAndUpdateFixture(scope.row, 2)" >新增共用机型</el-button>
        </div>
        <div class="box-ops">
          <el-button size="mini" type="text" class="btn-ops" @click="handleAddAndUpdateFixture(scope.row, 3)" >编辑</el-button>
          <el-button size="mini" type="text" class="btn-ops" @click="handleDelete(scope.row, 1)">删除</el-button>
          <el-button size="mini" type="text" class="btn-ops" @click="handleAddAndUpdateFixture(scope.row, 4)" >用参</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="queryParams.pageNum"
    :limit.sync="queryParams.pageSize"
    @pagination="getList"
  />

  <!--   添加治具对话框   -->
  <modal-udf :title="title" :dialogShow="addFixtureDialogVisible" :width="'30%'" :isCloseOnClick="false" :resetBtn="dialogReset" @closeChildDialog="closeChildDialog" v-dialogDrag v-dialogDragWidth v-dialogDragHeight >
    <el-form ref="fixturePoGoPinForm" :model="form" :rules="rulesFlag === 0 ? rules : rulesFlag === 1 ? rulesAddShared : rulesFlag === 2 ? rulesUpdate : rulesFlag === 3 ? rules : rules" label-width="110px" >
      <el-form-item label="料号" prop="materialId">
        <el-input v-model="form.materialId" :disabled="materialIdDisabled" placeholder="请输入料号" />
      </el-form-item>
      <el-form-item label="品名" prop="fixtureName">
        <el-input v-model="form.fixtureName" :disabled="materialInfoDisabled" placeholder="请输入品名" />
      </el-form-item>
      <el-form-item label="规格" prop="fixtureSpec">
        <el-input v-model="form.fixtureSpec" :disabled="materialInfoDisabled" placeholder="请输入规格" type="textarea" />
      </el-form-item>
      <el-form-item label="治具版本" prop="fixtureVersion">
        <el-input v-model="form.fixtureVersion" :disabled="materialInfoDisabled" placeholder="请输入治具版本" />
      </el-form-item>
      <el-form-item label="连接器朝向" prop="buckle">
        <el-radio-group v-model="form.buckle" :disabled="materialInfoDisabled" >
          <el-radio
            v-for="dict in dict.type.fixture_buckle_status"
            :key="dict.value"
            :label="dict.value"
          >{{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="治具类型" prop="fixtureCategory">
        <!-- 请求返回的form.fixtureCategory是 int 类型，字典的key是string类型，需要把int转成string，否则输入框不能自动转换成value/label -->
        <el-select v-model="form.fixtureCategory" placeholder="请选择治具类型" clearable :disabled="materialInfoDisabled" >
          <el-option
            v-for="item in categoryOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用机型" prop="prodType" v-if="prodTypeShow">
        <el-input v-model="form.prodType" placeholder="使用机型" clearable />
      </el-form-item>
      <el-form-item label="连接器型号" prop="connectorModel" v-if="formItemShow">
        <el-input v-model="form.connectorModel" placeholder="连接器型号" clearable />
      </el-form-item>
      <el-form-item label="连接器总宽" prop="connectorTtlWidth" v-if="formItemShow">
        <el-input v-model="form.connectorTtlWidth" placeholder="连接器总宽" clearable />
      </el-form-item>
      <el-form-item label="连接器总长" prop="connectorTtlLength" v-if="formItemShow">
        <el-input v-model="form.connectorTtlLength" placeholder="连接器总长" clearable />
      </el-form-item>
      <el-form-item label="连接器露铜部宽" prop="connectorExposedCopperWidth" v-if="formItemShow">
        <el-input v-model="form.connectorExposedCopperWidth" placeholder="连接器露铜部宽" clearable />
      </el-form-item>
      <el-form-item label="引脚PIN数" prop="pinPins" v-if="formItemShow">
        <el-input v-model="form.pinPins" placeholder="引脚PIN数" clearable />
      </el-form-item>
      <el-form-item label="引脚PIN间距" prop="pinSpacing" v-if="formItemShow">
        <el-input v-model="form.pinSpacing" placeholder="引脚PIN间距" clearable />
      </el-form-item>
      <el-form-item label="是否有固定PIN" prop="isFixedPin" v-if="formItemShow">
        <el-radio-group v-model="form.isFixedPin" placeholder="是否有固定PIN" clearable >
          <el-radio
            v-for="dict in dict.type.fixture_pogopin_fixed_pin"
            :key="dict.value"
            :label="dict.value"
          >{{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="连接器钢片宽度" prop="connectorSheetWidth" v-if="formItemShow">
        <el-input v-model="form.connectorSheetWidth" placeholder="连接器钢片宽度" clearable />
      </el-form-item>
      <el-form-item label="连接器钢片长度" prop="connectorSheetLength" v-if="formItemShow">
        <el-input v-model="form.connectorSheetLength" placeholder="连接器钢片长度" clearable />
      </el-form-item>
      <el-form-item label="模组头部宽度" prop="moduleHeadWidth" v-if="formItemShow">
        <el-input v-model="form.moduleHeadWidth" placeholder="模组头部宽度" clearable />
      </el-form-item>
      <el-form-item label="模组头部长度" prop="moduleHeadLength" v-if="formItemShow">
        <el-input v-model="form.moduleHeadLength" placeholder="模组头部长度" clearable />
      </el-form-item>
      <el-form-item label="模组本体高度" prop="moduleBodyHeight" v-if="formItemShow">
        <el-input v-model="form.moduleBodyHeight" placeholder="模组本体高度" clearable />
      </el-form-item>
      <el-form-item label="LENS中心到连接器中心高度" prop="heightOfLensCenterToConnectorCenter" label-width="200px" v-if="formItemShow">
        <el-input v-model="form.heightOfLensCenterToConnectorCenter" placeholder="LENS中心到连接器中心高度" clearable />
      </el-form-item>
      <el-form-item label="连接器基板厚度" prop="connectorSubstrateThickness" v-if="formItemShow">
        <el-input v-model="form.connectorSubstrateThickness" placeholder="连接器基板厚度" clearable />
      </el-form-item>
      <el-form-item label="LENS中心到连接器中心左右偏移量" prop="leftRightOffsetHeightLensCenterToConnectorCenter" label-width="260px" v-if="formItemShow" >
        <el-input v-model="form.leftRightOffsetHeightLensCenterToConnectorCenter" placeholder="LENS中心到连接器中心左右偏移量" clearable />
      </el-form-item>
      <el-form-item label="FOV角度" prop="fovAngle" v-if="formItemShow">
        <el-input v-model="form.fovAngle" placeholder="FOV角度" clearable />
      </el-form-item>
      <el-form-item label="是否常规FPC" prop="isRegularFpc" v-if="formItemShow">
        <el-radio-group v-model="form.isRegularFpc" placeholder="是否常规FPC" clearable >
          <el-radio
            v-for="dict in dict.type.fixture_pogopin_is_regular_fpc"
            :key="dict.value"
            :label="dict.value"
          >{{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="FPC最大宽度" prop="fpcMaximumWidth" v-if="formItemShow">
        <el-input v-model="form.fpcMaximumWidth" placeholder="FPC最大宽度" clearable />
      </el-form-item>
      <el-form-item label="模组摆放方向" prop="modulePlacement" v-if="formItemShow">
        <el-select v-model="form.modulePlacement" placeholder="模组摆放方向" clearable>
          <el-option
          v-for="dict in dict.type.fixture_pogopin_module_placement"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台" prop="mcId" v-if="formItemShow">
        <el-select v-model="form.mcId" placeholder="机台" clearable>
          <el-option
          v-for="dict in dict.type.fixture_pogopin_mc_id"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="测试工装" prop="testFixtures" v-if="formItemShow">
        <el-select v-model="form.testFixtures" placeholder="测试工装" clearable>
          <el-option
            v-for="dict in dict.type.fixtrue_pogopin_test_fixture"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型" prop="prodLevel" v-if="formItemShow">
        <el-select v-model="form.prodLevel" placeholder="产品类型" clearable>
          <el-option
            v-for="dict in dict.type.fixture_pogopin_prod_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"/>
      </el-form-item>
    </el-form>
  </modal-udf>
  <!-- 添加治具类型对话框 -->
  <modal-udf :title="title" :dialogShow="addFixtureCategoryDialogVisible" :name="'fixtureCategoryPogopinDialog'" width="800px" append-to-body :close-on-click-modal='false' @closeChildDialog="closeChildDialog" v-dialogDrag v-dialogDragWidth>
    <el-tabs v-model="activeName" type="border-card" @tab-click="fixtureCategoryForm.fixtureCategory=null">
      <el-tab-pane label="新增治具类型" name="first">
        <el-form ref="fixtureCategoryForm" :model="fixtureCategoryForm" label-width="155px">
          <el-form-item label="治具类型名称" prop="fixtureCategory" >
            <el-input v-model="fixtureCategoryForm.fixtureCategory" @change="addFixtureCategoryFlagChange" placeholder="请输入治具类型名称" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改治具类型" name="second" >
        <template>
          <el-table v-if="activeName === 'second'" v-loading="fixtureCategoryLoading" :data="fixtureCategoryTableData" fit class="tableArea" style="font-size: 14px;" cell-mouse-enter cell-mouse-leave cell-class-name border>
            <el-table-column label="序号" type="index" min-width="15" align="center" :key="0" />
            <el-table-column label="治具类型" align="center" min-width="50" prop="fixtureCategory"  :key="1" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.fixtureCategory" v-if="scope.row.seen" ref='editInput' type="string"></el-input>
                <span style="margin-left: 10px" v-else>{{ scope.row.fixtureCategory }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="compile" align="center" min-width="15" class-name="small-padding fixed-width" style="font-size: 10px"  :key="2" >
              <template slot-scope="{row, $index}">
                <el-button type="text" size="mini" @click="handleFixtureCategoryEdit(row, $index)">{{row.compile}}</el-button>
                <el-button type="text" size="mini" @click="handleFixtureCategoryRemove(row, $index)" v-if="row.isDelete">{{ "删除" }}</el-button>
                <el-button type="text" size="mini" @click="handleFixtureCategoryCancel(row, $index)" v-if="row.cancel">{{"取消"}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <pagination
          v-show="fixtureCategoryTotal>0"
          :total="fixtureCategoryTotal"
          :page.sync="fixtureCategoryForm.fixtureCategoryPageNum"
          :limit.sync="fixtureCategoryForm.fixtureCategoryPageSize"
          :layout="'total, prev, pager, next'"
          @pagination="getFixtureCategoryList"
        />
      </el-tab-pane>
    </el-tabs>
  </modal-udf>
</div>
</template>

<script>
import {
  fixtureCategoryList,
  addFixtureParamsPogopin,
  addFixtureCategory,
  updateFixtureParamsPogopin,
  deleteFixtureCategory,
  updateFixtureCategory,
  getFixtureParamsPogopin,
  fixtureCategoryAll,
  delFixtureParamsPogopin,
  listFixtureParamsPogopin,
  addFixtureSharedInfo,
  materialIdRules
} from '@/api/biz/fixture/fixture'
import ModalUdf from '@/views/biz/common/ModalUdf'

export default {
  name: 'Pogopin',
  dicts: ['fixture_buckle_status', 'biz_fixture_project', 'fixture_shared_status',
    'fixture_pogopin_fixed_pin', 'fixture_pogopin_is_regular_fpc', 'fixture_pogopin_module_placement', 'fixture_pogopin_mc_id',
  'fixtrue_pogopin_test_fixture', 'fixture_pogopin_prod_level'],

  components: { ModalUdf },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 遮罩层
      loading: true,
      fixtureCategoryLoading: true,
      // 总条数
      total: 0,
      fixtureCategoryTotal: 0,
      // 弹出层标题
      title: '',
      tableData: [],
      fixtureCategoryTableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: '209',
        id: null,
        materialId: null,
        prodType: null,
        deviation: 0,
        connectorModel: null,
        fixtureCategory: null,
        connectorTtlWidth: null,
        connectorTtlLength: null,
        connectorExposedCopperWidth: null,
        pinPins: null,
        pinSpacing: null,
        isFixedPin: null,
        connectorSheetWidth: null,
        connectorSheetLength: null,
        moduleHeadWidth: null,
        moduleHeadLength: null,
        moduleBodyHeight: null,
        heightOfLensCenterToConnectorCenter: null,
        connectorSubstrateThickness: null,
        leftRightOffsetHeightLensCenterToConnectorCenter: null,
        fovAngle: null,
        isRegularFpc: null,
        fpcMaximumWidth: null,
        modulePlacement: null,
        mcId: null,
        testFixtures: null,
        prodLevel: null
      },
      // 治具类型选择器
      categoryOptions: [],
      // 修改时，治具类型是否可修改
      materialIdDisabled: false,
      materialInfoDisabled: false,
      prodTypeShow: false,
      othersDisabled: false,
      addFixtureDialogVisible: false,
      dialogReset: false,
      activeName: 'first',
      addFixtureCategoryDialogVisible: false,
      // 添加治具类型表单参数
      fixtureCategoryForm: {
        fixtureCategoryPageNum: 1,
        fixtureCategoryPageSize: 10,
        deptId: '209',
        cId: null,
        fixtureCategory: null
      },
      // 是否隐藏表单项
      formItemShow: true,
      // 添加治具表单参数
      form: {
        deptId: '209',
        id: null,
        materialId: null,
        fixtureCategory: null,
        buckle: null,
        fixtureName: null,
        fixtureVersion: null,
        prodType: null,
        connectorModel: null,
        connectorTtlWidth: null,
        connectorTtlLength: null,
        connectorExposedCopperWidth: null,
        pinPins: null,
        pinSpacing: null,
        isFixedPin: null,
        connectorSheetWidth: null,
        connectorSheetLength: null,
        moduleHeadWidth: null,
        moduleHeadLength: null,
        moduleBodyHeight: null,
        heightOfLensCenterToConnectorCenter: null,
        connectorSubstrateThickness: null,
        leftRightOffsetHeightLensCenterToConnectorCenter: null,
        fovAngle: null,
        isRegularFpc: null,
        fpcMaximumWidth: null,
        modulePlacement: null,
        mcId: null,
        testFixtures: null,
        prodLevel: null,
        remark: null
      },
      rules: {
        materialId: [
          { required: true,  message: '请输入需要新增的料号', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'change' },
          { validator: this.materialIdRules, trigger: 'blur'}],
        fixtureCategory: [
          { required: true, type: 'string', message: '请输入治具类型', trigger: 'change' }],
        prodType: [
          { required: true, message: '请输入机种名称', trigger: 'blur' },
          { validator: this.prodTypeRules, trigger: 'blur' }
        ]
      },
      rulesAddShared: {
        prodType: [
          { required: true, message: '请输入机种名称', trigger: 'blur' },
          { validator: this.prodTypeRules, trigger: 'blur' }
        ]
      },
      rulesUpdate: {
        fixtureCategory: [
          { required: true, type: 'string', message: '请输入治具类型', trigger: 'change' },],
        prodType: [
          { required: true, message: '请输入机种名称', trigger: 'blur' },
          { validator: this.prodTypeRules, trigger: 'blur' }
        ]
      },
      rulesFlag: 0,
      btnFlag: null,
      advanced: false//这个是关键，我们用它来判断展开/收起
    }
  },

  mounted() {
    this.getList()
  },

  methods: {
    /** 获取pogopin治具因子 */
    getList() {
      this.loading = true
      listFixtureParamsPogopin(this.queryParams).then(response => {
        this.tableData = response.rows
        this.total = response.total
        this.loading = false
        this.getFixtureCategoryOptions(); // 首页治具类型下拉框数据
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('headQueryForm')
      this.resetForm('queryForm')
      this.handleQuery()
    },
    resetFixture() {
      //重置form表单
      // this.$refs['fixturePoGoPinForm'].resetFields();
      this.reset()
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('/fixture/params/pogopin/export', {
        ...this.queryParams
      }, `pogopin治具因子_${new Date().getTime()}.xlsx`)
      this.reset()
    },

    /** 新增按钮操作 */
    handleAddAndUpdateFixture(row, flag) {
      if (flag === 1) { // 新增治具
        this.btnFlag = 1
        this.addFixtureDialogVisible = true
        this.dialogReset = true
        this.title = '新增料号'
        this.rulesFlag = 0
        this.materialIdDisabled = false
        this.prodTypeShow = false
        this.othersDisabled = false
        this.form.submitFlag = 1
      } else if (flag === 2) { // 新增治具共用机型
        this.btnFlag = 2
        this.reset();
        this.addFixtureDialogVisible = true;
        this.title = "添加共用机型";
        this.rulesFlag = 1;
        this.materialIdDisabled = true;
        this.materialInfoDisabled = true;
        this.prodTypeShow = true;
        this.formItemShow = false;
        this.form.materialId = row.materialId;
        this.form.fixtureName = row.fixtureName;
        this.form.fixtureSpec = row.fixtureSpec;
        this.form.fixtureCategory = row.fixtureCategory;
        this.form.fixtureVersion = row.fixtureVersion;
        this.form.buckle = row.buckle === null ? null : row.buckle.toString();
        this.form.cId = row.cId;
        this.form.submitFlag = 4;
      } else if (flag === 3) { // 修改治具
        this.btnFlag = 3
        getFixtureParamsPogopin(row.id).then(response => {
          this.reset()
          this.rulesFlag = 2
          if (response.data != null) {
            // int 类型转换成 string，以便通过字典呈现
            if (row['buckle'] != null && row['buckle'] !== '') {
              response.data['buckle'] = response.data['buckle'].toString()
            }
            if (row['isFixedPin'] != null && row['isFixedPin'] !== '') {
              response.data['isFixedPin'] = response.data['isFixedPin'].toString()
            }
            if (row['isRegularFpc'] != null && row['isRegularFpc'] !== '') {
              response.data['isRegularFpc'] = response.data['isRegularFpc'].toString()
            }
            if (row['modulePlacement'] != null && row['modulePlacement'] !== '') {
              response.data['modulePlacement'] = response.data['modulePlacement'].toString()
            }
            if (row['mcId'] != null && row['mcId'] !== '') {
              response.data['mcId'] = response.data['mcId'].toString()
            }
            if (row['testFixtures'] != null && row['testFixtures'] !== '') {
              response.data['testFixtures'] = response.data['testFixtures'].toString()
            }
            if (row['prodLevel'] != null && row['prodLevel'] !== '') {
              response.data['prodLevel'] = response.data['prodLevel'].toString()
            }
            this.form = response.data
            this.addFixtureDialogVisible = true
            this.dialogReset = false
            this.title = '修改治具信息'
            this.materialIdDisabled = true
            this.prodTypeShow = false
            this.othersDisabled = false
            this.form.submitFlag = 2
          }
        })
      } else if (flag === 4) { // 用参
        this.btnFlag = 4
        getFixtureParamsPogopin(row.id).then(response => {
          this.reset()
          this.rulesFlag = 0
          if (response.data != null) {
            // int 类型转换成 string，以便通过字典呈现
            if (row['buckle'] != null && row['buckle'] !== '') {
              response.data['buckle'] = response.data['buckle'].toString()
            }
            if (row['isFixedPin'] != null && row['isFixedPin'] !== '') {
              response.data['isFixedPin'] = response.data['isFixedPin'].toString()
            }
            this.form = response.data
            this.form.materialId = null
            this.addFixtureDialogVisible = true
            this.dialogReset = true
            this.title = '新增料号'
            this.materialIdDisabled = false
            this.prodTypeShow = false
            this.othersDisabled = false
            this.form.submitFlag = 1
          }
        })
      }
    },

    /** 删除按钮操作 */
    handleDelete(row, flag) {
      if (flag === 1) {
        this.$modal.confirm('是否删除治具料号为 ' + row.materialId + '“的数据项？').then(response => {
          return delFixtureParamsPogopin({
            id: row.id,
            materialId: row.materialId,
            fixtureSharedStatus: row.fixtureSharedStatus,
            deptId: 209
          }).then(() => {
            this.$modal.msgSuccess('删除成功！')
            this.getList()
            this.reset()
          }).catch(() => {})
        })
      }
    },

    /** 提交按钮 */
    submitForm() {
      if (this.form.submitFlag === 1) { // 新增料号
        this.$refs['fixturePoGoPinForm'].validate(valid => {
          if (valid) {
            addFixtureParamsPogopin(this.form).then(() => {
              this.$modal.msgSuccess('新增料号成功！')
              this.addFixtureDialogVisible = false
              this.dialogReset = false
              this.getList()
              this.reset()
            })
          }
        })
      } else if (this.form.submitFlag === 2) { // 修改治具信息
        this.$refs['fixturePoGoPinForm'].validate(valid => {
          if (valid) {
            updateFixtureParamsPogopin(this.form).then(() => {
              this.$modal.msgSuccess('修改治具信息成功！')
              this.getList()
            })
          }
        })
      } else if (this.form.submitFlag === 3 && this.activeName === 'first') { // 新增治具类型
        if (this.fixtureCategoryForm.fixtureCategory !== null || this.fixtureCategoryForm.fixtureCategory !== '') {
          addFixtureCategory(this.fixtureCategoryForm).then(() => {
            this.$modal.msgSuccess('新增治具类型成功！')
            // this.addFixtureCategoryDialogVisible = false
            // this.reset()
            this.getFixtureCategoryOptions()
          })
        }
      } else if (this.form.submitFlag === 4) { // 新增治具共用机型
        this.$refs['fixturePoGoPinForm'].validate(valid => {
            if (valid) {
              addFixtureSharedInfo(this.form).then(response => {
                this.$modal.msgSuccess("新增治具共用机型成功！")
                this.reset()
                this.getList()
              })
            }}
        )
      }
      this.addFixtureDialogVisible = false
      this.dialogReset = false
      this.addFixtureCategoryDialogVisible = false
    },

    /** 取消按钮 */
    cancel() {

      /**
       * btnFlag: 按钮类型
       *     1 => 新增料号按钮
       *     2 => 新增共用机型按钮
       *     3 => 修改治具信息按钮
       *     4 => 用参按钮
       *
       * form.submitFlag: 提交类型
       *     1 => 新增料号
       *     2 => 修改治具信息
       *     3 => 新增治具类型
       *     4 => 新增治具共用机型
       */

      this.addFixtureDialogVisible = false;
      this.addFixtureCategoryDialogVisible = false;
      this.dialogReset = false;

      this.materialIdDisabled = false;
      this.materialInfoDisabled = false;
      this.prodTypeShow = false;
      this.formItemShow = true;
      this.prodTypeShow = false;

      if (!(this.btnFlag === 1)) {
        this.reset()
      }
      this.btnFlag = null
    },

    /** 治具类型管理按钮 */
    handleFixtureCategoryManage() {
      this.fixtureCategoryReset()
      this.addFixtureCategoryDialogVisible = true
      this.title = '管理治具类型'
      this.getFixtureCategoryList()
    },

    /** 获取治具类型列表 */
    getFixtureCategoryList() {
      this.fixtureCategoryLoading = true
      fixtureCategoryList(this.fixtureCategoryForm).then(response => {
        // 先赋值就是先监听，vue中直接为监听的对象新增一个属性，这个属性是不会被监听的，这时候需要用set处理。所以你这里对象的isEdit属性并没有被监听到，也就不会更新了。你这里不需要使用set，把下面的循环改下就可以了
        this.fixtureCategoryTableData = response.rows.map(item => {
          item['seen'] = false
          item['compile'] = '编辑'
          item['isDelete'] = true
          item['cancel'] = false
          return item
        })
        this.fixtureCategoryTotal = response.total
        this.fixtureCategoryLoading = false
      })
    },

    /** 表单重置 */
    fixtureCategoryReset() {
      this.fixtureCategoryForm = {
        fixtureCategoryPageNum: 1,
        fixtureCategoryPageSize: 10,
        deptId: '209',
        cId: null,
        fixtureCategory: null
      }
      this.resetForm('fixtureCategoryForm')
    },

    reset() {
      this.form = {
        deptId: '209',
        id: null,
        materialId: null,
        fixtureCategory: null,
        buckle: null,
        fixtureName: null,
        fixtureVersion: null,
        prodType: null,
        connectorModel: null,
        connectorTtlWidth: null,
        connectorTtlLength: null,
        connectorExposedCopperWidth: null,
        pinPins: null,
        pinSpacing: null,
        isFixedPin: null,
        connectorSheetWidth: null,
        connectorSheetLength: null,
        moduleHeadWidth: null,
        moduleHeadLength: null,
        moduleBodyHeight: null,
        heightOfLensCenterToConnectorCenter: null,
        connectorSubstrateThickness: null,
        leftRightOffsetHeightLensCenterToConnectorCenter: null,
        fovAngle: null,
        isRegularFpc: null,
        fpcMaximumWidth: null,
        modulePlacement: null,
        mcId: null,
        testFixtures: null,
        prodLevel: null,
        remark: null
      }
      this.resetForm('form')
      this.resetForm('fixturePoGoPinForm')
    },

    /** 编辑治具类型 */
    handleFixtureCategoryEdit(row, column, cell, event) {
      row.seen = !row.seen
      if (row.seen) {
        row.compile = '保存'
        row.isDelete = false
        row.cancel = true
      } else {
        this.fixtureCategoryForm.cId = row.cId
        this.fixtureCategoryForm.fixtureCategory = row.fixtureCategory
        updateFixtureCategory(this.fixtureCategoryForm).then(() => {
          this.fixtureCategoryForm.fixtureCategory = null
          this.getFixtureCategoryList()
          this.getFixtureCategoryOptions()
          this.$message.success('更新治具类型成功！')
        })
      }
    },

    /** 删除治具类型 */
    handleFixtureCategoryRemove(row, index) {
      this.$modal.confirm('是否确认删除治具类型为"' + row.fixtureCategory + '"的数据项？').then(function() {
        return deleteFixtureCategory(row.cId);
      }).then(() => {
        this.getFixtureCategoryList();
        this.getFixtureCategoryOptions();
        this.$modal.msgSuccess("删除治具类型成功");
      }).catch(() => {});
    },

    /** 治具类型编辑按钮功能 */
    handleFixtureCategoryCancel(row, index) {
      row.compile = '编辑'
      row.seen = false
      row.cancel = false
      row.isDelete = true
    },

    /** 新增治具类型输入框触发函数 */
    addFixtureCategoryFlagChange() {
      this.form.submitFlag = 3
    },

    /** 治具类型管理 治具类型下拉框赋值*/
    getFixtureCategoryOptions() {
      this.categoryOptions = [];
      this.fixtureCategoryForm.fixtureCategory = null;
      fixtureCategoryAll(this.fixtureCategoryForm).then(response => {
        for (const i in response.data) {
          this.categoryOptions.push(response.data[i]['fixtureCategory'])}})
    },

      /** 关闭模态框 */
      closeChildDialog(flag, name) {
        if (flag === 0 || flag === 1) { // 取消
          this.cancel()
        } else if (flag ===2) { // 确定
          this.submitForm()
          if (this.activeName === 'second' || this.activeName === 'first') {
          } else {
            this.$refs['fixturePoGoPinForm'].validate(valid => {
              if (valid) {
                this.cancel()
              }
            })
          }
        } else if (flag === 3 && name === 'default') { // 重置
          this.resetFixture()
          this.reset()
        }
      },

    /** 点击文字，改变状态 */
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    /** 数据格式显示格式转换 */
    formatTooltip(val) {
      // return val / 100;
      return val
    },

    /** 验证料号是否存在 */
    materialIdRules(rule, value, callback) {
      //首先验证是否含有汉字
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('内容不能包含汉字!'));
        }
      }
      let params = {
        materialId: this.form.materialId,
        deptId: 209
      };
        materialIdRules(params).then(response => {
          if(response.data === 'ok'){
            callback();
          }else{
            callback(new Error('料号已存在，请重新输入!'));
            // this.form.materialId = ""
          }
        })
    },
    fixtureCategoryRules(rule, value, callback) {
      if (value === '') {
        callback(new Error("请输入治具类型！"))
      } else {
        callback();
      }
    },
    prodTypeRules(rule, value, callback) {
      if (value === '') {
        callback(new Error("请输入机型！"))
      } else {
        callback();
      }
    },

    /** 表格样式函数 */
    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
//修改行高
::v-deep .el-table td {
  padding:0px 0px;  //默认上下是padding12px
}
::v-deep .el-table .el-table__cell {
  height: 5px;
}
.box-ops {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
}
// 修改按钮内边距
.btn-ops {
  padding: 2px;
  margin: 0;
}
</style>
