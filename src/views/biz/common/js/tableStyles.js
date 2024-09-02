// tableStyles.js

export function headerCellStyle() {
  return {
    backgroundColor: '#4fc3f7',  // 明亮的背景色
    color: '#ffffff',            // 白色字体，强烈对比
    fontWeight: 'bold',          // 粗体字体
    textAlign: 'center',         // 居中文本对齐
    fontSize: '15px',            // 清晰易读的字体大小
    alignItems: 'center',
  }
}

export function rowClassName({ row, rowIndex }) {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

export function bodyCellStyle()
{
  return {
    backgroundColor: '#e0f7fa',   // Clean, white background for clarity
    color: '#111111',             // Harmonious teal text color
    textAlign: 'center',          // Centered text for uniformity
    fontSize: '16px',             // Slightly smaller font for readability
    fontWeight: 'bold'
  }
}

export function tableStyle() {
  return {
    border: '1px solid #4fc3f7',               // 深绿色边框
    borderRadius: '8px',                       // 圆角边框
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 添加阴影
    width: '100%',
    color: '#363636'
  };
}
