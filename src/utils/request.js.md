isRelogin.show
return Promise.reject('无效的会话，或者会话已过期，请重新登录。') 这句话的意思是：
返回一个被拒绝的Promise：Promise.reject() 会立即返回一个被拒绝（rejected）的Promise。
错误信息：被拒绝的Promise会携带一个错误信息 '无效的会话，或者会话已过期，请重新登录。'。
具体解释如下：
Promise.reject()：这是一个静态方法，用于立即创建一个被拒绝的Promise。
错误信息：传递给 Promise.reject() 的字符串 '无效的会话，或者会话已过期，请重新登录。' 作为错误信息，会在后续处理中被捕获。
代码上下文
在响应拦截器中，当接收到401状态码时，会执行以下逻辑：
检查 isRelogin.show：
如果 isRelogin.show 为 false，则显示重新登录的提示框，并更新状态。
如果 isRelogin.show 已经为 true，则不再显示提示框。
返回被拒绝的Promise：
最终返回一个被拒绝的Promise，携带错误信息 '无效的会话，或者会话已过期，请重新登录。'。
示例
假设有一个异步请求：
service.get('/api/some-endpoint')
.then(response => {
console.log('请求成功:', response);
})
.catch(error => {
console.error('请求失败:', error.message);
});
如果该请求返回401状态码，最终会捕获到错误信息：
console.error('请求失败: 无效的会话，或者会话已过期，请重新登录。');
总结：
这句话用于在接收到401状态码时返回一个被拒绝的Promise，并附带具体的错误信息，以便在后续处理中进行错误提示或处理。
这段代码中的 isRelogin.show 主要用于控制重新登录提示框的显示逻辑。具体来说：
代码逻辑分析
初始状态：
初始时 isRelogin.show 的值为 false。
处理401状态码：
当响应状态码为401时，会检查 isRelogin.show 的值。
如果 isRelogin.show 为 false，则显示重新登录的提示框，并将 isRelogin.show 设置为 true。
如果 isRelogin.show 为 true，则不显示重新登录的提示框。
重新登录逻辑：
如果用户选择“重新登录”，则调用 store.dispatch('LogOut') 并跳转到指定页面。
无论用户选择“重新登录”还是“取消”，都会将 isRelogin.show 重置为 false。
具体场景分析
1. isRelogin.show 为 false
   首次收到401状态码：
   显示重新登录的提示框。
   将 isRelogin.show 设置为 true。
2. isRelogin.show 为 true
   已经显示过重新登录提示框：
   不再显示重新登录提示框。
   直接返回一个被拒绝的Promise，携带错误信息 '无效的会话，或者会话已过期，请重新登录。'。
   详细流程
   首次收到401状态码：
   isRelogin.show 为 false。
   显示重新登录提示框。
   isRelogin.show 设置为 true。
   用户选择“重新登录”或“取消”后，isRelogin.show 重置为 false。
   再次收到401状态码：
   isRelogin.show 为 true。
   不显示重新登录提示框。
   返回一个被拒绝的Promise，携带错误信息 '无效的会话，或者会话已过期，请重新登录。'。
   总结
   为 false 的情况：首次收到401状态码时，会显示重新登录提示框。
   为 true 的情况：已经显示过重新登录提示框，不会再次显示，而是直接返回一个被拒绝的Promise。
   这样设计的目的是为了防止在同一请求周期内重复显示重新登录的提示框，确保用户体验的一致性和简洁性。