import request from '@/utils/request'

// 查询智慧打线图列表
export function listOverview(query) {
  return request({
    url: '/wbcomparison/statistics/overView',
    method: 'get',
    params: query
  })
}

// 查询厂区
export function getFactoryNames() {
  return request({
    url: '/wbcomparison/statistics/factoryNames',
    method: 'get'
  })
}

// 查询车间
export function getGroupNames(query) {
  return request({
    url: '/wbcomparison/statistics/workShopNames',
    method: 'get',
    params: query
  })
}

// 获取数据更新时间
export function getUpdateTime() {
  return request({
    url: '/wbcomparison/statistics/updateTime',
    method: 'get'
  })
}
