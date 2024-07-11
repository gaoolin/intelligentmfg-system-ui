<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="厂区" prop="companyName">
        <el-select v-model="queryParams.factoryName" placeholder="请输入厂区" clearable @change="handleQuery">
          <el-option
            v-for="item in factoryOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车间" prop="groupName">
        <el-select v-model="queryParams.groupName" placeholder="请输入车间" clearable @focus="getGroupNames" @change="handleQuery">
          <el-option
            v-for="item in workshopOptions"
            style="width: 240px"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备号" prop="eqCode">
        <el-input v-model="queryParams.eqCode" placeholder="请输入设备号" clearable size="small" @change="dataChange" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="机台" prop="mcId">
        <el-input v-model="queryParams.mcId" placeholder="请输入机台" clearable size="small" />
      </el-form-item>
      <el-form-item label="机型" prop="prodType">
        <el-select v-model="queryParams.prodType" placeholder="请选择机型" clearable size="small">
          <el-input v-model="queryParams.prodType" placeholder="请输入机型" clearable size="small" />
        </el-select>
      </el-form-item>
      <el-form-item label="盒子号" prop="simId">
        <el-input v-model="queryParams.simId" placeholder="请输入盒子号" clearable size="small" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
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
          size="mini"
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
        <!-- 产品信息 -->
        <el-table-column label="机型" align="center" width="150" fixed>
          <template slot-scope="scope">
            <span class="prop-label">{{ scope.row.prodType }}</span>
          </template>
        </el-table-column>

        <!-- 初始化和重置 -->
        <el-table-column label="初始化和重置" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">
                init:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.init) === 'Enable', 'disabled': $convertNull(scope.row.init) === 'Disable'}"
                >{{ $convertNull(scope.row.init) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                reInit:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.reInit) === 'Enable', 'disabled': $convertNull(scope.row.reInit) === 'Disable'}"
                >{{ $convertNull(scope.row.reInit) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                senserReset:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.senserReset) === 'Enable', 'disabled': $convertNull(scope.row.senserReset) === 'Disable'}"
                >{{ $convertNull(scope.row.senserReset) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                clampOnOff:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.clampOnOff) === 'Enable', 'disabled': $convertNull(scope.row.clampOnOff) === 'Disable'}"
                >{{ $convertNull(scope.row.clampOnOff) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                sid:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.sid) === 'Enable', 'disabled': $convertNull(scope.row.sid) === 'Disable'}"
                >{{ $convertNull(scope.row.sid) }}</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 光学对齐和处理（LP） -->
        <el-table-column label="光学对齐和处理（LP）" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">
                AA1:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.AA1) === 'Enable', 'disabled': $convertNull(scope.row.AA1) === 'Disable'}"
                >{{ $convertNull(scope.row.AA1) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                AA2:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.AA2) === 'Enable', 'disabled': $convertNull(scope.row.AA2) === 'Disable'}"
                >{{ $convertNull(scope.row.AA2) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                AA3:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.AA3) === 'Enable', 'disabled': $convertNull(scope.row.AA3) === 'Disable'}"
                >{{ $convertNull(scope.row.AA3) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                mtfCheck:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.mtfCheck) === 'Enable', 'disabled': $convertNull(scope.row.mtfCheck) === 'Disable'}"
                >{{ $convertNull(scope.row.mtfCheck) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                mtfCheck2:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.mtfCheck2) === 'Enable', 'disabled': $convertNull(scope.row.mtfCheck2) === 'Disable'}"
                >{{ $convertNull(scope.row.mtfCheck2) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                mtfCheck3:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.mtfCheck3) === 'Enable', 'disabled': $convertNull(scope.row.mtfCheck3) === 'Disable'}"
                >{{ $convertNull(scope.row.mtfCheck3) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                lpOn:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.lpOn) === 'Enable', 'disabled': $convertNull(scope.row.lpOn) === 'Disable'}"
                >{{ $convertNull(scope.row.lpOn) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                lpOff:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.lpOff) === 'Enable', 'disabled': $convertNull(scope.row.lpOff) === 'Disable'}"
                >{{ $convertNull(scope.row.lpOff) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                lpOc:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.lpOc) === 'Enable', 'disabled': $convertNull(scope.row.lpOc) === 'Disable'}"
                >{{ $convertNull(scope.row.lpOc) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                lpOcCheck:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.lpOcCheck) === 'Enable', 'disabled': $convertNull(scope.row.lpOcCheck) === 'Disable'}"
                >{{ $convertNull(scope.row.lpOcCheck) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                lpOnBlemish:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.lpOnBlemish) === 'Enable', 'disabled': $convertNull(scope.row.lpOnBlemish) === 'Disable'}"
                >{{ $convertNull(scope.row.lpOnBlemish) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                lpBlemish:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.lpBlemish) === 'Enable', 'disabled': $convertNull(scope.row.lpBlemish) === 'Disable'}"
                >{{ $convertNull(scope.row.lpBlemish) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                blemish:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.blemish) === 'Enable', 'disabled': $convertNull(scope.row.blemish) === 'Disable'}"
                >{{ $convertNull(scope.row.blemish) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                chartAlignment:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.chartAlignment) === 'Enable', 'disabled': $convertNull(scope.row.chartAlignment) === 'Disable'}"
                >{{ $convertNull(scope.row.chartAlignment) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                chartAlignment1:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.chartAlignment1) === 'Enable', 'disabled': $convertNull(scope.row.chartAlignment1) === 'Disable'}"
                >{{ $convertNull(scope.row.chartAlignment1) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                chartAlignment2:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.chartAlignment2) === 'Enable', 'disabled': $convertNull(scope.row.chartAlignment2) === 'Disable'}"
                >{{ $convertNull(scope.row.chartAlignment2) }}</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- VCM（音圈电机）相关 -->
        <el-table-column label="VCM相关" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">
                vcmHall:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmHall) === 'Enable', 'disabled': $convertNull(scope.row.vcmHall) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmHall) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmHall2:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmHall2) === 'Enable', 'disabled': $convertNull(scope.row.vcmHall2) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmHall2) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmPowerOff:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmPowerOff) === 'Enable', 'disabled': $convertNull(scope.row.vcmPowerOff) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmPowerOff) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmPowerOn:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmPowerOn) === 'Enable', 'disabled': $convertNull(scope.row.vcmPowerOn) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmPowerOn) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmTop:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmTop) === 'Enable', 'disabled': $convertNull(scope.row.vcmTop) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmTop) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmTopHall:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmTopHall) === 'Enable', 'disabled': $convertNull(scope.row.vcmTopHall) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmTopHall) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmZ:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmZ) === 'Enable', 'disabled': $convertNull(scope.row.vcmZ) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmZ) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmZHall:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmZHall) === 'Enable', 'disabled': $convertNull(scope.row.vcmZHall) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmZHall) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmOisInit:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmOisInit) === 'Enable', 'disabled': $convertNull(scope.row.vcmOisInit) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmOisInit) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmMoveToZ:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmMoveToZ) === 'Enable', 'disabled': $convertNull(scope.row.vcmMoveToZ) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmMoveToZ) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmPowerOffCheck:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmPowerOffCheck) === 'Enable', 'disabled': $convertNull(scope.row.vcmPowerOffCheck) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmPowerOffCheck) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmMoveToZPos:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmMoveToZPos) === 'Enable', 'disabled': $convertNull(scope.row.vcmMoveToZPos) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmMoveToZPos) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                vcmInit:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.vcmInit) === 'Enable', 'disabled': $convertNull(scope.row.vcmInit) === 'Disable'}"
                >{{ $convertNull(scope.row.vcmInit) }}</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 检查和检测 -->
        <el-table-column label="检查和检测" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">
                mtfOffAxisCheck1:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.mtfOffAxisCheck1) === 'Enable', 'disabled': $convertNull(scope.row.mtfOffAxisCheck1) === 'Disable'}"
                >{{ $convertNull(scope.row.mtfOffAxisCheck1) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                mtfOffAxisCheck2:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.mtfOffAxisCheck2) === 'Enable', 'disabled': $convertNull(scope.row.mtfOffAxisCheck2) === 'Disable'}"
                >{{ $convertNull(scope.row.mtfOffAxisCheck2) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                mtfOffAxisCheck3:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.mtfOffAxisCheck3) === 'Enable', 'disabled': $convertNull(scope.row.mtfOffAxisCheck3) === 'Disable'}"
                >{{ $convertNull(scope.row.mtfOffAxisCheck3) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                openCheck:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.openCheck) === 'Enable', 'disabled': $convertNull(scope.row.openCheck) === 'Disable'}"
                >{{ $convertNull(scope.row.openCheck) }}</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 其他操作和记录 -->
        <el-table-column label="其他操作和记录" align="left">
          <template slot-scope="scope">
            <div class="prop-container">
              <span class="prop-label">
                backToPosition:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.backToPosition) === 'Enable', 'disabled': $convertNull(scope.row.backToPosition) === 'Disable'}"
                >{{ $convertNull(scope.row.backToPosition) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                delay:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.delay) === 'Enable', 'disabled': $convertNull(scope.row.delay) === 'Disable'}"
                >{{ $convertNull(scope.row.delay) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                destroy:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.destroy) === 'Enable', 'disabled': $convertNull(scope.row.destroy) === 'Disable'}"
                >{{ $convertNull(scope.row.destroy) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                destroyStart:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.destroyStart) === 'Enable', 'disabled': $convertNull(scope.row.destroyStart) === 'Disable'}"
                >{{ $convertNull(scope.row.destroyStart) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                dispense:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.dispense) === 'Enable', 'disabled': $convertNull(scope.row.dispense) === 'Disable'}"
                >{{ $convertNull(scope.row.dispense) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                epoxyInspectionAuto:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.epoxyInspectionAuto) === 'Enable', 'disabled': $convertNull(scope.row.epoxyInspectionAuto) === 'Disable'}"
                >{{ $convertNull(scope.row.epoxyInspectionAuto) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                epoxyInspection:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.epoxyInspection) === 'Enable', 'disabled': $convertNull(scope.row.epoxyInspection) === 'Disable'}"
                >{{ $convertNull(scope.row.epoxyInspection) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                grab:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.grab) === 'Enable', 'disabled': $convertNull(scope.row.grab) === 'Disable'}"
                >{{ $convertNull(scope.row.grab) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                gripperOpen:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.gripperOpen) === 'Enable', 'disabled': $convertNull(scope.row.gripperOpen) === 'Disable'}"
                >{{ $convertNull(scope.row.gripperOpen) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                moveToBlemishPos:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.moveToBlemishPos) === 'Enable', 'disabled': $convertNull(scope.row.moveToBlemishPos) === 'Disable'}"
                >{{ $convertNull(scope.row.moveToBlemishPos) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                recordPosition:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.recordPosition) === 'Enable', 'disabled': $convertNull(scope.row.recordPosition) === 'Disable'}"
                >{{ $convertNull(scope.row.recordPosition) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                saveOc:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.saveOc) === 'Enable', 'disabled': $convertNull(scope.row.saveOc) === 'Disable'}"
                >{{ $convertNull(scope.row.saveOc) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                saveMtf:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.saveMtf) === 'Enable', 'disabled': $convertNull(scope.row.saveMtf) === 'Disable'}"
                >{{ $convertNull(scope.row.saveMtf) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                uvon:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.uvon) === 'Enable', 'disabled': $convertNull(scope.row.uvon) === 'Disable'}"
                >{{ $convertNull(scope.row.uvon) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                uvoff:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.uvoff) === 'Enable', 'disabled': $convertNull(scope.row.uvoff) === 'Disable'}"
                >{{ $convertNull(scope.row.uvoff) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                yLevel:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.yLevel) === 'Enable', 'disabled': $convertNull(scope.row.yLevel) === 'Disable'}"
                >{{ $convertNull(scope.row.yLevel) }}</span>
              </span>
            </div>
            <div class="prop-container">
              <span class="prop-label">
                zOffset:
                <span class="prop-value"
                      :class="{'enabled': $convertNull(scope.row.zOffset) === 'Enable', 'disabled': $convertNull(scope.row.zOffset) === 'Disable'}"
                >{{ $convertNull(scope.row.zOffset) }}</span>
              </span>
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
                    {{ $convertNull(scope.row.resultCheckMin) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="resultCheckMax">
                    {{ $convertNull(scope.row.resultCheckMax) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="EpoxyInspectionAuto" name="4">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="EpoxyInspection">
                    {{ $convertNull(scope.row.epoxyInspectionInterval) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="chartAlignment" name="3">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="xResMin">
                    {{ $convertNull(scope.row.xResMin) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="xResMax">
                    {{ $convertNull(scope.row.xResMax) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="yResMin">
                    {{ $convertNull(scope.row.yResMin) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="yResMax">
                    {{ $convertNull(scope.row.yResMax) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="AA" name="2">
                <el-descriptions :column="1" border class="prop-label">
                  <el-descriptions-item label="roiCc">
                    {{ $convertNull(scope.row.roiCc) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiUl">
                    {{ $convertNull(scope.row.roiUl) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiUr">
                    {{ $convertNull(scope.row.roiUr) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiLl">
                    {{ $convertNull(scope.row.roiLl) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="roiLr">
                    {{ $convertNull(scope.row.roiLr) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item class="prop-label" title="mtfCheck" name="1">
                <el-descriptions :column="1" border class="prop-label">
                  <el-descriptions-item v-for="(result, index) in Array.from({length: 52}, (_, i) => `result${i+1}`)"
                                        :key="result"
                  >
                    <template slot="label">{{ `Result${index + 1}` }}</template>
                    <span> {{ $convertNull(scope.row[`result${index + 1}`]) }} </span>
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[1, 2, 5, 10, 50]"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchFactoryName, getAaParamsParsed } from '@/api/biz/aa/params'
import CommonForm from '@/components/QtechImCommonForm.vue'
import DateTimeRangePicker from '@/components/DateTimeRangePicker.vue'

export default {
  name: 'index',
  components: { CommonForm, DateTimeRangePicker },
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
      // 表单参数
      form: {},
      editDialogVisible: false,
      editForm: {},
      results: Array.from({ length: 52 }, (_, i) => `result${i + 1}`),
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1,
        id: null,
        prodType: null,
        companyName: null,
        groupName: null,
        deviceType: null,
        eqId: null,
        mcId: null,
        simId: null,
        dateRange: []
      },
      rules: {
        dateRange: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ]
      }

    }
  },

  methods: {
    getList() {
      this.loading = true
      this.queryParams.params = {}
      getAaParamsParsed(this.queryParams).then(response => {
        this.resultList = response.rows
        this.total = response.total
        this.loading = false
      })
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
      this.download('/aa/params/model/detail/export', {
        ...this.queryParams
      }, `AA-List参数模版明细_${new Date().getTime()}.xlsx`)
    },

    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return 'font-size: 14px; font-weight: bolder; align-items: center; text-align: center;'
    },

    handleDateRangeChange(value) {
      this.queryParams.dateRange = value
    },

    async fetchFactoryOptions() {
      // 模拟异步请求
      fetchFactoryName().then(response => {
        console.log('response', response)

        // 将响应数据转换为所需的格式
        this.factoryOptions = response.data.map(item => ({
          label: item.factoryName,
          value: item.factoryName,
          disabled: true // 根据需求设置disabled状态
        }))
        console.log(this.factoryOptions)

        // 调用updateFormConfigOptions方法
        this.updateFormConfigOptions('companyName', this.factoryOptions)
      })
    },

    async fetchWorkshopOptions() {
      // 模拟异步请求
    },

    updateFormConfigOptions(prop, options) {
      const configItem = this.formConfig.find(item => item.prop === prop)
      if (configItem) {
        this.$set(configItem, 'options', options)
      }
    }
  },

  created() {
    this.getList()
    this.fetchFactoryOptions()
    this.fetchWorkshopOptions()
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
