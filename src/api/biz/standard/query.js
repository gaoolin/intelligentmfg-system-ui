import request from '@/utils/request'

// 查询金线标准用量信息列表
export function listQuery(query) {
  return request({
    url: '/biz/standard/query/list',
    method: 'get',
    params: query
  })
}

// 查询金线标准用量信息详细
export function getQuery(id) {
  return request({
    url: '/biz/standard/query/' + id,
    method: 'get'
  })
}

// 新增金线标准用量信息
export function addQuery(data) {
  return request({
    url: '/biz/standard/query',
    method: 'post',
    data: data
  })
}

// 修改金线标准用量信息
export function updateQuery(data) {
  return request({
    url: '/biz/standard/query',
    method: 'put',
    data: data
  })
}

// 删除金线标准用量信息
export function delQuery(id) {
  return request({
    url: '/biz/standard/query/' + id,
    method: 'delete'
  })
}
