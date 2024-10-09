/**
 * 小数转换为百分比字符串
 * @param {number} point - 小数
 * @param {number} [n=2] - 保留小数位数，默认2
 * @returns {string} 百分比字符串
 */
export function toPercent(point, n = 2) {
  return `${Number(point * 100).toFixed(n)}%`
}

/**
 * 四舍五入保留指定小数位数
 * @param {string|number} value - 数值
 * @param {number} [bit=2] - 保留小数位数，默认2
 * @returns {string|null} 格式化后的字符串或null
 */
export function getBit(value, bit = 2) {
  if (value != null && value !== '') {
    return Number(value).toFixed(bit)
  }
  return null
}

/**
 * 验证是否为有效数字字符串
 * @param {string} val - 字符串
 * @returns {boolean} 是否为有效数字
 */
export function isNumberStr(val) {
  return /^\d+(\.\d{1,2})?$/.test(val)
}

/**
 * 计算两个日期之间的时间差
 * @param {Date|string} date1 - 第一个日期
 * @param {Date|string} date2 - 第二个日期
 * @param {string} [unit='day'] - 时间单位，默认为天（day），可选值为 day, hour, minute, second
 * @returns {number} 时间差
 */
function getDistanceOfDt(date1, date2, unit = 'day') {
  const msDiff = Math.abs(Date.parse(date1) - Date.parse(date2))

  let diff
  switch (unit) {
    case 'day':
      diff = Math.floor(msDiff / (1000 * 3600 * 24))
      break
    case 'hour':
      diff = Math.floor(msDiff / (1000 * 3600))
      break
    case 'minute':
      diff = Math.floor(msDiff / (1000 * 60))
      break
    case 'second':
      diff = Math.floor(msDiff / 1000)
      break
    default:
      throw new Error('无效的时间单位')
  }

  return diff
}

/**
 * 检查日期区间是否合法
 * @param {Object} rule - 规则对象
 * @param {Array<Date|string>} value - 日期数组
 * @param {Function} callback - 回调函数
 * @param {number} [intervalValue=30] - 时间跨度值，默认30
 * @param {string} [unit='day'] - 时间单位，默认为天（day），可选值为 day, hour, minute, second
 */
export function checkDtRange(rule, value, callback, intervalValue = 30, unit = 'day') {
  if (!value || value.length < 2) {
    return callback(new Error('请选择日期区间'))
  }

  const diff = getDistanceOfDt(value[0], value[1], unit)

  if (diff > intervalValue) {
    return callback(new Error(`时间跨度不能超过${intervalValue} ${unit}s`))
  }

  callback()
}

/** 表格合并行 */
/**
 * 表格合并行方法
 * @param {Object} params - 参数对象
 * @param {Array} params.row - 当前行数据
 * @param {Object} params.column - 列对象
 * @param {number} params.rowIndex - 当前行索引
 * @param {number} params.columnIndex - 当前列索引
 * @param {Array} needMergeArr - 需要合并的列配置
 * @param {Function} mergeAction - 合并操作函数
 * @returns {Array} 返回合并结果
 */
export function arraySpanMethod({ row, column, rowIndex, columnIndex }, needMergeArr, mergeAction) {
  let needMerge = needMergeArr.some((item) => {
    return item.colName === column.property
  })

  if (needMerge === true) {
    return mergeAction(column.property, rowIndex, column)
  }
}

/**
 * 合并操作函数
 * @param {string} val - 列属性名
 * @param {number} rowIndex - 当前行索引
 * @param {Object} colData - 列数据
 * @param {Object} rowMergeArrs - 合并行数据对象
 * @returns {Array} 返回合并结果
 */
export function mergeAction(val, rowIndex, colData, rowMergeArrs) {
  if (typeof val !== 'string') {
    throw new TypeError('val must be a string')
  }
  if (typeof rowIndex !== 'number') {
    throw new TypeError('rowIndex must be a number')
  }
  if (typeof colData !== 'object' || colData === null) {
    throw new TypeError('colData must be an object')
  }
  if (typeof rowMergeArrs !== 'object' || rowMergeArrs === null) {
    throw new TypeError('rowMergeArrs must be an object')
  }

  let _row = rowMergeArrs[val].rowArr[rowIndex]
  let _col = _row > 0 ? 1 : 0
  return [_row, _col]
}

/**
 * 行合并处理函数
 * @param {Array} arr - 合并配置数组
 * @param {Array} data - 数据数组
 * @returns {Object} 返回合并行数据对象
 */
export function rowMergeHandle(arr, data) {
  if (!Array.isArray(arr) || !arr.length) return false
  if (!Array.isArray(data) || !data.length) return false

  let needMerge = {}

  arr.forEach((mergeItem) => {
    // 创建合并管理对象
    needMerge[mergeItem.colName] = {
      rowArr: [],
      rowMergeNum: 0
    }

    let currentMergeItemData = needMerge[mergeItem.colName]

    // 进行合并管理对象数据的遍历整理
    data.forEach((item, index) => {
      if (index === 0) {
        currentMergeItemData.rowArr.push(1)
        currentMergeItemData.rowMergeNum = 0
      } else {
        let currentRowData = data[index]
        let preRowData = data[index - 1]

        if (colMergeCheck(currentRowData, preRowData, mergeItem.mergeCheckNames)) {
          currentMergeItemData.rowArr[currentMergeItemData.rowMergeNum] += 1
          currentMergeItemData.rowArr.push(0)
        } else {
          currentMergeItemData.rowArr.push(1)
          currentMergeItemData.rowMergeNum = index
        }
      }
    })
  })

  return needMerge
}

/**
 * 列合并检查函数
 * @param {Object} currentRowData - 当前行数据
 * @param {Object} preRowData - 前一行数据
 * @param {Array} mergeCheckNames - 合并检查属性名数组
 * @returns {boolean} 返回检查结果
 */
export function colMergeCheck(currentRowData, preRowData, mergeCheckNames) {
  if (!Array.isArray(mergeCheckNames) || !mergeCheckNames.length) return false
  let result = true

  for (let index = 0; index < mergeCheckNames.length; index++) {
    const mergeCheckName = mergeCheckNames[index]
    if (currentRowData[mergeCheckName] !== preRowData[mergeCheckName]) {
      result = false
      break
    }
  }

  return result
}

/**
 * 格式化文件大小
 * @param {number} size - 文件大小（以字节为单位）
 * @returns {string} 格式化后的文件大小字符串
 */
export function formatFileSize(size) {
  // 参数校验
  if (typeof size !== 'number' || isNaN(size)) {
    throw new Error('Invalid size provided')
  }

  const units = ['B', 'Kb', 'Mb', 'Gb', 'Tb']
  let unitIndex = 0

  // 动态确定单位
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  // 格式化输出
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

/** 字段校验规则 */
/**
 * @param rule
 * @param value
 * @param callback
 */
export function checkParamsRule(rule, value, callback) {
  if (!value) {
    // 如果值为空，则校验通过（视为可选）
    callback()
  }
  const allowedTypes = ['Enable', 'Disable', '']
  if (allowedTypes.includes(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的参数值, 必须是Enable、Disable或空值'))
  }
}

/**
 * @param rule
 * @param value
 * @param callback
 */
export function checkNumericOrEmpty(rule, value, callback) {
  const numericPattern = /^-?\d+(\.\d+)?$/
  if (!value) {
    callback()
  } else if (numericPattern.test(value)) {
    callback()
  } else {
    callback(new Error('请输入数字或留空'))
  }
}

/**
 * @param value
 * @returns {string|*}
 */
export function convertNull(value) {
  return value === null || value === undefined || '' ? '--' : value
}
