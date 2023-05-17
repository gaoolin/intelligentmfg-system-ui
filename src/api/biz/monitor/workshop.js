import request from '@/utils/request'

// 查询车间级金线用量监控列表
export function listWorkshop(query) {
  return request({
    url: '/biz/monitor/workshop/list',
    method: 'get',
    params: query
  })
}

// 查询车间级金线用量监控详细
export function getWorkshop(factoryName) {
  return request({
    url: '/biz/monitor/workshop/' + factoryName,
    method: 'get'
  })
}

// 新增车间级金线用量监控
export function addWorkshop(data) {
  return request({
    url: '/biz/monitor/workshop',
    method: 'post',
    data: data
  })
}

// 修改车间级金线用量监控
export function updateWorkshop(data) {
  return request({
    url: '/biz/monitor/workshop',
    method: 'put',
    data: data
  })
}

// 删除车间级金线用量监控
export function delWorkshop(factoryName) {
  return request({
    url: '/biz/monitor/workshop/' + factoryName,
    method: 'delete'
  })
}
