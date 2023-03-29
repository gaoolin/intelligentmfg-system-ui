import request from '@/utils/request'

// 查询金线监控列表
export function listWorkshop(query) {
  return request({
    url: '/biz/monitor/workshop/list',
    method: 'get',
    params: query
  })
}

// 查询金线监控详细
export function getWorkshop(partSpec) {
  return request({
    url: '/biz/monitor/workshop/' + partSpec,
    method: 'get'
  })
}

// 新增金线监控
export function addWorkshop(data) {
  return request({
    url: '/biz/monitor/workshop',
    method: 'post',
    data: data
  })
}

// 修改金线监控
export function updateWorkshop(data) {
  return request({
    url: '/biz/monitor/workshop',
    method: 'put',
    data: data
  })
}

// 删除金线监控
export function delWorkshop(partSpec) {
  return request({
    url: '/biz/monitor/workshop/' + partSpec,
    method: 'delete'
  })
}
