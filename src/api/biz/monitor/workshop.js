import request from '@/utils/request'

// 查询金线消耗量列表
export function listWorkshop(query) {
  return request({
    url: '/biz/monitor/workshop/list',
    method: 'get',
    params: query
  })
}

// 查询金线消耗量详细
export function getWorkshop(factoryName) {
  return request({
    url: '/biz/monitor/workshop/' + factoryName,
    method: 'get'
  })
}

// 新增金线消耗量
export function addWorkshop(data) {
  return request({
    url: '/biz/monitor/workshop',
    method: 'post',
    data: data
  })
}

// 修改金线消耗量
export function updateWorkshop(data) {
  return request({
    url: '/biz/monitor/workshop',
    method: 'put',
    data: data
  })
}

// 删除金线消耗量
export function delWorkshop(factoryName) {
  return request({
    url: '/biz/monitor/workshop/' + factoryName,
    method: 'delete'
  })
}
