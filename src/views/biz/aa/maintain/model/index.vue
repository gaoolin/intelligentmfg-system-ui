<template>
  <div class="app-container center">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机型" prop="prodType">
        <el-input
          v-model="queryParams.prodType"
          placeholder="请输入机型"
          clearable
          @change="dataChange"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <template>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="resultList" :key="refreshKey" border
                :header-cell-style="tableHeaderCellStyle"
      >
        <el-table-column type="index" label="序号" width="55" align="center" fixed/>

        <!-- 产品信息 -->
        <el-table-column label="机型" align="center" width="100">
          <template slot-scope="scope">
            <span class="prop-label">{{ scope.row.prodType }}</span>
          </template>
        </el-table-column>

        <!-- 初始化和重置 -->
        <el-table-column label="初始化和重置" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">{{ 'init: ' + convertNull(scope.row.init) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'reInit: ' + convertNull(scope.row.reInit) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'senserReset: ' + convertNull(scope.row.senserReset) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'clampOnOff: ' + convertNull(scope.row.clampOnOff) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'sid: ' + convertNull(scope.row.sid) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 光学对齐和处理（LP） -->
        <el-table-column label="光学对齐和处理（LP）" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">{{ 'AA1: ' + convertNull(scope.row.AA1) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'AA2: ' + convertNull(scope.row.AA2) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'AA3: ' + convertNull(scope.row.AA3) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'mtfCheck: ' + convertNull(scope.row.mtfCheck) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'mtfCheck2: ' + convertNull(scope.row.mtfCheck2) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'mtfCheck3: ' + convertNull(scope.row.mtfCheck3) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'lpOn: ' + convertNull(scope.row.lpOn) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'lpOff: ' + convertNull(scope.row.lpOff) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'lpOc: ' + convertNull(scope.row.lpOc) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'lpOcCheck: ' + convertNull(scope.row.lpOcCheck) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'lpOnBlemish: ' + convertNull(scope.row.lpOnBlemish) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'lpBlemish: ' + convertNull(scope.row.lpBlemish) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'blemish: ' + convertNull(scope.row.blemish) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'chartAlignment: ' + convertNull(scope.row.chartAlignment) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'chartAlignment1: ' + convertNull(scope.row.chartAlignment1) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'chartAlignment2: ' + convertNull(scope.row.chartAlignment2) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- VCM（音圈电机）相关 -->
        <el-table-column label="VCM相关" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmHall: ' + convertNull(scope.row.vcmHall) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmHall2: ' + convertNull(scope.row.vcmHall2) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmPowerOff: ' + convertNull(scope.row.vcmPowerOff) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmPowerOn: ' + convertNull(scope.row.vcmPowerOn) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmTop: ' + convertNull(scope.row.vcmTop) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmTopHall: ' + convertNull(scope.row.vcmTopHall) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmZ: ' + convertNull(scope.row.vcmZ) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmZHall: ' + convertNull(scope.row.vcmZHall) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmOisInit: ' + convertNull(scope.row.vcmOisInit) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmMoveToZ: ' + convertNull(scope.row.vcmMoveToZ) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmPowerOffCheck: ' + convertNull(scope.row.vcmPowerOffCheck) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmMoveToZPos: ' + convertNull(scope.row.vcmMoveToZPos) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'vcmInit: ' + convertNull(scope.row.vcmInit) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 检查和检测 -->
        <el-table-column label="检查和检测" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">{{ 'mtfOffAxisCheck1: ' + convertNull(scope.row.mtfOffAxisCheck1) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'mtfOffAxisCheck2: ' + convertNull(scope.row.mtfOffAxisCheck2) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'mtfOffAxisCheck3: ' + convertNull(scope.row.mtfOffAxisCheck3) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'openCheck: ' + convertNull(scope.row.openCheck) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 其他操作和记录 -->
        <el-table-column label="其他操作和记录" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">{{ 'backToPosition: ' + convertNull(scope.row.backToPosition) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'delay: ' + convertNull(scope.row.delay) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'destroy: ' + convertNull(scope.row.destroy) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'destroyStart: ' + convertNull(scope.row.destroyStart) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'dispense: ' + convertNull(scope.row.dispense) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'epoxyInspectionAuto: ' + convertNull(scope.row.epoxyInspectionAuto) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'epoxyInspection: ' + convertNull(scope.row.epoxyInspection) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'grab: ' + convertNull(scope.row.grab) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'gripperOpen: ' + convertNull(scope.row.gripperOpen) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'moveToBlemishPos: ' + convertNull(scope.row.moveToBlemishPos) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'recordPosition: ' + convertNull(scope.row.recordPosition) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'saveOc: ' + convertNull(scope.row.saveOc) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'saveMtf: ' + convertNull(scope.row.saveMtf) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'uvon: ' + convertNull(scope.row.uvon) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'uvoff: ' + convertNull(scope.row.uvoff) }}</span>
            </div>
            <div class="prop-container">
              <span class="prop-label">{{ 'yLevel: ' + convertNull(scope.row.yLevel) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Item参数管控详情 -->
        <el-table-column label="Item参数管控详情" align="left">
          <template slot-scope="scope">
            <el-collapse accordion>
              <el-collapse-item class="prop-label" title="vcmCheck" name="5">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="resultCheckMin">
                    {{ convertNull(scope.row.resultCheckMin) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="resultCheckMax">
                    {{ convertNull(scope.row.resultCheckMax) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="EpoxyInspectionAuto" name="4">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="EpoxyInspection">
                    {{ convertNull(scope.row.epoxyInspectionInterval) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="chartAlignment" name="3">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="xResMin">
                    {{ convertNull(scope.row.xResMin) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="xResMax">
                    {{ convertNull(scope.row.xResMax) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="yResMin">
                    {{ convertNull(scope.row.yResMin) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="yResMax">
                    {{ convertNull(scope.row.yResMax) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="AA" name="2">
                <el-descriptions :column="1" border class="prop-label">
                  <el-descriptions-item label="roiCc">
                    {{ convertNull(scope.row.roiCc) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiUl">
                    {{ convertNull(scope.row.roiUl) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiUr">
                    {{ convertNull(scope.row.roiUr) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiLl">
                    {{ convertNull(scope.row.roiLl) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiLr">
                    {{ convertNull(scope.row.roiLr) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="mtfCheck" name="1">
                <el-descriptions :column="1" border class="prop-label">
                  <el-descriptions-item v-for="(result, index) in Array.from({length: 52}, (_, i) => `result${i+1}`)"
                                        :key="result"
                  >
                    <template slot="label">{{ `Result${index + 1}` }}</template>
                    <span> {{ convertNull(scope.row[`result${index + 1}`]) }} </span>
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column prop="option" label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="btn-ops" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" class="btn-ops" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 编辑模态框 -->
    <el-dialog :visible.sync="editDialogVisible" width="500px" append-to-body title="编辑标准AA-List参数模版">
      <el-form ref="editForm" :rules="rules" label-width="180px" :model="editForm">
        <el-form-item label="机型">
          <el-input v-model="editForm.prodType" :disabled="true"/>
        </el-form-item>
        <el-collapse v-model="outerActiveNames" accordion>
          <!-- 初始化和重置 -->
          <el-collapse-item class="main-item" title="初始化和重置" name="1">
            <el-form-item label="init">
              <el-input v-model="editForm.init"></el-input>
            </el-form-item>
            <el-form-item label="reInit">
              <el-input v-model="editForm.reInit"></el-input>
            </el-form-item>
            <el-form-item label="senserReset">
              <el-input v-model="editForm.senserReset"></el-input>
            </el-form-item>
            <el-form-item label="clampOnOff">
              <el-input v-model="editForm.clampOnOff"></el-input>
            </el-form-item>
            <el-form-item label="SID">
              <el-input v-model="editForm.sid"></el-input>
            </el-form-item>
          </el-collapse-item>
          <!-- 光学对齐和处理（LP） -->
          <el-collapse-item class="main-item" title="光学对齐和处理（LP）" name="2">
            <el-form-item label="AA1">
              <el-input v-model="editForm.AA1"></el-input>
            </el-form-item>
            <el-form-item label="AA2">
              <el-input v-model="editForm.AA2"></el-input>
            </el-form-item>
            <el-form-item label="AA3">
              <el-input v-model="editForm.AA3"></el-input>
            </el-form-item>
            <el-form-item label="mtfCheck">
              <el-input v-model="editForm.mtfCheck"></el-input>
            </el-form-item>
            <el-form-item label="mtfCheck2">
              <el-input v-model="editForm.mtfCheck2"></el-input>
            </el-form-item>
            <el-form-item label="mtfCheck3">
              <el-input v-model="editForm.mtfCheck3"></el-input>
            </el-form-item>
            <el-form-item label="lpOn">
              <el-input v-model="editForm.lpOn"></el-input>
            </el-form-item>
            <el-form-item label="lpOff">
              <el-input v-model="editForm.lpOff"></el-input>
            </el-form-item>
            <el-form-item label="lpOc">
              <el-input v-model="editForm.lpOc"></el-input>
            </el-form-item>
            <el-form-item label="lpOcCheck">
              <el-input v-model="editForm.lpOcCheck"></el-input>
            </el-form-item>
            <el-form-item label="lpOnBlemish">
              <el-input v-model="editForm.lpOnBlemish"></el-input>
            </el-form-item>
            <el-form-item label="lpBlemish">
              <el-input v-model="editForm.lpBlemish"></el-input>
            </el-form-item>
            <el-form-item label="blemish">
              <el-input v-model="editForm.blemish"></el-input>
            </el-form-item>
            <el-form-item label="chartAlignment">
              <el-input v-model="editForm.chartAlignment"></el-input>
            </el-form-item>
            <el-form-item label="chartAlignment1">
              <el-input v-model="editForm.chartAlignment1"></el-input>
            </el-form-item>
            <el-form-item label="chartAlignment2">
              <el-input v-model="editForm.chartAlignment2"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item class="main-item" title="VCM相关" name="3">
            <el-form-item label="vcmHall">
              <el-input v-model="editForm.vcmHall"></el-input>
            </el-form-item>
            <el-form-item label="vcmHall2">
              <el-input v-model="editForm.vcmHall2"></el-input>
            </el-form-item>
            <el-form-item label="vcmPowerOff">
              <el-input v-model="editForm.vcmPowerOff"></el-input>
            </el-form-item>
            <el-form-item label="vcmPowerOn">
              <el-input v-model="editForm.vcmPowerOn"></el-input>
            </el-form-item>
            <el-form-item label="vcmTop">
              <el-input v-model="editForm.vcmTop"></el-input>
            </el-form-item>
            <el-form-item label="vcmTopHall">
              <el-input v-model="editForm.vcmTopHall"></el-input>
            </el-form-item>
            <el-form-item label="vcmZ">
              <el-input v-model="editForm.vcmZ"></el-input>
            </el-form-item>
            <el-form-item label="vcmZHall">
              <el-input v-model="editForm.vcmZHall"></el-input>
            </el-form-item>
            <el-form-item label="vcmOisInit">
              <el-input v-model="editForm.vcmOisInit"></el-input>
            </el-form-item>
            <el-form-item label="vcmMoveToZ">
              <el-input v-model="editForm.vcmMoveToZ"></el-input>
            </el-form-item>
            <el-form-item label="vcmPowerOffCheck">
              <el-input v-model="editForm.vcmPowerOffCheck"></el-input>
            </el-form-item>
            <el-form-item label="vcmMoveToZPos">
              <el-input v-model="editForm.vcmMoveToZPos"></el-input>
            </el-form-item>
            <el-form-item label="vcmInit">
              <el-input v-model="editForm.vcmInit"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item class="main-item" title="检查和检测" name="4">
            <el-form-item label="mtfOffAxisCheck1">
              <el-input v-model="editForm.mtfOffAxisCheck1"></el-input>
            </el-form-item>
            <el-form-item label="mtfOffAxisCheck2">
              <el-input v-model="editForm.mtfOffAxisCheck2"></el-input>
            </el-form-item>
            <el-form-item label="mtfOffAxisCheck3">
              <el-input v-model="editForm.mtfOffAxisCheck3"></el-input>
            </el-form-item>
            <el-form-item label="openCheck">
              <el-input v-model="editForm.openCheck"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item class="main-item" title="其他操作和记录" name="5">
            <el-form-item label="backToPosition">
              <el-input v-model="editForm.backToPosition"></el-input>
            </el-form-item>
            <el-form-item label="delay">
              <el-input v-model="editForm.delay"></el-input>
            </el-form-item>
            <el-form-item label="destroy">
              <el-input v-model="editForm.destroy"></el-input>
            </el-form-item>
            <el-form-item label="destroyStart">
              <el-input v-model="editForm.destroyStart"></el-input>
            </el-form-item>
            <el-form-item label="dispense">
              <el-input v-model="editForm.dispense"></el-input>
            </el-form-item>
            <el-form-item label="epoxyInspectionAuto">
              <el-input v-model="editForm.epoxyInspectionAuto"></el-input>
            </el-form-item>
            <el-form-item label="epoxyInspection">
              <el-input v-model="editForm.epoxyInspection"></el-input>
            </el-form-item>
            <el-form-item label="grab">
              <el-input v-model="editForm.grab"></el-input>
            </el-form-item>
            <el-form-item label="gripperOpen">
              <el-input v-model="editForm.gripperOpen"></el-input>
            </el-form-item>
            <el-form-item label="moveToBlemishPos">
              <el-input v-model="editForm.moveToBlemishPos"></el-input>
            </el-form-item>
            <el-form-item label="recordPosition">
              <el-input v-model="editForm.recordPosition"></el-input>
            </el-form-item>
            <el-form-item label="saveOc">
              <el-input v-model="editForm.saveOc"></el-input>
            </el-form-item>
            <el-form-item label="saveMtf">
              <el-input v-model="editForm.saveMtf"></el-input>
            </el-form-item>
            <el-form-item label="uvon">
              <el-input v-model="editForm.uvon"></el-input>
            </el-form-item>
            <el-form-item label="uvoff">
              <el-input v-model="editForm.uvoff"></el-input>
            </el-form-item>
            <el-form-item label="yLevel">
              <el-input v-model="editForm.yLevel"></el-input>
            </el-form-item>

          </el-collapse-item>
          <el-collapse-item class="main-item" title="Item参数管控详情" name="6">
            <el-collapse v-model="innerActiveNames" accordion>
              <el-collapse-item class="sub-item" title="vcmCheck" name="7" accordion>
                <el-form-item label="resultCheckMin">
                  <el-input v-model="editForm.resultCheckMin"></el-input>
                </el-form-item>
                <el-form-item label="resultCheckMax">
                  <el-input v-model="editForm.resultCheckMax"></el-input>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item class="sub-item" title="EpoxyInspectionAuto" name="8">
                <el-form-item label="epoxyInspectionInterval">
                  <el-input v-model="editForm.epoxyInspectionInterval"></el-input>
                </el-form-item>

              </el-collapse-item>
              <el-collapse-item class="sub-item" title="chartAlignment" name="9">

                <el-form-item label="xResMin">
                  <el-input v-model="editForm.xResMin"></el-input>
                </el-form-item>
                <el-form-item label="xResMax">
                  <el-input v-model="editForm.xResMax"></el-input>
                </el-form-item>
                <el-form-item label="yResMin">
                  <el-input v-model="editForm.yResMin"></el-input>
                </el-form-item>
                <el-form-item label="yResMax">
                  <el-input v-model="editForm.yResMax"></el-input>
                </el-form-item>

              </el-collapse-item>
              <el-collapse-item class="sub-item" title="AA" name="10">

                <el-form-item label="roiCc">
                  <el-input v-model="editForm.roiCc"></el-input>
                </el-form-item>
                <el-form-item label="roiUl">
                  <el-input v-model="editForm.roiUl"></el-input>
                </el-form-item>
                <el-form-item label="roiUr">
                  <el-input v-model="editForm.roiUr"></el-input>
                </el-form-item>
                <el-form-item label="roiLl">
                  <el-input v-model="editForm.roiLl"></el-input>
                </el-form-item>
                <el-form-item label="roiLr">
                  <el-input v-model="editForm.roiLr"></el-input>
                </el-form-item>

              </el-collapse-item>
              <el-collapse-item class="sub-item" title="mtfCheck" name="11">

                <el-form-item v-for="(result, index) in results" :key="result" :label="`Result${index + 1}`">
                  <el-input v-model="editForm[result]"></el-input>
                </el-form-item>

              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getParamsStdModels, updateParamsStdModel } from '@/api/biz/aa/params'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备比对结果表格数据
      resultList: [],
      // 弹出层标题
      title: '',
      // 刷新标识
      refreshKey: 0,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        prodType: null
      },
      // 表单参数
      form: {},
      editDialogVisible: false,
      editForm: {},
      results: Array.from({ length: 52 }, (_, i) => `result${i + 1}`),
      rules: {
        prodType: [{ required: true, message: '机型不能为空', trigger: 'blur' }]
      },
      outerActiveNames: ['1'], // 默认展开的外部项
      innerActiveNames: [] // 内部项默认不展开
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.queryParams.params = {}
      getParamsStdModels(this.queryParams).then(response => {
        this.resultList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 表单重置
    reset() {
      this.editForm = {
        prodType: null,
        init: null,
        reInit: null,
        senserReset: null,
        clampOnOff: null,
        sid: null,
        AA1: null,
        AA2: null,
        AA3: null,
        mtfCheck: null,
        mtfCheck2: null,
        mtfCheck3: null,
        lpOn: null,
        lpOff: null,
        lpOc: null,
        lpOcCheck: null,
        lpOnBlemish: null,
        lpBlemish: null,
        blemish: null,
        chartAlignment: null,
        chartAlignment1: null,
        chartAlignment2: null,
        vcmHall: null,
        vcmHall2: null,
        vcmPowerOff: null,
        vcmPowerOn: null,
        vcmTop: null,
        vcmTopHall: null,
        vcmZ: null,
        vcmZHall: null,
        vcmOisInit: null,
        vcmMoveToZ: null,
        vcmPowerOffCheck: null,
        vcmMoveToZPos: null,
        vcmInit: null,
        mtfOffAxisCheck1: null,
        mtfOffAxisCheck2: null,
        mtfOffAxisCheck3: null,
        openCheck: null,
        backToPosition: null,
        delay: null,
        destroy: null,
        destroyStart: null,
        dispense: null,
        epoxyInspectionAuto: null,
        epoxyInspection: null,
        grab: null,
        gripperOpen: null,
        moveToBlemishPos: null,
        recordPosition: null,
        saveOc: null,
        saveMtf: null,
        uvon: null,
        uvoff: null,
        yLevel: null,
        resultCheckMin: null,
        resultCheckMax: null,
        epoxyInspectionInterval: null,
        xResMin: null,
        xResMax: null,
        yResMin: null,
        yResMax: null,
        roiCc: null,
        roiUl: null,
        roiUr: null,
        roiLl: null,
        roiLr: null,
        result1: null,
        result2: null,
        result3: null,
        result4: null,
        result5: null,
        result6: null,
        result7: null,
        result8: null,
        result9: null,
        result10: null,
        result11: null,
        result12: null,
        result13: null,
        result14: null,
        result15: null,
        result16: null,
        result17: null,
        result18: null,
        result19: null,
        result20: null,
        result21: null,
        result22: null,
        result23: null,
        result24: null,
        result25: null,
        result26: null,
        result27: null,
        result28: null,
        result29: null,
        result30: null,
        result31: null,
        result32: null,
        result33: null,
        result34: null,
        result35: null,
        result36: null,
        result37: null,
        result38: null,
        result39: null,
        result40: null,
        result41: null,
        result42: null,
        result43: null,
        result44: null,
        result45: null,
        result46: null,
        result47: null,
        result48: null,
        result49: null,
        result50: null,
        result51: null,
        result52: null
      }
      this.resetForm('editForm')
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    dataChange() {
      this.getList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleExport() {
      // 导出逻辑
      console.log('导出数据')
    },
    handleEdit(row) {
      this.editForm = { ...row }
      this.editDialogVisible = true
    },
    handleDelete(row) {
      // 删除逻辑
      console.log('删除', row)
    },
    submitForm() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          updateParamsStdModel(this.editForm).then(() => {
            this.editDialogVisible = false
            this.$message.success('保存成功')
            this.getList()
          })
        }
      })
    },
    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return 'font-size: 14px; font-weight: bolder; align-items: center; text-align: center;'
    },
    convertNull(value) {
      return value === null || value === undefined ? '--' : value
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style scoped>
::v-deep .el-collapse-item__header {
  font-size: 16px; /* 调整字体大小 */
  font-weight: bold; /* 调整字体粗细 */
  color: #333; /* 调整字体颜色 */
}

::v-deep .el-collapse-item.main-item .el-collapse-item__header {
  font-size: 18px; /* 主项字体大小 */
  font-weight: bold; /* 主项字体粗细 */
  color: #1f2d3d; /* 主项字体颜色 */
}

::v-deep .el-collapse-item.sub-item .el-collapse-item__header {
  font-size: 16px; /* 子项字体大小 */
  font-weight: normal; /* 子项字体粗细 */
  color: #409eff; /* 子项字体颜色 */
}

.rotated-col {
  writing-mode: vertical-rl;
  text-align: left;
  transform: rotate(-0deg);
  transform-origin: left top;
  white-space: nowrap;
  margin-top: 10px; /* 根据需要调整 */
  margin-bottom: 10px; /* 根据需要调整 */
}


.prop-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.prop-label {
  font-weight: bold;
  margin-right: 5px;
}

.prop-separator {
  margin-right: 5px;
}

.prop-value {
  display: inline-block;
}

.prop-value.enabled {
  color: green;
}

.prop-value.disabled {
  color: red;
}
</style>
