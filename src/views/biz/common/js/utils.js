/** 小数转化为百分数 */
export function toPercent(point, n) {
  let str = Number(point * 100).toFixed(n)
  str += '%'
  return str
}

/** 四舍五入 保留N位小数 */
export function getBit(value, bit = 2) {
  if (value !== null && value !== '') {
    let str = Number(value)
    str = str.toFixed(bit)
    return str
  } else {
    return null
  }
}

/** 判断是否为数字 isNUmber */
export function isNumberStr(val) {
  return /^[0-9]+(.[0-9]{1,2})?$/.test(val)
}

/** 计算日期间隔天数 */
export function getDiffDay(date_1, date_2) {
  // 计算两个日期之间的差值
  let totalDays, diffDate
  let myDate_1 = Date.parse(date_1)
  let myDate_2 = Date.parse(date_2)
  // 将两个日期都转换为毫秒格式，然后做差
  diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
  totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
  return totalDays // 相差的天数
}

/** 规则校验 */
export function checkDtRange(rule, value, callback, intervalDays = 30) {
  if (value === null || value === '') {
    return callback(new Error('请选择日期区间'));
  } else {
    const days = getDiffDay(value[0], value[1]);
    if (days > intervalDays) {
      return callback(new Error('时间跨度不能超过30天'));
    } else {
      callback();
    }
  }
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
    return item.colName === column.property;
  });

  if (needMerge === true) {
    return mergeAction(column.property, rowIndex, column);
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
    throw new TypeError('val must be a string');
  }
  if (typeof rowIndex !== 'number') {
    throw new TypeError('rowIndex must be a number');
  }
  if (typeof colData !== 'object' || colData === null) {
    throw new TypeError('colData must be an object');
  }
  if (typeof rowMergeArrs !== 'object' || rowMergeArrs === null) {
    throw new TypeError('rowMergeArrs must be an object');
  }

  let _row = rowMergeArrs[val].rowArr[rowIndex];
  let _col = _row > 0 ? 1 : 0;
  return [_row, _col];
}

/**
 * 行合并处理函数
 * @param {Array} arr - 合并配置数组
 * @param {Array} data - 数据数组
 * @returns {Object} 返回合并行数据对象
 */
export function rowMergeHandle(arr, data) {
  if (!Array.isArray(arr) || !arr.length) return false;
  if (!Array.isArray(data) || !data.length) return false;

  let needMerge = {};

  arr.forEach((mergeItem) => {
    // 创建合并管理对象
    needMerge[mergeItem.colName] = {
      rowArr: [],
      rowMergeNum: 0
    };

    let currentMergeItemData = needMerge[mergeItem.colName];

    // 进行合并管理对象数据的遍历整理
    data.forEach((item, index) => {
      if (index === 0) {
        currentMergeItemData.rowArr.push(1);
        currentMergeItemData.rowMergeNum = 0;
      } else {
        let currentRowData = data[index];
        let preRowData = data[index - 1];

        if (colMergeCheck(currentRowData, preRowData, mergeItem.mergeCheckNames)) {
          currentMergeItemData.rowArr[currentMergeItemData.rowMergeNum] += 1;
          currentMergeItemData.rowArr.push(0);
        } else {
          currentMergeItemData.rowArr.push(1);
          currentMergeItemData.rowMergeNum = index;
        }
      }
    });
  });

  return needMerge;
}

/**
 * 列合并检查函数
 * @param {Object} currentRowData - 当前行数据
 * @param {Object} preRowData - 前一行数据
 * @param {Array} mergeCheckNames - 合并检查属性名数组
 * @returns {boolean} 返回检查结果
 */
export function colMergeCheck(currentRowData, preRowData, mergeCheckNames) {
  if (!Array.isArray(mergeCheckNames) || !mergeCheckNames.length) return false;
  let result = true;

  for (let index = 0; index < mergeCheckNames.length; index++) {
    const mergeCheckName = mergeCheckNames[index];
    if (currentRowData[mergeCheckName] !== preRowData[mergeCheckName]) {
      result = false;
      break;
    }
  }

  return result;
}
