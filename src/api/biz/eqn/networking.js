import request from '@/utils/request'

// 查询治具列表
export function listEqStatus(query) {
  return request({
    url: '/eqn/status/list',
    method: 'get',
    params: query
  })
}

// 查询厂区
export function getFactoryNames() {
  return request({
    url: '/eqn/status/factoryNames',
    method: 'get'
  })
}

// 查询车间
export function getGroupNames(query) {
  return request({
    url: '/eqn/status/workShopNames',
    method: 'get',
    params: query
  })
}
