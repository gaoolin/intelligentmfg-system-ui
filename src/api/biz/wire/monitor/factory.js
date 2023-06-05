import request from '@/utils/request'

// 查询厂区级金线用量监控列表
export function listFactory(query) {
  return request({
    url: '/biz/wire/monitor/factory/list',
    method: 'get',
    params: query
  })
}

// 查询厂区级金线用量监控详细
export function getFactory(factoryName) {
  return request({
    url: '/biz/wire/monitor/factory/' + factoryName,
    method: 'get'
  })
}

// 新增厂区级金线用量监控
export function addFactory(data) {
  return request({
    url: '/biz/wire/monitor/factory',
    method: 'post',
    data: data
  })
}

// 修改厂区级金线用量监控
export function updateFactory(data) {
  return request({
    url: '/biz/wire/monitor/factory',
    method: 'put',
    data: data
  })
}

// 删除厂区级金线用量监控
export function delFactory(factoryName) {
  return request({
    url: '/biz/wire/monitor/factory/' + factoryName,
    method: 'delete'
  })
}
