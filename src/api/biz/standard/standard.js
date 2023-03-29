import request from '@/utils/request'

// 查询金线标准用量信息列表
export function listStandard(query) {
  return request({
    url: '/biz/standard/standard/list',
    method: 'get',
    params: query
  })
}

// 查询金线标准用量信息详细
export function getStandard(id) {
  return request({
    url: '/biz/standard/standard/' + id,
    method: 'get'
  })
}

// 新增金线标准用量信息
export function addStandard(data) {
  return request({
    url: '/biz/standard/standard',
    method: 'post',
    data: data
  })
}

// 修改金线标准用量信息
export function updateStandard(data) {
  return request({
    url: '/biz/standard/standard',
    method: 'put',
    data: data
  })
}

// 删除金线标准用量信息
export function delStandard(id) {
  return request({
    url: '/biz/standard/standard/' + id,
    method: 'delete'
  })
}
