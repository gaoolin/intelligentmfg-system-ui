import request from '@/utils/request'

// 获取工厂名
export function listFactory() {
  return request({
    url: '/biz/factoryName',
    method: 'get'
  })
}

// 根据工厂名获取区名
export function listWorkshop(query) {
  return request({
    url: '/biz/workshop',
    method: 'get',
    query: query
  })
}
