import request from '../../../utils/request'

// 获取工厂名
export function listFactoryName() {
  return request({
    url: '/biz/factoryName',
    method: 'get'
  })
}

// 根据工厂名获取区名
export function listWorkshopName(query) {
  return request({
    url: '/biz/workshopName',
    method: 'get',
    params: query
  })
}
